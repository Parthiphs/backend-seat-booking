@echo off
echo Starting Backend and Frontend servers...
echo.

REM Open Backend in new window
start "Backend - Port 3000" cmd /k "cd c:\tesplab\node\backend-ticket-booking && npm run start:dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Open Frontend in new window  
start "Frontend - Port 3001" cmd /k "cd c:\tesplab\node\backend-ticket-booking\frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
pause
