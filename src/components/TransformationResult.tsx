'use client';

import Image from 'next/image';
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TransformationResultProps {
  originalUrl: string;
  transformedUrl: string;
  styleName: string;
  onStartOver: () => void;
}

export function TransformationResult({
  originalUrl,
  transformedUrl,
  styleName,
  onStartOver,
}: TransformationResultProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(transformedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photobox-${styleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try right-clicking and saving the image manually.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">✨ Transformation Complete!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your photo has been transformed with the <span className="font-semibold">{styleName}</span> style
        </p>
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Photo */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
              <Image
                src={originalUrl}
                alt="Original photo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 text-center bg-gray-50 dark:bg-gray-800">
              <p className="font-semibold text-sm">Original Photo</p>
            </div>
          </CardContent>
        </Card>

        {/* Transformed Photo */}
        <Card className="overflow-hidden ring-2 ring-primary">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
              <Image
                src={transformedUrl}
                alt="Transformed photo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 text-center bg-primary/10 dark:bg-primary/20">
              <p className="font-semibold text-sm text-primary">Transformed ({styleName})</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleDownload}
          size="lg"
          className="flex-1"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Transformed Photo
        </Button>

        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </Button>
      </div>

      {/* Share Info */}
      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
        <p className="text-sm text-green-900 dark:text-green-200">
          🎉 Love the result? You can download the transformed image and share it with your friends!
        </p>
      </div>
    </div>
  );
}


