# Production deployment script for HexSyn Server (Windows PowerShell)
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Set environment
$env:NODE_ENV = $Environment

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force
    Write-Host "📁 Created logs directory" -ForegroundColor Yellow
}

# Install production dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci --only=production

# Check if Docker is available
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "🐳 Building Docker image..." -ForegroundColor Blue
    docker build -t hexsyn-server:latest .
    
    Write-Host "🔄 Stopping existing containers..." -ForegroundColor Yellow
    docker-compose down 2>$null
    
    Write-Host "🚀 Starting new containers..." -ForegroundColor Green
    docker-compose up -d
    
    Write-Host "✅ Deployment completed with Docker!" -ForegroundColor Green
    Write-Host "📊 Container status:" -ForegroundColor Cyan
    docker-compose ps
}
elseif (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "⚡ Deploying with PM2..." -ForegroundColor Blue
    pm2 stop ecosystem.config.js 2>$null
    pm2 start ecosystem.config.js --env production
    pm2 save
    
    Write-Host "✅ Deployment completed with PM2!" -ForegroundColor Green
    Write-Host "📊 PM2 status:" -ForegroundColor Cyan
    pm2 status
}
else {
    Write-Host "❌ Neither Docker nor PM2 found. Please install one of them." -ForegroundColor Red
    exit 1
}

$port = if ($env:PORT) { $env:PORT } else { "5000" }
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "🌐 Server should be running on port $port" -ForegroundColor Cyan
Write-Host "🔍 Health check: Invoke-RestMethod http://localhost:$port/api/health" -ForegroundColor Cyan
