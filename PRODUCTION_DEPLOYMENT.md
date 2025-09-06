# Production Deployment Guide

This guide covers deploying the HexSyn Server to production environments with best practices for security, monitoring, and scalability.

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)
```bash
# Clone and setup
git clone <your-repo>
cd hex-be

# Configure environment
cp .env.example .env.production
# Edit .env.production with your production values

# Deploy with Docker
npm run docker:build
npm run docker:run
```

### Option 2: PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Deploy
npm run pm2:start
```

### Option 3: One-click Deployment
```bash
# Linux/Mac
npm run deploy

# Windows
npm run deploy:windows
```

## 📋 Pre-deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env.production`
- [ ] Set `NODE_ENV=production`
- [ ] Configure production SMTP settings (SendGrid, AWS SES, etc.)
- [ ] Set secure `JWT_SECRET`
- [ ] Configure `FRONTEND_URL` with your production domain
- [ ] Set appropriate `LOG_LEVEL` (info or warn for production)

### Security
- [ ] Use production email service (not Gmail for high volume)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up rate limiting appropriately
- [ ] Review CORS settings for production domains

### Infrastructure
- [ ] Ensure sufficient server resources (min 1GB RAM, 1 CPU)
- [ ] Set up log rotation
- [ ] Configure monitoring and alerting
- [ ] Set up backup strategy
- [ ] Plan for horizontal scaling if needed

## 🐳 Docker Deployment

### Production Docker Setup
```bash
# Build production image
docker build -t hexsyn-server:latest .

# Run with docker-compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Docker Environment Variables
Create a `.env` file for docker-compose:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
# ... other variables
```

### Docker Health Checks
The container includes built-in health checks:
- Endpoint: `/api/health`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

## ⚡ PM2 Deployment

### PM2 Configuration
The `ecosystem.config.js` file provides:
- Cluster mode for multi-core utilization
- Auto-restart on crashes
- Memory limit monitoring
- Log management
- Graceful shutdown handling

### PM2 Commands
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Monitor
pm2 status
pm2 logs
pm2 monit

# Management
pm2 restart hexsyn-server
pm2 stop hexsyn-server
pm2 delete hexsyn-server

# Save configuration
pm2 save
pm2 startup  # Setup auto-start on boot
```

## 🌐 Platform-Specific Deployments

### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will automatically detect and deploy

### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Set environment variables
4. Deploy

### AWS ECS/Fargate
1. Build and push Docker image to ECR
2. Create ECS task definition
3. Configure service with load balancer
4. Set up CloudWatch logging

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set SMTP_HOST=smtp.sendgrid.net
# ... set other environment variables
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel
vercel login

# Set environment variables
vercel env add NODE_ENV production
vercel env add SMTP_HOST smtp.sendgrid.net
# ... set other environment variables

# Deploy
npm run vercel:deploy
```

## 📊 Monitoring and Logging

### Log Files
- `logs/access.log` - HTTP access logs
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

### Log Rotation
Set up logrotate for production:
```bash
# /etc/logrotate.d/hexsyn-server
/path/to/hex-be/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 nodejs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Monitoring
- Health endpoint: `GET /api/health`
- SMTP test endpoint: `GET /api/email/test-connection`
- Monitor response times and error rates
- Set up alerts for downtime

### Recommended Monitoring Tools
- **Application**: PM2 monitoring, New Relic, DataDog
- **Infrastructure**: Prometheus + Grafana, CloudWatch
- **Uptime**: Pingdom, UptimeRobot
- **Logs**: ELK Stack, Splunk, CloudWatch Logs

## 🔒 Security Best Practices

### Environment Security
- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Rotate API keys regularly
- Use strong JWT secrets (32+ characters)

### Network Security
- Enable HTTPS only
- Configure proper CORS origins
- Use reverse proxy (Nginx, CloudFlare)
- Implement rate limiting
- Set up DDoS protection

### Application Security
- Keep dependencies updated
- Use Helmet.js for security headers
- Validate all inputs
- Implement proper error handling
- Log security events

## 📈 Performance Optimization

### Scaling Strategies
1. **Vertical Scaling**: Increase server resources
2. **Horizontal Scaling**: Multiple server instances
3. **Load Balancing**: Distribute traffic
4. **Caching**: Redis for session/data caching
5. **CDN**: Static asset delivery

### Performance Monitoring
- Response time monitoring
- Memory usage tracking
- CPU utilization
- Email delivery rates
- Error rate monitoring

## 🔧 Troubleshooting

### Common Issues

#### SMTP Connection Failures
```bash
# Test SMTP connection
curl http://localhost:5000/api/email/test-connection

# Check logs
npm run logs
# or
pm2 logs
```

#### High Memory Usage
```bash
# Check PM2 memory usage
pm2 monit

# Restart if needed
pm2 restart hexsyn-server
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in .env
```

#### Docker Issues
```bash
# Check container logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up --build -d
```

### Log Analysis
```bash
# Monitor real-time logs
tail -f logs/combined.log

# Search for errors
grep "ERROR" logs/combined.log

# Check access patterns
grep "POST /api/email" logs/access.log
```

## 🔄 CI/CD Pipeline

### GitHub Actions
The included workflow (`.github/workflows/deploy.yml`) provides:
- Automated testing
- Docker image building
- Deployment automation
- Environment-specific deployments

### Manual Deployment Steps
1. Test locally: `npm run dev`
2. Run tests: `npm test`
3. Build Docker image: `npm run docker:build`
4. Deploy: `npm run deploy`
5. Verify: Check health endpoint
6. Monitor: Watch logs and metrics

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Monitor disk space and logs
- [ ] Review performance metrics
- [ ] Test backup and recovery procedures

### Emergency Procedures
1. **Service Down**: Check health endpoint, restart service
2. **High Error Rate**: Check logs, rollback if needed
3. **Memory Issues**: Restart service, investigate memory leaks
4. **SMTP Issues**: Verify credentials, check provider status

## 📚 Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

For questions or issues, please check the logs first, then consult this guide. If problems persist, review the application logs and monitoring dashboards for more detailed information.
