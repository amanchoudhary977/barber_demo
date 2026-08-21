import { NextRequest } from 'next/server';
import { generateStylePreview } from '@/lib/generate';
import { getStyleById } from '@/lib/styles-data';
import { ApiResponse, AnalysisResult } from '@/types';

// Timeout for the external Colab/Ngrok server (30 seconds)
const GENERATION_TIMEOUT_MS = 30_000;

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate request body ──────────────────
    let body: { image?: string; styleId?: string; analysis?: AnalysisResult };
    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          error: 'Invalid request body. Expected JSON with "image", "styleId", and "analysis" fields.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { image, styleId, analysis } = body;

    // Validate image
    if (!image || typeof image !== 'string') {
      return Response.json(
        {
          success: false,
          error: 'Missing or invalid "image" field. Please provide a base64-encoded image.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate styleId
    if (!styleId || typeof styleId !== 'string') {
      return Response.json(
        {
          success: false,
          error: 'Missing or invalid "styleId" field.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate the style exists in our catalog
    const style = getStyleById(styleId);
    if (!style) {
      return Response.json(
        {
          success: false,
          error: `Unknown style "${styleId}". Please select a valid style from the catalog.`,
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate analysis object
    if (!analysis || typeof analysis !== 'object' || !analysis.faceShape || !analysis.skinTone) {
      return Response.json(
        {
          success: false,
          error: 'Missing or invalid "analysis" field. Please complete the photo analysis step first.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // ── 2. Validate Ngrok URL is configured ───────────────
    if (!process.env.NGROK_API_URL) {
      console.error('[generate] NGROK_API_URL is not configured');
      return Response.json(
        {
          success: false,
          error: 'Image generation service is not configured. Please set the NGROK_API_URL environment variable.',
        } satisfies ApiResponse<never>,
        { status: 503 }
      );
    }

    // ── 3. Call the Colab server with timeout ─────────────
    let generatedImage: string;
    try {
      generatedImage = await Promise.race([
        generateStylePreview(image, styleId, analysis),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('TIMEOUT')),
            GENERATION_TIMEOUT_MS
          )
        ),
      ]);
    } catch (genError) {
      const message =
        genError instanceof Error ? genError.message : 'Unknown error';

      // Timeout
      if (message === 'TIMEOUT') {
        return Response.json(
          {
            success: false,
            error:
              'Image generation timed out after 30 seconds. The generation server may be busy or unreachable. Please try again.',
          } satisfies ApiResponse<never>,
          { status: 504 }
        );
      }

      // Network / connection errors (Ngrok tunnel down)
      if (
        message.includes('fetch failed') ||
        message.includes('ECONNREFUSED') ||
        message.includes('ENOTFOUND') ||
        message.includes('NetworkError') ||
        message.includes('Failed to fetch')
      ) {
        console.error('[generate] Ngrok connection failed:', message);
        return Response.json(
          {
            success: false,
            error:
              'Cannot reach the image generation server. Please ensure your Colab notebook is running and the Ngrok tunnel is active.',
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      // Ngrok-specific errors (tunnel expired, etc.)
      if (
        message.includes('ngrok') ||
        message.includes('tunnel') ||
        message.includes('3200') ||
        message.includes('ERR_NGROK')
      ) {
        console.error('[generate] Ngrok tunnel error:', message);
        return Response.json(
          {
            success: false,
            error:
              'The Ngrok tunnel has expired or is misconfigured. Please restart the tunnel and update the NGROK_API_URL.',
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      // HTTP errors from the generation server
      if (message.includes('generation failed')) {
        console.error('[generate] Server returned error:', message);
        return Response.json(
          {
            success: false,
            error:
              'The image generation server returned an error. Please check the Colab notebook logs.',
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      // No image data in response
      if (message.includes('no image data')) {
        return Response.json(
          {
            success: false,
            error:
              'The generation server returned an empty result. Please try a different style or photo.',
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      // Generic generation error
      console.error('[generate] Generation failed:', message);
      return Response.json(
        {
          success: false,
          error: 'Image generation failed. Please try again.',
        } satisfies ApiResponse<never>,
        { status: 500 }
      );
    }

    // ── 4. Return the generated image ────────────────────
    return Response.json(
      {
        success: true,
        data: {
          generatedImage,
        },
      } satisfies ApiResponse<{ generatedImage: string }>,
      { status: 200 }
    );
  } catch (unexpectedError) {
    // Catch-all for truly unexpected errors
    console.error('[generate] Unexpected error:', unexpectedError);
    return Response.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
