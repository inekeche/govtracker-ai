'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check login state whenever path changes or component mounts
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    router.push('/auth');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      {/* Brand Logo on Left */}
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          🏛️ GovTracker <span className="text-amber-400">AI</span>
        </Link>
      </div>

      {/* Nav Links & Auth Actions Shifted to the Right */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-300">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <Link href="/about" className="hover:text-amber-400 transition">About Us</Link>
          <Link 
            href={userEmail ? "/admin" : "/auth"} 
            className="hover:text-amber-400 transition text-amber-400 font-semibold"
          >
            Admin Portal
          </Link>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 text-xs transition"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline text-slate-200">{userEmail}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}