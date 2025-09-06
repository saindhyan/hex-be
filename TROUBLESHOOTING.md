# 🔧 Troubleshooting Guide

## Windows OneDrive Permission Issues

### Problem: npm ci fails with EPERM error
```
Error: EPERM: operation not permitted, rmdir 'node_modules\.bin'
```

This happens because OneDrive syncs files and can lock them during npm operations.

## Solutions (Try in Order)

### Solution 1: Close All Programs and Retry
```bash
# Close VS Code, any terminals, and file explorers
# Wait 30 seconds, then try:
npm ci
```

### Solution 2: Clear npm Cache
```bash
npm cache clean --force
rmdir /s node_modules
npm install
```

### Solution 3: Run as Administrator
1. Right-click Command Prompt → "Run as Administrator"
2. Navigate to your project:
```cmd
cd "C:\Users\piyus\OneDrive\Documents\hex-be"
npm ci
```

### Solution 4: Disable OneDrive Sync Temporarily
1. Right-click OneDrive icon in system tray
2. Click "Pause syncing" → "2 hours"
3. Run npm commands
4. Re-enable syncing when done

### Solution 5: Move Project Outside OneDrive (Recommended)
```cmd
# Create new folder outside OneDrive
mkdir C:\Projects
xcopy "C:\Users\piyus\OneDrive\Documents\hex-be" "C:\Projects\hex-be" /E /I

# Work from new location
cd C:\Projects\hex-be
npm ci
```

### Solution 6: Use Docker (Bypasses npm issues)
```bash
# Build and run with Docker instead
npm run docker:build
npm run docker:run
```

### Solution 7: Deploy Without Local Build
Use GitHub integration for Vercel:
1. Push code to GitHub
2. Deploy directly from Vercel dashboard
3. No local npm ci needed

## Alternative Commands

If npm ci keeps failing, use:
```bash
# Instead of npm ci, use:
npm install --production

# Or for development:
npm install
```

## Prevention Tips

1. **Work outside OneDrive** for Node.js projects
2. **Use Docker** for consistent environments
3. **Use cloud deployments** (Vercel, Railway) that don't need local builds
4. **Exclude node_modules** from OneDrive sync
