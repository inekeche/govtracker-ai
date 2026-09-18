'use client';
import { useState } from 'react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} GovTracker AI. Empowering citizens through open transparency By inekeonubifelix@gmail.com.</p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <button 
              onClick={() => setActiveModal('privacy')} 
              className="hover:text-slate-300 transition cursor-pointer bg-transparent border-0 p-0 text-slate-500 text-xs"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActiveModal('api')} 
              className="hover:text-slate-300 transition cursor-pointer bg-transparent border-0 p-0 text-slate-500 text-xs"
            >
              Open Gov Data API
            </button>
            <button 
              onClick={() => setActiveModal('support')} 
              className="hover:text-slate-300 transition cursor-pointer bg-transparent border-0 p-0 text-slate-500 text-xs"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL WINDOWS FOR FOOTER LINKS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-200">
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>

            {/* Modal Content: Privacy Policy */}
            {activeModal === 'privacy' && (
              <>
                <h2 className="text-xl font-bold text-emerald-400">Privacy Policy</h2>
                <div className="text-xs text-slate-300 space-y-2 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                  <p>At GovTracker AI, we value your privacy and are committed to protecting any data submitted through our transparency and citizen issue-reporting portal.</p>
                  <p><strong>1. Data Collection:</strong> We collect project reports, infrastructure complaints, and location coordinates solely for public monitoring, audit tracking, and civil oversight.</p>
                  <p><strong>2. Confidentiality:</strong> Citizen submissions are handled with utmost security. Personal identifiers are restricted to the authorized Admin Portal and protected oversight channels.</p>
                  <p><strong>3. Contact:</strong> For privacy inquiries, reach out directly to the administrator at <strong>inekeonubifelix@gmail.com</strong>.</p>
                </div>
              </>
            )}

            {/* Modal Content: Open Gov Data API */}
            {activeModal === 'api' && (
              <>
                <h2 className="text-xl font-bold text-emerald-400">Open Gov Data API Endpoints</h2>
                <div className="text-xs text-slate-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                  <p>GovTracker AI provides open programmatic access for developers, civil society organizations, and researchers to audit public sector spending.</p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-amber-400 font-mono font-semibold">GET /api/projects</p>
                    <p className="text-slate-400">Fetches all tracked government capital projects and Naira budget allocations.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-amber-400 font-mono font-semibold">POST /api/reports</p>
                    <p className="text-slate-400">Allows external integrations to log public infrastructure grievances into MongoDB.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-amber-400 font-mono font-semibold">GET /api/policies</p>
                    <p className="text-slate-400">Retrieves AI-simplified public policy and legislative frameworks.</p>
                  </div>
                </div>
              </>
            )}

            {/* Modal Content: Support */}
            {activeModal === 'support' && (
              <>
                <h2 className="text-xl font-bold text-emerald-400">Platform Support & Help Desk</h2>
                <div className="text-xs text-slate-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                  <p>Need technical assistance, onboarding guidance, or agency integration support?</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <p>📧 Direct Developer Contact: <strong className="text-white">inekeonubifelix@gmail.com</strong></p>
                    <p>🛠️ System Status: <span className="text-emerald-400 font-semibold">Operational (Local Node Server Active)</span></p>
                    <p>⚡ Stack: Next.js frontend, Express backend, MongoDB Atlas cluster.</p>
                  </div>
                  <p className="text-slate-400">Send an email for custom administrative provisioning or database query troubleshooting.</p>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button 
                onClick={closeModal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}