<div align="center">

# ⚡ ArenaVerse

**The ultimate competitive esports tournament platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://prisma.io)

*Register · Compete · Win*

</div>

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Getting Started (Local Dev)](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Scripts Reference](#scripts-reference)
8. [Deployment](#deployment)
   - [Frontend → Vercel](#frontend--vercel)
   - [Backend → Railway](#backend--railway)
9. [Git & GitHub](#git--github)
10. [API Documentation](#api-documentation)
11. [Testing](#testing)
12. [Security](#security)
13. [Contributing](#contributing)
14. [License](#license)

---

## Overview

**ArenaVerse** is a full-stack production-ready esports tournament platform that enables players to:

- 🏆 Create, discover, and register for tournaments
- 👥 Form teams and manage rosters
- 💰 Fund wallets via Razorpay and pay tournament entry fees
- 🤖 Use AI-powered assistant tools (team analysis, strategy generator, code/game analysis)
- 📊 Track real-time leaderboards and match brackets
- 💬 Chat with teammates via real-time Socket.IO messaging

Admin users can manage users, teams, tournaments, and view financial reports via a full-featured admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, TanStack Query |
| **Backend** | Node.js 20, Express 5, TypeScript |
| **Database** | PostgreSQL 15 (via Prisma ORM) |
| **Cache / Rate Limit** | Redis 7 |
| **Real-time** | Socket.IO |
| **Auth** | JWT (access + refresh), Google OAuth 2.0, Discord OAuth |
| **Payments** | Razorpay |
| **Email** | SendGrid |
| **Storage** | Cloudinary |
| **AI** | OpenAI GPT (latest) |
| **Containerization** | Docker + Docker Compose |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Railway (Docker) |
| **CI/CD** | GitHub Actions + Vercel GitHub integration |

---

## Features

### 🎮 Core Platform
- **Authentication** — Email/password, Google OAuth, Discord OAuth; JWT access tokens (15 min) + refresh tokens (7 days) in httpOnly cookies
- **Role-Based Access Control** — Roles: Guest, Player, Team Captain, Organizer, Moderator, Admin
- **User Profiles** — Editable profile with Cloudinary avatar upload
- **Teams** — Create, edit, invite members, manage rosters, role promotion
- **Tournaments** — Single-elimination brackets, custom rules, entry fee validation
- **Wallet** — Real-time balance, Razorpay deposit, entry fee deduction (atomic Prisma transactions)
- **Admin Dashboard** — User/team/tournament management, financial reports, platform configuration

### 🤖 AI Tools
- Team Composition Analyzer
- Strategy Generator  
- Code/Game Script Analyzer
- Natural language assistant with OpenAI GPT

### ⚡ Real-time
- Socket.IO for live notifications, chat, bracket updates, leaderboard changes

### 🔒 Security
- Helmet.js security headers
- CSP (Content Security Policy)
- Distributed Redis rate limiting (Auth: 10/min, Public: 100/min, Payments: 20/min, Admin: 200/min)
- OWASP-compliant input validation (Zod)
- Comprehensive audit logs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARENAVERSE                              │
│                                                                 │
│  ┌──────────────┐  HTTPS  ┌──────────────────────────────────┐ │
│  │   Vercel CDN │◄───────►│      React 19 SPA (Frontend)     │ │
│  │  (Frontend)  │         │  Vite · Tailwind · Framer Motion │ │
│  └──────────────┘         └────────────────┬─────────────────┘ │
│                                            │ REST / Socket.IO   │
│  ┌─────────────────────────────────────────▼─────────────────┐  │
│  │              Railway (Docker Container)                    │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         Express API (Backend)                        │ │  │
│  │  │  Auth · Users · Teams · Tournaments · Wallet · Admin │ │  │
│  │  │  AI Routes · Real-time Socket.IO                     │ │  │
│  │  └───────────────────┬──────────────────────────────────┘ │  │
│  │                      │                                    │  │
│  │  ┌───────────────────▼──────────────────┐                │  │
│  │  │        PostgreSQL (Prisma ORM)        │                │  │
│  │  └───────────────────┬──────────────────┘                │  │
│  │  ┌───────────────────▼──────────────────┐                │  │
│  │  │              Redis                    │                │  │
│  │  │  Rate Limiting · Session Cache        │                │  │
│  │  └──────────────────────────────────────┘                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  External: Razorpay · Cloudinary · SendGrid · OpenAI            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Docker Desktop (for PostgreSQL & Redis)
- npm ≥ 10

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ArenaVerse.git
cd ArenaVerse
```

### 2. Set up environment variables

```bash
# Copy example env files
cp backend/.env.example backend/.env
```

Fill in all values in `backend/.env` (see [Environment Variables](#environment-variables)).

### 3. Start services (Docker)

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.

### 4. Install dependencies & run migrations

```bash
# Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed

# Frontend
cd ../frontend
npm install
```

### 5. Start development servers

```bash
# Terminal 1 – Backend (port 4000)
cd backend && npm run dev

# Terminal 2 – Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

---

## Environment Variables

### `backend/.env.example`

```env
# ── App ───────────────────────────────────────────────────────────
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173

# ── Database ──────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/arenaverse

# ── Redis ─────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── JWT ───────────────────────────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ── Google OAuth ──────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback

# ── Discord OAuth ─────────────────────────────────────────────────
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=http://localhost:4000/api/auth/discord/callback

# ── Cloudinary ────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ── SendGrid ──────────────────────────────────────────────────────
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=no-reply@arenaverse.gg

# ── Razorpay ──────────────────────────────────────────────────────
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# ── OpenAI ────────────────────────────────────────────────────────
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=arenaverse_unsigned
```

> ⚠️ **Never commit `.env` files with real secrets.** Only `.env.example` files are committed.

---

## Scripts Reference

### Root

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in dev mode |
| `npm run build` | Build both for production |
| `npm run test` | Run all tests (backend + frontend) |
| `npm run lint` | Lint entire codebase |

### Backend (`/backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express with ts-node-dev hot reload |
| `npm run build` | Compile TypeScript to `/dist` |
| `npm start` | Run compiled production server |
| `npm test` | Jest + Supertest tests |
| `npm run test:coverage` | Jest with coverage report |
| `npm run lint` | ESLint |
| `npx prisma migrate dev` | Run DB migrations (dev) |
| `npx prisma migrate deploy` | Run DB migrations (production) |
| `npx prisma db seed` | Seed the database |
| `npx prisma studio` | Open Prisma Studio GUI |

### Frontend (`/frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build |
| `npm test` | Jest + React Testing Library |
| `npm run lint` | ESLint |
| `npm run cypress:open` | Open Cypress GUI |
| `npm run cypress:run` | Run Cypress headless |

---

## Deployment

### Frontend → Vercel

1. **Push to GitHub** (see [Git & GitHub](#git--github))

2. **Import project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Git Repository"** → select `ArenaVerse`
   - Set **Root Directory** to `frontend`
   - Framework: **Vite** (auto-detected)

3. **Configure Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL          = https://your-backend.railway.app
   VITE_SOCKET_URL       = https://your-backend.railway.app
   VITE_RAZORPAY_KEY_ID  = rzp_live_xxxxx
   VITE_CLOUDINARY_CLOUD_NAME = your-cloud
   VITE_CLOUDINARY_UPLOAD_PRESET = arenaverse_unsigned
   ```

4. **Deploy** — Vercel automatically deploys on every push to `main`.

5. **Custom Domain** (optional):
   - Go to **Settings → Domains** in your Vercel project
   - Add your custom domain (e.g., `arenaverse.gg`)
   - Update DNS records at your registrar:
     ```
     Type: CNAME   Name: @   Value: cname.vercel-dns.com
     Type: CNAME   Name: www Value: cname.vercel-dns.com
     ```
   - Vercel provisions SSL automatically via Let's Encrypt

### Backend → Railway

1. **Create a Railway project**
   - Go to [railway.app](https://railway.app) → New Project
   - Select **"Deploy from GitHub repo"** → select `ArenaVerse`
   - Set **Root Directory** to `backend`

2. **Add services**:
   - Click **"+ New"** → **Database** → **PostgreSQL** (Railway provisions it)
   - Click **"+ New"** → **Database** → **Redis**

3. **Set Environment Variables** in Railway service settings:
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=${{Postgres.DATABASE_URL}}    ← Railway injects this
   REDIS_URL=${{Redis.REDIS_URL}}             ← Railway injects this
   JWT_SECRET=<generate-32-char-random>
   JWT_REFRESH_SECRET=<generate-32-char-random>
   FRONTEND_URL=https://arenaverse.vercel.app
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   DISCORD_CLIENT_ID=...
   DISCORD_CLIENT_SECRET=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   SENDGRID_API_KEY=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   OPENAI_API_KEY=...
   OPENAI_MODEL=gpt-4o
   ```

4. **Run DB migrations on deploy**:
   In Railway service settings → **Start Command**:
   ```bash
   npx prisma migrate deploy && node dist/index.js
   ```

5. **Custom Domain** (optional):
   - In Railway service → **Settings → Networking → Custom Domain**
   - Add `api.arenaverse.gg`
   - Railway provides TLS automatically

---

## Git & GitHub

### Initialize and push to GitHub

```bash
# 1. Initialize git repo (in project root)
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ArenaVerse
git init

# 2. Stage all files
git add .

# 3. Initial commit
git commit -m "feat: initial ArenaVerse platform — Phase 1, 2 & 3 complete"

# 4. Create a new repo on GitHub
# Go to https://github.com/new
# Repo name: ArenaVerse  |  Visibility: Public or Private  |  Do NOT add README/gitignore (we have them)

# 5. Connect remote
git remote add origin https://github.com/<your-username>/ArenaVerse.git
git branch -M main

# 6. Push
git push -u origin main
```

### Recommended branch strategy

```
main        ← production (auto-deploys to Vercel + Railway)
develop     ← integration branch
feat/*      ← feature branches
fix/*       ← bug fix branches
```

```bash
# Create develop branch
git checkout -b develop
git push -u origin develop
```

### Protect the main branch

1. GitHub → Settings → Branches → Add branch rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (add CI checks)
   - ✅ Require linear history

---

## API Documentation

Swagger UI is available at:
- **Local**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Production**: `https://your-backend.railway.app/api/docs`

### Core Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| GET | `/api/auth/google` | — | Google OAuth |
| GET | `/api/auth/discord` | — | Discord OAuth |
| GET | `/api/users/me` | JWT | Get own profile |
| PUT | `/api/users/me` | JWT | Update profile |
| POST | `/api/teams` | JWT | Create team |
| GET | `/api/teams/:id` | JWT | Get team details |
| POST | `/api/tournaments` | Organizer | Create tournament |
| GET | `/api/tournaments` | — | List tournaments |
| POST | `/api/tournaments/:id/register` | JWT | Register team |
| GET | `/api/wallet` | JWT | Get wallet balance |
| POST | `/api/payments/create-order` | JWT | Create Razorpay order |
| POST | `/api/payments/webhook` | Razorpay Sig | Payment webhook |
| GET | `/api/admin/users` | Admin | List all users |
| POST | `/api/ai/chat` | JWT | AI assistant |

---

## Testing

```bash
# Backend tests with coverage
cd backend && npm run test:coverage

# Frontend component tests
cd frontend && npm test

# E2E tests (requires running backend + frontend)
cd frontend && npm run cypress:run

# Load testing with k6
k6 run backend/tests/load/k6-load-test.js
```

**Coverage targets**: Backend ≥ 80% | Frontend ≥ 70%

---

## Security

- 🔐 **JWT** — short-lived access tokens (15 min) + httpOnly refresh cookies
- 🛡️ **Helmet.js** — security headers (HSTS, X-Frame-Options, XSS Protection)
- 🚦 **Rate Limiting** — Redis-backed per-IP limits on all route groups
- ✅ **Input Validation** — Zod schemas on all API inputs
- 🔒 **CSP** — strict Content Security Policy via `vercel.json` headers
- 🔑 **RBAC** — role-based middleware on every protected route
- 📋 **Audit Logs** — all sensitive actions logged to DB with timestamps

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
4. Push and open a pull request to `develop`

---

## License

MIT © ArenaVerse Contributors
