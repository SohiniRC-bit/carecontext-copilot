// src/modules/DrugChecker.jsx
import { useState } from "react";
import { callClaude } from "../utils/callClaude";

const SYSTEM_PROMPT = `You are a clinical pharmacist. Check for drug interactions.
Return JSON only:
{
  "interactions": [
    {
      "drug1": "name",
      "drug2": "name",
      "severity": "minor|moderate|major",
      "mechanism": "brief mechanism",
      "recommendation": "clinical recommendation"
    }
  ],
  "safe": true or false,
  "summary": "one sentence overall safety assessment"
}`;

export default function DrugChecker({ record }) {
  const [newDrug, setNewDrug] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!newDrug.trim()) return;
    setLoading(true);
    try {
      const userMsg = `Patient's current medication list extracted from record:\n${record}\n\nNew drug being considered: ${newDrug}`;
      const raw = await callClaude(SYSTEM_PROMPT, userMsg);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Drug Interaction Checker</h2>
        <p className="text-slate-400 mt-1 text-sm">Second-opinion layer before prescribing a new medication.</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
        <label className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-2">New Drug to Prescribe</label>
        <div className="flex gap-3">
          <input
            value={newDrug}
            onChange={e => setNewDrug(e.target.value)}
            placeholder="e.g. Ibuprofen 400mg"
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            onKeyDown={e => e.key === "Enter" && check()}
          />
          <button
            onClick={check}
            disabled={loading || !newDrug.trim()}
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-medium transition-all"
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Summary banner */}
          <div className={`rounded-2xl p-4 border ${result.safe ? "bg-green-950/40 border-green-700/40" : "bg-red-950/40 border-red-700/40"}`}>
            <p className={`text-sm font-semibold ${result.safe ? "text-green-300" : "text-red-300"}`}>
              {result.safe ? "✅ No major interactions found" : "⛔ Interactions detected — review required"}
            </p>
            <p className="text-xs text-slate-400 mt-1">{result.summary}</p>
          </div>

          {result.interactions?.map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-slate-300">{item.drug1}</span>
                <span className="text-slate-600">×</span>
                <span className="text-sm font-mono text-slate-300">{item.drug2}</span>
                <span className={`ml-auto text-xs font-mono uppercase px-2 py-0.5 rounded ${
                  item.severity === "major" ? "bg-red-900 text-red-300" :
                  item.severity === "moderate" ? "bg-amber-900 text-amber-300" :
                  "bg-slate-700 text-slate-400"}`}>{item.severity}</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{item.mechanism}</p>
              <p className="text-sm text-teal-300">{item.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}