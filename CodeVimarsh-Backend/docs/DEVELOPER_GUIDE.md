# Code Vimarsh Backend — Developer Guide

> A complete walkthrough for developers new to web development who want to understand, set up, and contribute to this backend project.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Prerequisites](#2-prerequisites)
3. [Cloning the Repository](#3-cloning-the-repository)
4. [Project Structure Explained](#4-project-structure-explained)
5. [Installing Dependencies](#5-installing-dependencies)
6. [Environment Variables Setup](#6-environment-variables-setup)
7. [Prisma & Database Setup](#7-prisma--database-setup)
8. [Running the Server](#8-running-the-server)
9. [Available Scripts (package.json)](#9-available-scripts-packagejson)
10. [Understanding the JWT Auth Workflow](#10-understanding-the-jwt-auth-workflow)
11. [Role System](#11-role-system)
12. [Navigating Swagger Docs](#12-navigating-swagger-docs)
13. [Using Postman](#13-using-postman)
14. [Email Verification Flow (Dev Tips)](#14-email-verification-flow-dev-tips)
15. [Common Errors & Fixes](#15-common-errors--fixes)

---

## 1. What Is This Project?

This is the **REST API backend** for Code Vimarsh — the MSUB Coding Club platform. It is built with:

- **Node.js + Express** — the web server framework
- **Prisma** — a type-safe database toolkit (ORM) that talks to the database
- **PostgreSQL on Supabase** — the cloud-hosted database
- **JWT (JSON Web Tokens)** — for user authentication
- **Zod** — for validating incoming request data
- **Nodemailer** — for sending emails (verification, password reset)
- **Swagger** — interactive API documentation in the browser
- **Morgan** — HTTP request logger

The backend exposes a set of API endpoints that the frontend (or Postman) calls to register users, log in, manage events, projects, and so on.

---

## 2. Prerequisites

Before you begin, make sure the following are installed on your machine:

| Tool | Why You Need It | Download |
|------|----------------|----------|
| **Node.js** (v18+) | Runs the JavaScript backend | https://nodejs.org |
| **npm** | Installs packages (comes with Node.js) | Included with Node.js |
| **Git** | Clones the repository | https://git-scm.com |
| **Postman** | Tests API endpoints visually | https://postman.com |
| **VS Code** (recommended) | Code editor | https://code.visualstudio.com |

To verify your installations, open a terminal and run:

```bash
node --version     # Should print v18.x.x or higher
npm --version      # Should print 9.x.x or higher
git --version      # Should print git version 2.x.x
```

---

## 3. Cloning the Repository

Open a terminal, navigate to the folder where you want the project, and run:

```bash
git clone https://github.com/Bhavika-Giyanani/CodeVimarsh-Backend.git
```

---

## 4. Project Structure Explained

Here is every file and folder explained so you know exactly what touches what:

```
backend/
├── docs/                          # Auto-generated or static documentation assets
│
├── prisma/                        # Everything related to the database schema
│   ├── migrations/                # SQL history of every schema change ever made
│   │   ├── 20260312011849_init/   # First migration — creates all tables from scratch
│   │   │   └── migration.sql      # The actual SQL that was run on the database
│   │   └── migration_lock.toml    # Locks the DB provider (postgresql) — don't edit this
│   ├── schema.prisma              # ⭐ THE source of truth for your database structure
│   │                              #    Edit this to add/change/remove tables and columns
│   └── seed.ts                    # Script to pre-fill the DB with test users (SUPER_ADMIN etc.)
│
├── src/                           # All application source code lives here
│   │
│   ├── config/                    # Configuration files (set up once, used everywhere)
│   │   ├── prisma.js              # Creates and exports the Prisma client instance
│   │   │                          # Import this wherever you need DB access
│   │   └── swagger.js             # Sets up Swagger UI — the interactive API docs page
│   │
│   ├── middleware/                # Functions that run BETWEEN receiving a request and handling it
│   │   ├── auth.middleware.js     # Verifies the JWT token on protected routes
│   │   │                          # Attaches req.user = { id, role } if token is valid
│   │   ├── error.middleware.js    # Global error handler — catches all thrown errors
│   │   │                          # Returns a consistent { success: false, message } response
│   │   ├── rateLimit.middleware.js# Prevents abuse — limits how many requests an IP can make
│   │   ├── role.middleware.js     # Guards routes by role (USER / CONTENT_ADMIN / SUPER_ADMIN)
│   │   │                          # requireSuperAdmin, requireContentAdmin exported from here
│   │   └── validate.middleware.js # Runs Zod schema validation on req.body
│   │                              # Returns 400 with field errors if validation fails
│   │
│   ├── modules/                   # Feature-based folders — each module = one domain
│   │   │
│   │   ├── admin/                 # Admin-only user management features
│   │   │   ├── admin.controller.js# Receives HTTP request → calls service → sends response
│   │   │   ├── admin.routes.js    # Defines admin API routes and which middleware to apply
│   │   │   └── admin.service.js   # Business logic: list users, change roles, manage admins
│   │   │
│   │   ├── auth/                  # Registration, login, email verify, password reset
│   │   │   ├── auth.controller.js # HTTP layer for auth endpoints
│   │   │   ├── auth.routes.js     # Routes: /register, /login, /verify-email, etc.
│   │   │   ├── auth.schema.js     # Zod validation rules for auth request bodies
│   │   │   └── auth.service.js    # Core logic: hash passwords, create tokens, send emails
│   │   │
│   │   └── users/                 # Public user profiles and leaderboard
│   │       ├── user.controller.js # HTTP layer for user endpoints
│   │       ├── user.routes.js     # Routes: GET /users/:id, PUT /users/:id, GET /leaderboard
│   │       ├── user.schema.js     # Zod schemas for profile update validation
│   │       └── user.service.js    # Logic: fetch profile, update profile, leaderboard query
│   │
│   ├── services/                  # Shared services used across multiple modules
│   │   └── mail.service.js        # Sends emails via SMTP (verification links, reset links)
│   │                              # Called by auth.service.js whenever an email is needed
│   │
│   ├── utils/                     # Small reusable helper functions
│   │   ├── generateToken.js       # Creates a signed JWT token for a user
│   │   └── xpCalculator.js        # Logic for calculating XP and level from activity
│   │
│   ├── app.js                     # ⭐ Express app setup
│   │                              # Registers all middleware and mounts all route modules
│   │                              # Think of this as the "wiring" of the application
│   └── server.js                  # Entry point — starts the HTTP server on the port
│                                  # Run this file to start the backend
│
├── .gitignore                     # Files Git should NOT commit (node_modules, .env, etc.)
├── package.json                   # Project metadata + npm scripts + dependency list
├── package-lock.json              # Exact locked versions of every installed package
└── prisma.config.ts               # Prisma 7 config — sets DB connection URL and seed command
```

### How a Request Flows Through the Code

Understanding this flow will help you debug anything:

```
HTTP Request
    ↓
server.js          (starts the server, listens on port)
    ↓
app.js             (Morgan logs it, JSON parser reads body)
    ↓
*.routes.js        (matches the URL path and HTTP method)
    ↓
middleware         (authenticate → validate → requireRole)
    ↓
*.controller.js    (extracts params/body, calls service)
    ↓
*.service.js       (business logic, queries the DB via Prisma)
    ↓
prisma.js          (Prisma sends SQL to Supabase PostgreSQL)
    ↓
Response sent back to client
```

---

## 5. Installing Dependencies

From inside the `backend/` folder, run:

```bash
npm install
```

This reads `package.json` and downloads all listed packages into the `node_modules/` folder. This can take 1–2 minutes the first time.

> **Never commit `node_modules/`** — it is listed in `.gitignore` for this reason. Anyone cloning the repo just runs `npm install` themselves.

---

## 6. Environment Variables Setup

The project needs secret configuration values (database URL, JWT secret, email credentials) that must **never** be committed to Git. These are stored in a `.env` file at the root of the `backend/` folder.

**Step 1:** Create the file:

```bash
# On Mac/Linux
touch .env

# On Windows (Command Prompt)
type nul > .env
```

**Step 2:** Add the following variables (get actual values from your team lead or Supabase dashboard):

```env
# ── Database ──────────────────────────────────────────────
# From Supabase: Project Settings → Database → Connection String
# Use the "Direct connection" URI (port 5432), NOT the pooler (port 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ── JWT ───────────────────────────────────────────────────
# Any long random string — used to sign and verify tokens
# Generate one: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your_super_secret_key_here"
JWT_EXPIRES_IN="7d"

# ── Server ────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Email (SMTP) ──────────────────────────────────────────
# For Gmail: enable "App Passwords" in your Google account settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_gmail_app_password"
SMTP_FROM="Code Vimarsh <your_email@gmail.com>"

# ── App ───────────────────────────────────────────────────
FRONTEND_URL="http://localhost:3000"
```

> **How to get your Supabase connection string:**
> 1. Go to [supabase.com](https://supabase.com) → your project
> 2. Click **Settings** (gear icon) → **Database**
> 3. Scroll to **Connection String** → select **URI** tab
> 4. Copy the string starting with `postgresql://`
> 5. Replace `[YOUR-PASSWORD]` with your actual database password

---

## 7. Prisma & Database Setup

Prisma is the tool that manages your database structure and lets you query it from JavaScript without writing raw SQL.

### Key Concepts

- **`schema.prisma`** — describes your tables (called "models") and their columns
- **Migrations** — SQL files generated by Prisma when you change the schema
- **Prisma Client** — auto-generated JavaScript code that lets you do `prisma.user.findMany()` etc.

### First-Time Setup

Run these commands in order:

```bash
# Step 1: Apply all migrations to your database (creates all tables)
npx prisma migrate deploy

# Step 2: Generate the Prisma Client (creates the JS query helpers)
npx prisma generate

# Step 3: Seed the database with test users
npx prisma db seed
```

After seeding, you will have these test accounts (password: `DevPass@123`):

| PRN | Name | Role |
|-----|------|------|
| 8022003911 | Humpy Koneru | SUPER_ADMIN |
| 8022003912 | Divya Deshmukh | CONTENT_ADMIN |

### When You Change the Schema

Whenever you edit `prisma/schema.prisma` (add a table, add a column, etc.), run:

```bash
# Creates a new migration file and applies it to the DB
npx prisma migrate dev --name describe_your_change

# Then regenerate the client
npx prisma generate
```

### Useful Prisma Commands

```bash
# Open a visual browser to view/edit your database data
npx prisma studio

# Reset everything (drops DB, re-runs all migrations, re-seeds)
# ⚠️ This deletes ALL data — only use in development
npx prisma migrate reset

# View the current state of your DB vs schema
npx prisma migrate status
```

### Prisma Studio

Running `npx prisma studio` opens a browser at `http://localhost:5555` where you can visually browse all your tables, add rows, and edit data — very useful during development without needing to write SQL.

---

## 8. Running the Server

```bash
# Development mode (auto-restarts when you save a file)
npm run dev

# Production mode
npm start
```

When the server starts successfully, you will see output like:

```
GET /api/v1/health 200 2.341 ms - 33
🚀 Server running on port 5000
📚 Swagger docs at http://localhost:5000/api-docs
```

The server is now live at `http://localhost:5000`.

---

## 9. Available Scripts (package.json)

Open `package.json` and look at the `"scripts"` section. These are the commands you run via `npm run <name>`:

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Starts the server with `nodemon` — auto-restarts on file save |
| `npm start` | Starts the server normally (for production) |
| `npm run seed` | Runs the Prisma seed file to insert test data |
| `npm run studio` | Opens Prisma Studio in the browser |

> **What is nodemon?** It watches your files and automatically restarts the server whenever you save a `.js` file. Without it, you would have to stop and restart the server manually after every change.

---

## 10. Understanding the JWT Auth Workflow

JWT (JSON Web Token) is how this API knows who you are on every request after you log in.

### The Flow

```
1. User registers  →  account created, verification email sent
2. User verifies email  →  account activated
3. User logs in  →  server creates a JWT token and returns it
4. User stores token  →  saved in Postman env / browser localStorage
5. User makes requests  →  sends token in every request header
6. Server verifies token  →  reads user ID and role from it
7. Token expires (7 days)  →  user must log in again
```

### What Is Inside a JWT Token?

A JWT looks like this: `eyJhbGci...` — three base64-encoded parts separated by dots.

The **middle part** (payload) contains:

```json
{
  "userId": "cmmms7tk50002hcw1pjcd02cl",
  "role": "SUPER_ADMIN",
  "iat": 1773278804,
  "exp": 1773883604
}
```

You can decode any token at [jwt.io](https://jwt.io) to see its contents (paste the token in the left box).

> **Important:** Never put sensitive data (passwords, etc.) inside a JWT — the payload is base64 encoded, not encrypted. Anyone can decode it.

### How to Send the Token in Requests

Every protected API endpoint requires this HTTP header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

In Postman, this is handled automatically once you set the `token` environment variable (explained in the Postman section below).

### Token Expiry

Tokens expire after `7d` (set in `.env` as `JWT_EXPIRES_IN`). If you get a `401 – Token expired` error, just log in again to get a fresh token.

---

## 11. Role System

There are three roles in the system, each with more privileges than the last:

```
USER  <  CONTENT_ADMIN  <  SUPER_ADMIN
```

| Role | What They Can Do |
|------|-----------------|
| `USER` | Register, login, view public content, update own profile |
| `CONTENT_ADMIN` | Everything a USER can do + manage events, projects, blogs, resources |
| `SUPER_ADMIN` | Everything + manage users, change roles, full admin access |

### How to Promote a User (Dev Workflow)

You cannot promote yourself through the API (by design). To create your first SUPER_ADMIN during development:

**Option A — Using Prisma Studio:**
1. Run `npx prisma studio`
2. Open the `users` table
3. Find your user and change the `role` field to `SUPER_ADMIN`
4. Save

**Option B — Using Supabase SQL Editor:**
```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE prn = '22CS001';
```

After promoting, log in again to get a fresh JWT token that carries the new role.

---

## 12. Navigating Swagger Docs

Swagger is a built-in interactive API documentation page where you can read about every endpoint and test it directly in the browser — no Postman needed.

### Opening Swagger

With the server running, go to:

```
http://localhost:5000/api-docs
```

You will see a list of all API endpoints grouped by tag (Auth, Users, Admin, etc.).

### Authorizing in Swagger (Setting Your Token)

Most endpoints require authentication. Here is how to authorize:

1. First, **register and log in** using the `/auth/register` and `/auth/login` endpoints in Swagger (see steps below)
2. Copy the `token` value from the login response
3. Click the green **Authorize 🔒** button at the top right of the Swagger page
4. In the popup, type: `Bearer ` followed by your token (with a space after Bearer):
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Click **Authorize** then **Close**

All subsequent requests in Swagger will now include your token automatically.

### Full Workflow: Register → Verify → Login

Follow these steps in Swagger to get started:

**Step 1 — Register a new user**
1. Click on `POST /auth/register` to expand it
2. Click **Try it out**
3. Fill in the request body:
   ```json
   {
     "prn": "22CS001",
     "name": "Your Name",
     "email": "youremail@university.edu",
     "password": "SecurePass@123"
   }
   ```
4. Click **Execute**
5. You should get a `201` response — a verification email has been sent

**Step 2 — Get the verification token**

During development, instead of waiting for the email, grab the token directly from Supabase:
1. Go to your Supabase project → **SQL Editor**
2. Run:
   ```sql
   SELECT token FROM email_verification_tokens ORDER BY created_at DESC LIMIT 1;
   ```
3. Copy the token value

**Step 3 — Verify your email**
1. Click on `GET /auth/verify-email` in Swagger
2. Click **Try it out**
3. Paste the token in the `token` query parameter field
4. Click **Execute** — you should get a `200` success response

**Step 4 — Log in**
1. Click on `POST /auth/login`
2. Click **Try it out**
3. Enter your PRN and password
4. Click **Execute**
5. In the response, find the `"token"` field and **copy its value**

**Step 5 — Authorize**
1. Click the **Authorize 🔒** button at the top
2. Paste: `Bearer <your-copied-token>`
3. Click **Authorize**

You are now authenticated! Try calling `GET /auth/me` — it should return your user profile.

---

## 13. Using Postman

Postman is a desktop app for testing APIs. The project includes ready-made collection and environment files so you don't have to manually create every request.

### Importing the Files

**Step 1 — Import the Collection**
1. Open Postman
2. Click **Import** (top left, next to "New")
3. Click **Upload Files**
4. Select `CodeVimarsh_postman_collection.json`
5. Click **Import**

You will now see a collection called **"Code Vimarsh – Backend API"** in your left sidebar.

**Step 2 — Import the Environment**
1. Click **Import** again
2. Upload `CodeVimarsh_postman_environment.json`
3. Click **Import**

**Step 3 — Activate the Environment**
1. Look at the top-right corner of Postman — there is an environment dropdown (it may say "No Environment")
2. Click it and select **"Code Vimarsh – Local"**

> This is critical. Without selecting the environment, variables like `{{baseUrl}}` and `{{token}}` will not resolve and all requests will fail.

### Understanding Environment Variables

The environment file stores values that are reused across requests:

| Variable | What It Holds | How It Gets Set |
|----------|--------------|-----------------|
| `baseUrl` | `http://localhost:5000/api/v1` | Pre-set — don't change |
| `rawBaseUrl` | `http://localhost:5000` | Pre-set — used for health check |
| `token` | Your JWT after login | **Auto-set** by the Login request's test script |
| `userId` | Your user ID | **Auto-set** by Register and Login scripts |
| `superAdminToken` | SUPER_ADMIN's JWT | Manually set after logging in as SUPER_ADMIN |
| `verificationToken` | Email verification token | Manually set from DB/email |
| `resetToken` | Password reset token | Manually set from DB/email |

### Running Your First Request Sequence

Follow this order in Postman:

**1. Register**
- Open `🔐 Auth` → `Register User`
- Click **Send**
- On success (201), `userId` and `userPRN` are auto-saved to your environment

**2. Get the verification token**
- Go to Supabase SQL Editor and run:
  ```sql
  SELECT token FROM email_verification_tokens ORDER BY created_at DESC LIMIT 1;
  ```
- Copy the token
- In Postman, click the **eye icon** (top right) next to the environment name → click **Edit**
- Paste the token into the `verificationToken` variable's **Current Value** field → Save

**3. Verify Email**
- Open `🔐 Auth` → `Verify Email`
- Click **Send** — should return 200

**4. Login**
- Open `🔐 Auth` → `Login`
- Click **Send**
- The test script automatically saves the `token` and `userId` to your environment

**5. Test a protected route**
- Open `👤 Users` → `Get User By ID`
- Click **Send** — should return your profile using the saved `userId`

**6. Test admin routes (as SUPER_ADMIN)**
- Log in using the seeded SUPER_ADMIN credentials (PRN: `8022003911`, password: `DevPass@123`)
- After login, copy the token from the response
- Click the eye icon → Edit environment → Paste into `superAdminToken` Current Value → Save
- Now open `🛡️ Admin` → `List All Users` — it will use `superAdminToken` automatically

### Viewing and Editing Environment Variables

1. Click the **eye icon 👁** (top right corner next to environment dropdown)
2. You can see all current values
3. Click **Edit** (pencil icon) to modify values
4. Always edit the **Current Value** column, not the Initial Value column

---

## 14. Email Verification Flow (Dev Tips)

Sending real emails during development can be slow or unreliable. Here are the two fastest ways to handle email tokens during development:

### Option A — Query Supabase Directly (Fastest)

For **email verification tokens:**
```sql
SELECT token FROM email_verification_tokens ORDER BY created_at DESC LIMIT 1;
```

For **password reset tokens:**
```sql
SELECT token FROM password_reset_tokens ORDER BY created_at DESC LIMIT 1;
```

Run these in the Supabase **SQL Editor** tab.

### Option B — Use a Test Email Inbox

Use [Mailtrap](https://mailtrap.io) — a free fake SMTP inbox for development. Emails sent by the app appear in your Mailtrap inbox so you can click verification links normally.

1. Sign up at mailtrap.io
2. Go to **Email Testing** → **Inboxes** → your inbox → **SMTP Settings**
3. Copy the SMTP credentials into your `.env`:
   ```env
   SMTP_HOST="sandbox.smtp.mailtrap.io"
   SMTP_PORT=587
   SMTP_USER="your_mailtrap_user"
   SMTP_PASS="your_mailtrap_pass"
   ```

---

## 15. Common Errors & Fixes

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Cannot find module '...'` | `node_modules` not installed | Run `npm install` |
| `prisma: error – column does not exist` | Prisma client is out of sync | Run `npx prisma generate` |
| `P2021: Table does not exist` | Migrations not applied | Run `npx prisma migrate deploy` |
| `401 – Access token missing` | No token in Authorization header | Log in and set the token |
| `401 – Token expired` | JWT has expired (after 7 days) | Log in again to get a fresh token |
| `403 – Access denied` | Your role is too low for this route | Use a higher-role account |
| `400 – Unrecognized key(s)` | Sending a field not allowed by the schema | Remove the extra field from request body |
| `409 – PRN already registered` | Trying to register with an existing PRN | Use a different PRN |
| `connect ECONNREFUSED` | Server is not running | Run `npm run dev` |
| `Invalid DATABASE_URL` | `.env` file missing or wrong DB URL | Check your `.env` file |
| Extra tables reappearing after reset | Old migration files being replayed | Delete `prisma/migrations/`, run `npx prisma migrate dev --name init` |

---

## Quick Reference Card

```bash
# ── Setup (run once) ──────────────────────────────────────
npm install                              # Install all packages
npx prisma migrate deploy                # Apply DB schema
npx prisma generate                      # Generate Prisma client
npx prisma db seed                       # Add test users

# ── Daily development ─────────────────────────────────────
npm run dev                              # Start server (auto-restart)
npx prisma studio                        # Visual DB browser

# ── After changing schema.prisma ──────────────────────────
npx prisma migrate dev --name my_change  # Create & apply migration
npx prisma generate                      # Regenerate client

# ── Debugging ─────────────────────────────────────────────
npx prisma migrate status                # Check migration state
npx prisma migrate reset                 # ⚠️ Wipe & rebuild DB

# ── Useful URLs (server must be running) ──────────────────
# API:     http://localhost:5000/api/v1
# Swagger: http://localhost:5000/api-docs
# Health:  http://localhost:5000/health
# Studio:  http://localhost:5555  (when prisma studio is running)
```

---

*Last updated: March 2026. For questions, reach out to the backend team lead.*
