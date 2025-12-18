# Dolphin v2 - Local Quick Start

This guide explains how to run the Dolphin Estimator locally for development and testing.

> **Note:** The `app` folder is a self-contained local environment. Changes you make here should be synced back to `files/dolphin-pricing-engine.js` if they affect the core logic.

## Prerequisites

- Node.js (v18+)
- npm

## Setup

1. Navigate to the app directory:
   ```bash
   cd dolphin-v2/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally

Start the server:

```bash
npm start
```

- **Frontend:** Open [http://localhost:3000](http://localhost:3000) in your browser.
- **API:** Available at `http://localhost:3000/api/calculate`.

## Files Structure

- `server/lib/dolphin-pricing-engine.js`: **Core Logic** (Copied from `../../files/`).
- `server/index.js`: Simple Express server.
- `public/index.html`: Vue.js Single File Application (No build step required).

## Deployment to Replit

When you are ready to deploy to Replit:
1. Copy the contents of `dolphin-v2/files` to your Replit project.
2. Follow the setup similar to Echo v2 (creating a server script and frontend).
3. **Important:** The `dolphin-v2/app` folder is for local testing only and its specific server code is not intended for production usage without adaptation (e.g., adding security, database persistence).
