# Distributed Voting System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

## About the Project
The **Distributed Voting System** is a secure, scalable, and highly available full-stack web application designed to handle elections, candidate management, and real-time vote casting. Originally built as an academic project, it demonstrates key distributed systems concepts including load balancing, high availability, database transactions for consistency, and secure email-based authentication.

## What This Is For
This system is designed to provide a robust and tamper-proof platform where:
- **Administrators** can seamlessly create elections, set timeframes, and manage candidates.
- **Voters** can register, verify their identity via Email OTP, and securely cast their vote in active elections.
- **Everyone** can view election results updating in real-time through Server-Sent Events (SSE).

It prevents common digital voting issues like double-voting and unauthorized access, ensuring a fair, transparent, and verifiable election process.

---

## Technical Implementation & Reasoning

The architecture is deliberately split into a highly scalable, containerized backend ecosystem and a fast, statically served frontend. 

### 1. Backend Architecture (Node.js + Express)
- **High Availability & Replication**: The API runs in **3 Replicas** managed by Docker Compose. This ensures that if one container crashes (a `/crash` chaos testing endpoint is explicitly built-in to demonstrate this), the system remains online, preventing single points of failure.
- **Load Balancing (Nginx)**: An Nginx load balancer sits in front of the 3 API replicas, distributing incoming traffic evenly on port 3000 using Round-Robin algorithms to prevent any single node from being overwhelmed.
- **Authentication (JWT & OTP)**: JSON Web Tokens (JWT) are used for stateless authentication. This is crucial for a distributed system because any of the 3 API replicas can verify a user's session independently without needing shared session memory (like Redis). Email OTPs (via Nodemailer) are enforced during registration to prevent bot accounts and ensure traceability.

### 2. Database (PostgreSQL 15)
- **ACID Compliance & Race Condition Prevention**: PostgreSQL was chosen for its strict ACID compliance. The system uses SQL **Transactions** (`BEGIN`, `COMMIT`, `ROLLBACK`) when casting a vote. 
- **Consistency**: A composite `UNIQUE` constraint on `(voter_id, election_id)` at the database level guarantees that even if a user tries to exploit network latency to vote twice simultaneously, the database will strictly reject the duplicate vote at the lowest level.

### 3. Real-Time Data (Server-Sent Events)
- Rather than polling the database continuously (which would overwhelm the server) or setting up complex bidirectional WebSockets (which is overkill), the API uses **Server-Sent Events (SSE)** to stream real-time election results to the frontend. This is lightweight, unidirectional (server-to-client), and perfect for live leaderboards.

### 4. Frontend (React + Vite)
- The frontend is a Single Page Application (SPA) built with React and Vite for optimal developer experience and build speed.
- **Decoupled Design**: It is intentionally kept out of the backend's Docker network. This decoupling allows the frontend to be hosted on a CDN or a Static Web App provider (like Azure Static Web Apps, Vercel, or Netlify) for blazing-fast load times and infinite scalability at the edge.

---

## How to Run Locally

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18+ LTS recommended)

### 1. Start the Backend Ecosystem
The backend ecosystem (PostgreSQL + 3 API Replicas + Nginx Load Balancer) is fully containerized for a zero-configuration setup.
```bash
# Start the containers in detached mode
docker-compose up -d --build
```
*Wait a few moments for the database to initialize.* 
You can verify it's running via `curl http://localhost:3000/health`.

### 2. Start the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## Deployment Strategy
The system is designed for cloud-native deployment (configured for Microsoft Azure):
- **Database**: Azure Database for PostgreSQL (Flexible Server).
- **Backend & Load Balancer**: Multi-Container Azure App Service pulling images from Azure Container Registry (ACR).
- **Frontend**: Azure Static Web Apps automatically building from the GitHub repository.

For detailed deployment instructions, please see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Tech Stack Summary
- **Frontend**: React 19, Vite, Recharts, React Router v7
- **Backend**: Node.js, Express.js, JSONWebToken, Nodemailer
- **Database**: PostgreSQL 15, node-postgres (pg)
- **Infrastructure**: Docker, Docker Compose, Nginx