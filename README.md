# \# AbyssLearn — Deep Ocean Learning \& Exploration Platform

# 

# AbyssLearn is a full-stack educational web application for exploring ocean depth zones, discovering deep-sea creatures, taking marine science quizzes, and tracking learning progress.

# 

# Built using React, Vite, Kotlin, Spring Boot, MySQL, Firebase Admin SDK, and a Python-based OceanEmbed research service.

# 

# \## Features

# 

# \- \*\*Ocean Zones Explorer:\*\* Explore the Epipelagic, Mesopelagic, Bathypelagic, Abyssopelagic, and Hadal zones.

# \- \*\*Deep-Sea Creature Database:\*\* Discover marine species, habitats, depths, and adaptations.

# \- \*\*Interactive Quizzes:\*\* Test marine science knowledge with scoring and feedback.

# \- \*\*User Authentication:\*\* Register and log in using JWT-based authentication.

# \- \*\*Learning Dashboard:\*\* Track quiz attempts, scores, and learning progress.

# \- \*\*OceanEmbed Research Workspace:\*\* Explore ocean-temperature prediction workflows using location, date, and depth inputs.

# \- \*\*Prediction History:\*\* Save and retrieve OceanEmbed prediction records for the authenticated user.

# \- \*\*Responsive Interface:\*\* Dark ocean-inspired design with bioluminescent accents.

# 

# \## Technology Stack

# 

# | Component | Technologies |

# |---|---|

# | Frontend | React 18, Vite, JavaScript, CSS |

# | Main backend | Kotlin, Spring Boot 3, Spring Data JPA |

# | Database | MySQL |

# | Authentication | JWT |

# | Prediction history | Firebase Admin SDK, Cloud Firestore |

# | Research service | Python, FastAPI, scikit-learn |

# | Ocean data | CSV and NetCDF datasets |

# 

# \## Project Structure

# 

# ```text

# abysslearn/

# ├── backend/             # Kotlin + Spring Boot API

# ├── frontend/            # React + Vite application

# ├── oceanembed-service/  # Python prediction service

# ├── README.md

# ├── UPGRADE\_NOTES.md

# ├── .gitignore

# └── start-dev.bat

# ```

# 

# \## Prerequisites

# 

# Install the following before running the application:

# 

# \- Git

# \- Node.js and npm

# \- Java/JDK compatible with the Gradle project

# \- Python compatible with the OceanEmbed service

# \- MySQL Server

# 

# Firebase credentials are required for features that use Cloud Firestore.

# 

# \## Setup

# 

# \### 1. Configure the main backend

# 

# Create the MySQL database:

# 

# ```sql

# CREATE DATABASE abysslearn\_db;

# ```

# 

# In PowerShell, set your local environment variables:

# 

# ```powershell

# $env:DB\_USERNAME = "root"

# $env:DB\_PASSWORD = "your\_mysql\_password"

# $env:ABYSSLEARN\_JWT\_SECRET = "replace-with-a-random-secret-at-least-32-bytes-long"

# ```

# 

# Use your actual local MySQL credentials. Generate a strong JWT secret and never commit real passwords or production secrets.

# 

# Configure Firebase Admin credentials using the backend's supported credential path or `FIREBASE\_CREDENTIALS\_PATH`. Never upload the service-account JSON file to GitHub.

# 

# Start the backend:

# 

# ```powershell

# cd backend

# .\\gradlew.bat bootRun

# ```

# 

# The backend is configured to run at `http://localhost:8085`.

# 

# \### 2. Start the frontend

# 

# Open a second terminal at the project root:

# 

# ```powershell

# cd frontend

# npm install

# npm run dev

# ```

# 

# Open the local URL printed by Vite, usually `http://localhost:5173`.

# 

# \### 3. Start the OceanEmbed service

# 

# Open another terminal at the project root:

# 

# ```powershell

# cd oceanembed-service

# ```

# 

# Create and activate a Python virtual environment if you have not already done so, then install the dependencies listed in the service's dependency file.

# 

# Start the FastAPI application using the launch instructions in `oceanembed-service/README.md`. The local service is configured for port `8090`.

# 

# \## OceanEmbed: Research Scope and Limitations

# 

# OceanEmbed is a research prototype for ocean-temperature estimation using a trained Random Forest model and available reanalysis-derived data.

# 

# \- The current model has a limited training-depth range.

# \- Predictions should not be treated as validated real-time satellite measurements.

# \- Independent evaluation and broader geographic, temporal, and depth validation are needed before scientific or operational use.

# \- The trained model file is excluded from this Git repository because of its size. It must be supplied separately to run model-based predictions.

# 

# \## Security

# 

# \- Keep Firebase service-account credentials, passwords, API keys, and JWT secrets out of version control.

# \- Keep Firestore security rules restrictive and access Firestore through the authenticated backend.

# \- Configure production secrets and allowed origins separately before deployment.

# \- Never use development-only secrets in production.

# 

# \## Academic Context

# 

# Developed as a Web and Mobile Application Development (W-MAD) project, with an additional ocean-temperature research component.



