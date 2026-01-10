🗳️ Distributed Voting System

This project is a Distributed Voting System built as an academic project.
The backend and database are containerized using Docker, while the frontend is a React application.

The system supports:

User registration & login (JWT-based)

Role-based access (Admin / User)

Election creation (Admin)

Candidate management (Admin)

Secure voting (User)

Viewing election results

🧱 Tech Stack
Frontend

React (Vite)

JavaScript

Fetch API

JWT authentication (stored in localStorage)

Backend

Node.js

Express.js

PostgreSQL

JWT authentication

Docker (containerized backend)

Database

PostgreSQL 15 (Docker container)

📁 Project Structure
distributed-voting/
├── api/                # Backend (Dockerized)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db/
│       └── middleware/
│
├── frontend/           # React frontend
│   ├── package.json
│   └── src/
│
└── README.md

✅ Prerequisites

Make sure the following are installed on your machine:

Docker Desktop

Node.js (LTS version)

npm (comes with Node.js)

⚠️ Docker must be running before starting the backend.

🚀 How to Run the Project (Step-by-Step)
1️⃣ Clone or Extract the Project
cd distributed-voting

2️⃣ Run the System with Docker Compose
Navigate to the root directory and run:

docker-compose up -d --build


This command helps:
- Create the private internal network (`voting-net`)
- Start the PostgreSQL database
- Build and start the API backend

Wait for the containers to start.

6️⃣ Verify Backend is Running
docker ps


You should see:

api        Up
postgres   Up


Test backend health:

curl http://localhost:3000/health


Expected response:

{ "ok": true, "db": "postgres" }

7️⃣ Run Frontend Application
cd ../frontend
npm install
npm run dev


Frontend will be available at:

http://localhost:5173

🔐 Authentication Notes

JWT tokens are stored in localStorage

Logging out removes the token

Token expiration is handled by the backend

Admin-only routes are protected by role-based middleware

🧪 Default Ports Used
Service	Port
Frontend	5173
Backend API	3000
PostgreSQL	5432

Make sure these ports are free.

🛠️ Common Issues & Fixes
❌ 401 Unauthorized

You are not logged in

JWT token is missing or expired

Log in again

❌ ERR_CONNECTION_REFUSED

Backend container is not running

Check using docker ps

❌ Database Errors

Ensure PostgreSQL container is running

Ensure DATABASE_URL is set correctly

📌 Notes

Backend is fully containerized → no local DB setup needed

Frontend is intentionally not Dockerized for simplicity

This setup ensures consistent behavior across machines