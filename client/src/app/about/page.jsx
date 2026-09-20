'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
              Enterprise Solutions
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">About Multiflexzy Tech Solutions</h1>
          </div>
          <Link 
            href="/"
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><span>🚀</span> Who We Are</h2>
            <p>
              <strong>Multiflexzy Tech</strong> (powered by Inekeche Enterprises) is a dynamic full-stack software development and IT consultancy firm specializing in building robust, scalable enterprise systems, modern web applications, and cutting-edge civic-tech solutions like GovTracker AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xl">💻</span>
              <h3 className="font-bold text-white text-sm">MERN Full-Stack Dev</h3>
              <p className="text-xs text-slate-400">Building lightning-fast web applications using MongoDB, Express, React/Next.js, and Node.js with secure role-based access architectures.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xl">📊</span>
              <h3 className="font-bold text-white text-sm">Enterprise Consultancy</h3>
              <p className="text-xs text-slate-400">Expertise in ERP implementations, Microsoft Dynamics migrations, data cleansing, and custom business process automation.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xl">☁️</span>
              <h3 className="font-bold text-white text-sm &">Cloud Services</h3>
              <p className="text-xs text-slate-400">Robust cloud hosting configuration, API integrations (such as Paystack and BAAS platforms), and reliable production deployments.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}