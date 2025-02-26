'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Navigation() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-900">
            IT Skills Matcher
          </Link>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/results')}
                >
                  My Resources
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/profile')}
                >
                  Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

