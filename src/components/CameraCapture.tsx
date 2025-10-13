'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CapturedImage } from '@/types';

interface CameraCaptureProps {
  onCapture: (image: CapturedImage) => void;
  onError: (error: string) => void;
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setPermissionDenied(false);

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user', // Use front camera on mobile
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          onError('Camera access denied. Please grant camera permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          setIsCameraSupported(false);
          onError('No camera found on this device. Please use the file upload option.');
        } else {
          onError(`Camera error: ${error.message}`);
        }
      }
    }
  }, [onError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (!blob) {
        onError('Failed to capture photo. Please try again.');
        return;
      }

      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      const url = URL.createObjectURL(blob);

      onCapture({ file, url });
      stopCamera();
    }, 'image/jpeg', 0.95);
  }, [onCapture, onError, stopCamera]);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        onError('Please select a valid image file.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        onError('Image file is too large. Please select an image under 10MB.');
        return;
      }

      const url = URL.createObjectURL(file);
      onCapture({ file, url });
    },
    [onCapture, onError]
  );

  // Initialize camera on mount
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Camera Permission Alert */}
      {permissionDenied && (
        <Alert variant="destructive">
          <AlertDescription>
            Camera access was denied. Please enable camera permissions in your browser settings and refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Camera not supported alert */}
      {!isCameraSupported && (
        <Alert>
          <AlertDescription>
            Camera is not available on this device. Please use the file upload option below to select a photo.
          </AlertDescription>
        </Alert>
      )}

      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />

        {!isStreaming && !permissionDenied && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Capture Photo Button */}
        <Button
          onClick={capturePhoto}
          disabled={!isStreaming}
          className="flex-1"
          size="lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Capture Photo
        </Button>

        {/* Retry Camera Button */}
        {!isStreaming && isCameraSupported && (
          <Button onClick={startCamera} variant="outline" size="lg" className="flex-1">
            <RotateCcw className="w-5 h-5 mr-2" />
            Retry Camera
          </Button>
        )}

        {/* File Upload Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Photo
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Capture a photo using your camera or upload an existing image to get started.</p>
      </div>
    </div>
  );
}


