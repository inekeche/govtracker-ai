'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BackButton from '../../../components/BackButton';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const handlePrintFile = (fileData, title) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head><title>Print Evidence - ${title}</title></head>
        <body style="background:#111; color:#fff; text-align:center; padding:20px; font-family:sans-serif;">
          <h2>Evidence Document: ${title}</h2>
          <hr style="border-color:#44import x;"/>
          <div style="margin-top:20px;">
            ${fileData.startsWith('data:image/') ? `<img src="${fileData}" style="max-width:100%; height:auto; border-radius:8px;"/>` : 
              fileData.startsWith('data:video/') ? `<video controls src="${fileData}" style="max-width:100%;"></video>` : 
              `<iframe src="${fileData}" style="width:100%; height:80vh; border:none;"></iframe>`}
          </div>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <BackButton />

        {/* Admin Navigation Switcher Tabs */}
        <div className="flex space-x-4 border-b border-slate-700 pb-4">
          <Link 
            href="/admin/reports" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              pathname === '/admin/reports' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Issue Logs & Grievances
          </Link>
          <Link 
            href="/admin/services" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              pathname === '/admin/services' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Institutional Scrutiny Ratings
          </Link>
        </div>
        
        <div>
          <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
            Restricted • Admin & Oversight Portal
          </span>
          <h1 className="text-3xl font-bold tracking-tight mt-3">Citizen Grievance & Issue Logs</h1>
          <p className="text-slate-400">Review submitted community infrastructure issues and agency dispatch logs.</p>
        </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading citizen reports...</p>
        ) : reports.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400">
            No citizen reports logged yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((rep) => {
              const fileData = rep.evidence || rep.imageUrl || rep.photo || rep.file;

              return (
                <div key={rep._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-amber-400">{rep.title}</h3>
                    <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-md font-medium border border-amber-500/20">
                      {rep.status || 'Submitted'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{rep.description}</p>
                  
                  <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-700">
                    <p>📁 Category: <span className="text-slate-200 font-medium">{rep.category}</span></p>
                    {rep.latitude && rep.longitude && (
                      <p>📍 Coordinates: <span className="text-slate-200 font-medium">{rep.latitude}, {rep.longitude}</span></p>
                    )}
                    <p>🕒 Logged: <span className="text-slate-200">{new Date(rep.createdAt).toLocaleString()}</span></p>
                  </div>

                  {/* Attached Evidence Preview & Actions */}
                  {fileData ? (
                    <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-3">
                      <div className="text-xs font-semibold text-slate-300 flex items-center justify-between flex-wrap gap-2">
                        <span>📎 Attached Evidence</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handlePrintFile(fileData, rep.title)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium transition"
                          >
                            🖨️ Print / View
                          </button>
                          <a 
                            href={fileData} 
                            download={`evidence_report_${rep._id || 'file'}`}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                          >
                            ⬇ Download
                          </a>
                        </div>
                      </div>

                      {typeof fileData === 'string' && fileData.startsWith('data:image/') ? (
                        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 max-h-48 flex justify-center">
                          <img src={fileData} alt="Evidence Preview" className="object-contain max-h-48 w-full" />
                        </div>
                      ) : typeof fileData === 'string' && fileData.startsWith('data:video/') ? (
                        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                          <video controls className="w-full max-h-48">
                            <source src={fileData} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                          <span>📄 Document / PDF attached</span>
                          <a href={fileData} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-medium">
                            Open Full File ↗
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-500 italic">
                      No evidence file attached to this report.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}