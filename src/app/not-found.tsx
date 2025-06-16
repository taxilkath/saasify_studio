import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default async function NotFound() {
  // Get headers asynchronously
  const headersList = await headers();
  const csp = headersList.get('Content-Security-Policy');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
} 