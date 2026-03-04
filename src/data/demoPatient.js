// src/data/demoPatient.js
// Fictional patient for demo mode — safe to commit

export const demoPatient = {
    name: "John Doe",
    age: 67,
    dob: "1957-03-14",
    record: `
  PATIENT: John Doe | DOB: 03/14/1957 | MRN: 00482910
  
  === VISIT 2019-01-10 ===
  Chief Complaint: Fatigue, increased thirst
  Diagnosis: Type 2 Diabetes Mellitus (E11.9)
  HbA1c: 7.4%
  Fasting Glucose: 142 mg/dL
  Started: Metformin 500mg twice daily
  BP: 138/88
  
  === VISIT 2020-06-22 ===
  HbA1c: 8.1% — increased
  Fasting Glucose: 171 mg/dL
  BP: 145/92
  Diagnosis added: Hypertension (I10)
  Started: Lisinopril 10mg daily
  Metformin increased to 1000mg twice daily
  
  === LAB RESULTS 2021-09-15 ===
  HbA1c: 7.8%
  Creatinine: 0.9 mg/dL (normal)
  eGFR: 82
  Cholesterol Total: 214 mg/dL
  LDL: 138 mg/dL — borderline high
  Started: Atorvastatin 20mg
  
  === VISIT 2022-11-03 ===
  Patient reports occasional chest tightness on exertion
  ECG: normal sinus rhythm
  Stress test: mild ST depression at peak — referred to cardiology
  Creatinine: 1.1 mg/dL (slight rise)
  
  === CARDIOLOGY CONSULT 2023-01-17 ===
  Echo: EF 55%, mild diastolic dysfunction
  Coronary CTA: 40% stenosis LAD — no intervention needed
  Added: Aspirin 81mg daily
  Added: Metoprolol 25mg daily for rate control
  
  === VISIT 2024-02-20 ===
  HbA1c: 8.6% — significantly elevated
  Creatinine: 1.4 mg/dL — rising trend (was 0.9 in 2021)
  eGFR: 58 — Stage 3 CKD flag
  BP: 152/96 — not well controlled
  Lisinopril increased to 20mg
  Referred to nephrology
  
  === ALLERGIES ===
  Penicillin — anaphylaxis
  Sulfa drugs — rash
  
  === CURRENT MEDICATIONS ===
  Metformin 1000mg BID
  Lisinopril 20mg daily
  Atorvastatin 20mg daily
  Metoprolol 25mg daily
  Aspirin 81mg daily
    `
  };