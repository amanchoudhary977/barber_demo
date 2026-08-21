// ── Analysis Types ──────────────────────────────────────

export interface AnalysisResult {
  faceShape: string;
  skinTone: string;
  skinToneHex: string;
  facialHair: string;
  hairType: string;
  recommendations: string[];
  confidence: number;
}

// ── Style Catalog Types ────────────────────────────────

export type StyleCategory = 'hair' | 'beard' | 'combo';

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  category: StyleCategory;
  promptTemplate: string;
  emoji: string;
  tags: string[];
}

// ── Generation Types ───────────────────────────────────

export interface GenerationRequest {
  image: string; // base64 encoded image
  styleId: string;
  analysis: AnalysisResult;
}

export interface GenerationResult {
  originalImage: string; // base64
  generatedImage: string; // base64
  styleApplied: StyleOption;
  analysis: AnalysisResult;
}

// ── API Response Types ─────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Upload State ───────────────────────────────────────

export type FlowStep = 'upload' | 'analyzing' | 'results' | 'selecting' | 'generating' | 'preview';

export interface UploadState {
  step: FlowStep;
  image: string | null; // base64 of uploaded image
  fileName: string | null;
  analysis: AnalysisResult | null;
  selectedStyle: StyleOption | null;
  generatedImage: string | null;
  error: string | null;
}
