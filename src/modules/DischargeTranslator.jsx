// src/modules/DischargeTranslator.jsx
import { useState } from "react";
import { callClaude } from "../utils/callClaude";

const SYSTEM_PROMPT = `You are a patient educator. Translate complex hospital discharge summaries into simple, clear instructions.
Return JSON only:
{
  "whatHappened": "2-3 sentences in plain language, no jargon",
  "whatToDo": ["specific", "numbered", "action", "items"],
  "whenToCallDoctor": ["specific warning signs to watch for"],
  "followUpDate": "when to follow up, if mentioned"
}`;

export default function DischargeTranslator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    setLoading(true);
    try {
      const raw = await callClaude(SYSTEM_PROMPT, input);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const copyForPatient = () => {
    if (!result) return;
    const text = `WHAT HAPPENED:\n${result.whatHappened}\n\nWHAT TO DO:\n${result.whatToDo.map((t,i)=>`${i+1}. ${t}`).join('\n')}\n\nCALL YOUR DOCTOR IF:\n${result.whenToCallDoctor.map(w=>`• ${w}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Discharge Translator</h2>
        <p className="text-slate-400 mt-1 text-sm">Converts clinical discharge summaries into patient-ready instructions.</p>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste hospital discharge summary here..."
        className="w-full h-48 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-teal-500 text-sm mb-4"
      />

      <button
        onClick={translate}
        disabled={loading || !input.trim()}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium transition-all mb-8"
      >
        {loading ? "Translating..." : "Translate for Patient →"}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs text-teal-400 font-mono uppercase tracking-widest mb-2">What Happened</p>
            <p className="text-slate-200 text-sm leading-relaxed">{result.whatHappened}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs text-teal-400 font-mono uppercase tracking-widest mb-3">What To Do</p>
            <ol className="space-y-2">
              {result.whatToDo?.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="text-teal-500 font-mono font-bold flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-red-950/30 border border-red-700/40 rounded-2xl p-5">
            <p className="text-xs text-red-400 font-mono uppercase tracking-widest mb-3">🚨 Call Your Doctor If...</p>
            <ul className="space-y-2">
              {result.whenToCallDoctor?.map((w, i) => (
                <li key={i} className="text-sm text-red-200 flex gap-2">
                  <span className="flex-shrink-0">•</span>{w}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={copyForPatient} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm transition-all">
            {copied ? "✅ Copied to clipboard!" : "Copy Patient-Ready Instructions"}
          </button>
        </div>
      )}
    </div>
  );
}