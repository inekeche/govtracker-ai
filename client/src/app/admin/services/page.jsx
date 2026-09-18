{ratings.map((item) => (
  <div key={item._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3 shadow-xl">
    <div className="flex justify-between items-start">
      <div>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-medium">
          {item.category || 'Public Service'}
        </span>
        <span className="text-xs text-slate-400 block mt-1">Agency: <strong className="text-slate-200">{item.agency}</strong></span>
        <h3 className="text-lg font-bold text-white mt-1">{item.serviceName}</h3>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
        item.rating === 'Satisfied' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
        item.rating === 'Neutral' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      }`}>
        {item.rating}
      </span>
    </div>

    <p className="text-slate-300 text-sm bg-slate-900/60 p-3 rounded-xl border border-slate-800 italic">
      "{item.comment}"
    </p>

    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
      <span>👤 Submitted by: <strong className="text-slate-300">{item.userEmail}</strong></span>
      <span>🕒 {new Date(item.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
))}