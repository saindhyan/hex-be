# 🚀 Vercel Deployment Guide

Deploy your HexSyn Server to Vercel with serverless functions for automatic scaling and global edge distribution.

## 🎯 Quick Deployment

### Method 1: Vercel CLI (Recommended)

**For Windows PowerShell Issues:**
If you get execution policy errors, run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Then install and deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run vercel:deploy
```

**Alternative for Windows:**
```cmd
# Use Command Prompt instead of PowerShell
npm install -g vercel
vercel login
vercel --prod
```

### Method 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically deploy

## ⚙️ Configuration

### Environment Variables
Set these in your Vercel dashboard or via CLI:

```bash
# Required Environment Variables
vercel env add NODE_ENV production
vercel env add FRONTEND_URL https://your-frontend-domain.com
vercel env add SMTP_HOST smtp.sendgrid.net
vercel env add SMTP_PORT 587
vercel env add SMTP_USER apikey
vercel env add SMTP_PASS your-sendgrid-api-key
vercel env add FROM_NAME "HexSyn DataLabs Team"
vercel env add FROM_EMAIL noreply@hexsyndatalabs.com
vercel env add REPLY_TO_EMAIL support@hexsyndatalabs.com
vercel env add ADMIN_EMAIL admin@hexsyndatalabs.com
vercel env add JWT_SECRET your-super-secure-jwt-secret
```

### Custom Domain
```bash
# Add custom domain
vercel domains add your-domain.com
vercel alias set your-deployment-url.vercel.app your-domain.com
```

## 📁 Project Structure for Vercel

```
hex-be/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── index.js          # Main application
│   └── ...               # Other source files
├── vercel.json           # Vercel configuration
└── .vercelignore         # Files to ignore during deployment
```

## 🔧 Vercel Configuration (`vercel.json`)

The configuration includes:
- **Serverless Functions**: Automatic scaling based on traffic
- **Edge Locations**: Global distribution for low latency
- **Build Optimization**: Efficient builds with caching
- **Custom Routes**: API routing configuration

## 🚀 Deployment Commands

```bash
# Development (local testing)
npm run vercel:dev

# Preview deployment (staging)
npm run vercel:preview

# Production deployment
npm run vercel:deploy
```

## 🌐 Vercel Features

### Automatic Benefits
- **Global CDN**: Worldwide edge locations
- **Auto-scaling**: Handles traffic spikes automatically
- **Zero Configuration**: Works out of the box
- **HTTPS**: Automatic SSL certificates
- **Git Integration**: Deploy on every push

### Performance Optimizations
- **Cold Start Optimization**: Fast function initialization
- **Edge Caching**: Intelligent caching at edge locations
- **Compression**: Automatic gzip compression
- **HTTP/2**: Modern protocol support

## 📊 Monitoring & Analytics

### Vercel Dashboard
- Real-time function invocations
- Performance metrics
- Error tracking
- Build logs

### Custom Monitoring
```javascript
// Add to your routes for better monitoring
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 🔒 Security on Vercel

### Environment Variables
- Stored securely and encrypted
- Not exposed in client-side code
- Can be set per environment (development, preview, production)

### Rate Limiting
Vercel provides built-in DDoS protection, but you can add custom rate limiting:

```javascript
// Enhanced rate limiting for Vercel
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.VERCEL ? 50 : 100, // Lower limit on serverless
  message: 'Too many requests from this IP'
});
```

## 🐛 Troubleshooting

### Common Issues

#### Function Timeout
```json
// In vercel.json, increase timeout
{
  "functions": {
    "src/index.js": {
      "maxDuration": 30
    }
  }
}
```

#### Environment Variables Not Loading
```bash
# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

#### CORS Issues
```javascript
// Update CORS configuration for Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app',
  'https://your-custom-domain.com',
  process.env.FRONTEND_URL
].filter(Boolean);
```

#### Cold Start Performance
```javascript
// Optimize for cold starts
if (process.env.VERCEL) {
  // Minimize initialization code
  // Use connection pooling
  // Cache frequently used data
}
```

## 📈 Scaling Considerations

### Function Limits
- **Execution Time**: 30 seconds max (can be increased on Pro plans)
- **Memory**: 1GB default (configurable)
- **Payload Size**: 4.5MB request/response limit

### Database Connections
```javascript
// Use connection pooling for databases
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## 🔄 CI/CD with Vercel

### GitHub Actions Integration
```yaml
# .github/workflows/vercel.yml
name: Vercel Production Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches:
      - main
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 💡 Best Practices

### Code Organization
- Keep serverless functions lightweight
- Use middleware efficiently
- Implement proper error handling
- Cache static data when possible

### Performance
- Minimize cold start time
- Use appropriate memory allocation
- Implement connection pooling
- Optimize bundle size

### Monitoring
- Use Vercel Analytics
- Implement custom logging
- Set up error tracking
- Monitor function performance

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 Deployment Checklist

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Set environment variables in Vercel dashboard
- [ ] Test locally: `npm run vercel:dev`
- [ ] Deploy to production: `npm run vercel:deploy`
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and analytics
- [ ] Test all API endpoints
- [ ] Verify email functionality

Your HexSyn Server is now ready for Vercel deployment with automatic scaling and global distribution! 🚀
