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
  "confidence": <number between 0 and 1 representing how confident you are in the analysis>
}

For recommendations, suggest 3 specific hairstyle or beard style names that would complement this person's face shape, skin tone, and features. Be specific (e.g., "Textured Crop with a mid fade" rather than just "short hair").

IMPORTANT: Return ONLY the JSON object, nothing else. No explanation, no markdown formatting.`;

export async function analyzePhoto(imageBase64: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

  const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
  const response = result.response;
  const text = response.text();

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
    const analysis: AnalysisResult = JSON.parse(jsonString);

    // Validate required fields
    if (!analysis.faceShape || !analysis.skinTone || !analysis.recommendations) {
      throw new Error('Missing required fields in analysis response');
    }

    return analysis;
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error(
      `Failed to parse AI analysis. Raw response: ${text.substring(0, 200)}`
    );
  }
}
