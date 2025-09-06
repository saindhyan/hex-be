# 🔄 CI/CD Pipeline Setup Guide

## GitHub Actions Configuration

The pipeline has been optimized with the following improvements:

### 🔧 Pipeline Features

#### **Test Job**
- ✅ Updated to latest GitHub Actions (v4)
- ✅ Health check validation
- ✅ Runs on both push and pull requests
- ✅ Uses `npm install` instead of `npm ci` (OneDrive compatibility)

#### **Build Job**
- ✅ Only runs on main/master branch pushes
- ✅ Docker image building and testing
- ✅ Container health validation
- ✅ Artifact upload with retention

#### **Deploy Jobs**
- ✅ **Vercel Deploy**: Automatic serverless deployment
- ✅ **Docker Deploy**: Container-based deployment options

## 🔐 Required GitHub Secrets

### For Vercel Deployment
Add these secrets in your GitHub repository settings:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

**How to get these values:**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a new token → Copy `VERCEL_TOKEN`
3. Run `vercel link` in your project → Get org and project IDs

### For Other Platforms (Optional)
```
RAILWAY_TOKEN=your-railway-token
DO_TOKEN=your-digitalocean-token
```

## 🚀 Pipeline Workflow

### On Pull Request:
1. **Test** → Runs health checks and validation

### On Push to main/master:
1. **Test** → Health checks and validation
2. **Build** → Docker image creation and testing
3. **Deploy-Vercel** → Serverless deployment
4. **Deploy-Docker** → Container deployment (if configured)

## 📋 Setup Checklist

- [ ] Push code to GitHub repository
- [ ] Enable GitHub Actions in repository settings
- [ ] Add required secrets for your deployment platform
- [ ] Create production environment in GitHub (Settings → Environments)
- [ ] Test pipeline with a commit to main branch

## 🔧 Customization

### Enable Different Deployment Targets

**For Railway:**
```yaml
# Uncomment and configure Railway deployment in deploy.yml
- name: Deploy to Railway
  run: railway deploy
```

**For DigitalOcean:**
```yaml
# Add DigitalOcean App Platform deployment
- name: Deploy to DigitalOcean
  run: doctl apps create --spec .do/app.yaml
```

### Environment-Specific Deployments

The pipeline supports:
- **Development**: Auto-deploy from `develop` branch
- **Staging**: Auto-deploy from `staging` branch  
- **Production**: Auto-deploy from `main`/`master` branch

## 🐛 Troubleshooting

### Common Issues

**Pipeline fails on npm install:**
- Pipeline uses `npm install` instead of `npm ci` for Windows compatibility

**Docker build fails:**
- Check Dockerfile syntax
- Ensure all required files are not in `.dockerignore`

**Vercel deployment fails:**
- Verify all three Vercel secrets are set correctly
- Check if Vercel project exists and is linked

**Secrets not working:**
- Ensure secrets are added to repository (not organization)
- Check secret names match exactly (case-sensitive)

## 📊 Pipeline Status

Monitor your deployments:
- **GitHub Actions tab**: See pipeline runs and logs
- **Vercel Dashboard**: Monitor serverless deployments
- **Platform dashboards**: Check deployment status on your chosen platform

The pipeline is now production-ready with multiple deployment options! 🎉
