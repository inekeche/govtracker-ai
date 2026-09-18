'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';

export default function ScrutinizeDecisionsPage() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchDecisions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/decisions');
      const data = await res.json();
      setDecisions(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading decisions:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleVote = async (id, voteType) => {
    try {
      const res = await fetch(`http://localhost:5000/api/decisions/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      });
      if (res.ok) fetchDecisions();
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleSuggestionSubmit = async (e, id) => {
    e.preventDefault();
    const commentData = commentInputs[id] || {};
    try {
      const res = await fetch(`http://localhost:5000/api/decisions/${id}/suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenEmail: commentData.email || 'anonymous@citizen.org',
          comment: commentData.text || ''
        })
      });
      if (res.ok) {
        setCommentInputs({ ...commentInputs, [id]: { email: '', text: '' } });
        fetchDecisions();
      }
    } catch (err) {
      console.error("Error submitting suggestion:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        
        <div>
          <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
            Institutional Oversight
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Scrutinize Institutional Decisions</h1>
          <p className="text-slate-400 text-sm mt-1">Review pending or active institutional policies, vote on favorability, and submit alternative inputs.</p>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading institutional decisions...</p>
        ) : decisions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No institutional decisions currently listed for public scrutiny.
          </div>
        ) : (
          <div className="space-y-6">
            {decisions.map((item) => {
              const totalVotes = item.favorableVotes + item.unfavorableVotes;
              const favorablePct = totalVotes > 0 ? Math.round((item.favorableVotes / totalVotes) * 100) : 50;

              return (
                <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {item.institution}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{item.title}</h2>
                    <p className="text-sm text-slate-300 mt-2">{item.description}</p>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mt-3 text-xs text-slate-400">
                      <strong className="text-slate-200">Impact Analysis:</strong> {item.impactSummary}
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-400">👍 Favorable ({item.favorableVotes})</span>
                      <span className="text-rose-400">👎 Unfavorable ({item.unfavorableVotes})</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${favorablePct}%` }}></div>
                      <div className="bg-rose-500 h-full transition-all" style={{ width: `${100 - favorablePct}%` }}></div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button 
                        onClick={() => handleVote(item._id, 'favorable')}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold py-2 rounded-xl text-xs transition"
                      >
                        Vote Favorable
                      </button>
                      <button 
                        onClick={() => handleVote(item._id, 'unfavorable')}
                        className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold py-2 rounded-xl text-xs transition"
                      >
                        Vote Unfavorable
                      </button>
                    </div>
                  </div>

                  {/* Public Suggestions / Input Section */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Citizen Recommendations ({item.suggestions.length})</h3>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {item.suggestions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No suggestions submitted yet. Be the first to weigh in.</p>
                      ) : (
                        item.suggestions.map((s, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs space-y-1">
                            <span className="font-semibold text-amber-400">{s.citizenEmail}</span>
                            <p className="text-slate-300">{s.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={(e) => handleSuggestionSubmit(e, item._id)} className="space-y-2 pt-2">
                      <input 
                        type="email" 
                        placeholder="Your Email Address"
                        value={commentInputs[item._id]?.email || ''}
                        onChange={(e) => setCommentInputs({
                          ...commentInputs, 
                          [item._id]: { ...commentInputs[item._id], email: e.target.value }
                        })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <textarea 
                        rows="2" 
                        placeholder="Provide your constructive suggestion or alternative input..."
                        value={commentInputs[item._id]?.text || ''}
                        onChange={(e) => setCommentInputs({
                          ...commentInputs, 
                          [item._id]: { ...commentInputs[item._id], text: e.target.value }
                        })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      ></textarea>
                      <button 
                        type="submit" 
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Submit Suggestion
                      </button>
                    </form>
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