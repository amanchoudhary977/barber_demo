import { AnalysisResult } from '@/types';
import { getStyleById } from '@/lib/styles-data';

const NGROK_API_URL = process.env.NGROK_API_URL;

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
  if (!NGROK_API_URL) {
    throw new Error(
      'NGROK_API_URL is not configured. Please set it in your .env.local file.'
    );
  }

  const prompt = composePrompt(styleId, analysis);

  // Strip the data URL prefix if present to get raw base64
  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  // Convert base64 to a Blob for multipart/form-data
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  // Build multipart/form-data
  const formData = new FormData();
  formData.append('image', blob, 'photo.jpg');
  formData.append('prompt', prompt);

  const response = await fetch(`${NGROK_API_URL}/generate`, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type — let the browser set it with the boundary
      'ngrok-skip-browser-warning': 'true',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `Image generation failed (${response.status}): ${errorText.substring(0, 200)}`
    );
  }

  const data = await response.json();

  if (!data.image) {
    throw new Error('Generation server returned no image data');
  }

  return data.image; // base64 encoded generated image
}
