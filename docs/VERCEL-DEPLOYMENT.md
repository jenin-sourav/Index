# Deploying Apex International School to Vercel via GitHub
## Step-by-Step Production Deployment Guide

---

## Overview

This guide walks you through deploying your Apex International School website and management system to **Vercel** with continuous deployment from **GitHub**.

---

## Step 1: Push Code to GitHub

### Option A: Using the Command Line (Git)
If you have Git installed on your computer:

```bash
# 1. Initialize git repository in this folder
git init

# 2. Stage all project files (node_modules is excluded by .gitignore)
git add .

# 3. Commit the project
git commit -m "feat: complete international school website, management system & portals"

# 4. Set default branch to main
git branch -M main

# 5. Link to your GitHub repository
# (Create a new empty repository on github.com first: e.g. 'apex-international-school')
git remote add origin https://github.com/<your-github-username>/apex-international-school.git

# 6. Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Desktop
1. Download and install [GitHub Desktop](https://desktop.github.com/).
2. Click **File** &rarr; **Add Local Repository** &rarr; Select `C:\Users\UESR\Downloads\School`.
3. If prompted to create a repository, click **Create Repository**.
4. Click **Publish repository** to push it directly to your GitHub account.

---

## Step 2: Import into Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. From the Vercel Dashboard, click **"Add New..."** &rarr; **"Project"**.
3. Under **"Import Git Repository"**, find your `apex-international-school` repository and click **Import**.
4. Vercel will automatically detect **Next.js**.

---

## Step 3: Configure Database (Vercel Postgres / Neon)

Because Vercel runs on a serverless architecture (ephemeral file system), SQLite files cannot be written to in production. Use Vercel's built-in PostgreSQL:

1. In your Vercel Project dashboard, go to the **Storage** tab.
2. Click **"Create Database"** &rarr; Select **Postgres** (powered by Neon).
3. Choose your nearest region (e.g. `Singapore (sin1)` for lowest latency from Bangladesh).
4. Click **Create**.
5. Once created, click **"Connect Project"** &rarr; Select your `apex-international-school` project.
   - Vercel automatically populates `DATABASE_URL` and `POSTGRES_URL` in your project's Environment Variables!

---

## Step 4: Environment Variables

In the Vercel project configuration, under **Environment Variables**, verify or add the following:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | *(Auto-configured by Vercel Postgres)* | PostgreSQL connection string |
| `SESSION_SECRET` | `apex_intl_school_super_secret_session_key_2026_bd_asia_dhaka` | 64+ char secret for HMAC-SHA256 sessions |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel production URL |
| `NEXT_PUBLIC_SCHOOL_NAME` | `Apex International School, Dhaka` | School Name |
| `NEXT_PUBLIC_TIMEZONE` | `Asia/Dhaka` | Institutional Timezone |
| `NEXT_PUBLIC_CURRENCY` | `BDT` | Bangladeshi Taka |

---

## Step 5: Deploy & Seed Data

1. Click **Deploy** in Vercel.
2. Vercel will install dependencies, run `scripts/prepare-vercel.js` (which automatically detects the PostgreSQL URL and switches the Prisma provider), run `prisma generate`, and build Next.js.
3. Once the deployment finishes, initialize your production database with seed data:
   - On your local machine, run:
     ```bash
     # Set the production DATABASE_URL from Vercel in your terminal
     $env:DATABASE_URL="postgres://..."
     
     # Push the schema tables to PostgreSQL
     npx prisma db push
     
     # Seed the initial admin, teacher, student, and parent accounts
     node prisma/seed.js
     ```

Your website is now **100% LIVE** on Vercel with automatic continuous deployment on every Git push!
