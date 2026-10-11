# 🚀 TestApp — Dockerized Node.js Application with MongoDB

A containerized web application built using **Node.js, Express.js, and MongoDB**, with Docker Compose for managing multiple services.

This project demonstrates how to containerize a Node.js application, connect it to MongoDB, persist database data using Docker volumes, and manage the application stack using Docker Compose.

The project is designed as a hands-on demonstration of Docker fundamentals and containerized application deployment.

---

## 📌 Table of Contents

* [Project Overview](#-project-overview)
* [Architecture](#-architecture)
* [Technologies Used](#-technologies-used)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Getting Started](#-getting-started)
* [Accessing the Services](#-accessing-the-services)
* [API Endpoints](#-api-endpoints)
* [Docker Commands](#-docker-commands)
* [MongoDB Configuration](#-mongodb-configuration)
* [Troubleshooting](#-troubleshooting)
* [Security Considerations](#-security-considerations)
* [Future Improvements](#-future-improvements)
* [Author](#-author)

---

## 📖 Project Overview

The application consists of three services:

| Service           | Description                               |
| ----------------- | ----------------------------------------- |
| **TestApp**       | Node.js application built with Express.js |
| **MongoDB**       | Database for storing user records         |
| **Mongo Express** | Web-based interface for managing MongoDB  |

Docker Compose manages these services and connects them through a shared Docker network.

### Key Features

* Containerized Node.js application
* MongoDB database integration
* Multi-container orchestration using Docker Compose
* Docker bridge networking and service discovery
* Persistent MongoDB storage using Docker volumes
* Environment-based database connection configuration
* HTTP endpoints for creating and retrieving user records
* Application health-check endpoint

---

## 🏗️ Architecture

```text
                  User / Web Browser
                          |
                          v
                 +------------------+
                 |     TestApp      |
                 | Node.js/Express  |
                 |    Port 5050     |
                 +------------------+
                          |
                          | Docker Network
                          |
                          v
                 +------------------+
                 |     MongoDB      |
                 |    Port 27017    |
                 +------------------+
                          ^
                          |
                 +------------------+
                 |   Mongo Express  |
                 |    Port 8081     |
                 +------------------+
```

### How It Works

1. The user accesses the application through port `5050`.
2. The Node.js application processes incoming HTTP requests.
3. The application connects to MongoDB using the hostname `mongo`.
4. MongoDB stores application data in the `apnacollege-db` database.
5. The `users` collection stores submitted user records.
6. Mongo Express provides a browser-based interface for inspecting the database.
7. A named Docker volume preserves MongoDB data when containers are stopped or recreated.

**Important:** Inside Docker Compose, `localhost` refers to the current container. The application must use `mongo` as the database hostname because it is the MongoDB service name on the shared Docker network.

---

## 🛠️ Technologies Used

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| Node.js          | JavaScript runtime                       |
| Express.js       | Web application framework                |
| MongoDB          | NoSQL database                           |
| Mongo Express    | MongoDB administration interface         |
| Docker           | Application containerization             |
| Docker Compose   | Multi-container application management   |
| Linux / Terminal | Container management and troubleshooting |

---

## 📂 Project Structure

```text
testapp/
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
├── server.js
└── public/
    └── ... frontend files ...
```

### File Descriptions

| File                | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `Dockerfile`        | Defines how the application Docker image is built                       |
| `compose.yaml`      | Configures the application, MongoDB, Mongo Express, network, and volume |
| `package.json`      | Defines the Node.js application dependencies and scripts                |
| `package-lock.json` | Records resolved npm dependency versions                                |
| `server.js`         | Implements the Express server and MongoDB operations                    |
| `public/`           | Contains static frontend files, if included                             |

---

## ⚙️ Prerequisites

Install the following before running the project:

* Git
* Docker Engine or Docker Desktop
* Docker Compose

Verify your installations:

```bash
git --version
docker --version
docker compose version
```

A local Node.js installation is not required when building and running the application entirely inside Docker.

---

## 🚀 Getting Started

### Step 1: Clone the Repository

Replace the placeholder below with your actual GitHub repository URL.

```bash
git clone <your-github-repository-url>
```

Navigate to the cloned project directory:

```bash
cd <your-project-directory>
```

### Step 2: Review the Docker Compose Configuration

Open `compose.yaml` and verify that the `testapp`, `mongo`, and `mongo-express` services are configured.

The application should have a MongoDB connection environment variable similar to:

```yaml
environment:
  MONGO_URL: "mongodb://admin:qwerty@mongo:27017/?authSource=admin"
```

The example credentials above are for demonstration only. Use secure credentials for real deployments.

### Step 3: Validate the Configuration

Run:

```bash
docker compose config
```

This checks the Compose configuration for syntax and configuration errors.

### Step 4: Build and Start the Services

Run:

```bash
docker compose up -d --build
```

Docker Compose will build the application image and start the configured services in the background.

### Step 5: Verify the Containers

Run:

```bash
docker compose ps
```

Check the logs if a service fails to start:

```bash
docker compose logs --tail=100 testapp
```

Check MongoDB logs:

```bash
docker compose logs --tail=100 mongo
```

Check Mongo Express logs:

```bash
docker compose logs --tail=100 mongo-express
```

When the application starts successfully, its logs should indicate that MongoDB connected and the web server is listening on port `5050`.

---

## 🌐 Accessing the Services

Once the containers are running, open these URLs:

| Service       | URL                            | Description                     |
| ------------- | ------------------------------ | ------------------------------- |
| TestApp       | http://localhost:5050          | Main application                |
| Health Check  | http://localhost:5050/health   | Application health endpoint     |
| Get Users     | http://localhost:5050/getUsers | Retrieve user records           |
| Mongo Express | http://localhost:8081          | Browser-based MongoDB interface |

Mongo Express may need a short time to initialize after MongoDB starts.

---

## 🔌 API Endpoints

The application provides the following HTTP endpoints.

### 1. Health Check

**Method:** `GET`

```text
/health
```

Test it with:

```bash
curl http://localhost:5050/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### 2. Retrieve Users

**Method:** `GET`

```text
/getUsers
```

Example:

```bash
curl http://localhost:5050/getUsers
```

This endpoint retrieves all documents from the `users` collection.

### 3. Add a User

**Method:** `POST`

```text
/addUser
```

Example:

```bash
curl -X POST http://localhost:5050/addUser \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

The application inserts the submitted fields into MongoDB and returns a response containing the inserted document ID.

The request fields depend on the data your application is designed to accept.

---

## 🐳 Docker Image

The application image is published on Docker Hub.

**Image:** `krunalhande/testapp:latest`

Pull the image:

```bash
docker pull krunalhande/testapp:latest
```

The GitHub repository includes the Docker Compose configuration for running the complete application stack.

To run the application using the published image rather than building locally, configure the `testapp` service to use:

```yaml
image: krunalhande/testapp:latest
```

Remove `build: .` from that service if you want Compose to use the published image without building it locally.

---

## 🗄️ MongoDB Configuration

The application uses the following database configuration:

| Setting                  | Value            |
| ------------------------ | ---------------- |
| Database                 | `apnacollege-db` |
| Collection               | `users`          |
| MongoDB service hostname | `mongo`          |
| MongoDB container port   | `27017`          |

MongoDB data is persisted using a named volume configured in Compose:

```yaml
volumes:
  - mongo-data:/data/db
```

This allows database files to remain available after the containers are stopped or recreated.

**Note:** Avoid `docker compose down -v` if you want to preserve the named MongoDB volume.

---

## 🧰 Useful Docker Commands

### View Running Containers

```bash
docker compose ps
```

### View All Containers, Including Stopped Ones

```bash
docker compose ps -a
```

### Follow Application Logs

```bash
docker compose logs -f testapp
```

### Restart the Application

```bash
docker compose restart testapp
```

### Rebuild the Application Image

```bash
docker compose build --no-cache testapp
```

### Stop and Remove the Compose Containers

```bash
docker compose down
```

This command removes the Compose containers and network but preserves the named volume by default.

---

## 🔧 Troubleshooting

### Issue 1: Port Already in Use

Example error:

```text
failed to bind host port 0.0.0.0:5050
```

Identify the process using port `5050` on Linux:

```bash
sudo ss -ltnp | grep ':5050'
```

Check whether another Docker container is publishing that port:

```bash
docker ps --filter "publish=5050"
```

After identifying the conflicting process or container, stop it if appropriate, or change the host-side port mapping in `compose.yaml`.

For example:

```yaml
ports:
  - "5051:5050"
```

The application will then be accessible at `http://localhost:5051`.

### Issue 2: MongoDB Hostname Resolution Failure

Example error:

```text
MongoServerSelectionError: getaddrinfo EAI_AGAIN mongo
```

Check that:

* The MongoDB service is running.
* The application and MongoDB are attached to the same Docker network.
* The MongoDB Compose service is named `mongo`.
* The application uses `mongo`, not `localhost`, in its Docker connection URL.

Check service status:

```bash
docker compose ps -a
```

Inspect Docker networks:

```bash
docker network ls
```

Inspect application logs:

```bash
docker compose logs --tail=100 testapp
```

### Issue 3: Application Container Exits

Inspect the logs:

```bash
docker compose logs --tail=100 testapp
```

Verify that:

* `server.js` exists in the build context.
* The Dockerfile points to the correct startup file.
* Required npm dependencies are declared in `package.json`.
* The `MONGO_URL` environment variable is correct.
* MongoDB is available on the shared network.

---

## 🔐 Security Considerations

This project is intended for learning and demonstration.

Before deploying it in production:

* Replace example database credentials with secure credentials.
* Do not commit passwords, tokens, or secrets to GitHub.
* Use environment variables or Docker secrets for sensitive configuration.
* Restrict external access to MongoDB.
* Secure the Mongo Express interface.
* Add appropriate request validation and authentication.
* Use production-grade logging and monitoring.

---

## 🚧 Future Improvements

Planned enhancements for this project include:

* Add Docker health checks for MongoDB and the application.
* Improve startup dependency handling using health-based conditions.
* Integrate Jenkins for automated CI/CD.
* Add automated application tests.
* Introduce structured logging and monitoring.
* Improve secrets management.
* Publish versioned Docker image tags.
* Add a `.env.example` file documenting required configuration.

---

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Creating Docker images using a Dockerfile
* Running containers and publishing application ports
* Orchestrating multi-container services with Docker Compose
* Connecting containers through Docker networking
* Using service names for internal DNS resolution
* Persisting database data with Docker volumes
* Configuring applications through environment variables
* Troubleshooting port conflicts and container networking
* Deploying a Node.js application with MongoDB

---

## 👨‍💻 Author

**Krunal Hande** or you can call me **ZORO**  

* Docker Hub image: `krunalhande/testapp:latest`

---

* If this project helps you learn Docker and containerized application deployment, feel free to explore it and build upon it.



