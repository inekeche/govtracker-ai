'use client';
import { useState } from 'react';
import BackButton from '../../components/BackButton';

export default function PoliciesPage() {
  const [policyText, setPolicyText] = useState('');
  const [agencyUrl, setAgencyUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimplify = async () => {
    setLoading(true);
    // Simulating AI response handler layout for next integration step
    setTimeout(() => {
      setSummary(`Simplified Breakdown: This document outlines public fund allocations focusing on community development trust initiatives, ensuring transparency across local infrastructural targets.`);
      setLoading(false);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPolicyText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleUrlFetch = () => {
    if (!agencyUrl) return;
    setLoading(true);
    setTimeout(() => {
      setPolicyText(`[Imported from URL: ${agencyUrl}]\n\nSample extracted government policy content regarding public procurement transparency and infrastructure milestones.`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Policy & Budget Simplifier</h1>
          <p className="text-slate-400 text-sm">Upload documents from your device, paste agency URLs, or paste text directly to extract clear citizen summaries.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
          
          {/* Upload & URL Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-700">
            {/* Local File Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Upload Document (.txt / .pdf)</label>
              <input 
                type="file" 
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
              />
            </div>

            {/* Agency URL Import */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Govt Agency Document URL</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={agencyUrl}
                  onChange={(e) => setAgencyUrl(e.target.value)}
                  placeholder="https://budgetoffice.gov.ng/..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={handleUrlFetch}
                  className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap"
                >
                  Fetch
                </button>
              </div>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Policy Document Content</label>
            <textarea 
              rows="6" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 text-sm" 
              placeholder="Paste policy document text here or upload/fetch above..." 
              value={policyText} 
              onChange={(e) => setPolicyText(e.target.value)} 
            />
          </div>

          <button 
            onClick={handleSimplify} 
            disabled={loading || !policyText} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            {loading ? 'Analyzing with AI...' : 'Simplify Policy'}
          </button>
        </div>

        {summary && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 space-y-2">
            <h3 className="text-emerald-400 font-semibold">AI Summary Output</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}