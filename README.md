# ResumeAI

Production-ready SaaS for AI-powered resume analysis and improvement.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| AI | Google Gemini API |

## Features

- User registration & JWT authentication
- PDF resume upload & text extraction
- ATS score analysis with detailed feedback
- AI-powered resume rewriting
- Credit-based freemium model (5 free credits)
- Rate limiting & security middleware

## Project Structure

```
resume-ai/
├── client/     # React SPA (port 5173)
└── server/     # Express API (port 5000)
```

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

## Local Setup

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resume-ai
JWT_SECRET=your_random_secret_at_least_32_characters_long
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run development servers

**Terminal 1 — API:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/v1
- Health: http://localhost:5000/health

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Current user |
| POST | `/api/v1/resumes/upload` | Upload PDF |
| GET | `/api/v1/resumes` | List resumes |
| GET | `/api/v1/resumes/:id` | Get resume |
| DELETE | `/api/v1/resumes/:id` | Delete resume |
| POST | `/api/v1/resumes/:id/analyze` | ATS analysis (1 credit) |
| POST | `/api/v1/resumes/:id/improve` | AI rewrite (1 credit) |

## Deploy to Production

### Frontend — Vercel

1. Push repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api/v1`
5. Deploy

### Backend — Render

1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repo, set root directory to `server`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add environment variables from `server/.env.example`
6. Set `CLIENT_URL` to your Vercel URL

### Database — MongoDB Atlas

1. Create free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create database user and get connection string
3. Network Access: allow `0.0.0.0/0` (or Render IPs)
4. Set `MONGO_URI` in Render environment

### Post-deploy checklist

- [ ] Update `CLIENT_URL` on server to match Vercel URL
- [ ] Update `VITE_API_URL` on Vercel to match Render URL
- [ ] Generate strong `JWT_SECRET` (32+ chars)
- [ ] Add `GEMINI_API_KEY`
- [ ] Test register → upload → analyze flow

## Scripts

### Client
- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run preview` — Preview build

### Server
- `npm run dev` — Dev with hot reload
- `npm run build` — Compile TypeScript
- `npm start` — Run production server

## License

ISC
