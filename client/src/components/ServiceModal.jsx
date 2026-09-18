'use client';
import { useState } from 'react';

export default function ServiceModal({ service, onClose, onSuccess }) {
  const [citizenEmail, setCitizenEmail] = useState('');
  const [satisfaction, setSatisfaction] = useState('Satisfied');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !service._id) {
      alert('No service selected.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceName: service.title || service.name || 'Public Institution',
        agency: service.agency || 'Government Agency',
        category: service.category || 'Public Service',
        rating: satisfaction, // 'Satisfied', 'Neutral', or 'Dissatisfied'
        comment: comment,
        userEmail: citizenEmail || 'Anonymous Citizen'
      };

      const res = await fetch('http://localhost:5000/api/services/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Institutional scrutiny audit recorded successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to submit: ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 text-white shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{service?.category || 'Public Service'}</span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Scrutinize: {service?.title || service?.name || 'Public Institution'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Your Email Address</label>
            <input 
              type="email" 
              value={citizenEmail}
              onChange={(e) => setCitizenEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Satisfaction Level</label>
            <select 
              value={satisfaction}
              onChange={(e) => setSatisfaction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
            >
              <option value="Satisfied">🟢 Satisfied (Meets / Exceeds Expectations)</option>
              <option value="Neutral">🟡 Neutral (Average / Inconsistent)</option>
              <option value="Dissatisfied">🔴 Dissatisfied (Poor Service / Inefficient)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Scrutiny Comment / Review</label>
            <textarea 
              rows="4" 
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience accessing this service..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs font-medium transition text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-lg shadow-emerald-600/20 text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Scrutiny Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}