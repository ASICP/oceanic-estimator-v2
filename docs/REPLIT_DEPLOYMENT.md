# Replit Safe Deployment Guide

To ensure your Replit instance stays perfectly synced with GitHub and avoids "configuration drift" (where Replit tries to auto-reconfigure your project), follow these strict deployment steps.

## The Golden Rule
**Treat Replit as Read-Only.** Do not make code edits directly in Replit if you are properly managing the project locally. Always push from your local machine, then pull into Replit.

## How to Pull Safely (Preventing Drift)

Replit has a habit of modifying configuration files (like `.replit`, `replit.nix`, or `package-lock.json`) automatically. This causes merge conflicts when you try to pull.

To force Replit to accept your GitHub version as the absolute truth, run these commands in the **Replit Shell**:

### Option 1: The "Hard Reset" (Production Safe)
This sequence ensures you are running the optimized production build, not the development server.

```bash
# 1. Fetch latest code and force-match GitHub
git fetch --all
git reset --hard origin/main

# 2. Update dependencies (Critical if package.json changed)
npm install

# 3. Build & Start (Production Mode)
npm run build
npm run start
```

**Why npm install?** Even in production, you must install/update the libraries defined in `package.json` to ensure the app has the tools it needs to run.
**Why build & start?** `npm run dev` is slower and meant for editing. `npm run build` creates an optimized, high-performance version of your app, and `npm run start` serves it efficiently.

### Option 2: The UI Method
1. Open the **Tools > Git** pane in Replit.
2. If you see "Changes" listed that you didn't make (e.g., config updates), click the **Discard (Undo)** button on them.
3. Once the working tree is clean, click **Pull**.

## Why this works
We have now committed the `.replit` configuration file to the repository. This file tells Replit exactly how to build and run the project. By doing a "Hard Reset", you ensure Replit respects *your* configuration rather than guessing its own.

## Troubleshooting

**"Permission denied" or "Lock file error"**
If `npm install` fails, run:
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Address already in use (EADDRINUSE)"**
If `npm run start` fails with "address already in use", an old server process is stuck. Kill it with:
```bash
killall -9 node
# Then try starting again
npm run start
```
