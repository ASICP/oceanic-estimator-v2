# Echo RAG Calculator - Replit Setup Guide

**Version:** 2.0
**Date:** November 30, 2025
**Platform:** Replit (Node.js + React Full-Stack Template)

---

## 📋 Table of Contents

1. [Replit Project Setup](#replit-project-setup)
2. [Project Structure](#project-structure)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup (Neon/Supabase)](#database-setup)
5. [Backend API Setup](#backend-api-setup)
6. [Frontend React Setup](#frontend-react-setup)
7. [Deployment Checklist](#deployment-checklist)

---

## 🚀 Replit Project Setup

### Step 1: Create New Repl

1. Go to [Replit.com](https://replit.com)
2. Click **"+ Create Repl"**
3. Select **"Node.js"** template (we'll add React manually for better control)
4. Name: `echo-rag-calculator`
5. Click **"Create Repl"**

### Step 2: Initial Setup

In the Replit shell, run:

```bash
# Initialize project
npm init -y

# Install backend dependencies
npm install express cors dotenv pg prisma
npm install --save-dev nodemon

# Install frontend dependencies (we'll use Vite)
npm install -D vite @vitejs/plugin-react
npm install react react-dom react-router-dom

# Install UI libraries
npm install tailwindcss postcss autoprefixer
npm install recharts react-hook-form zustand

# Install export libraries
npm install jspdf xlsx

# Initialize Tailwind
npx tailwindcss init -p

# Initialize Prisma
npx prisma init
```

---

## 📁 Project Structure

Create this exact structure in your Repl:

```
echo-rag-calculator/
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── prisma/
│   └── schema.prisma             # Database schema (Prisma format)
├── server/                       # Backend (Express API)
│   ├── index.js                  # Express server entry point
│   ├── routes/
│   │   ├── calculator.js         # POST /api/calculate
│   │   ├── scenarios.js          # Scenario CRUD
│   │   ├── competitors.js        # Competitor data
│   │   └── exports.js            # PDF/Excel exports
│   ├── controllers/
│   │   ├── pricingController.js  # Pricing logic
│   │   └── cogsController.js     # COGS calculations
│   ├── lib/
│   │   └── pricing-engine.js     # Core calculation engine (our existing file)
│   └── middleware/
│       ├── auth.js               # JWT auth middleware
│       └── rbac.js               # Role-based access control
├── client/                       # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Main app component
│   │   ├── store/
│   │   │   └── calculatorStore.js # Zustand state management
│   │   ├── pages/
│   │   │   ├── Step1ProductSelection.jsx
│   │   │   ├── Step2TeamConfiguration.jsx
│   │   │   ├── Step3UsageBuilder.jsx
│   │   │   ├── Step4Analysis.jsx
│   │   │   └── Step5Simulate.jsx
│   │   ├── components/
│   │   │   ├── PricingSidebar.jsx
│   │   │   ├── TierRecommendation.jsx
│   │   │   ├── CompetitorComparison.jsx
│   │   │   ├── ROICalculator.jsx
│   │   │   ├── MigrationCalculator.jsx
│   │   │   ├── GrowthProjection.jsx
│   │   │   └── ExportButtons.jsx
│   │   ├── hooks/
│   │   │   └── useCalculator.js  # Custom hook for API calls
│   │   └── styles/
│   │       └── index.css         # Tailwind imports
│   └── public/
│       └── assets/
│           └── logos/            # Connector logos, etc.
└── README.md
```

### Create the Structure

Run this in Replit shell:

```bash
# Backend
mkdir -p server/routes server/controllers server/lib server/middleware

# Frontend
mkdir -p client/src/pages client/src/components client/src/hooks client/src/store client/src/styles client/public/assets/logos
```

---

## 🔧 Environment Configuration

### `.env` File

Create `.env` in the root:

```env
# Database (Neon PostgreSQL - Free tier)
DATABASE_URL="postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/echo_calculator?sslmode=require"

# Server
NODE_ENV=development
PORT=3000
API_PORT=3001

# JWT Auth (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_secret_key_here

# CORS
ALLOWED_ORIGINS=https://your-repl-name.your-username.repl.co

# Optional: Email (SendGrid)
SENDGRID_API_KEY=optional_for_later

# Optional: PDF Generation
PDF_TEMPLATE_PATH=./templates
```

### `.gitignore`

```
node_modules/
.env
dist/
.replit
.upm/
```

---

## 🗄️ Database Setup

### Option 1: Neon (Recommended for Replit - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier: 0.5GB storage, perfect for this)
3. Create new project: `echo-calculator`
4. Copy connection string to `.env`

### Option 2: Supabase (Alternative)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy to `.env`

### Prisma Schema Setup

**File: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model PricingTier {
  tierId                 String   @id @map("tier_id")
  tierName               String   @map("tier_name")
  deploymentType         String   @map("deployment_type")
  monthlyPrice           Decimal? @map("monthly_price") @db.Decimal(10, 2)
  annualPrice            Decimal? @map("annual_price") @db.Decimal(10, 2)
  annualDiscountPercent  Decimal? @map("annual_discount_percent") @db.Decimal(5, 2)
  usersMin               Int?     @map("users_min")
  usersMax               Int?     @map("users_max")
  connectorsIncluded     Int?     @map("connectors_included")
  storageGbIncluded      Int?     @map("storage_gb_included")
  monthlyQueriesIncluded Int?     @map("monthly_queries_included")

  // Features
  hybridSearch           Boolean  @default(true) @map("hybrid_search")
  permissionAwareRag     Boolean  @default(true) @map("permission_aware_rag")
  voiceInterface         Boolean  @default(true) @map("voice_interface")
  visualSearch           Boolean  @default(true) @map("visual_search")
  advancedAnalytics      Boolean  @default(false) @map("advanced_analytics")
  dedicatedCsm           Boolean  @default(false) @map("dedicated_csm")
  customConnectorsIncl   Int      @default(0) @map("custom_connectors_included")
  ssoSaml                Boolean  @default(false) @map("sso_saml")
  airGapDeployment       Boolean  @default(false) @map("air_gap_deployment")

  // Support
  supportLevel           String?  @map("support_level")
  slaUptimePercent       Decimal? @map("sla_uptime_percent") @db.Decimal(5, 2)

  // Metadata
  active                 Boolean  @default(true)
  createdAt              DateTime @default(now()) @map("created_at")
  updatedAt              DateTime @updatedAt @map("updated_at")

  // Relations
  scenarios              CalculatorScenario[]
  cogsStructure          CogsStructure[]

  @@map("pricing_tiers")
}

model UsagePricing {
  pricingId       Int      @id @default(autoincrement()) @map("pricing_id")
  resourceType    String   @map("resource_type")
  resourceName    String   @map("resource_name")
  pricePerUnit    Decimal  @map("price_per_unit") @db.Decimal(10, 4)
  unitName        String?  @map("unit_name")
  appliesToTiers  String[] @map("applies_to_tiers")
  effectiveDate   DateTime @map("effective_date") @db.Date
  endDate         DateTime? @map("end_date") @db.Date
  notes           String?
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("usage_pricing")
}

model CogsStructure {
  cogsId            Int          @id @default(autoincrement()) @map("cogs_id")
  costCategory      String       @map("cost_category")
  costSubcategory   String?      @map("cost_subcategory")
  costPerUnit       Decimal      @map("cost_per_unit") @db.Decimal(10, 4)
  unitName          String?      @map("unit_name")
  tierId            String?      @map("tier_id")
  userCountBracket  String?      @map("user_count_bracket")
  effectiveDate     DateTime     @map("effective_date") @db.Date
  endDate           DateTime?    @map("end_date") @db.Date
  notes             String?
  createdAt         DateTime     @default(now()) @map("created_at")
  updatedAt         DateTime     @updatedAt @map("updated_at")

  tier              PricingTier? @relation(fields: [tierId], references: [tierId])

  @@map("cogs_structure")
}

model CompetitorPricing {
  competitorId         Int       @id @default(autoincrement()) @map("competitor_id")
  competitorKey        String    @unique @map("competitor_key")
  competitorName       String    @map("competitor_name")
  annualCostEstimate   Decimal   @map("annual_cost_estimate") @db.Decimal(10, 2)
  usageAssumptions     Json?     @map("usage_assumptions")
  connectorsCount      Int?      @map("connectors_count")
  voiceInterface       Boolean   @default(false) @map("voice_interface")
  visualSearch         Boolean   @default(false) @map("visual_search")
  selfHostedOption     Boolean   @default(false) @map("self_hosted_option")
  managedSaasOption    Boolean   @default(true) @map("managed_saas_option")
  vendorLockIn         String?   @map("vendor_lock_in")
  strengths            Json?
  weaknesses           Json?
  dataSource           String?   @map("data_source")
  lastVerifiedDate     DateTime  @map("last_verified_date") @db.Date
  lastUpdatedBy        String?   @map("last_updated_by")
  verificationNotes    String?   @map("verification_notes")
  pricingPageUrl       String?   @map("pricing_page_url")
  scrapeEnabled        Boolean   @default(false) @map("scrape_enabled")
  scrapeFrequencyDays  Int       @default(90) @map("scrape_frequency_days")
  lastScrapedDate      DateTime? @map("last_scraped_date") @db.Date
  active               Boolean   @default(true)
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  // Relations
  history              CompetitorPricingHistory[]
  validationQueue      PricingValidationQueue[]
  migrations           MigrationAnalysis[]

  @@map("competitor_pricing")
}

model CompetitorPricingHistory {
  historyId          Int                 @id @default(autoincrement()) @map("history_id")
  competitorId       Int                 @map("competitor_id")
  annualCostEstimate Decimal             @map("annual_cost_estimate") @db.Decimal(10, 2)
  changeAmount       Decimal?            @map("change_amount") @db.Decimal(10, 2)
  changePercent      Decimal?            @map("change_percent") @db.Decimal(5, 2)
  changeReason       String?             @map("change_reason")
  effectiveDate      DateTime            @map("effective_date") @db.Date
  recordedBy         String?             @map("recorded_by")
  createdAt          DateTime            @default(now()) @map("created_at")

  competitor         CompetitorPricing   @relation(fields: [competitorId], references: [competitorId], onDelete: Cascade)

  @@map("competitor_pricing_history")
}

model PricingValidationQueue {
  queueId         Int                @id @default(autoincrement()) @map("queue_id")
  competitorId    Int                @map("competitor_id")
  validationType  String?            @map("validation_type")
  priority        String?
  currentPrice    Decimal?           @map("current_price") @db.Decimal(10, 2)
  reportedPrice   Decimal?           @map("reported_price") @db.Decimal(10, 2)
  priceDifference Decimal?           @map("price_difference") @db.Decimal(10, 2)
  source          String?
  sourceDetails   String?            @map("source_details")
  status          String?
  assignedTo      String?            @map("assigned_to")
  reviewedBy      String?            @map("reviewed_by")
  reviewNotes     String?            @map("review_notes")
  createdAt       DateTime           @default(now()) @map("created_at")
  reviewedAt      DateTime?          @map("reviewed_at")

  competitor      CompetitorPricing  @relation(fields: [competitorId], references: [competitorId], onDelete: Cascade)

  @@map("pricing_validation_queue")
}

model CalculatorScenario {
  scenarioId          Int                 @id @default(autoincrement()) @map("scenario_id")
  scenarioName        String?             @map("scenario_name")
  tierId              String              @map("tier_id")
  deploymentType      String?             @map("deployment_type")
  billingPeriod       String?             @map("billing_period")
  companyName         String?             @map("company_name")
  companySize         String?             @map("company_size")
  industry            String?
  useCases            Json?               @map("use_cases")
  numUsers            Int?                @map("num_users")
  numConnectors       Int?                @map("num_connectors")
  storageGb           Decimal?            @map("storage_gb") @db.Decimal(10, 2)
  monthlyQueries      Int?                @map("monthly_queries")
  voicePercentage     Decimal?            @map("voice_percentage") @db.Decimal(5, 2)
  visualPercentage    Decimal?            @map("visual_percentage") @db.Decimal(5, 2)
  addonsSelected      Json?               @map("addons_selected")
  customConnectorsCount Int?              @default(0) @map("custom_connectors_count")
  advancedOptions     Json?               @map("advanced_options")
  monthlyCost         Decimal?            @map("monthly_cost") @db.Decimal(10, 2)
  annualCost          Decimal?            @map("annual_cost") @db.Decimal(10, 2)
  monthlyCogs         Decimal?            @map("monthly_cogs") @db.Decimal(10, 2)
  annualCogs          Decimal?            @map("annual_cogs") @db.Decimal(10, 2)
  grossMarginPercent  Decimal?            @map("gross_margin_percent") @db.Decimal(5, 2)
  createdBy           String?             @map("created_by")
  createdForProspect  String?             @map("created_for_prospect")
  crmOpportunityId    String?             @map("crm_opportunity_id")
  shareToken          String?             @unique @map("share_token")
  isPublic            Boolean             @default(false) @map("is_public")
  expiresAt           DateTime?           @map("expires_at")
  createdAt           DateTime            @default(now()) @map("created_at")
  updatedAt           DateTime            @updatedAt @map("updated_at")

  tier                PricingTier         @relation(fields: [tierId], references: [tierId])
  migrations          MigrationAnalysis[]

  @@map("calculator_scenarios")
}

model MigrationAnalysis {
  migrationId          Int                 @id @default(autoincrement()) @map("migration_id")
  scenarioId           Int?                @map("scenario_id")
  currentProviderId    Int                 @map("current_provider_id")
  currentAnnualCost    Decimal?            @map("current_annual_cost") @db.Decimal(10, 2)
  currentDataSources   Int?                @map("current_data_sources")
  currentStorageGb     Decimal?            @map("current_storage_gb") @db.Decimal(10, 2)
  currentUsers         Int?                @map("current_users")
  planningCost         Decimal?            @map("planning_cost") @db.Decimal(10, 2)
  dataExportCost       Decimal?            @map("data_export_cost") @db.Decimal(10, 2)
  echoSetupCost        Decimal?            @map("echo_setup_cost") @db.Decimal(10, 2)
  testingCost          Decimal?            @map("testing_cost") @db.Decimal(10, 2)
  trainingCost         Decimal?            @map("training_cost") @db.Decimal(10, 2)
  cutoverCost          Decimal?            @map("cutover_cost") @db.Decimal(10, 2)
  totalMigrationCost   Decimal?            @map("total_migration_cost") @db.Decimal(10, 2)
  migrationWeeks       Int?                @default(7) @map("migration_weeks")
  echoAnnualCost       Decimal?            @map("echo_annual_cost") @db.Decimal(10, 2)
  annualSavings        Decimal?            @map("annual_savings") @db.Decimal(10, 2)
  paybackMonths        Decimal?            @map("payback_months") @db.Decimal(5, 2)
  year1NetSavings      Decimal?            @map("year1_net_savings") @db.Decimal(10, 2)
  year2NetSavings      Decimal?            @map("year2_net_savings") @db.Decimal(10, 2)
  year3NetSavings      Decimal?            @map("year3_net_savings") @db.Decimal(10, 2)
  threeYearSavings     Decimal?            @map("three_year_savings") @db.Decimal(10, 2)
  migrationPlanJson    Json?               @map("migration_plan_json")
  createdAt            DateTime            @default(now()) @map("created_at")

  scenario             CalculatorScenario? @relation(fields: [scenarioId], references: [scenarioId], onDelete: Cascade)
  currentProvider      CompetitorPricing   @relation(fields: [currentProviderId], references: [competitorId])

  @@map("migration_analyses")
}

model AccessControl {
  userId                    Int      @id @default(autoincrement()) @map("user_id")
  email                     String   @unique
  userRole                  String   @map("user_role")
  canViewInternalMargins    Boolean  @default(false) @map("can_view_internal_margins")
  canViewCogs               Boolean  @default(false) @map("can_view_cogs")
  canEditCompetitorData     Boolean  @default(false) @map("can_edit_competitor_data")
  canEditPricing            Boolean  @default(false) @map("can_edit_pricing")
  active                    Boolean  @default(true)
  createdAt                 DateTime @default(now()) @map("created_at")
  updatedAt                 DateTime @updatedAt @map("updated_at")

  @@map("access_control")
}
```

### Deploy Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Seed data (we'll create this next)
node prisma/seed.js
```

---

## 🔌 Backend API Setup

### File: `server/index.js`

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/calculator', require('./routes/calculator'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/competitors', require('./routes/competitors'));
app.use('/api/exports', require('./routes/exports'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✓ Echo RAG Calculator API running on port ${PORT}`);
});
```

### File: `server/lib/pricing-engine.js`

Copy our existing `echo-pricing-engine.js` file here.

### File: `server/routes/calculator.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  determineTier,
  performFullPricingAnalysis,
  calculateROI,
  calculateMigration,
  project5Year
} = require('../lib/pricing-engine');

// POST /api/calculator/analyze
router.post('/analyze', async (req, res) => {
  try {
    const config = req.body;

    // Auto-determine tier if not provided
    if (!config.tierId) {
      config.tierId = determineTier(config);
    }

    const analysis = performFullPricingAnalysis(config);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/calculator/migration
router.post('/migration', async (req, res) => {
  try {
    const { competitorKey, currentAnnualCost, echoAnnualCost } = req.body;

    const migration = calculateMigration(
      competitorKey,
      currentAnnualCost,
      echoAnnualCost
    );

    res.json({
      success: true,
      data: migration
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/calculator/5year
router.post('/5year', async (req, res) => {
  try {
    const { config, growthRate } = req.body;

    const projection = project5Year(config, growthRate || 40);

    res.json({
      success: true,
      data: projection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

---

## ⚛️ Frontend React Setup

### File: `client/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

### File: `client/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### File: `client/src/App.jsx`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Step1ProductSelection from './pages/Step1ProductSelection';
import Step2TeamConfiguration from './pages/Step2TeamConfiguration';
import Step3UsageBuilder from './pages/Step3UsageBuilder';
import Step4Analysis from './pages/Step4Analysis';
import Step5Simulate from './pages/Step5Simulate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Step1ProductSelection />} />
          <Route path="/step2" element={<Step2TeamConfiguration />} />
          <Route path="/step3" element={<Step3UsageBuilder />} />
          <Route path="/step4" element={<Step4Analysis />} />
          <Route path="/step5" element={<Step5Simulate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

## 📦 Package.json Scripts

Update `package.json`:

```json
{
  "name": "echo-rag-calculator",
  "version": "2.0.0",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server/index.js",
    "client": "vite --config client/vite.config.js",
    "build": "vite build --config client/vite.config.js",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "test": "node echo-pricing-engine.test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "@prisma/client": "^5.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.3",
    "react-hook-form": "^7.48.2",
    "zustand": "^4.4.7",
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "prisma": "^5.6.0",
    "nodemon": "^3.0.2",
    "concurrently": "^8.2.2",
    "vite": "^5.0.4",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.5",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## ✅ Deployment Checklist

### 1. Database
- [ ] Neon/Supabase account created
- [ ] Database connection string added to `.env`
- [ ] Prisma schema pushed (`npx prisma db push`)
- [ ] Seed data loaded

### 2. Backend
- [ ] All dependencies installed
- [ ] `pricing-engine.js` copied to `server/lib/`
- [ ] API routes created
- [ ] Server starts without errors (`npm run server`)

### 3. Frontend
- [ ] Tailwind configured
- [ ] All page components created
- [ ] State management (Zustand) set up
- [ ] Client starts without errors (`npm run client`)

### 4. Replit Configuration
- [ ] `.replit` file configured to run `npm run dev`
- [ ] Environment variables set in Secrets
- [ ] Webview configured for port 3000

### 5. Testing
- [ ] API health check works (`/api/health`)
- [ ] Pricing calculation works (`POST /api/calculator/analyze`)
- [ ] Frontend loads on port 3000
- [ ] All 5 steps navigate correctly

---

## 🎯 Next: Component Wireframes

See `COMPONENT_WIREFRAMES.md` for detailed specs of each React component.

---

**Ready to build!** 🚀
