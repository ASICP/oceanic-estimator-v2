# Replit Safe Deployment Guide

To ensure your Replit instance stays perfectly synced with GitHub and avoids "configuration drift" (where Replit tries to auto-reconfigure your project), follow these strict deployment steps.

## The Golden Rule
**Treat Replit as Read-Only.** Do not make code edits directly in Replit if you are properly managing the project locally. Always push from your local machine, then pull into Replit.

## How to Pull Safely (Preventing Drift)

Replit has a habit of modifying configuration files (like `.replit`, `replit.nix`, or `package-lock.json`) automatically. This causes merge conflicts when you try to pull.

To force Replit to accept your GitHub version as the absolute truth, run these commands in the **Replit Shell**:

### Option 1: The "Hard Reset" (Recommended)
This calculates the difference between Replit and GitHub, deletes *all* local Replit changes, and makes it an exact mirror of your main branch.

```bash
git fetch --all
git reset --hard origin/main
npm install
npm run dev
```

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
