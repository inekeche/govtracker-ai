'use client';
import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [feedback, setFeedback] = useState({ citizenEmail: '', satisfaction: 'Satisfied', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  const handleRatingSubmit = async (e, srv) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        serviceName: srv.title || srv.name || 'Public Institution',
        agency: srv.agency || 'Government Agency',
        category: srv.category || 'Public Service',
        rating: feedback.satisfaction, // 'Satisfied', 'Neutral', or 'Dissatisfied'
        comment: feedback.comment,
        userEmail: feedback.citizenEmail || 'Anonymous Citizen'
      };

      const res = await fetch('http://localhost:5000/api/services/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Institutional scrutiny feedback recorded successfully!');
        setFeedback({ citizenEmail: '', satisfaction: 'Satisfied', comment: '' });
        setSelectedService(null);
        
        // Refresh services list
        const updated = await fetch('http://localhost:5000/api/services').then(r => r.json());
        setServices(updated);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to submit: ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <BackButton />

        <div className="text-center space-y-2">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
            Access Services & Scrutinize Decisions
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Public Services Directory & Accountability Portal</h1>
          <p className="text-slate-400 text-sm">Access government services, review institutional delivery, and grade public performance.</p>
        </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse text-center">Loading institutional services...</p>
        ) : services.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400">
            No public services listed in database yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const totalRatings = srv.ratings?.length || 0;
              const satisfiedCount = srv.ratings?.filter(r => r.satisfaction === 'Satisfied').length || 0;
              const satisfactionRate = totalRatings > 0 ? Math.round((satisfiedCount / totalRatings) * 100) : 0;

              return (
                <div key={srv._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-medium">
                        {srv.category}
                      </span>
                      <span className="text-xs text-slate-400">Agency: <strong className="text-slate-200">{srv.agency}</strong></span>
                    </div>

                    <h3 className="text-xl font-semibold text-emerald-400">{srv.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{srv.description}</p>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <p className="text-slate-400">📋 <strong className="text-slate-300">Eligibility:</strong> {srv.eligibility}</p>
                      {srv.accessLink && (
                        <p className="pt-1">
                          🔗 <a href={srv.accessLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-medium">Access Service Portal ↗</a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Citizen Satisfaction Score:</span>
                      <span className={`font-bold ${satisfactionRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {totalRatings > 0 ? `${satisfactionRate}% (${totalRatings} reviews)` : 'No reviews yet'}
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelectedService(srv)}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium py-2.5 rounded-xl transition cursor-pointer"
                    >
                      ⚖️ Scrutinize & Rate Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Scrutiny & Rating Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-200">
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-emerald-400">Scrutinize: {selectedService.title}</h2>
              <p className="text-xs text-slate-400">Submit your independent citizen evaluation on this institutional service delivery.</p>

              <form onSubmit={(e) => handleRatingSubmit(e, selectedService)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={feedback.citizenEmail}
                    onChange={(e) => setFeedback({ ...feedback, citizenEmail: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Satisfaction Rating</label>
                  <select 
                    value={feedback.satisfaction}
                    onChange={(e) => setFeedback({ ...feedback, satisfaction: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Satisfied">🟢 Satisfied (Meets Expectations)</option>
                    <option value="Neutral">🟡 Neutral (Average / Inconsistent)</option>
                    <option value="Dissatisfied">🔴 Dissatisfied (Poor Service / Inefficient)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Scrutiny Comment / Review</label>
                  <textarea 
                    rows="3"
                    required
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    placeholder="Describe your experience accessing this service..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Scrutiny Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}