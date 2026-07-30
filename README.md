# HealthVault Pro: AI-Powered Personal Health Record & Medical Report Analyzer

HealthVault Pro is a comprehensive, privacy-conscious Electronic Health Record (EHR) system and AI-driven medical report intelligence platform. Powered by Google Gemini AI (Gemini 2.5 Flash), HealthVault Pro enables patients and healthcare providers to seamlessly upload, parse, analyze, compare, and track medical history, lab reports, and prescriptions over time.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Data Storage & Maintenance](#data-storage--maintenance)
- [Security & Privacy](#security--privacy)
- [License](#license)

---

## Overview

Managing medical history across multiple clinics, doctors, and lab reports is often fragmented and complex. HealthVault Pro solves this by acting as a centralized, intelligent health repository. Beyond standard record storage, it uses Google Gemini AI multimodal vision and language models to interpret medical diagnostic reports (CBC, Liver Function, Lipid Panels, Radiology), parse handwritten or digital prescriptions, evaluate drug-drug interactions, analyze longitudinal treatment trends across multi-doctor visits, and provide structured dietary and doctor consultation guidance.

---

## Key Features

### 1. AI-Powered Medical Report Analysis
- Multimodal PDF and image parsing for lab test reports (e.g., Blood Work, Lipid Panels, Metabolic Tests).
- Automatic extraction of metrics, patient values, normal reference ranges, and clinical status (Low, Normal, High, Critical).
- Generates plain-language health summaries, urgent risk warnings, specialist doctor consultation recommendations, and personalized dietary/food advice.

### 2. Clinical Mind-Map & Longitudinal Disease Tracking
- Disease-centric health node organization that links medical visits, diagnoses, prescribed medications, and lab reports under specific condition timelines.
- Visual breakdown of condition progression across multiple doctor visits.

### 3. Multi-Visit & Multi-Report AI Comparison
- Cross-evaluates chronological medical visits and lab tests to determine whether treatment strategies are effective.
- Evaluates treatment evolution across different attending physicians to highlight optimal therapeutic outcomes.

### 4. Intelligent Drug Interaction Checker
- Analyzes co-prescribed medications for pharmacological drug-drug interactions.
- Categorizes risk severity (Mild, Moderate, Severe, Contraindicated) and provides safety recommendations.

### 5. Handwritten & Digital Prescription Parser (AI Vision OCR)
- Extracts medicine names, dosages, durations, timings (Morning, Afternoon, Evening, Night), and special administration instructions directly from prescription images or PDFs.

### 6. Verified Doctor Review & Rating System
- Patient-submitted rating and review registry for doctors, specialties, and hospitals.

### 7. Dual-Layer Storage Engine
- Primary lightweight JSON document store (`store.json`) for seamless portability.
- Secondary Microsoft Access database integration (`patients_registry.accdb`) with graceful fallback to JSON-only mode if driver is unavailable.

---

## System Architecture

```
                       +-----------------------------------+
                       |    React + Vite Frontend Client   |
                       | (Landing, Portal, Mind-Map, AI)   |
                       +-----------------+-----------------+
                                         | REST API (HTTP)
                                         v
                       +-----------------+-----------------+
                       |    Express.js Backend Server      |
                       |          (Port 5000)              |
                       +--------+----------------+---------+
                                |                |
             +------------------+                +------------------+
             |                                                      |
             v                                                      v
  +----------+----------+                                +----------+----------+
  | Google Gemini AI SDK|                                | Local Storage Engine|
  | (Gemini 2.5 Flash)  |                                |  - store.json       |
  +---------------------+                                |  - MS Access DB     |
                                                         |  - Uploaded PDFs    |
                                                         +---------------------+
```

---

## Technology Stack

- **Frontend**: React 18, Vite, React Router DOM, Lucide Icons, Vanilla CSS Design Tokens
- **Backend**: Node.js, Express.js, Multer (File Upload Handling), CORS, dotenv
- **Artificial Intelligence**: `@google/genai` (Google Gemini 2.5 Flash Multimodal API)
- **Database Engine**: Custom JSON Document Store, optional `node-adodb` (Microsoft Access Database Engine integration)

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Required for AI report analysis, prescription vision OCR, and interaction checks. Obtain one from Google AI Studio.

---

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ahmadkhanalm/HealthVault-Pro.git
   cd HealthVault-Pro
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## Environment Configuration

Create a `.env` file inside the `backend` folder based on the provided `.env.example`:

```bash
# Copy template to backend/.env
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your Google Gemini API Key:

```env
GEMINI_API_KEY=AIzaSyYourActualApiKeyHere
```

---

## Running the Application

### Option A: Using One-Click Batch Script (Windows)

Double-click `start_v2.bat` in the root directory, or run it via terminal:

```cmd
start_v2.bat
```

This launches both the Express backend server (on http://localhost:5000) and Vite frontend development server (on http://localhost:5173) in separate command windows.

### Option B: Manual Startup

**Terminal 1 (Backend Server)**:
```bash
cd backend
npm start
```

**Terminal 2 (Frontend Client)**:
```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## API Reference

### Authentication
- `POST /api/signup` - Register new patient profile.
- `POST /api/login` - Authenticate patient/doctor credentials.

### Patient & Medical Records
- `GET /api/patients/:cnic` - Fetch full patient health record and history.
- `POST /api/patients/:cnic/reports` - Upload lab test report (PDF/Image).
- `DELETE /api/patients/:cnic/reports/:reportId` - Remove test report.
- `POST /api/patients/:cnic/history` - Synchronize clinical visit narrative and prescription.
- `DELETE /api/patients/:cnic/history/:historyId` - Delete clinical record.

### AI Diagnostic & Intelligence Endpoints
- `POST /api/patients/:cnic/analyze-report` - Perform comprehensive AI analysis on lab report.
- `POST /api/patients/:cnic/compare-reports` - Compare two lab test reports over time.
- `POST /api/patients/:cnic/compare-visits` - Cross-analyze multiple doctor visits and treatments.
- `POST /api/patients/:cnic/health-summary` - Generate overall patient health trajectory brief.
- `POST /api/patients/:cnic/check-interactions` - Check prescribed medicines for drug interactions.
- `POST /api/patients/:cnic/diagnosis-suggestion` - AI diagnostic suggestion from lab report values.
- `POST /api/patients/:cnic/treatment-trend` - Track therapeutic trend for a specific disease node.
- `POST /api/patients/:cnic/parse-prescription` - Vision OCR parsing of handwritten or digital prescription images.

### Doctor Reviews
- `POST /api/reviews` - Submit doctor rating and feedback.
- `GET /api/reviews` - Fetch list of all public doctor reviews.

---

## Data Storage & Maintenance

### Data Reset Utility

To reset all local test data, user accounts, and uploaded PDFs back to a clean initial state, execute the included reset script:

```cmd
reset_v2.bat
```

This clears `backend/data/store.json`, wipes files in `backend/uploads/`, and resets the Access database registry if present.

---

## Security & Privacy

- All sensitive environment configurations (`.env`), private patient databases (`store.json`), and physical uploaded medical files (`uploads/`) are excluded from repository version control via `.gitignore`.
- Password fields are sanitized before sending user objects to the client.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
