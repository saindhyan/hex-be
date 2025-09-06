# 🔐 GitHub Secrets Setup Guide

## The Issue
Pipeline fails with: `Error: Input required and not supplied: vercel-token`

## 🚀 Quick Solutions

### Option 1: Add GitHub Secrets (Recommended)
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

```
Name: VERCEL_TOKEN
Value: [Get from vercel.com/account/tokens]

Name: VERCEL_ORG_ID  
Value: [Get from vercel link command]

Name: VERCEL_PROJECT_ID
Value: [Get from vercel link command]
```

### Option 2: Use Test-Only Pipeline
Rename `.github/workflows/test-only.yml` to `deploy.yml`:
- Runs tests only
- No deployment (manual deployment needed)
- No secrets required

### Option 3: Manual Deployment (Simplest)
Skip GitHub Actions entirely:
```bash
# Deploy manually
vercel --prod
```

## 🔧 Getting Vercel Secrets

### Step 1: Get VERCEL_TOKEN
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Copy the token value

### Step 2: Get ORG_ID and PROJECT_ID
```bash
# In your project directory
vercel link

# This will show:
# Linked to your-org/your-project (created .vercel folder)
```

Check `.vercel/project.json` for the IDs:
```json
{
  "orgId": "your-org-id-here",
  "projectId": "your-project-id-here"
}
```

## 🎯 Current Pipeline Status

**Fixed Pipelines Available:**
- `simple-deploy.yml` - Now handles missing secrets gracefully
- `test-only.yml` - Tests only, no deployment
- `deploy.yml` - Full pipeline (needs secrets)

## 🚀 Recommended Approach

1. **For now**: Use manual deployment (`vercel --prod`)
2. **Later**: Add secrets for automated deployment
3. **Alternative**: Use Vercel's GitHub integration (no Actions needed)

### Vercel GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **Import Project**
4. Select your repository
5. Auto-deploys on every push (no secrets needed)

This bypasses GitHub Actions entirely and is often the easiest solution!
