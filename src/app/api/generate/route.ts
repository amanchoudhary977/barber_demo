import { NextRequest } from 'next/server';
import { generateStylePreview } from '@/lib/generate';
import { getStyleById } from '@/lib/styles-data';
import { ApiResponse, AnalysisResult } from '@/types';

// Timeout for external Colab/Ngrok server (45 seconds)
const GENERATION_TIMEOUT_MS = 45_000;

export async function POST(request: NextRequest) {
  console.log("HIT: /api/generate - Request received at:", new Date().toISOString());

  try {
    let body: { image?: string; styleId?: string; analysis?: AnalysisResult; demoMode?: boolean };
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

    const { image, styleId, analysis, demoMode } = body;

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
    if (!analysis || typeof analysis !== 'object') {
      return Response.json(
        {
          success: false,
          error: 'Missing or invalid "analysis" field. Please complete the photo analysis step first.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // ── Demo mode bypass if requested ──
    if (demoMode) {
      console.log("[generate] Demo mode active, returning transformed preview...");
      return Response.json(
        {
          success: true,
          data: { generatedImage: image },
        } satisfies ApiResponse<{ generatedImage: string }>,
        { status: 200 }
      );
    }

    // ── Validate Ngrok URL ──
    const ngrokUrl = process.env.NGROK_API_URL;
    if (!ngrokUrl || ngrokUrl.includes('your-ngrok-url')) {
      console.error('[generate] NGROK_API_URL is not configured');
      return Response.json(
        {
          success: false,
          error: 'Colab Ngrok URL is not set. Please update NGROK_API_URL in .env.local / Vercel.',
        } satisfies ApiResponse<never>,
        { status: 503 }
      );
    }

    // ── Call Colab/Ngrok server ──
    console.log(`[generate] Calling Ngrok server at: ${ngrokUrl}/generate for style: ${style.name}...`);
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
      console.log("[generate] Image generation SUCCESS!");
    } catch (genError) {
      const message = genError instanceof Error ? genError.message : String(genError);
      console.error('[generate] Generation failed with error:', message);

      if (message === 'TIMEOUT') {
        return Response.json(
          {
            success: false,
            error: 'Image generation timed out (45s). The Colab GPU server may be busy processing.',
          } satisfies ApiResponse<never>,
          { status: 504 }
        );
      }

      if (message.includes('3200') || message.includes('offline') || message.includes('ERR_NGROK')) {
        return Response.json(
          {
            success: false,
            error: `Your Google Colab Ngrok tunnel is OFFLINE (${ngrokUrl}). Please run your Colab notebook cell to start the FastAPI server and ngrok tunnel.`,
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      if (message.includes('fetch failed') || message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
        return Response.json(
          {
            success: false,
            error: `Cannot reach Colab server at ${ngrokUrl}. Please ensure your Colab notebook is running.`,
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      return Response.json(
        {
          success: false,
          error: `Colab Server Error: ${message.substring(0, 200)}`,
        } satisfies ApiResponse<never>,
        { status: 502 }
      );
    }

    return Response.json(
      {
        success: true,
        data: { generatedImage },
      } satisfies ApiResponse<{ generatedImage: string }>,
      { status: 200 }
    );
  } catch (unexpectedError) {
    console.error('[generate] Unexpected error:', unexpectedError);
    return Response.json(
      {
        success: false,
        error: 'An unexpected server error occurred.',
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
