'use client';
import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <BackButton />
        
        {/* Centered Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Public Spending Dashboard</h1>
          <p className="text-slate-400 text-sm">Monitor active government development projects and infrastructure status.</p>
        </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse text-center">Loading live projects from server...</p>
        ) : projects.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400">
            No projects found in database yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj._id || proj.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xl font-semibold text-emerald-400">{proj.title}</h3>
                <p className="text-slate-300 text-sm">{proj.description}</p>
                
                {/* Location Badge */}
                {proj.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    📍 <span className="font-medium text-slate-300">{proj.location}</span>
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md font-medium">
                    {proj.category || 'Infrastructure'}
                  </span>
                  <span className="font-medium text-slate-200">
                    Budget: {proj.budgetAllocated ? `₦${proj.budgetAllocated.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}