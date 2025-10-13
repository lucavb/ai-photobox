'use client';

import Image from 'next/image';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onContinue: () => void;
}

export function ImagePreview({ imageUrl, onRetake, onContinue }: ImagePreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Preview Your Photo</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Happy with this photo? Continue to select a style, or retake it.
        </p>
      </div>

      {/* Image Preview Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
            <Image
              src={imageUrl}
              alt="Captured photo preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onRetake}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Retake Photo
        </Button>

        <Button
          onClick={onContinue}
          size="lg"
          className="flex-1"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}


