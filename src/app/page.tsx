'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { CameraCapture } from '@/components/CameraCapture';
import { ImagePreview } from '@/components/ImagePreview';
import { StyleSelection } from '@/components/StyleSelection';
import { LoadingState } from '@/components/LoadingState';
import { TransformationResult } from '@/components/TransformationResult';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppStep, CapturedImage } from '@/types';
import { transformImage, optimizeImage } from '@/services/image-api';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('capture');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const [selectedStyleName, setSelectedStyleName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Handle image capture
  const handleCapture = (image: CapturedImage) => {
    setCapturedImage(image);
    setCurrentStep('preview');
    setError(null);
  };

  // Handle retake photo
  const handleRetake = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
    setCurrentStep('capture');
    setError(null);
  };

  // Handle continue to style selection
  const handleContinueToStyle = () => {
    setCurrentStep('style-selection');
    setError(null);
  };

  // Handle style selection and trigger transformation
  const handleStyleSelect = async (prompt: string, styleName: string) => {
    console.log('=== Style Selection Started ===');
    console.log('Style name:', styleName);
    console.log('Prompt:', prompt);
    console.log('Has captured image:', !!capturedImage);

    if (!capturedImage) {
      console.error('❌ No image captured!');
      setError('No image captured. Please go back and capture a photo.');
      return;
    }

    setSelectedStyleName(styleName);
    setCurrentStep('processing');
    setError(null);

    try {
      console.log('Starting image optimization...');
      // Optimize image before sending
      const optimizedImage = await optimizeImage(capturedImage.file);

      console.log('Starting image transformation...');
      // Transform image using API with Qwen model (no custom params needed)
      const transformedUrl = await transformImage({
        image: optimizedImage,
        prompt: prompt,
      });

      console.log('✅ Transformation successful!');
      setTransformedImageUrl(transformedUrl);
      setCurrentStep('result');
    } catch (error) {
      console.error('❌ Transformation error in page component:', error);

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        console.error('Error message:', errorMessage);
        setError(errorMessage);
      } else {
        console.error('Unknown error format:', error);
        setError('Failed to transform image. Please try again.');
      }

      setCurrentStep('style-selection');
    }
  };

  // Handle start over
  const handleStartOver = () => {
    // Clean up object URLs
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    if (transformedImageUrl && transformedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(transformedImageUrl);
    }

    setCapturedImage(null);
    setTransformedImageUrl(null);
    setSelectedStyleName('');
    setError(null);
    setCurrentStep('capture');
  };

  // Handle errors
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              PhotoBox AI
            </h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            Transform your photos with AI-powered style transfers
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="ml-4 text-sm underline hover:no-underline"
                >
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step: Camera Capture */}
        {currentStep === 'capture' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-3">Welcome to PhotoBox AI</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Capture or upload a photo to get started. We&apos;ll help you transform it into amazing art!
              </p>
            </div>
            <CameraCapture onCapture={handleCapture} onError={handleError} />
          </div>
        )}

        {/* Step: Image Preview */}
        {currentStep === 'preview' && capturedImage && (
          <ImagePreview
            imageUrl={capturedImage.url}
            onRetake={handleRetake}
            onContinue={handleContinueToStyle}
          />
        )}

        {/* Step: Style Selection */}
        {currentStep === 'style-selection' && capturedImage && (
          <StyleSelection onStyleSelect={handleStyleSelect} disabled={false} />
        )}

        {/* Step: Processing */}
        {currentStep === 'processing' && capturedImage && (
          <LoadingState imageUrl={capturedImage.url} styleName={selectedStyleName} />
        )}

        {/* Step: Result */}
        {currentStep === 'result' && capturedImage && transformedImageUrl && (
          <TransformationResult
            originalUrl={capturedImage.url}
            transformedUrl={transformedImageUrl}
            styleName={selectedStyleName}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            PhotoBox AI • Powered by TNG Image Model • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
