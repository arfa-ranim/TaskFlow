# TaskFlow - Quick Start Script
# This script helps you start the TaskFlow application

Write-Host "🚀 TaskFlow Setup & Start Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB is running!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB process not found. Starting MongoDB..." -ForegroundColor Yellow
        Write-Host "   Please start MongoDB manually:" -ForegroundColor Yellow
        Write-Host "   - Open a new terminal and run: mongod" -ForegroundColor White
        Write-Host "   - Or start MongoDB service if installed as service" -ForegroundColor White
        Write-Host ""
        $startMongo = Read-Host "Press Enter after MongoDB is started, or type 'skip' to continue anyway"
        if ($startMongo -ne 'skip') {
            Write-Host "Continuing..." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status. Make sure MongoDB is running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Check backend dependencies
if (Test-Path "backend\node_modules") {
    Write-Host "✅ Backend dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "❌ Backend dependencies: NOT INSTALLED" -ForegroundColor Red
    Write-Host "   Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check frontend dependencies
if (Test-Path "frontend\node_modules") {
    Write-Host "✅ Frontend dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies: NOT INSTALLED" -ForegroundColor Red
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open TWO terminal windows" -ForegroundColor White
Write-Host "   2. Terminal 1 - Backend:" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "      cd frontend" -ForegroundColor Gray
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Make sure MongoDB is running before starting the backend!" -ForegroundColor Yellow

