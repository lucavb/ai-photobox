import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <Camera className="w-20 h-20 mx-auto mb-6 text-gray-400" />
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to transforming photos!
        </p>
        <Link href="/">
          <Button size="lg">
            <Camera className="w-5 h-5 mr-2" />
            Back to PhotoBox
          </Button>
        </Link>
      </div>
    </div>
  );
}

