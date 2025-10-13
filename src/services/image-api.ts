import { ImageEditRequest, ImageEditResponse, ApiError } from '@/types';

/**
 * API Service layer for TNG backend image transformation
 * Using OpenAI-compatible API with Qwen Image Edit model
 */

const API_BASE_URL = 'https://image.model.tngtech.com/api/v1';
const API_ENDPOINT = `${API_BASE_URL}/images/edits`;
const REQUEST_TIMEOUT = 60000; // 60 seconds

/**
 * Transform an image using TNG AI image editing API
 * Using Qwen/Qwen-Image-Edit model - no mask required
 */
export async function transformImage(request: ImageEditRequest): Promise<string> {
  const token = process.env.NEXT_PUBLIC_TNG_API_TOKEN;

  console.log('=== TNG API Transform Image Request ===');
  console.log('API Endpoint:', API_ENDPOINT);
  console.log('Model: Qwen/Qwen-Image-Edit');
  console.log('Token configured:', token ? `Yes (${token.substring(0, 10)}...)` : 'No');
  console.log('Image file:', {
    name: request.image.name,
    size: `${(request.image.size / 1024).toFixed(2)} KB`,
    type: request.image.type,
  });
  console.log('Prompt:', request.prompt);

  if (!token || token === 'your_token_here') {
    console.error('❌ API token not configured!');
    throw new Error('API token not configured. Please add NEXT_PUBLIC_TNG_API_TOKEN to your .env.local file.');
  }

  // Create FormData for multipart/form-data request (OpenAI compatible)
  const formData = new FormData();
  formData.append('image', request.image);
  formData.append('prompt', request.prompt);
  formData.append('model', 'Qwen/Qwen-Image-Edit');
  formData.append('response_format', 'b64_json');

  console.log('Sending request to TNG API (Qwen model - no mask needed)...');

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      let errorMessage = 'Image transformation failed';

      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error JSON:', errorJson);
        errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
      } catch (parseError) {
        console.error('Could not parse error response as JSON:', parseError);
        errorMessage = errorText || errorMessage;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        details: `HTTP ${response.status}: ${errorMessage}`,
      };

      console.error('Throwing ApiError:', error);
      throw error;
    }

    const responseText = await response.text();
    console.log('Response body length:', responseText.length, 'characters');

    let data: ImageEditResponse;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', {
        hasData: !!data.data,
        dataLength: data.data?.length,
        created: data.created,
      });
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      throw new Error('Invalid JSON response from API');
    }

    // Extract base64 image data (Qwen model returns b64_json)
    if (data.data && data.data.length > 0) {
      const imageData = data.data[0];
      console.log('Image data received:', {
        hasUrl: !!imageData.url,
        hasB64: !!imageData.b64_json,
        b64Length: imageData.b64_json?.length,
      });

      if (imageData.b64_json) {
        console.log('✅ Success! Converting base64 to data URL (length:', imageData.b64_json.length, ')');
        // Convert base64 to data URL
        return `data:image/png;base64,${imageData.b64_json}`;
      }

      if (imageData.url) {
        console.log('✅ Success! Returning image URL:', imageData.url);
        return imageData.url;
      }
    }

    console.error('❌ No image data in response:', data);
    throw new Error('No image data in response');
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      console.error('❌ Error caught:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      if (error.name === 'AbortError') {
        const timeoutError: ApiError = {
          message: 'Request timed out. The image transformation is taking too long. Please try again with a smaller image or different style.',
          details: 'Request exceeded 60 second timeout',
        };
        console.error('Request timed out');
        throw timeoutError;
      }

      if ('status' in error) {
        console.error('Rethrowing ApiError with status:', (error as ApiError).status);
        throw error;
      }

      // Network or other errors
      const networkError: ApiError = {
        message: error.message.includes('fetch')
          ? 'Unable to connect to image service. Please check your connection and try again.'
          : error.message,
        details: error.message,
      };
      console.error('Network or other error:', networkError);
      throw networkError;
    }

    console.error('❌ Unknown error type:', error);
    throw error;
  }
}

/**
 * Compress and optimize image before sending to API
 * Ensures file size is under 2MB
 */
export async function optimizeImage(file: File, maxSizeMB: number = 2): Promise<File> {
  console.log('=== Image Optimization ===');
  console.log('Original file:', {
    name: file.name,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
  });
  console.log('Max size:', maxSizeMB, 'MB');

  // If file is already small enough, return as-is
  if (file.size <= maxSizeMB * 1024 * 1024) {
    console.log('✅ File is already within size limit, no optimization needed');
    return file;
  }

  console.log('File exceeds limit, optimizing...');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to reduce file size
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920; // Max width or height

        console.log('Original dimensions:', { width, height });

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
          console.log('Resized dimensions:', { width: Math.round(width), height: Math.round(height) });
        } else {
          console.log('Dimensions within limit, keeping original size');
        }

        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error('❌ Failed to get canvas context');
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality adjustment
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('❌ Failed to create blob from canvas');
              reject(new Error('Failed to optimize image'));
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log('✅ Optimized file:', {
              size: `${(optimizedFile.size / 1024).toFixed(2)} KB`,
              reduction: `${(((file.size - optimizedFile.size) / file.size) * 100).toFixed(1)}%`,
            });

            resolve(optimizedFile);
          },
          'image/jpeg',
          0.85 // Quality setting
        );
      };

      img.onerror = (error) => {
        console.error('❌ Failed to load image:', error);
        reject(new Error('Failed to load image for optimization'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (error) => {
      console.error('❌ Failed to read file:', error);
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
}


