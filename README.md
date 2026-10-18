# Resume Checker AI

> **Build Smarter. Apply Better. Get Noticed.**

A complete, modern, premium, responsive, AI-powered web application that allows users to create professional resumes from scratch, upload existing documents (PDF/DOCX), evaluate ATS compatibility, identify weak passive phrasing, match resumes with target job descriptions, improve wording using grounded AI, and export professional PDF resumes.

---

## 🚀 Key Features

1. **AI Resume Builder**
   - Interactive dual-pane live editor with real-time zoomable A4 preview.
   - Comprehensive structured sections: Personal Info, Professional Summary, Work Experience, Education, Skills, Projects, Certifications, Achievements, and Languages.
   - Inline **AI Bullet Enhancer** (active verb rewrites and metric suggestions) and **AI Summary Generator**.
   - Autosave with visible status indicator, manual save, and PDF export.

2. **ATS Resume Checker**
   - Text-based PDF and Word DOCX document parsing with `pdf-parse` and `mammoth`.
   - Transparent, configurable 5-category scoring engine:
     - **ATS Readability (25%)**: Document length, font clarity, contact completeness.
     - **Keyword Alignment (25%)**: Industry terms or direct match against target job description.
     - **Skills & Experience (20%)**: Section structure, chronological tenure, active responsibility ownership.
     - **Projects & Measurable Outcomes (15%)**: Quantified impact metrics (%, $, scale).
     - **Grammar, Clarity & Structure (15%)**: Third-person implied tone, date consistency.
   - Categorized issue list (Critical, Warning, Suggestion) with inline **1-Click AI Fixes**.

3. **Job Description Matcher**
   - Benchmarks any saved resume against a target job posting.
   - Highlights matched required skills, missing mandatory skills, and missing preferred qualifications.
   - **1-Click Create Tailored Resume**: Automatically clones and customizes a tailored resume version for that specific job posting.

4. **AI Resume Improver**
   - Side-by-side interactive review of original text versus proposed AI revision.
   - Complete Accept, Edit, and Reject control.
   - Recalculates projected ATS score improvements based on approved changes.

5. **5 Engineered Resume Templates**
   - **ATS Classic**: Single-column layout engineered for maximum parsing compatibility across legacy and modern ATS systems (Workday, Greenhouse, Lever).
   - **Modern Professional**: Contemporary aesthetic with subtle violet accents and competency badges.
   - **Minimal Elegant**: Refined typography with generous whitespace for design and product roles.
   - **Technical Resume**: Monospace accents, tech-stack header box, and systems focus for developers and DevOps engineers.
   - **Executive Profile**: Structured for senior leaders with executive statement callouts and strategic milestones.

6. **AI Career Assistant**
   - Interactive chat assistant with context awareness of your active resume.
   - Provides structured advice on technical projects, interview preparation (STAR method), and career transitions.

7. **Authentication & Data Privacy**
   - Secure email/password authentication using `bcryptjs` and `jsonwebtoken`.
   - Forgot and reset password token flow.
   - User onboarding wizard for role targeting.
   - User data ownership: Permanent document purge and account deletion capabilities.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios
- **Backend**: Node.js, Express, Multer, Helmet, CORS, Express Rate Limit
- **Database**: MongoDB with Mongoose
- **Document Processing**: `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction)
- **AI Engine**: Google Gemini API integration with automatic fallback to a robust Heuristic AI engine for demo/offline use.
- **Testing**: Jest, Supertest

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Installation

From the project root directory, install root, client, and server dependencies:

```bash
# Install root orchestration tools
npm install

# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
cd ..
```

### 2. Environment Configuration

Copy the example environment files:

```bash
# In the server directory:
cp server/.env.example server/.env
```

Configure your `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/resume_checker_ai
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173

# Optional: Add your Google Gemini API key for live generative AI
GEMINI_API_KEY=
```

> **Note on AI Mode**: If no `GEMINI_API_KEY` is provided, the application runs seamlessly in **Heuristic AI Mode**, using a rule-based engine that transforms weak phrases into active verbs and generates role-appropriate summaries and career coaching answers.

### 3. Run Development Servers

Run both backend API and frontend Vite servers concurrently with a single command from the project root:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

Alternatively, you can run them in separate terminals:

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## 🧪 Automated Testing

Run the automated test suite in the `server` directory:

```bash
cd server
npm test
```

This executes:
- **Unit Tests**: Transparent ATS scoring engine calculations, boundary conditions, weak bullet detection, and custom job description keyword matching (`tests/atsScoring.test.js`).
- **Integration Tests**: User registration, login validation, token authorization, route protection, and health check endpoints (`tests/api.test.js`).

---

## 🏗️ Production Build

To build the client for production:

```bash
npm run build:client
```

The optimized static assets will be output to `client/dist`.

---

## 📄 License

MIT License. Designed and engineered for modern career advancement.
