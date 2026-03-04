// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import NarrativeEngine from "./modules/NarrativeEngine";
import AnomalySpotter from "./modules/AnomalySpotter";
import DrugChecker from "./modules/DrugChecker";
import DischargeTranslator from "./modules/DischargeTranslator";
import ReferralCopilot from "./modules/ReferralCopilot";
import { demoPatient } from "./data/demoPatient";

export default function App() {
  const [activeModule, setActiveModule] = useState("narrative");
  const [patientRecord, setPatientRecord] = useState("");
  const [patientName, setPatientName] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const loadDemo = () => {
    setPatientRecord(demoPatient.record);
    setPatientName(demoPatient.name);
    setDemoMode(true);
  };

  const modules = {
    narrative: <NarrativeEngine record={patientRecord} />,
    anomaly: <AnomalySpotter record={patientRecord} />,
    drug: <DrugChecker record={patientRecord} />,
    discharge: <DischargeTranslator />,
    referral: <ReferralCopilot record={patientRecord} patientName={patientName} />,
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar active={activeModule} setActive={setActiveModule} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Patient Context</p>
            <p className="font-semibold text-slate-200">{patientName || "No patient loaded"}</p>
          </div>
          <div className="flex gap-3">
            {!demoMode && (
              <button
                onClick={loadDemo}
                className="text-xs bg-teal-900/50 hover:bg-teal-800 text-teal-300 border border-teal-700 px-4 py-2 rounded-lg transition-all font-mono"
              >
                Load Demo Patient
              </button>
            )}
            {/* PDF Upload */}
            <label className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-4 py-2 rounded-lg transition-all font-mono cursor-pointer">
              Upload Record PDF
              <input
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.type === "application/pdf") {
                    const { extractTextFromPDF } = await import("./utils/pdfExtractor");
                    const text = await extractTextFromPDF(file);
                    setPatientRecord(text);
                    setPatientName(file.name.replace(".pdf", ""));
                  } else {
                    const text = await file.text();
                    setPatientRecord(text);
                    setPatientName(file.name.replace(".txt", ""));
                  }
                  setDemoMode(false);
                }}
              />
            </label>
          </div>
        </div>

        <div className="p-8">
          {!patientRecord ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <p className="text-6xl mb-6">🏥</p>
              <h2 className="text-2xl font-semibold text-slate-300 mb-3">No patient loaded</h2>
              <p className="text-slate-500 mb-6 max-w-md">Upload a patient record PDF or load the demo patient to get started.</p>
              <button onClick={loadDemo} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-medium transition-all">
                Try Demo Patient →
              </button>
            </div>
          ) : (
            modules[activeModule]
          )}
        </div>
      </main>
    </div>
  );
}