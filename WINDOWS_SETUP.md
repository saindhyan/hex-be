# Windows PowerShell Setup for Vercel

## 🔧 Fix PowerShell Execution Policy

### Option 1: Enable PowerShell Scripts (Recommended)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 2: Bypass for Current Session
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Option 3: Use Command Prompt Instead
Open **Command Prompt** (cmd) and run:
```cmd
npm install -g vercel
vercel login
vercel --prod
```

### Option 4: Use npx (No Global Install)
```powershell
npx vercel login
npx vercel --prod
```

## 🚀 Alternative Deployment Methods for Windows

### Method 1: GitHub Integration (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically deploy

### Method 2: Use WSL (Windows Subsystem for Linux)
```bash
# In WSL terminal
npm install -g vercel
vercel login
vercel --prod
```

### Method 3: Use Docker Desktop
```powershell
# These should work without execution policy issues
npm run docker:build
npm run docker:run
```

### Method 4: Use PM2 with Node.js
```powershell
npm install -g pm2
npm run pm2:start
```

## 🔍 Verify Installation

After fixing the execution policy:
```powershell
vercel --version
vercel login
```

## 🛠️ Troubleshooting

### If execution policy still doesn't work:
1. **Use Git Bash** (comes with Git for Windows)
2. **Use Windows Terminal** with Command Prompt profile
3. **Use VS Code integrated terminal** set to Command Prompt
4. **Use the GitHub integration method** (no CLI needed)

### Check current execution policy:
```powershell
Get-ExecutionPolicy -List
```

### Reset to default (if needed):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Default -Scope CurrentUser
```
