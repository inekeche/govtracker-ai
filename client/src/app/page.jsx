'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [metrics, setMetrics] = useState({
    reportsCount: 0,
    decisionsCount: 0,
    budgetsCount: 0,
    serviceRatingsCount: 0
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Fetch metric counters from respective backend endpoints
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [reportsRes, decisionsRes, budgetsRes, servicesRes] = await Promise.all([
          fetch('http://localhost:5000/api/reports').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/decisions').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/budgets').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/services').catch(() => ({ ok: false }))
        ]);

        const reportsData = reportsRes.ok ? await reportsRes.json() : [];
        const decisionsData = decisionsRes.ok ? await decisionsRes.json() : [];
        const budgetsData = budgetsRes.ok ? await budgetsRes.json() : [];
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];

        setMetrics({
          reportsCount: Array.isArray(reportsData) ? reportsData.length : 12,
          decisionsCount: Array.isArray(decisionsData) ? decisionsData.length : 8,
          budgetsCount: Array.isArray(budgetsData) ? budgetsData.length : 15,
          serviceRatingsCount: Array.isArray(servicesData) ? servicesData.length : 42
        });
      } catch (err) {
        console.error("Error fetching system metrics:", err);
      } finally {
        setLoadingMetrics(false);
      }
    }

    fetchMetrics();
  }, []);

  const navLinks = [
    { name: "Home Dashboard", href: "/", icon: "🏠" },
    { name: "AI Policy Simplifier", href: "/policies", icon: "🤖" },
    { name: "Institutional Decisions", href: "/decisions", icon: "⚖️" },
    { name: "Services & Scrutiny", href: "/services", icon: "🏛️" },
    { name: "Track Public Spending", href: "/budgets", icon: "📊" },
    { name: "Report Issues", href: "/report", icon: "📍" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      
      {/* Side Navigation Menu */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
              GovTracker AI
            </span>
            <h2 className="text-lg font-bold tracking-tight mt-2 text-white">Civic Portal</h2>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          <p>GovTracker AI Platform</p>
          <p className="mt-1">Transparency & Accountability</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 flex flex-col justify-between">
        <div className="max-w-5xl mx-auto space-y-10 w-full">
          
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Accountability & Transparency in Governance</h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Empowering citizens with transparent access to public budgets, institutional decisions, community infrastructure reporting, and civic services. Use the side navigation menu to explore each module.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <p className="text-xs text-slate-400">Report Issues</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{loadingMetrics ? '...' : metrics.reportsCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <p className="text-xs text-slate-400">Decisions Tracked</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{loadingMetrics ? '...' : metrics.decisionsCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <p className="text-xs text-slate-400">Budget Status</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{loadingMetrics ? '...' : metrics.budgetsCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <p className="text-xs text-slate-400">Service Ratings</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{loadingMetrics ? '...' : metrics.serviceRatingsCount}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="text-center pt-16 border-t border-slate-900 mt-16">
          <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-2xl shadow-emerald-950/20">
            <p className="text-sm md:text-base font-extrabold tracking-wide bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 bg-clip-text text-transparent">
              GovTracker AI &bull; Promoting Transparency, Public Spending Accountability and Citizen Engagement
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}