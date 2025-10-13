/**
 * TypeScript interfaces and types for PhotoBox application
 */

// Style preset configuration
export interface StylePreset {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

// API request payload for Qwen Image Edit model
export interface ImageEditRequest {
  image: File;
  prompt: string;
}

// API response from TNG backend
export interface ImageEditResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}

// Application state
export type AppStep = 'capture' | 'preview' | 'style-selection' | 'processing' | 'result';

export interface CapturedImage {
  file: File;
  url: string;
}

export interface TransformedImage {
  url: string;
  prompt: string;
}

// Camera constraints
export interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: string;
  };
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}


