# EdTech CRM & Inquiry System

A full-stack CRM where anyone can submit a public inquiry and an admin can log in to view, filter, search and manage inquiries.

**Live demo:** https://edtech-crm-amber.vercel.app
**API health check:** https://edtech-crm-mxp9.onrender.com/api/health
**Demo admin:** `admin@example.com` / `Admin@12345`

> The backend runs on Render's free tier and sleeps when idle. The first request may take up to ~50 seconds.

## Tech Stack
- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** Supabase PostgreSQL via `pg` (standard connection string)
- **Auth:** Custom JWT (bcrypt + jsonwebtoken). Supabase Auth is not used.

## Features
- Public inquiry form (User Type, Category, Name, Email, Phone, Message) saved to Supabase
- Admin login with JWT, protected API routes and protected dashboard route
- Dashboard table: Name, Phone, Email, User Type, Category, Date, Status
- Filters by Category and User Type, plus search by Name or Phone
- Inline status update (New / In Progress / Resolved)

## Project Structure
```
edtech-crm/
├── backend/    # Express API
├── frontend/   # React app
├── schema.sql
└── README.md
```

## Prerequisites
- Node.js 20+
- A Supabase project

## Local Setup

### 1. Database
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste the contents of `schema.sql`, and run it.
3. Click **Connect**, open the **Direct** tab, and copy the **Session pooler** connection string.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # then fill in the values
npm run seed             # creates the admin user (once)
npm run dev              # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `DATABASE_URL` | Supabase Postgres connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `8h` |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed` |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000/api` |

## How to Test the Custom JWT Auth

1. **Login (get a token)**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"Admin@12345"}'
   ```
   Returns `{ "token": "...", "admin": {...} }`.
2. **Protected route without a token returns 401**
   ```bash
   curl -i http://localhost:5000/api/inquiries
   ```
3. **Protected route with a token returns 200**
   ```bash
   curl http://localhost:5000/api/inquiries -H "Authorization: Bearer <TOKEN>"
   ```
4. **Wrong password returns 401**, and an invalid or expired token returns 401.
5. **UI check:** open `/admin` while logged out and you are redirected to `/admin/login`. After login, `/admin` shows the dashboard.

## API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Admin login, returns JWT |
| GET | `/api/auth/me` | Yes | Current admin |
| POST | `/api/inquiries` | No | Submit an inquiry |
| GET | `/api/inquiries?category=&user_type=&search=` | Yes | List with filters and search |
| PATCH | `/api/inquiries/:id/status` | Yes | Update status |

## Security Notes
- Passwords hashed with bcrypt (10 rounds)
- Parameterized SQL queries (no SQL injection)
- Input validation on the public form endpoint
- Secrets are kept in environment variables, and `.env` is git-ignored

## Deployment
- **Backend:** Render (root dir `backend`, build `npm install`, start `npm start`)
- **Frontend:** Vercel (root dir `frontend`, env `VITE_API_URL`)
