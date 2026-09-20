'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPortalPage() {
  const [reports, setReports] = useState([]);
  const [services, setServices] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllAdminData() {
      try {
        const [reportsRes, servicesRes, decisionsRes, budgetsRes, policiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/reports').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/services').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/decisions').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/budgets').catch(() => ({ ok: false })),
          fetch('http://localhost:5000/api/policies').catch(() => ({ ok: false }))
        ]);

        const reportsData = reportsRes.ok ? await reportsRes.json() : [];
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const decisionsData = decisionsRes.ok ? await decisionsRes.json() : [];
        const budgetsData = budgetsRes.ok ? await budgetsRes.json() : [];
        const policiesData = policiesRes.ok ? await policiesRes.json() : [];

        setReports(Array.isArray(reportsData) ? reportsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setDecisions(Array.isArray(decisionsData) ? decisionsData : []);
        setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
        setPolicies(Array.isArray(policiesData) ? policiesData : []);
      } catch (err) {
        console.error("Error loading admin oversight data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
              System Administration
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">Admin Portal & Oversight Records</h1>
            <p className="text-slate-400 text-sm mt-1">Review community issue reports, institutional service ratings, policy decisions, AI policy summaries, and public budget records.</p>
          </div>
          <Link 
            href="/"
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            ← Back to Home
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading admin records and oversight metrics...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Community Issues Logged */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📍</span> Community Issues Logged
                </h2>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                  {reports.length} Total
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {reports.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No community issues reported yet.</p>
                ) : (
                  reports.map((item, idx) => (
                    <div key={item._id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-amber-400 font-semibold">{item.sector || 'Infrastructure'}</span>
                        <span className="text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.title || item.projectTitle || 'Issue Report'}</h3>
                      <p className="text-xs text-slate-400">{item.description || item.details}</p>
                      {item.geoLocation && <p className="text-[11px] text-slate-500">GPS: {item.geoLocation}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Institutional Service Ratings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🏛️</span> Institutional Service Ratings
                </h2>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                  {services.length} Total
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {services.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No service ratings submitted yet.</p>
                ) : (
                  services.map((item, idx) => (
                    <div key={item._id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-semibold">{item.serviceName || 'Public Service'}</span>
                        <span className="text-amber-400 font-semibold">★ {item.rating || '4'} / 5</span>
                      </div>
                      <p className="text-xs text-slate-300">{item.feedback || item.comment}</p>
                      <p className="text-[11px] text-slate-500">Submitted by: {item.submittedBy || 'Anonymous Citizen'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Scrutinized Institutional Decisions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⚖️</span> Scrutinized Decisions
                </h2>
                <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20">
                  {decisions.length} Total
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {decisions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No institutional decisions logged in admin portal.</p>
                ) : (
                  decisions.map((item, idx) => (
                    <div key={item._id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-400 font-semibold">{item.category || 'Policy Decision'}</span>
                        <span className="text-slate-400">Status: {item.status || 'Active'}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.title || item.decisionTitle}</h3>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. Public Budget Status & Capital Entries */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📊</span> Budget Status & Capital Entries
                </h2>
                <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                  {budgets.length} Total
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {budgets.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No budget tracking records found.</p>
                ) : (
                  budgets.map((item, idx) => (
                    <div key={item._id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-amber-400 font-semibold">{item.sector} • {item.fiscalYear}</span>
                        <span className="text-emerald-400 font-semibold">₦{item.amountBudgeted?.toLocaleString()}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.projectTitle}</h3>
                      <p className="text-xs text-slate-400">Contractor: <strong className="text-slate-200">{item.contractor}</strong></p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 5. AI Policy & Budget Simplifier Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl lg:col-span-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🤖</span> AI Policy & Budget Simplifier Logs
                </h2>
                <span className="bg-purple-500/10 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/20">
                  {policies.length} Total
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {policies.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No AI policy simplification requests recorded yet.</p>
                ) : (
                  policies.map((item, idx) => (
                    <div key={item._id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-purple-400 font-semibold">Source: {item.sourceType || 'Document Upload'}</span>
                        <span className="text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">Summary: {item.summary || item.policyText}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}