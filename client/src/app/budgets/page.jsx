'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';

export default function TrackSpendingPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    projectTitle: '',
    sector: 'Infrastructure',
    amountBudgeted: '',
    amountSpent: '',
    contractor: '',
    status: 'Ongoing',
    fiscalYear: '2026',
    geoLocation: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Preset government capital projects for quick auto-population
  const govTemplates = [
    {
      projectTitle: "Ibaji-Anambra Interstate Dual Carriageway Stabilization",
      sector: "Infrastructure",
      amountBudgeted: 1500000000,
      amountSpent: 1250000000,
      contractor: "Multiflexzy Engineering Ltd",
      status: "Ongoing",
      fiscalYear: "2026",
      geoLocation: "Kogi-Anambra Border Axis"
    },
    {
      projectTitle: "3% HCDT Grassroots Micro-Projects & Solar Water Schemes",
      sector: "Host Communities Development",
      amountBudgeted: 450000000,
      amountSpent: 480000000,
      contractor: "Oboyo Development Consortium",
      status: "Delayed",
      fiscalYear: "2026",
      geoLocation: "Oboyo-Ibaji Sector"
    },
    {
      projectTitle: "Public Secondary School E-Learning Hub Integration",
      sector: "Education",
      amountBudgeted: 300000000,
      amountSpent: 180000000,
      contractor: "Inekeche Tech Solutions",
      status: "Ongoing",
      fiscalYear: "2026",
      geoLocation: "Zonal Education District 1"
    }
  ];

  const fetchBudgets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/budgets');
      const data = await res.json();
      setBudgets(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load budget tracking data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleTemplateSelect = (e) => {
    const index = e.target.value;
    if (index === '') return;
    const template = govTemplates[index];
    setFormData({
      projectTitle: template.projectTitle,
      sector: template.sector,
      amountBudgeted: template.amountBudgeted,
      amountSpent: template.amountSpent,
      contractor: template.contractor,
      status: template.status,
      fiscalYear: template.fiscalYear,
      geoLocation: template.geoLocation
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Safely package payload and file metadata to prevent drops over JSON transport
      const payload = {
        ...formData,
        amountBudgeted: Number(formData.amountBudgeted),
        amountSpent: Number(formData.amountSpent),
        documentName: selectedFile ? selectedFile.name : 'No Attachment'
      };

      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormData({
          projectTitle: '',
          sector: 'Infrastructure',
          amountBudgeted: '',
          amountSpent: '',
          contractor: '',
          status: 'Ongoing',
          fiscalYear: '2026',
          geoLocation: ''
        });
        setSelectedFile(null);
        setShowAddForm(false);
        fetchBudgets();
      } else {
        alert("Failed to save budget record. Please verify inputs.");
      }
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Network error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
              Financial Accountability
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">Public Spending & Capital Budget Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Measure approved capital budgets against actual expenditures and fiscal variance.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2"
          >
            {showAddForm ? '✕ Close Form' : '+ Add / Import Budget Record'}
          </button>
        </div>

        {/* Collapsible Admin Entry & Import Form */}
        {showAddForm && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Admin Portal: Log or Import Capital Budget</h2>
              
              <select 
                onChange={handleTemplateSelect} 
                defaultValue=""
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="" disabled>📥 Load Official Gov Capital Project Template...</option>
                {govTemplates.map((t, idx) => (
                  <option key={idx} value={idx}>{t.projectTitle} ({t.sector})</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-400">Project Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Rural Electrification Phase 2" 
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Sector</label>
                <select 
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Host Communities Development">Host Communities Development</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Contractor / Agency</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contracting Firm Name" 
                  value={formData.contractor}
                  onChange={(e) => setFormData({...formData, contractor: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Approved Allocation (₦)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00" 
                  value={formData.amountBudgeted}
                  onChange={(e) => setFormData({...formData, amountBudgeted: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Actual Expenditure / Release (₦)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00" 
                  value={formData.amountSpent}
                  onChange={(e) => setFormData({...formData, amountSpent: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Geo-Location / Zonal Axis</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Zone A, Local Govt Area" 
                  value={formData.geoLocation}
                  onChange={(e) => setFormData({...formData, geoLocation: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Project Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Abandoned">Abandoned</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-400">Upload Supporting Document / Expenditure Receipt (PDF/Image)</label>
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
                {selectedFile && <p className="text-[11px] text-emerald-400 mt-1">Attached: {selectedFile.name}</p>}
              </div>

              <div className="md:col-span-2 pt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition shadow-md"
                >
                  {submitting ? 'Saving to Backend...' : 'Save Budget Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading financial records...</p>
        ) : budgets.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No public spending records found. Seed or add budget data to begin tracking.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {budgets.map((item) => {
              const isOverBudget = item.amountSpent > item.amountBudgeted;
              return (
                <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                        {item.sector} • {item.fiscalYear}
                      </span>
                      <h2 className="text-xl font-bold text-white mt-2">{item.projectTitle}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Contractor: <strong className="text-slate-200">{item.contractor}</strong> | Location: {item.geoLocation}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Financial Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">Amount Budgeted (₦)</p>
                      <p className="text-lg font-bold text-white mt-1">₦{item.amountBudgeted.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">Actual Spend (₦)</p>
                      <p className={`text-lg font-bold mt-1 ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                        ₦{item.amountSpent.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">Variance Status</p>
                      <p className={`text-sm font-semibold mt-1 ${isOverBudget ? 'text-rose-400' : 'text-amber-400'}`}>
                        {isOverBudget ? `Over Budget by ₦${Math.abs(item.variance).toLocaleString()}` : `Surplus / Saved: ₦${item.variance.toLocaleString()}`}
                        <span className="block text-[11px] font-normal text-slate-400 mt-0.5">({item.variancePercentage}% variance)</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}