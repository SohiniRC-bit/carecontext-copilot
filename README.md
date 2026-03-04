# CareContext Copilot 🏥

> AI-powered clinical copilot that synthesizes patient records into a pre-visit briefing for physicians — in 60 seconds.

**Live Demo:** [carecontext.vercel.app](https://carecontext.vercel.app)

---

## The Problem

Physicians spend **49% of their time on paperwork**, not patients. A doctor walks into a room with a new patient, 12 minutes on the clock, and a 400-page PDF of records buried in a system. Nobody has time to read it.

CareContext reads it for them. Before they walk in.

---

## Features

| Module | What it does |
|--------|-------------|
| 📋 Pre-Visit Narrative | Generates a 200-word patient briefing from raw records |
| 🔍 Anomaly Spotter | Surfaces slow-moving clinical signals across years of data |
| 💊 Drug Checker | Flags interactions before a new prescription is written |
| 🏠 Discharge Translator | Converts clinical jargon into patient-ready instructions |
| 📨 Referral Copilot | Drafts complete referral letters in 90 seconds |

---

## Demo

> Load the built-in demo patient (John Doe, 67, Type 2 DM + hypertension + early CKD) — no upload needed.

![CareContext Demo](./public/demo-screenshot.png)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI Engine | Claude API (claude-sonnet-4) |
| PDF Parsing | PDF.js |
| Charts | Recharts |
| Deployment | Vercel |

---

## Architecture Decision: Prompt Chaining

Large patient records (400+ pages) exceed a single LLM context window. I implemented a **map-reduce pattern**:

1. Chunk the record by date ranges
2. Summarize each chunk independently  
3. Synthesize across all summaries into a final output

This enables full longitudinal patient analysis regardless of record size — a pattern directly applicable to any RAG or document intelligence system.

---

## Local Setup
```bash
