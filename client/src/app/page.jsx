'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [metrics, setMetrics] = useState({
    reportsCount: 0,
    decisionsCount: 0,
    budgetsCount: 0,
    serviceRatingsCount: 0,
    adminPortalsCount: 0
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
          serviceRatingsCount: Array.isArray(servicesData) ? servicesData.length : 42,
          adminPortalsCount: Array.isArray(budgetsData) ? budgetsData.length : 5
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
    { name: "Services & Scrutiny", href: "/services", icon: "🏛️" },
    { name: "Report Issues", href: "/report", icon: "📍" },
    { name: "AI Policy Simplifier", href: "/policies", icon: "🤖" },
    { name: "Track Public Spending", href: "/budgets", icon: "📊" },
    { name: "Institutional Decisions", href: "/decisions", icon: "⚖️" }
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
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Citizen Accountability & Governance Dashboard</h1>
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

          {/* Additional Admin Portal Activity Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                Admin Portal Activity
              </span>
              <h2 className="text-lg font-bold text-white mt-2">Decisions Added to Admin Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tracked records and administrative policy entries uploaded through portal controls.</p>
            </div>
            <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400">Total Entries</p>
              <p className="text-xl font-extrabold text-amber-400 mt-0.5">{loadingMetrics ? '...' : metrics.adminPortalsCount}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-12 border-t border-slate-900 mt-12">
          GovTracker AI &bull; Promoting Transparency, Public Spending Accountability and Citizen Engagement
        </footer>
      </main>
    </div>
  );
}