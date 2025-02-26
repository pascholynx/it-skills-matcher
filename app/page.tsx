'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  // If authenticated, show a different view
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-xl mb-8">Continue to your learning resources.</p>
          <Button 
            onClick={() => router.push('/results')}
            size="lg"
          >
            View My Resources
          </Button>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold mb-6 text-blue-900">IT Skills Matcher</h1>
        <p className="text-xl mb-8 text-gray-700">
          Find the perfect learning resources for your desired IT skills. We match you with the best courses and tutorials based on your interests.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => router.push('/login')}
            variant="outline"
            size="lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => router.push('/register')}
            size="lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
