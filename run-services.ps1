# Kill any lingering processes on ports 3001 and 8000
Get-NetTCPConnection -LocalPort 3001, 8000 -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Freeing port $($_.LocalPort) (PID: $($_.OwningProcess))..."
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "Starting FastAPI Backend on port 8000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

Write-Host "Starting Admin Dashboard on port 3001..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\admin-dashboard'; npm run dev"

Write-Host "Both services are launching in separate windows:"
Write-Host "FastAPI API:      http://127.0.0.1:8000/docs"
Write-Host "Admin Dashboard:  http://127.0.0.1:3001"

