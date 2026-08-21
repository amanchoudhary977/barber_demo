import { getStyleById } from '@/lib/styles-data';

/**
 * Sends user_image + template_url to the Colab FastAPI Face Swap server via Ngrok
 * and returns the generated face-swapped image as a base64 string.
 */
export async function generateStylePreview(
  imageBase64: string,
  styleId: string
): Promise<string> {
  const rawUrl = process.env.NGROK_API_URL || '';
  if (!rawUrl) {
    throw new Error(
      'NGROK_API_URL is not configured. Please set it in your .env.local file.'
    );
  }

  const style = getStyleById(styleId);
  if (!style) {
    throw new Error(`Style not found: ${styleId}`);
  }

  // Normalize URL to prevent duplicate path segments
  const baseUrl = rawUrl.trim().replace(/\/generate\/?$/i, '').replace(/\/+$/, '');
  const endpoint = `${baseUrl}/generate`;

  // Strip data URL prefix to get raw base64
  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  // Convert base64 to binary buffer/Blob for multipart/form-data
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer], { type: 'image/jpeg' });

  // Build multipart/form-data matching InsightFace contract: user_image + template_url
  const formData = new FormData();
  formData.append('user_image', blob, 'user_photo.jpg');
  formData.append('template_url', style.frontUrl);

  console.log(`[generate] Sending Face Swap request to: ${endpoint} for style: ${style.name} (${style.frontUrl})`);

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
    console.error(`[generate] Colab Face Swap error (${response.status}):`, errorText);
    throw new Error(
      `Face Swap generation failed (${response.status}): ${errorText.substring(0, 200)}`
    );
  }

  const data = await response.json();

  const resultImage = data.image || data.result_image || data.output_image;
  if (!resultImage) {
    throw new Error('Face Swap server returned no "image" field in response JSON');
  }

  return resultImage; // base64 encoded generated image
}
