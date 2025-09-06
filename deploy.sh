#!/bin/bash

# Production deployment script for HexSyn Server
set -e

echo "🚀 Starting production deployment..."

# Check if required environment variables are set
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

# Create logs directory
mkdir -p logs

# Install production dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build Docker image if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker build -t hexsyn-server:latest .
    
    echo "🔄 Stopping existing containers..."
    docker-compose down || true
    
    echo "🚀 Starting new containers..."
    docker-compose up -d
    
    echo "✅ Deployment completed with Docker!"
    echo "📊 Container status:"
    docker-compose ps
else
    # PM2 deployment fallback
    if command -v pm2 &> /dev/null; then
        echo "⚡ Deploying with PM2..."
        pm2 stop ecosystem.config.js || true
        pm2 start ecosystem.config.js --env production
        pm2 save
        
        echo "✅ Deployment completed with PM2!"
        echo "📊 PM2 status:"
        pm2 status
    else
        echo "❌ Neither Docker nor PM2 found. Please install one of them."
        exit 1
    fi
fi

echo "🎉 Deployment successful!"
echo "🌐 Server should be running on port ${PORT:-5000}"
echo "🔍 Health check: curl http://localhost:${PORT:-5000}/api/health"
