# AbyssLearn upgrade notes

This update preserves the React + Vite frontend and Kotlin + Spring Boot + MySQL backend.

## Changes included

- Reworked the Home hero into an immersive deep-ocean landing experience, with layered ocean imagery, a glowing depth orb, responsive layouts, and reduced-motion support.
- Removed simulated login/signup responses. If the backend is unavailable, authentication now fails instead of storing a fake JWT.
- Hardened persisted auth state against invalid JSON in localStorage.
- Moved database credentials and the JWT signing key to environment variables; reduced noisy SQL/security logging and restricted CORS to the configured frontend origin.
- Restricted create/update/delete operations for ocean zones and creatures to the `ADMIN` role.
- Removed the correct answer from public quiz question responses and added a server-side quiz grading endpoint.
- Updated the README and added a `.gitignore` for generated dependencies/build files and secrets.

## Run locally on Windows

1. Start MySQL and create `abysslearn_db` if it does not exist.
2. In PowerShell, set the database and JWT environment variables in the terminal you will use for the backend:

   ```powershell
   $env:DB_USERNAME = "root"
   $env:DB_PASSWORD = "your_mysql_password"
   $env:ABYSSLEARN_JWT_SECRET = "replace-with-a-random-secret-at-least-32-bytes-long"
   ```

3. Start the backend:

   ```powershell
   cd backend
   .\gradlew.bat bootRun
   ```

4. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`.

`start-dev.bat` includes a local-only development JWT secret to keep the quick launcher usable. Do not use that secret outside local development. For the normal backend command, set your own environment variable as shown above.

## Admin access

Zone/creature write endpoints now require a database user with role `ADMIN`; normal signups remain `USER`. Promote a trusted account manually in your local database if you need to test the content-management endpoints. Do not expose an admin account or database to the public internet.

## Validation status

The source was inspected and edited, but automated builds could not be completed in this environment because the Gradle distribution could not be downloaded (network DNS unavailable) and the frontend dependencies could not be reinstalled. Run the frontend build and backend tests locally before merging or deploying:

```powershell
cd frontend
npm ci
npm run build
cd ..ackend
.\gradlew.bat test
```
