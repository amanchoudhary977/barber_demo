'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { AnalysisResult, StyleOption, FlowStep } from '@/types';

interface FlowState {
  step: FlowStep;
  image: string | null;
  fileName: string | null;
  analysis: AnalysisResult | null;
  selectedStyle: StyleOption | null;
  generatedImage: string | null;
  error: string | null;
}

interface FlowContextValue extends FlowState {
  setImage: (image: string, fileName: string) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setSelectedStyle: (style: StyleOption) => void;
  setGeneratedImage: (image: string) => void;
  setStep: (step: FlowStep) => void;
  setError: (error: string | null) => void;
  resetToUpload: () => void;
  resetToStyleSelect: () => void;
}

const initialState: FlowState = {
  step: 'upload',
  image: null,
  fileName: null,
  analysis: null,
  selectedStyle: null,
  generatedImage: null,
  error: null,
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState);

  const setImage = useCallback((image: string, fileName: string) => {
    setState((prev) => ({
      ...prev,
      image,
      fileName,
      error: null,
    }));
  }, []);

  const setAnalysis = useCallback((analysis: AnalysisResult) => {
    setState((prev) => ({
      ...prev,
      analysis,
      step: 'results',
      error: null,
    }));
  }, []);

  const setSelectedStyle = useCallback((style: StyleOption) => {
    setState((prev) => ({
      ...prev,
      selectedStyle: style,
      error: null,
    }));
  }, []);

  const setGeneratedImage = useCallback((generatedImage: string) => {
    setState((prev) => ({
      ...prev,
      generatedImage,
      step: 'preview',
      error: null,
    }));
  }, []);

  const setStep = useCallback((step: FlowStep) => {
    setState((prev) => ({ ...prev, step, error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const resetToUpload = useCallback(() => {
    setState(initialState);
  }, []);

  const resetToStyleSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: 'selecting',
      selectedStyle: null,
      generatedImage: null,
      error: null,
    }));
  }, []);

  return (
    <FlowContext.Provider
      value={{
        ...state,
        setImage,
        setAnalysis,
        setSelectedStyle,
        setGeneratedImage,
        setStep,
        setError,
        resetToUpload,
        resetToStyleSelect,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow(): FlowContextValue {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
