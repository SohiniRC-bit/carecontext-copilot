// src/modules/AnomalySpotter.jsx
import { useState } from "react";
import { callClaude } from "../utils/callClaude";

const SYSTEM_PROMPT = `You are a clinical data analyst. Scan patient records for medically significant patterns and anomalies.
Return JSON only:
{
  "signals": [
    {
      "title": "signal name",
      "severity": "low|medium|high",
      "detail": "what changed, over how long, and why it matters clinically",
      "recommendation": "what the physician should consider"
    }
  ]
}
Only flag clinically significant patterns. Maximum 5 signals. Never invent data.`;

const severityStyles = {
  high: "border-red-700/40 bg-red-950/30",
  medium: "border-amber-700/40 bg-amber-950/30",
  low: "border-slate-600 bg-slate-900",
};

const severityDot = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

export default function AnomalySpotter({ record }) {
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const raw = await callClaude(SYSTEM_PROMPT, record);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSignals(parsed.signals);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Anomaly Spotter</h2>
        <p className="text-slate-400 mt-1 text-sm">Surfaces slow-moving signals buried across years of records.</p>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all mb-8"
      >
        {loading ? "Scanning for patterns..." : "Scan Record for Anomalies →"}
      </button>

      {signals && (
        <div className="space-y-4">
          {signals.map((s, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${severityStyles[s.severity]}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-3 h-3 rounded-full ${severityDot[s.severity]}`}></span>
                <h3 className="font-semibold text-slate-200">{s.title}</h3>
                <span className="ml-auto text-xs font-mono uppercase tracking-wider text-slate-500">{s.severity} severity</span>
              </div>
              <p className="text-sm text-slate-300 mb-3">{s.detail}</p>
              <div className="border-t border-slate-700 pt-3">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Recommendation</p>
                <p className="text-sm text-slate-400">{s.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}