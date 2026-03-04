// src/components/Sidebar.jsx
const nav = [
    { id: "narrative", icon: "📋", label: "Pre-Visit Brief", desc: "Patient narrative" },
    { id: "anomaly",   icon: "🔍", label: "Anomaly Spotter", desc: "Pattern detection" },
    { id: "drug",      icon: "💊", label: "Drug Checker", desc: "Interaction check" },
    { id: "discharge", icon: "🏠", label: "Discharge Translator", desc: "Patient instructions" },
    { id: "referral",  icon: "📨", label: "Referral Copilot", desc: "Draft referral letter" },
  ];
  
  export default function Sidebar({ active, setActive }) {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Care<span className="text-teal-400">Context</span></h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">Clinical AI Copilot</p>
        </div>
        <nav className="flex-1 p-3">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all flex items-start gap-3 group
                ${active === item.id
                  ? "bg-teal-900/60 border border-teal-700/50 text-teal-300"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className="text-lg mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-600 font-mono text-center">v1.0.0 · Demo Build</p>
        </div>
      </aside>
    );
  }