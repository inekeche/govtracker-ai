'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Skip protection check if user is already on the auth page
    if (pathname === '/auth') {
      setAuthorized(true);
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setAuthorized(false);
      router.push('/auth');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== '/auth') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 animate-pulse text-sm">Verifying security session...</p>
      </div>
    );
  }

  return children;
}