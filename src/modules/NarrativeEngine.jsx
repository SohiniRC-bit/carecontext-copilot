// src/modules/NarrativeEngine.jsx
import { useState } from "react";
import { callClaude } from "../utils/callClaude";

const SYSTEM_PROMPT = `You are a senior clinical summarizer working for a physician. 
Given raw patient medical records, produce a structured pre-visit briefing.
Respond in this exact JSON format:
{
  "narrative": "200-word plain-English story of this patient's health journey",
  "conditions": ["list", "of", "active", "diagnoses"],
  "medications": ["current", "medications"],
  "alerts": ["2-3 things the doctor MUST know today"],
  "lastVisit": "summary of most recent encounter"
}
Be factual. Never hallucinate. If uncertain about something, prefix it with [UNCERTAIN].`;

export default function NarrativeEngine({ record }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await callClaude(SYSTEM_PROMPT, `Patient record:\n${record}`);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Pre-Visit Narrative</h2>
        <p className="text-slate-400 mt-1 text-sm">AI-generated clinical briefing for the physician.</p>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all mb-8"
      >
        {loading ? "Generating briefing..." : "Generate Pre-Visit Brief →"}
      </button>

      {error && <p className="text-red-400 text-sm mb-4">Error: {error}</p>}

      {result && (
        <div className="space-y-6">
          {/* Narrative */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <p className="text-xs text-teal-400 font-mono uppercase tracking-widest mb-3">Patient Story</p>
            <p className="text-slate-200 leading-relaxed">{result.narrative}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Active Conditions */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">Active Conditions</p>
              <ul className="space-y-2">
                {result.conditions?.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medications */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">Current Medications</p>
              <ul className="space-y-2">
                {result.medications?.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-slate-600">💊</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-2xl p-5">
            <p className="text-xs text-amber-400 font-mono uppercase tracking-widest mb-3">⚠ Must Know Today</p>
            <ul className="space-y-2">
              {result.alerts?.map((a, i) => (
                <li key={i} className="text-sm text-amber-200">{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}