# PowerShell script to start both servers

Write-Host "🚀 Starting Movie Ticket Booking System..." -ForegroundColor Green
Write-Host ""

$backendPath = "C:\tesplab\node\backend-ticket-booking"
$frontendPath = "C:\tesplab\node\backend-ticket-booking\frontend"

Write-Host "Starting Backend Server (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run start:dev" -WindowStyle Normal

Write-Host "Waiting 3 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
