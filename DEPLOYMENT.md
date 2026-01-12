# Deployment Guide

This guide covers the deployment of the Distributed Voting System.

-   **Database**: Standard Azure PostgreSQL (Flexible Server)
-   **Backend**: Multi-Container App Service (3 Replicas + Load Balancer)
-   **Frontend**: Standard Azure Static Web App

---

## 1. Database Setup (Azure PostgreSQL)

1.  **Create Resource**:
    -   Search for **Azure Database for PostgreSQL - Flexible Server**.
    -   Click **Create**.
2.  **Configuration**:
    -   **Resource Group**: Create a new one (e.g., `voting-group`).
    -   **Server Name**: Unique name (e.g., `voting-db-prod`).
    -   **Region**: Choose your preferred region.
    -   **Workload Type**: Development or Production (Standard_B1ms is fine for testing).
    -   **Authentication**: Method: PostgreSQL authentication only.
    -   **Admin Username/Password**: Set and **save these**.
3.  **Networking**:
    -   **Connectivity method**: Public access (allowed IP addresses).
    -   **Firewall rule**: Click "Add current client IP address" to testing locally.
    -   *Important*: For Azure App Service to connect later, you must check **Allow public access from any Azure service within Azure to this server** in the Networking tab (or configure VNet isolation if preferred).
4.  **Save Details**:
    -   Note down the **Server name** (Host), **Database name** (default is usually `postgres`, or create a new one called `votingdb`), **Username**, and **Password**.

---

## 2. Backend Setup (Replicated API)

This step deploys your API with **3 Replicas** using the Multi-Container file we prepared.

### A. Push Images to Azure Container Registry (ACR)
1.  **Create Registry**:
    -   Create resource -> **Container Registry**.
    -   Name: e.g., `votingregistry`.
    -   Go to **Access keys** -> Enable **Admin user**. Copy the Login server, Username, and Password.
2.  **Build & Push (Local Terminal)**:
    ```powershell
    # Login
    az acr login --name <your-registry-name>

    # 1. Build and Push API Image
    docker build -t <your-registry-name>.azurecr.io/voting-api:latest ./api
    docker push <your-registry-name>.azurecr.io/voting-api:latest

    # 2. Build and Push Load Balancer Image
    docker build -t <your-registry-name>.azurecr.io/voting-lb:latest ./nginx
    docker push <your-registry-name>.azurecr.io/voting-lb:latest
    ```

### B. Create App Service
1.  **Create Resource**:
    -   Create resource -> **Web App**.
    -   **Publish**: Docker Container.
    -   **Operating System**: Linux.
    -   **Pricing Plan**: **Premium V3** (Recommended for multi-container performance) or Standard.
2.  **Docker Settings**:
    -   **Options**: Docker Compose (Preview).
    -   **Image Source**: Azure Container Registry.
    -   **Registry**: Select your registry.
    -   **Configuration File**: Upload the **`docker-compose.prod.yml`** file from your project root.
        -   *Note: Ensure the image names in your `docker-compose.prod.yml` match your actual ACR name.*

### C. Configure Environment Variables
Go to the App Service -> **Settings** -> **Environment Variables**. Add these:

| Name | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgres://<user>:<password>@<host>:5432/<dbname>?sslmode=require` |
| `JWT_SECRET` | (Generate a random secure string) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_USER` | (Your Gmail address) |
| `SMTP_PASS` | (Your Gmail App Password) |
| `WEBSITES_PORT` | `3000` (Required to expose the Load Balancer port) |

---

## 3. Frontend Setup (Azure Static Web Apps)

1.  **Prepare Remote Repo**:
    -   Ensure your project is pushed to GitHub.
2.  **Create Resource**:
    -   Create resource -> **Static Web App**.
    -   **Plan Type**: Free (sufficient for most) or Standard.
    -   **Deployment Details**: GitHub.
    -   **Repository**: Select your distributed-voting repo.
    -   **Build Presets**: React.
    -   **App Location**: `/frontend`
    -   **Api Location**: (Leave blank).
    -   **Output Location**: `dist`.
3.  **Connect to Backend**:
    -   After the Static Web App is created, go to **Settings** -> **Environment variables**.
    -   Add `VITE_API_BASE_URL` with the value of your Backend App Service URL (e.g., `https://voting-backend.azurewebsites.net`).
    -   *Note: Ensure your `api.js` in the frontend uses this variable.*

---

## 4. Verification

1.  Open the Frontend URL.
2.  Register a new user (This hits the Load Balancer -> One of the API Replicas -> Database).
3.  Check your Check your Gmail for the OTP.
4.  Log in and Vote.
