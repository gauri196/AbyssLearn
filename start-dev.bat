@echo off
title AbyssLearn Launcher
echo ===================================================
echo     AbyssLearn - Deep Ocean Exploration Platform
echo ===================================================
echo.
echo Choose an option:
echo   [1] Start Backend only (Spring Boot :8085)
echo   [2] Start Frontend only (React Vite :5173)
echo   [3] Start Both (opens 2 terminal windows)
echo   [4] Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto start_both
if "%choice%"=="4" goto end
goto invalid

:start_backend
echo Starting Kotlin Spring Boot backend on port 8085...
rem Local development secret only. Set a unique secret for deployed environments.
set ABYSSLEARN_JWT_SECRET=local-dev-secret-change-this-before-deploying-123456
cd backend
call .\gradlew.bat bootRun
goto end

:start_frontend
echo Starting React Vite frontend on port 5173...
cd frontend
call npm run dev
goto end

:start_both
echo Starting backend in new window (port 8085)...
start "AbyssLearn Backend (Spring Boot)" cmd /k "set ABYSSLEARN_JWT_SECRET=local-dev-secret-change-this-before-deploying-123456 && cd backend && .\gradlew.bat bootRun"
echo Starting frontend in new window (port 5173)...
start "AbyssLearn Frontend (Vite)" cmd /k "cd frontend && npm run dev"
echo Both services are launching!
echo Backend:  http://localhost:8085
echo Frontend: http://localhost:5173
goto end

:invalid
echo Invalid choice.
pause

:end
