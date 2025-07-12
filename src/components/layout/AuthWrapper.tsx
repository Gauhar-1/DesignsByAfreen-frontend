'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const PROTECTED_ROUTES = ['/dashboard', '/orders', '/admin', '/portfolio', '/order-history', '/cart']; // Add as needed

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isProtected = PROTECTED_ROUTES.some(path => pathname.startsWith(path));
    if (isProtected && !isLoggedIn) {
      router.push('/login');
    }
  }, [pathname, isLoggedIn]);

  return <>{children}</>;
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
    <AuthGate>{children}</AuthGate>
  </AuthProvider>;
}
