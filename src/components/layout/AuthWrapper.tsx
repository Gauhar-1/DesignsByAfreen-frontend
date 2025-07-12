'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from './Header';
import Footer from './Footer';

const PROTECTED_ROUTES = ['/dashboard', '/orders', '/admin', '/portfolio', '/order-history', '/cart']; // Add as needed
const ADMIN_ROUTES = ['/admin'];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtected = PROTECTED_ROUTES.some(path => pathname.startsWith(path));
  const isAdminRoute = ADMIN_ROUTES.some(path => pathname.startsWith(path));
  
  useEffect(() => {
    if (isProtected && !isLoggedIn) {
      router.push('/login');
    }
  }, [pathname, isLoggedIn]);

  return  <>
      {!isAdminRoute && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </>;
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
    <AuthGate>{children}</AuthGate>
  </AuthProvider>;
}
