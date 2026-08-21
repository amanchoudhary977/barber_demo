import { NextRequest } from 'next/server';
import { analyzePhoto } from '@/lib/gemini';
import { ApiResponse, AnalysisResult } from '@/types';

// Max image size: 10MB
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate request body ──────────────────
    let body: { image?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          error: 'Invalid request body. Expected JSON with an "image" field.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { image } = body;

    if (!image || typeof image !== 'string') {
      return Response.json(
        {
          success: false,
          error: 'Missing or invalid "image" field. Please provide a base64-encoded image.',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // ── 2. Validate image size ────────────────────────────
    // Rough estimate: base64 is ~4/3 of original size
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    const estimatedBytes = (base64Data.length * 3) / 4;

    if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
      return Response.json(
        {
          success: false,
          error: `Image too large (${(estimatedBytes / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 10MB.`,
        } satisfies ApiResponse<never>,
        { status: 413 }
      );
    }

    // ── 3. Validate API key is configured ─────────────────
    if (!process.env.GEMINI_API_KEY) {
      console.error('[analyze] GEMINI_API_KEY is not configured');
      return Response.json(
        {
          success: false,
          error: 'AI analysis service is not configured. Please contact the administrator.',
        } satisfies ApiResponse<never>,
        { status: 503 }
      );
    }

    // ── 4. Call Gemini for analysis ───────────────────────
    let analysis: AnalysisResult;
    try {
      analysis = await analyzePhoto(image);
    } catch (geminiError) {
      const message =
        geminiError instanceof Error ? geminiError.message : 'Unknown error';

      // Check for common Gemini failure scenarios
      if (message.includes('SAFETY')) {
        return Response.json(
          {
            success: false,
            error:
              'The image was blocked by safety filters. Please upload a clear, appropriate photo of your face.',
          } satisfies ApiResponse<never>,
          { status: 422 }
        );
      }

      if (message.includes('Could not process') || message.includes('no face')) {
        return Response.json(
          {
            success: false,
            error:
              'No face could be detected in the image. Please upload a clear, front-facing photo with good lighting.',
          } satisfies ApiResponse<never>,
          { status: 422 }
        );
      }

      if (message.includes('QUOTA') || message.includes('429')) {
        return Response.json(
          {
            success: false,
            error:
              'AI analysis service is temporarily overloaded. Please try again in a few seconds.',
          } satisfies ApiResponse<never>,
          { status: 429 }
        );
      }

      if (message.includes('API key') || message.includes('401') || message.includes('403')) {
        console.error('[analyze] Gemini API key error:', message);
        return Response.json(
          {
            success: false,
            error: 'AI analysis service authentication failed. Please contact the administrator.',
          } satisfies ApiResponse<never>,
          { status: 503 }
        );
      }

      // Parse failure (Gemini returned non-JSON)
      if (message.includes('Failed to parse')) {
        console.error('[analyze] Gemini response parse error:', message);
        return Response.json(
          {
            success: false,
            error:
              'AI analysis returned an unexpected format. Please try again with a different photo.',
          } satisfies ApiResponse<never>,
          { status: 502 }
        );
      }

      // Generic Gemini error
      console.error('[analyze] Gemini analysis failed:', message);
      return Response.json(
        {
          success: false,
          error: 'AI analysis failed. Please try again.',
        } satisfies ApiResponse<never>,
        { status: 500 }
      );
    }

    // ── 5. Validate analysis quality ─────────────────────
    if (analysis.confidence !== undefined && analysis.confidence < 0.3) {
      return Response.json(
        {
          success: false,
          error:
            'Low confidence in face detection. Please upload a clearer photo with your face centered and well-lit.',
        } satisfies ApiResponse<never>,
        { status: 422 }
      );
    }

    // ── 6. Return successful analysis ────────────────────
    return Response.json(
      {
        success: true,
        data: analysis,
      } satisfies ApiResponse<AnalysisResult>,
      { status: 200 }
    );
  } catch (unexpectedError) {
    // Catch-all for truly unexpected errors
    console.error('[analyze] Unexpected error:', unexpectedError);
    return Response.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
