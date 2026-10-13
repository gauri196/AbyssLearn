# 🌊 AbyssLearn
### Dive deeper. Discover more. Learn the unknown.

**AbyssLearn** is an interactive ocean-learning platform that brings the mysteries of the deep sea to life. Explore ocean zones, discover extraordinary marine creatures, challenge yourself with quizzes, and track your learning journey.

The project also features **OceanEmbed**, a research prototype for ocean-temperature estimation using a machine-learning model and reanalysis-derived data.

<p align="center">
  <a href="https://github.com/gauri196/AbyssLearn">
    <img src="https://img.shields.io/badge/Project-AbyssLearn-00C2D1?style=for-the-badge&logo=github&logoColor=white" alt="AbyssLearn project"/>
  </a>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/ML-Scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="Scikit-learn"/>
</p>

---

## ✦ Explore the Abyss

| Feature | What it offers |
|---|---|
| 🌊 **Ocean Zones** | Explore five major ocean depth zones, from sunlit surface waters to the Hadal zone. |
| 🦑 **Marine Life** | Discover deep-sea creatures, their habitats, adaptations, and depth ranges. |
| 🧠 **Knowledge Quizzes** | Test your ocean knowledge with interactive quizzes and instant feedback. |
| 📊 **Learning Dashboard** | Review quiz scores, attempts, and learning progress. |
| 🔐 **Authentication** | Register and log in with JWT-based authentication. |
| 🌡️ **OceanEmbed** | Explore a machine-learning workflow for estimating ocean temperatures at selected locations and depths. |
| 📁 **Prediction History** | Save and retrieve prediction records associated with the authenticated user. |

---

## 🪼 Built With

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS"/>
  <img src="https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white" alt="Kotlin"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" alt="scikit-learn"/>
</p>

---

## 🗺️ Architecture

```text
                    ABYSSLEARN
                         |
             +-----------+-----------+
             |                       |
        React + Vite             User Interface
             |
       +-----+----------------+
       |                      |
  Spring Boot API        OceanEmbed API
  Kotlin / REST          Python / FastAPI
       |                      |
  +----+------+          Random Forest
  |           |          Temperature Model
 MySQL     Firebase
           Firestore
```

**How it works**
- The React frontend communicates with the Spring Boot backend for the core learning experience.
- Spring Boot manages application logic, authentication, and learning data.
- Firebase Admin SDK supports prediction-history storage in Cloud Firestore.
- The Python service handles OceanEmbed prediction requests using the configured model and available inputs.

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- [Node.js and npm](https://nodejs.org/)
- [Java / JDK](https://adoptium.net/)
- [Python](https://www.python.org/)
- [MySQL](https://dev.mysql.com/downloads/)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gauri196/AbyssLearn.git
cd AbyssLearn
```

### 2. Configure the database

Create the MySQL database:

```sql
CREATE DATABASE abysslearn_db;
```

Set your local backend environment variables in PowerShell:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"
$env:ABYSSLEARN_JWT_SECRET = "your-random-secret-at-least-32-bytes-long"
```

Use your own local credentials and a strong, randomly generated JWT secret. Never commit real secrets.

Configure Firebase Admin credentials using the backend's supported credential configuration. The service-account JSON file is intentionally excluded from version control.

### 3. Start the backend

Open a terminal in the project root:

```powershell
cd backend
.\gradlew.bat bootRun
```

The backend runs at `http://localhost:8085` when using the configured defaults.

### 4. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

### 5. Start OceanEmbed

Open a third terminal:

```powershell
cd oceanembed-service
```

Create and activate a Python virtual environment, install the dependencies from `requirements.txt`, and follow the service-specific launch instructions in `oceanembed-service/README.md`.

The service uses port `8090` in the current local configuration.

> **Model requirement:** The trained model file is excluded from this repository because of its size. It must be obtained separately and placed at the configured model path before model-based predictions can run.

---

## 🌡️ OceanEmbed Research Notes

OceanEmbed is a **research prototype**, not a validated operational ocean-forecasting system.

- The current Random Forest model is trained using reanalysis-derived data.
- Its training-depth range is limited; predictions outside that range require further validation.
- Predictions should not be interpreted as direct satellite measurements or guaranteed real-time ocean conditions.
- Broader temporal, geographic, and depth validation is necessary before scientific or operational use.

---

## 🔒 Security

- Credentials and environment-specific secrets must stay out of Git.
- Firestore access should remain restricted and flow through the authenticated backend.
- Production deployments require secure environment variables, appropriate CORS origins, and deployment-specific configuration.

---

## 🎯 Project Goal

Bring together **marine education, interactive learning, full-stack development, and exploratory machine learning** in one ocean-inspired platform.

---

<p align="center">
  <strong>Made with curiosity for the world's least explored frontier — the deep ocean. 🌊</strong>
</p>
