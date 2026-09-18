'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 px-4 py-2 rounded-xl transition shadow-sm"
    >
      ← Back to Home
    </button>
  );
}