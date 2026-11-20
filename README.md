
# RedSun – AI Operating System for Teams

RedSun is a team collaboration and project management platform designed to help teams manage projects, organize tasks, track progress, and stay connected through a centralized workspace.

It provides features such as team management, project tracking, task assignments, notifications, user authentication, and session management.

## Live Demo

- **Frontend:** https://redsunnai.vercel.app/
- **Backend API:** https://redsun-backend-latest.onrender.com
- **API Base URL:** https://redsun-backend-latest.onrender.com/api

## Features

### Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Active session tracking
- Revoke active sessions from other devices
- Profile management
- Change password

### Team Management
- Create and manage teams
- Team membership management
- Role-based team access
- Add employees to teams
- View team details

### Project Management
- Create, update, and manage projects
- Organize projects within teams
- Track project progress

### Task Management
- Create and assign tasks
- Update task status
- Manage task progress
- Organize tasks within projects

### Dashboard
- Overview of projects and tasks
- Dynamic dashboard statistics
- Recent notifications
- Task and project summaries

### Notifications
- Background notification processing
- Redis and BullMQ integration
- Real-time notification data management

## Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript
- CSS Modules
- Lucide React
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt

### DevOps & Infrastructure
- Docker
- Docker Compose
- Docker Hub
- GitHub Actions
- Redis
- BullMQ
- Vercel
- Render

## Architecture

```text
                 User
                  |
                  v
          Next.js Frontend
                  |
                  v
           Express Backend
                  |
          +-------+-------+
          |               |
          v               v
     MongoDB Atlas       Redis
                          |
                          v
                       BullMQ
                          |
                          v
                  Background Worker
```

## Project Structure

```text
AI/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── workers/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── my-app/
│       ├── app/
│       ├── components/
│       ├── public/
│       ├── Dockerfile
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── docker-compose.yaml
```

## Run Locally

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Backend Setup

```bash
cd backend
npm install
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend/my-app
npm install
```
Start the frontend:

```bash
npm run dev
```

## Run Using Docker Compose

Make sure Docker Desktop is running.

From the project root directory:

### Build and Start Containers

```bash
docker compose up -d --build
```

### Check Running Containers

```bash
docker compose ps
```

### View Container Logs

```bash
docker compose logs -f
```

### Stop Containers

```bash
docker compose down
```

### Application URLs

- Frontend: http://localhost:3001
- Backend: http://localhost:1000
- Redis: localhost:6379

## CI/CD Pipeline

RedSun uses GitHub Actions to automate continuous integration and Docker image publishing.

The pipeline performs the following steps:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs backend dependencies.
4. Checks backend JavaScript syntax.
5. Installs frontend dependencies.
6. Runs ESLint.
7. Builds the Next.js application.
8. Builds Docker images.
9. Pushes Docker images to Docker Hub.

Docker publishing runs on pushes to the `main` branch after both backend and frontend checks succeed.

### Docker Hub Images

- Backend: https://hub.docker.com/r/vedantv0502/redsun-backend
- Frontend: https://hub.docker.com/r/vedantv0502/redsun-frontend

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Redis | Render Key Value |
| Container Registry | Docker Hub |
| CI/CD | GitHub Actions |

## Environment Variables

Never commit `.env` files, database credentials, JWT secrets, or Docker Hub access tokens to GitHub.

Configure production environment variables through the respective deployment platform.

## Future Improvements

- AI-powered task assistance
- AI project summaries
- Smart task recommendations
- Team productivity analytics
- Advanced reporting
- More collaboration features

## Author

**Yadnesh Vidulkar**

B.Tech – Information Technology (Data Science)

GitHub: https://github.com/Yadnesh2026

Portfolio: https://yadneshvidulkar.vercel.app/

---

If you find this project interesting, consider giving it a ⭐ on GitHub!
