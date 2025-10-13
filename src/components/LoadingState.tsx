'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface LoadingStateProps {
  imageUrl: string;
  styleName: string;
}

export function LoadingState({ imageUrl, styleName }: LoadingStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          Transforming Your Photo
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Applying <span className="font-semibold">{styleName}</span> style...
        </p>
      </div>

      {/* Image Preview with Overlay */}
      <Card className="overflow-hidden relative">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
            <Image
              src={imageUrl}
              alt="Photo being transformed"
              fill
              className="object-cover opacity-50"
              priority
            />
            
            {/* Loading Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
              <p className="text-white text-lg font-medium">Processing...</p>
              <p className="text-white/80 text-sm mt-2">This may take 10-30 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-gray-700 dark:text-gray-300">Preparing your image...</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-200" />
          <span className="text-gray-700 dark:text-gray-300">Applying AI transformation...</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-400" />
          <span className="text-gray-700 dark:text-gray-300">Finalizing result...</span>
        </div>
      </div>

      {/* Tip Card */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          ⏱️ Please wait while we work our magic. Do not close or refresh this page.
        </p>
      </div>
    </div>
  );
}


