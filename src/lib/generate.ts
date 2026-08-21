import { AnalysisResult } from '@/types';
import { getStyleById } from '@/lib/styles-data';

/**
 * Composes a detailed generation prompt from the style template and analysis context.
 */
function composePrompt(styleId: string, analysis: AnalysisResult): string {
  const style = getStyleById(styleId);
  if (!style) {
    throw new Error(`Style not found: ${styleId}`);
  }

  return [
    style.promptTemplate,
    `The person has a ${analysis.faceShape} face shape,`,
    `${analysis.skinTone} skin tone,`,
    `${analysis.hairType} hair type,`,
    `and currently has ${analysis.facialHair} facial hair.`,
    'Generate a photorealistic result that looks natural and suits their features.',
    'Maintain the person\'s identity, lighting, and background. Only modify the hairstyle/beard as described.',
  ].join(' ');
}

/**
 * Sends the photo + composed prompt to the Colab FastAPI server via Ngrok
 * and returns the generated image as a base64 string.
 */
export async function generateStylePreview(
  imageBase64: string,
  styleId: string,
  analysis: AnalysisResult
): Promise<string> {
  const rawUrl = process.env.NGROK_API_URL || '';
  if (!rawUrl) {
    throw new Error(
      'NGROK_API_URL is not configured. Please set it in your .env.local file.'
    );
  }

  // Normalize URL to prevent /generate/generate or trailing slashes
  const baseUrl = rawUrl.trim().replace(/\/generate\/?$/i, '').replace(/\/+$/, '');
  const endpoint = `${baseUrl}/generate`;

  const prompt = composePrompt(styleId, analysis);

  // Strip data URL prefix to get raw base64
  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  // Convert base64 to binary buffer/Blob for multipart/form-data
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer], { type: 'image/jpeg' });

  // Build multipart/form-data
  const formData = new FormData();
  formData.append('image', blob, 'photo.jpg');
  formData.append('prompt', prompt);

  console.log(`[generate] Sending POST request to: ${endpoint}`);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'User-Agent': 'StyleGenius/1.0',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`[generate] Colab server error (${response.status}):`, errorText);
    throw new Error(
      `Image generation failed (${response.status}): ${errorText.substring(0, 200)}`
    );
  }

  const data = await response.json();

  if (!data.image) {
    throw new Error('Generation server returned no "image" field in response JSON');
  }

  return data.image; // base64 encoded generated image
}
