# Resume Checker AI — Production Deployment Guide

This guide provides end-to-end instructions for deploying **Resume Checker AI** to production using zero-cost free tiers:
- **Frontend**: [Vercel](https://vercel.com/) (React + Vite SPA)
- **Backend**: [Render](https://render.com/) (Node.js & Express Web Service)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 Shared Cluster)

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |   User's Web Browser        |
                      +--------------+--------------+
                                     |
               HTTPS (Static Assets) | HTTPS (REST API calls)
                                     v
                      +-----------------------------+
                      |  Vercel (Frontend Client)   |
                      |  https://<app>.vercel.app   |
                      +--------------+--------------+
                                     |
                                     | CORS Protected
                                     v
                      +-----------------------------+
                      |  Render (Backend Service)   |
                      |  https://<app>.onrender.com |
                      +--------------+--------------+
                                     |
                                     | Encrypted TLS Connection
                                     v
                      +-----------------------------+
                      | MongoDB Atlas (M0 Free DB)  |
                      | cluster0.abcde.mongodb.net  |
                      +-----------------------------+
```

---

## 2. Directory & Command Specifications

| Component | Target Platform | Root Directory | Install / Build Command | Start Command | Output Directory |
|---|---|---|---|---|---|
| **Frontend** | Vercel | `client` | `npm run build` | *Static Hosting* | `dist` |
| **Backend** | Render | `server` | `npm install` | `npm start` (`node src/server.js`) | *N/A (API Server)* |

---

## 3. Environment Variable Reference

### Backend Variables (Configure in Render Dashboard)

| Variable Name | Required? | Example Value | Description |
|---|---|---|---|
| `NODE_ENV` | **Yes** | `production` | Enables production optimizations & secure cookies |
| `PORT` | **Yes** | `10000` | Port automatically assigned by Render |
| `MONGODB_URI` | **Yes** | `mongodb+srv://user:pass@cluster0.mongodb.net/resume_checker_ai?retryWrites=true&w=majority` | Connection string from MongoDB Atlas |
| `JWT_SECRET` | **Yes** | *Generate random 64-char hex string* | Secret key for signing authentication tokens |
| `JWT_EXPIRE` | No | `30d` | Lifetime of authentication sessions (default: 30 days) |
| `CLIENT_URL` | **Yes** | `https://your-frontend.vercel.app` | Production frontend URL allowed through CORS |
| `ALLOW_VERCEL_PREVIEWS` | No | `true` | Allows Vercel preview deployment URLs (`*.vercel.app`) |
| `MAX_UPLOAD_SIZE_MB` | No | `10` | Maximum file size for uploaded resumes (default: 10MB) |
| `GEMINI_API_KEY` | Optional | *Your Google AI Studio Key* | Live generative AI rewriting (heuristic engine used if blank) |

> [!WARNING]
> Never commit actual secret keys or `.env` files to Git. Enter them exclusively in your hosting provider's dashboard.

### Frontend Variables (Configure in Vercel Project Settings)

| Variable Name | Required? | Example Value | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | `https://your-backend.onrender.com/api` | Base URL pointing to the deployed Render API |

---

## 4. Step-by-Step Deployment Instructions

### Step 1: Push Code to GitHub

1. Open your terminal in the repository root:
   ```bash
   cd "c:\Users\ADMIN\OneDrive\Desktop\Resume checker"
   ```
2. Verify that your `.env` files and local secrets are excluded from Git:
   ```bash
   git status
   ```
3. Stage and commit only verified deployment changes:
   ```bash
   git add .
   git commit -m "feat: complete production deployment configuration"
   ```
4. Push to your GitHub repository:
   ```bash
   git push origin main
   ```

---

### Step 2: Set Up Free MongoDB Atlas Cluster

> [!IMPORTANT]
> **Database Isolation Notice**:
> Do NOT touch, overwrite, or modify any existing ConvertX database, collections, or project credentials. Resume Checker AI uses its own dedicated database named `resume_checker_ai`.

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. If you already have a free cluster in your current project, click the Project dropdown at the top-left and click **New Project** (Atlas allows one Free M0 cluster per project).
3. Click **Create Database** -> Select the **M0 Free** shared cluster tier.
4. Configure cluster options:
   - **Cluster Name**: `ResumeChecker`
   - **Cloud Provider**: AWS
   - **Region**: `ap-south-1` (Mumbai) or the region closest to your target users.
   - *Ensure no paid add-ons or auto-scaling upgrades are checked*.
5. Set up dedicated database credentials under **Security** -> **Quickstart**:
   - Choose **Username and Password**. Create a dedicated user (e.g., `resume_checker_admin`) with a strong password.
   - *Do not use your Atlas account login credentials*.
6. Configure **Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Why 0.0.0.0/0 is needed*: Free-tier hosting providers like Render spin up containers with dynamic, changing outbound IP addresses. Securing your database relies on your database user's strong password and encrypted TLS transport.
7. Retrieve your official Connection String:
   - Click **Connect** on your cluster -> Choose **Drivers** -> Select **Node.js** (version 5.5 or later).
   - Copy the URI template:
     ```
     mongodb+srv://<DATABASE_USER>:<PASSWORD>@resumechecker.abcde.mongodb.net/resume_checker_ai?retryWrites=true&w=majority
     ```
   - Replace `<DATABASE_USER>` and `<PASSWORD>` (URL-encode special characters if necessary, e.g., `@` becomes `%40`).
   - Ensure the database name `/resume_checker_ai` is specified before the `?` query string.
8. Local Verification (Optional):
   - In your local `server/.env`, set `MONGODB_URI=<your-atlas-uri>`.
   - Run the automated connectivity test:
     ```bash
     npm run test:db
     ```
   - Confirm it reports: `[Verify Atlas] All connectivity and permission checks passed successfully!`.

---

### Step 3: Deploy Backend on Render

1. Sign in to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** -> Connect your GitHub account and select `resume-checker-ai`.
4. Configure the service settings:
   - **Name**: `resume-checker-backend` (or a name of your choice)
   - **Region**: Choose the region closest to your MongoDB Atlas cluster (e.g., *Oregon (US West)* or *Frankfurt (EU)*)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** and expand **Environment Variables**:
   - Add `NODE_ENV` = `production`
   - Add `PORT` = `10000`
   - Add `MONGODB_URI` = *(your MongoDB Atlas URI from Step 2)*
   - Add `JWT_SECRET` = *(generate a random 64-character string)*
   - Add `JWT_EXPIRE` = `30d`
   - Add `CLIENT_URL` = `http://localhost:5173` *(temporary placeholder until Vercel is deployed)*
   - Add `ALLOW_VERCEL_PREVIEWS` = `true`
   - Add `MAX_UPLOAD_SIZE_MB` = `10`
   - Add `GEMINI_API_KEY` = *(optional)*
6. Set **Health Check Path** to:
   ```
   /api/health
   ```
7. Click **Create Web Service**.
8. Wait for Render to build and start your service. Copy your public backend URL once live:
   ```
   https://resume-checker-backend.onrender.com
   ```
9. Confirm the backend is healthy by visiting:
   `https://resume-checker-backend.onrender.com/api/health`
   *(Expected response: `{"status":"healthy","database":"connected",...}`)*

---

### Step 4: Deploy Frontend on Vercel

1. Sign in to the [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your `resume-checker-ai` GitHub repository.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** -> Select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://resume-checker-backend.onrender.com/api`
   *(Make sure to use your actual Render URL and include `/api`)*.
6. Click **Deploy**.
7. Once deployment finishes, Vercel will provide your production domain:
   ```
   https://resume-checker-ai.vercel.app
   ```

---

### Step 5: Link CORS in Render

Now that your Vercel frontend URL is active, update Render to accept cross-origin requests from it:

1. Open your [Render Dashboard](https://dashboard.render.com/) -> Select your `resume-checker-backend` service.
2. Navigate to the **Environment** tab.
3. Update `CLIENT_URL` to your production Vercel URL:
   ```
   CLIENT_URL=https://resume-checker-ai.vercel.app
   ```
4. Click **Save Changes**. Render will redeploy automatically.

---

## 5. Post-Deployment Verification Checklist

Once both services are deployed, perform the following end-to-end tests:

- [ ] **Health Endpoint**: Open `https://<backend>.onrender.com/api/health` -> confirms `"database": "connected"`.
- [ ] **Account Registration**: Navigate to `/signup` on Vercel -> create a new user account.
- [ ] **Login & Session**: Sign in at `/login` -> verify dashboard loads and JWT token is stored.
- [ ] **Direct Page Refresh**: Press F5 on `/dashboard/builder` and `/dashboard/checker` -> confirms no Vercel 404 errors.
- [ ] **Document Upload**: Upload a PDF or DOCX file on the ATS Checker -> verify score calculation, issues, and keyword density.
- [ ] **Live Builder & PDF Export**: Open the Resume Builder -> click **Download PDF** -> verify clean, multi-page A4 PDF downloads to your computer.
- [ ] **Job Description Matcher**: Run a match test against a job description -> verify matched and missing skills are computed.
- [ ] **Account Logout**: Log out -> verify redirect to landing page and removal of auth credentials.

---

## 6. Free-Tier Behavior & Platform Considerations

1. **Render Free Tier Spin-Down (Cold Starts)**:
   - Render free-tier web services spin down after **15 minutes of inactivity**.
   - The first request after a period of inactivity may take **30 to 50 seconds** to wake up.
   - Subsequent requests will respond in milliseconds.
2. **Privacy & Ephemeral Memory**:
   - Resume files and OCR page buffers are processed strictly in memory and discarded immediately upon response.
   - No raw resume text or files are permanently stored on disk or database.
3. **MongoDB Atlas Free M0 Limits**:
   - Includes **512 MB** storage, sufficient for thousands of user accounts and resume templates.
   - Automated cleanup prunes orphaned records when accounts are deleted.
