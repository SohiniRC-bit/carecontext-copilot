// src/modules/ReferralCopilot.jsx
import { useState } from "react";
import { callClaude } from "../utils/callClaude";

const SPECIALTIES = ["Cardiology","Nephrology","Endocrinology","Neurology","Oncology","Orthopedics","Gastroenterology","Pulmonology","Rheumatology","Dermatology"];

const SYSTEM_PROMPT = `You are a physician's assistant. Draft a formal, complete referral letter.
Return JSON only:
{
  "letter": "full referral letter text, properly formatted with Dear Dr., patient background, reason for referral, relevant history, current medications, and closing"
}`;

export default function ReferralCopilot({ record, patientName }) {
  const [specialty, setSpecialty] = useState("Cardiology");
  const [reason, setReason] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const userMsg = `Patient: ${patientName}\nSpecialty referral to: ${specialty}\nReason: ${reason}\n\nPatient record:\n${record}`;
      const raw = await callClaude(SYSTEM_PROMPT, userMsg);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setLetter(parsed.letter);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const print = () => window.print();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Referral Letter Copilot</h2>
        <p className="text-slate-400 mt-1 text-sm">Draft a complete referral letter in 90 seconds.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-2">Referring To</label>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500">
            {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-2">Reason for Referral</label>
          <input value={reason} onChange={e => setReason(e.target.value)}
            placeholder="e.g. Worsening renal function"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500" />
        </div>
      </div>

      <button onClick={generate} disabled={loading || !reason.trim()}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-medium transition-all mb-6">
        {loading ? "Drafting letter..." : "Generate Referral Letter →"}
      </button>

      {letter && (
        <div className="bg-white text-slate-800 rounded-2xl p-8 shadow-xl font-serif">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{letter}</pre>
          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button onClick={print} className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-sans">Print / Export PDF</button>
            <button onClick={() => navigator.clipboard.writeText(letter)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg text-sm font-sans">Copy Text</button>
          </div>
        </div>
      )}
    </div>
  );
}