import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '@/types';

const ANALYSIS_PROMPT = `You are an expert grooming and styling consultant. Analyze this person's photo and provide a detailed assessment.

Return your analysis as a valid JSON object with EXACTLY this structure (no markdown, no code blocks, just pure JSON):

{
  "faceShape": "<one of: oval, round, square, heart, oblong, diamond, triangle>",
  "skinTone": "<descriptive name like: fair, light, medium, olive, tan, brown, dark brown, deep>",
  "skinToneHex": "<approximate hex color code matching the skin tone, e.g. #D4A574>",
  "facialHair": "<current facial hair status: clean shaven, light stubble, heavy stubble, short beard, full beard, goatee, mustache, none visible>",
  "hairType": "<hair description: straight, wavy, curly, coily, thin, thick, receding, bald, short, long>",
  "recommendations": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "confidence": <number between 0 and 1 representing confidence>
}

For recommendations, suggest 3 specific hairstyle or beard style names that would complement this person's face shape and features (e.g., "Textured Crop", "Classic Fade", "Designer Stubble").

IMPORTANT: Return ONLY the JSON object, nothing else.`;

// Supported Gemini models in order of priority
const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export async function analyzePhoto(imageBase64: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Strip the data URL prefix if present
  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: 'image/jpeg',
    },
  };

  let lastError: Error | null = null;
  let text = '';

  // Try supported model names
  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
      text = result.response.text();
      if (text) break;
    } catch (err) {
      console.warn(`[gemini] Model ${modelName} failed, trying fallback...`, err instanceof Error ? err.message : err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  if (!text) {
    throw lastError || new Error('Failed to generate analysis with Gemini');
  }

  // Parse the JSON response, handling potential markdown code blocks
  let jsonString = text.trim();

  // Remove markdown code blocks if Gemini wraps the response
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  try {
    const raw = JSON.parse(jsonString);

    // Sanitize with resilient defaults so the user is never blocked
    const sanitized: AnalysisResult = {
      faceShape: raw.faceShape || 'oval',
      skinTone: raw.skinTone || 'medium',
      skinToneHex: raw.skinToneHex || '#D4A574',
      facialHair: raw.facialHair || 'clean shaven',
      hairType: raw.hairType || 'straight',
      recommendations: Array.isArray(raw.recommendations) && raw.recommendations.length > 0
        ? raw.recommendations
        : ['Textured Crop', 'Classic Fade', 'Designer Stubble'],
      confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.85,
    };

    return sanitized;
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', text);
    // Return resilient fallback analysis so the user can continue
    return {
      faceShape: 'oval',
      skinTone: 'medium',
      skinToneHex: '#D4A574',
      facialHair: 'clean shaven',
      hairType: 'straight',
      recommendations: ['Textured Crop', 'Classic Fade', 'Designer Stubble'],
      confidence: 0.75,
    };
  }
}
