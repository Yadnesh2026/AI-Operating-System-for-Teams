<<<<<<< HEAD
RedSun --- AI Operating System for Teams
<p align="center">
<strong>{=html}Bring your teams, projects, and work together in one
workspace.`</strong>`{=html}
</p>
<p align="center">
<a href="https://redsunnai.vercel.app/">{=html}Live
Application`</a>`{=html} ·
<a href="https://redsun-backend-latest.onrender.com">{=html}Backend`</a>`{=html}
·
<a href="https://hub.docker.com/r/vedantv0502/redsun-frontend">{=html}Frontend
Docker Image`</a>`{=html} ·
<a href="https://hub.docker.com/r/vedantv0502/redsun-backend">{=html}Backend
Docker Image`</a>`{=html}
</p>
RedSun is a team-workspace application for organizing teams, projects,
tasks, and notifications. It combines a Next.js frontend, an Express.js
backend, MongoDB persistence, and Redis-powered background processing
with BullMQ.
Live Deployment
  Component               Platform                Link
  Frontend                Vercel                  Open RedSun

  Backend                 Render                  Backend service

  Frontend image          Docker Hub              vedantv0502/redsun-frontend
Backend image           Docker Hub              vedantv0502/redsun-backend
Production API base URL:
https://redsun-backend-latest.onrender.com/api
Features
Authentication and account management
- User registration and login.
- Password hashing and verification.
- JWT-based authentication.
- Active-session tracking and individual session revocation.
- Profile management, profile photo updates, and password changes.
Teams and collaboration
- Create and view teams.
- Team memberships and role-aware access.
- Add employees to teams.
- View team details and membership information.
Projects and tasks
- Create and manage projects.
- Create and manage tasks.
- Assign tasks to team members.
- Track task status and completion.
Dashboard and notifications
- Dashboard overview with project, task, and notification information.
- Redis-backed notification queue.
- Background notification processing with BullMQ workers.
Technology Stack
  Area                 Technologies
  Frontend             Next.js, React, TypeScript
UI                   CSS Modules, Lucide React
Backend              Node.js, Express.js
Database             MongoDB Atlas, Mongoose
Authentication       JWT, bcrypt
Background jobs      BullMQ
Queue                Redis
Containers           Docker, Docker Compose
CI/CD                GitHub Actions
Hosting              Vercel, Render
Container registry   Docker Hub
Architecture
Browser
   |
   v
Next.js Frontend (Vercel)
   |
   | HTTPS API requests
   v
Express Backend (Render)
   |                 |
   v                 v
MongoDB Atlas       Redis
                    |
                    v
               BullMQ Worker
The frontend communicates with the backend through
NEXT_PUBLIC_API_URL. The backend stores application data in MongoDB
and uses Redis/BullMQ for background notification jobs.
Project Structure
project-root/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── queues/
│   ├── routes/
│   ├── workers/
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   └── my-app/
│       ├── app/
│       ├── components/
│       ├── public/
│       ├── package.json
│       └── Dockerfile
├── .github/
│   └── workflows/
│       └── ci.yml
└── docker-compose.yaml
Getting Started
Prerequisites
- Node.js 22
- npm
- pnpm (the frontend includes a pnpm-lock.yaml)
- MongoDB Atlas or another reachable MongoDB instance
- Redis
- Git
- Docker Desktop with Docker Compose (for containerized development)
Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
Replace the placeholders with your repository URL and directory name.
Environment Variables
Create environment files locally. Never commit them or share their
secret values.
Backend --- backend/.env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
PORT=1000

# Local development Redis
REDIS_HOST=localhost
REDIS_URL=redis://localhost:6379
  Variable                            Purpose
  MONGODB_URL                       MongoDB connection string.

  JWT_SECRET                        Secret used to sign and verify
JWTs.

  PORT                              Local backend port; the deployed
server should respect
process.env.PORT.

  REDIS_HOST                        Redis hostname used by the BullMQ
queue and worker.
REDIS_URL                         Full Redis URL for URL-based Redis
client configuration, where
applicable.
For Docker Compose, use the Redis service hostname (commonly redis) as
REDIS_HOST, not localhost.

For Render, use the hostname portion of the Redis internal URL as
REDIS_HOST. For example, for redis://red-abc123:6379, set
REDIS_HOST=red-abc123. Keep the full internal URL in REDIS_URL if
your Redis client uses it.
Frontend --- frontend/my-app/.env.local
NEXT_PUBLIC_API_URL=http://localhost:1000/api
For Vercel Production:
NEXT_PUBLIC_API_URL=https://redsun-backend-latest.onrender.com/api
NEXT_PUBLIC_ variables are exposed to browser-side code. Use this
prefix only for public configuration such as the API URL. Never put
passwords, database credentials, JWT secrets, or private tokens in a
NEXT_PUBLIC_ variable. Redeploy Vercel after changing it because the
value is included at build time.
Run Locally
Start Redis
If Redis is not already running locally:
docker run --name redsun-redis -p 6379:6379 -d redis:alpine
If a container with that name already exists, start the existing
container instead of creating another one.
Start the backend
cd backend
npm install
node server.js
Use the backend's start script instead if one is defined in
backend/package.json.
Start the frontend
In a second terminal:
cd frontend/my-app
pnpm install
pnpm dev
Open http://localhost:3000. The local frontend API URL should point to
http://localhost:1000/api.
Run with Docker Compose
From the repository root:
docker compose up --build -d
Check services:
docker compose ps
Follow logs:
docker compose logs -f
Stop the containers:
docker compose down
Inside Docker Compose, localhost refers to the current container. The
backend should use the Redis Compose service hostname (commonly
redis). The frontend API URL must be reachable from the browser, not
merely from another container.
CI/CD Pipeline
GitHub Actions runs on pushes to main and pull requests targeting
main.

The workflow contains three jobs:
1. Backend checks
   - Checks out the repository.
   - Sets up Node.js 22.
   - Installs dependencies with npm ci.
   - Checks backend syntax using node --check server.js.
2. Frontend checks
   - Sets up Node.js 22.
   - Installs frontend dependencies with npm ci.
   - Runs ESLint.
   - Builds the Next.js application.
3. Docker image publishing
   - Runs on pushes to main after both check jobs pass.
   - Builds and pushes frontend and backend images.
   - Publishes latest and commit-SHA tags.
Configure these GitHub Actions repository secrets: -
DOCKERHUB_USERNAME - DOCKERHUB_TOKEN

Never place Docker Hub credentials directly in workflow files.
Deployment
Backend --- Render
The backend is deployed using:
docker.io/vedantv0502/redsun-backend:latest
Live service: https://redsun-backend-latest.onrender.com

Configure the required backend variables in Render: - MONGODB_URL -
JWT_SECRET - PORT (the server should listen on
process.env.PORT || 1000) - REDIS_HOST - REDIS_URL if used by the
Redis client

Use the Redis internal hostname for REDIS_HOST, not localhost.
Frontend --- Vercel
The Next.js project root is frontend/my-app.

Live application: https://redsunnai.vercel.app/

Set this Production environment variable in Vercel:
NEXT_PUBLIC_API_URL=https://redsun-backend-latest.onrender.com/api
Redeploy after changing it.
CORS
The backend must allow the exact production frontend origin:
https://redsunnai.vercel.app
Add other trusted Vercel preview or custom domains to the backend CORS
allowlist only when needed. Register CORS middleware before API routes.
Avoid wildcard origins when credentials are enabled.
Troubleshooting
Redis error: ECONNREFUSED 127.0.0.1:6379
- Confirm Render's REDIS_HOST is the Redis internal hostname, not
  localhost.
- Confirm the Render Key Value service is available.
- Confirm the BullMQ queue and worker use the same Redis host and
  port.
- In Docker Compose, use the Redis service hostname.
Browser CORS error
- Confirm the exact Vercel origin is allowed by backend CORS.
- Register CORS middleware before API routes.
- Inspect the request and preflight OPTIONS request in the browser
  Network tab.
- With credentials enabled, use an explicit trusted origin rather than
  *.
API requests go to the frontend domain
- Check NEXT_PUBLIC_API_URL in Vercel.
- Include /api if backend routes are mounted under /api.
- Redeploy Vercel after changing the variable.
- Verify the Axios base URL and endpoint paths.
Vercel reports NEXT_NO_VERSION
- Set Root Directory to frontend/my-app.
- Confirm package.json in that directory declares next as a
  dependency.
- Confirm the selected package manager and lockfile match.
Vercel reports ERR_PNPM_OUTDATED_LOCKFILE
From frontend/my-app, run:
pnpm install
Commit the updated package.json and pnpm-lock.yaml, then push.
Render reports no open ports
Make sure Express listens on Render's assigned port:
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
If the server does not reach app.listen(), inspect earlier logs for
MongoDB or Redis startup errors.
Security Notes
- Never commit .env or .env.local.
- Rotate any credential or secret that has been accidentally exposed.
- Use a long, randomly generated production JWT_SECRET.
- Keep MongoDB credentials and Docker Hub tokens private.
- Restrict MongoDB network access appropriately.
- Use HTTPS for deployed frontend/backend communication.
- Allow only trusted frontend origins through CORS.
- Never expose secrets through NEXT_PUBLIC_ variables.
- Do not log passwords, tokens, or sensitive user information.
Future Improvements
- Automated backend unit and integration tests.
- API health checks, structured logging, and monitoring.
- More granular role-based permissions.
- Additional notification events and retry/failure handling.
- Production backup and recovery procedures.
- AI-powered team productivity features.
Author
Vedant

RedSun is a hands-on full-stack and DevOps project exploring team
collaboration, backend services, background jobs, Docker, CI/CD, and
cloud deployment.
=======
# RedSun

RedSun is a team workspace for organizing teams, projects, and tasks. This repository contains a Next.js web app and an Express API backed by MongoDB and Redis. The app includes account authentication, team and project management, task workflows, notifications, and session management.

## Features

- Register and sign in with JWT authentication.
- Create teams, manage members, and update team details.
- Create projects within teams and manage project tasks.
- View assigned tasks and update task status.
- View and dismiss notifications.
- View active sessions and revoke a session.
- Process notification jobs using BullMQ and Redis.

## Tech stack

- **Web:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **API:** Node.js, Express 5
- **Data:** MongoDB with Mongoose
- **Jobs and cache infrastructure:** Redis and BullMQ
- **Authentication and validation:** JWT, bcrypt, Joi

## Repository layout

```text
.
├── backend/                 # Express API, database models, routes, and worker
├── frontend/
│   └── my-app/              # Next.js application
└── docker-compose.yaml      # Backend, frontend, and Redis services
```

## Run locally

### Requirements

- Node.js 22 or later and npm
- MongoDB (local or hosted)
- Redis (local, or use the Docker Compose instructions below)

### 1. Configure the backend

Create `backend/.env` with the following values:

```env
PORT=1000
MONGODB_URL=mongodb://127.0.0.1:27017/redsun
JWT_SECRET=replace_with_a_long_random_secret
REDIS_HOST=localhost
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

`MONGODB_URL` must point to a MongoDB database you can access. `REDIS_HOST` is the Redis hostname; Redis uses port `6379`. `CORS_ORIGINS` is a comma-separated list of allowed browser origins and can be omitted to use the defaults in the server.

Install dependencies and start the API:

```bash
cd backend
npm install
node server.js
```

The API starts at `http://localhost:1000`. The backend package currently does not define a `dev` or `start` npm script, so run the server with `node server.js`.

### 2. Configure and start the web app

In a second terminal, set the API base URL in `frontend/my-app/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:1000/api
```

Then install dependencies and run Next.js:

```bash
cd frontend/my-app
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Run with Docker Compose

Docker Compose builds the frontend and backend and starts Redis. MongoDB is not included, so configure `backend/.env` with a MongoDB connection string reachable from the backend container. For a MongoDB instance running on the host, use `host.docker.internal` as the hostname where supported.

The compose configuration loads `backend/.env` into the backend container and sets `REDIS_HOST=redis`. The file must exist before starting Compose.

```bash
docker compose up --build
```

The web app is available at `http://localhost:3001`, the API at `http://localhost:1000`, and Redis is exposed on port `6379`. Stop the services with `Ctrl+C`, or run `docker compose down` in another terminal.

## API routes

All routes are served under `/api`. Routes marked **Protected** require `Authorization: Bearer <token>`.

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `POST` | `/register` | Register an account | No |
| `POST` | `/login` | Sign in and receive a token | No |
| `GET` | `/profile` | Get the current profile | Protected |
| `PUT` | `/profile` | Update the current profile | Protected |
| `PUT` | `/change-password` | Change the password | Protected |
| `GET` | `/sessions` | List active sessions | Protected |
| `DELETE` | `/sessions/:sessionId` | Revoke a session | Protected |
| `GET` | `/user/:id` | Get a user | No |
| `PUT` | `/user/:id` | Update a user | Protected |
| `DELETE` | `/user/:id` | Delete a user | No |
| `POST` | `/createteam` | Create a team | Protected |
| `GET` | `/getAllTeams` | List the current user's teams | Protected |
| `GET` | `/getDetails/:teamId` | Get team details | Protected |
| `POST` | `/addEmployee/:teamId/members` | Add a team member | Protected |
| `DELETE` | `/deleteEmployee/:teamId/:userId` | Remove a team member | Protected |
| `PUT` | `/updateTeam/:teamId` | Update a team | Protected |
| `DELETE` | `/deleteTeam/:teamId` | Delete a team | Protected |
| `POST` | `/project/:teamId` | Create a project | Protected |
| `GET` | `/project/:teamId` | List team projects | Protected |
| `GET` | `/project/:teamId/:projectId` | Get project details | Protected |
| `PUT` | `/project/:teamId/:projectId` | Update a project | Protected |
| `DELETE` | `/project/:teamId/:projectId` | Delete a project | Protected |
| `POST` | `/task/:teamId/:projectId` | Create a task | Protected |
| `GET` | `/task/:teamId/:projectId` | List project tasks | Protected |
| `GET` | `/task/:teamId/:projectId/:taskId` | Get task details | Protected |
| `PUT` | `/task/:teamId/:projectId/:taskId` | Update a task | Protected |
| `PATCH` | `/task/:teamId/:projectId/:taskId/assign` | Update assigned task status | Protected |
| `DELETE` | `/task/:teamId/:projectId/:taskId` | Delete a task | Protected |
| `GET` | `/mytasks` | List tasks assigned to the current user | Protected |
| `GET` | `/notifications` | List current user's notifications | Protected |
| `DELETE` | `/notifications/:notificationId` | Delete a notification | Protected |

## Available scripts

From `frontend/my-app`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production web app |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

The backend currently has no npm scripts; start it with `node server.js` from `backend/`.

## Configuration and security

- Keep `backend/.env` and `frontend/my-app/.env.local` out of version control. Never commit database credentials or `JWT_SECRET`.
- Use a unique, long `JWT_SECRET` outside local development.
- `NEXT_PUBLIC_API_URL` is embedded into the frontend build and must point to an API reachable by the user's browser.
- The current frontend stores its JWT in browser `localStorage`; use this implementation with appropriate care.

## Contributing

Changes and suggestions are welcome. For a contribution, fork the repository, create a branch, make your change, and open a pull request with a description of the behavior changed.

## License

No license is currently specified in this repository.
>>>>>>> 5e3d018 (docs: improve project README)
