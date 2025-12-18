# Echo RAG Calculator - API & State Management Specifications

**Version:** 2.0
**Date:** November 30, 2025

---

## 📡 API Endpoint Specifications

### Base URL
```
Development: http://localhost:3001/api
Production:  https://echo-calculator.oceanic.io/api
```

### Authentication
```http
Authorization: Bearer <jwt_token>
```

All internal endpoints (margins, COGS) require JWT authentication.

---

## 🔌 API Endpoints

### 1. Health Check

**GET** `/health`

**Description:** Server health status
**Auth Required:** No

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T12:00:00.000Z",
  "version": "2.0.0"
}
```

---

### 2. Get Pricing Tiers

**GET** `/pricing-tiers`

**Description:** Get all active pricing tiers
**Auth Required:** No

**Query Parameters:**
- `deploymentType` (optional): `managed_saas` | `self_hosted`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tierId": "starter_saas",
      "tierName": "Starter",
      "deploymentType": "managed_saas",
      "monthlyPrice": 2500,
      "annualPrice": 24000,
      "annualDiscountPercent": 20,
      "included": {
        "usersMin": 10,
        "usersMax": 50,
        "connectors": 5,
        "storageGB": 100,
        "monthlyQueries": -1
      },
      "features": {
        "hybridSearch": true,
        "voiceInterface": true,
        "visualSearch": true,
        "advancedAnalytics": false,
        "dedicatedCSM": false
      },
      "support": "email_24hr",
      "sla": 99.0
    }
  ]
}
```

---

### 3. Calculate Pricing

**POST** `/calculator/analyze`

**Description:** Perform full pricing analysis
**Auth Required:** No (client view), Yes (internal margins)

**Request Body:**
```json
{
  "tierId": "professional_saas",
  "billingPeriod": "annual",
  "deploymentType": "managed_saas",
  "users": 250,
  "connectors": 15,
  "storageGB": 850,
  "monthlyQueries": 90000,
  "voicePercentage": 15,
  "visualPercentage": 10,
  "addons": {
    "advancedAnalytics": true,
    "dedicatedCSM": false
  },
  "customConnectorsCount": 2,
  "companySize": "mid-market",
  "industry": "financial",
  "useCases": ["internal_knowledge", "customer_support", "compliance"],
  "includeInternal": false
}
```

**Response (Client View):**
```json
{
  "success": true,
  "data": {
    "tier": {
      "id": "professional_saas",
      "name": "Professional",
      "deploymentType": "managed_saas"
    },
    "pricing": {
      "monthly": {
        "subscription": 8000,
        "connectorOverage": 0,
        "storageOverage": 0,
        "addons": 2000,
        "total": 10000
      },
      "annual": {
        "subscription": 96000,
        "overages": 0,
        "addons": 24000,
        "oneTime": 30000,
        "total": 150000
      }
    },
    "roi": {
      "productivityValue": 2250000,
      "onboardingSavings": 340000,
      "efficiencyGain": 350000,
      "totalValue": 2940000,
      "investment": 150000,
      "netValue": 2790000,
      "roi": 1860,
      "paybackMonths": 0.6
    }
  }
}
```

**Response (Internal View - with `includeInternal: true`):**
```json
{
  "success": true,
  "data": {
    // ... all client view data plus:
    "cogs": {
      "monthly": {
        "infrastructure": 3728,
        "aiml": 45,
        "dataTransfer": 38,
        "support": 250,
        "monitoring": 150,
        "total": 4211
      },
      "annual": 50532
    },
    "margin": {
      "monthly": {
        "revenue": 10000,
        "cogs": 4211,
        "grossProfit": 5789,
        "grossMarginPercent": 57.89,
        "targetMargin": 82,
        "meetsTarget": false,
        "status": "below_target",
        "variance": -24.11
      },
      "annual": {
        "revenue": 150000,
        "cogs": 50532,
        "grossProfit": 99468,
        "grossMarginPercent": 66.31,
        "meetsTarget": false,
        "variance": -15.69
      }
    }
  }
}
```

---

### 4. Recommend Tier

**POST** `/calculator/recommend-tier`

**Description:** Auto-determine recommended tier
**Auth Required:** No

**Request Body:**
```json
{
  "deploymentType": "managed_saas",
  "users": 250,
  "connectors": 15,
  "storageGB": 850,
  "useCases": ["internal_knowledge", "customer_support", "compliance"],
  "industry": "financial"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendedTier": "enterprise_saas",
    "reason": "Financial services industry requires enhanced compliance features",
    "tierDetails": {
      "tierName": "Enterprise",
      "monthlyPrice": 25000,
      "features": ["SOC 2 Type II", "Dedicated CSM", "99.9% SLA"]
    },
    "alternatives": [
      {
        "tierId": "professional_saas",
        "tierName": "Professional",
        "monthlyPrice": 10000,
        "note": "Upgrade to Enterprise recommended for compliance"
      }
    ]
  }
}
```

---

### 5. Get Competitors

**GET** `/competitors`

**Description:** Get all active competitors
**Auth Required:** Yes (Sales Manager, Finance, Executive)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "competitorId": 1,
      "competitorKey": "glean",
      "competitorName": "Glean Enterprise",
      "annualCostEstimate": 290000,
      "usageAssumptions": {
        "users": 250,
        "connectors": 15,
        "storageGB": 850,
        "monthlyQueries": 90000
      },
      "connectorsCount": 70,
      "voiceInterface": false,
      "visualSearch": false,
      "strengths": ["Strong enterprise adoption", "Good search UX", "70 connectors"],
      "weaknesses": ["151% more expensive", "No voice", "No visual"],
      "lastVerifiedDate": "2025-11-30"
    }
  ]
}
```

---

### 6. Calculate Migration

**POST** `/calculator/migration`

**Description:** Calculate migration costs from competitor
**Auth Required:** No

**Request Body:**
```json
{
  "competitorKey": "glean",
  "currentAnnualCost": 290000,
  "echoAnnualCost": 150000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "competitor": "Glean Enterprise",
    "migrationCost": 55800,
    "migrationWeeks": 7,
    "breakdown": {
      "planning": 7000,
      "dataExport": 13500,
      "echoSetup": 9000,
      "testing": 10500,
      "training": 6000,
      "cutover": 9800
    },
    "currentAnnualCost": 290000,
    "echoAnnualCost": 150000,
    "annualSavings": 140000,
    "paybackMonths": 4.8,
    "year1NetSavings": 84200,
    "year2NetSavings": 140000,
    "year3NetSavings": 140000,
    "threeYearSavings": 364200
  }
}
```

---

### 7. 5-Year Projection

**POST** `/calculator/5year`

**Description:** Generate 5-year growth projection
**Auth Required:** No

**Request Body:**
```json
{
  "config": {
    "tierId": "professional_saas",
    "billingPeriod": "annual",
    "users": 250,
    "connectors": 15,
    "storageGB": 850,
    "voicePercentage": 15,
    "visualPercentage": 10,
    "addons": {
      "advancedAnalytics": true,
      "dedicatedCSM": false
    }
  },
  "growthRate": 40
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "years": [
      {
        "year": 1,
        "users": 250,
        "connectors": 15,
        "storageGB": 850,
        "tier": "professional_saas",
        "monthlyRevenue": 10000,
        "annualRevenue": 120000,
        "annualCOGS": 50532,
        "grossMargin": 57.89,
        "value": 2940000
      },
      {
        "year": 2,
        "users": 350,
        "connectors": 17,
        "storageGB": 1063,
        "tier": "professional_saas",
        "monthlyRevenue": 12400,
        "annualRevenue": 148800,
        "annualCOGS": 60240,
        "grossMargin": 59.52,
        "value": 4116000
      }
      // ... years 3, 4, 5
    ],
    "totals": {
      "investment": 1200000,
      "value": 32198000,
      "netValue": 30998000,
      "roi": 2583
    }
  }
}
```

---

### 8. Save Scenario

**POST** `/scenarios`

**Description:** Save calculator configuration
**Auth Required:** Yes

**Request Body:**
```json
{
  "scenarioName": "Acme Corp - Q4 2025 Quote",
  "companyName": "Acme Corporation",
  "createdForProspect": "john.doe@acme.com",
  "crmOpportunityId": "OPP-12345",
  "configuration": {
    "tierId": "professional_saas",
    "users": 250,
    "connectors": 15,
    // ... full config
  },
  "isPublic": false,
  "expiresAt": "2026-01-30T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scenarioId": 42,
    "shareToken": "abc123def456",
    "shareUrl": "https://echo-calculator.oceanic.io/share/abc123def456",
    "createdAt": "2025-11-30T12:00:00.000Z",
    "expiresAt": "2026-01-30T00:00:00.000Z"
  }
}
```

---

### 9. Get Scenario by Token

**GET** `/scenarios/share/:token`

**Description:** Load shared scenario
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "scenarioId": 42,
    "scenarioName": "Acme Corp - Q4 2025 Quote",
    "companyName": "Acme Corporation",
    "configuration": { /* full config */ },
    "analysis": { /* pricing analysis */ },
    "createdAt": "2025-11-30T12:00:00.000Z",
    "expiresAt": "2026-01-30T00:00:00.000Z",
    "isExpired": false
  }
}
```

---

### 10. Export PDF

**POST** `/exports/pdf`

**Description:** Generate PDF quote
**Auth Required:** No

**Request Body:**
```json
{
  "scenarioId": 42,
  "includeInternal": false,
  "includeCompetitors": true,
  "includeROI": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "https://echo-calculator.oceanic.io/exports/quote-42.pdf",
    "expiresAt": "2025-12-07T12:00:00.000Z"
  }
}
```

---

### 11. Export Excel

**POST** `/exports/excel`

**Description:** Generate Excel financial model
**Auth Required:** No (client view), Yes (with formulas/margins)

**Request Body:**
```json
{
  "scenarioId": 42,
  "includeFormulas": false,
  "include5Year": true,
  "includeInternal": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "excelUrl": "https://echo-calculator.oceanic.io/exports/model-42.xlsx",
    "expiresAt": "2025-12-07T12:00:00.000Z"
  }
}
```

---

## 🏪 State Management (Zustand)

### Store: `calculatorStore.js`

```javascript
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useCalculatorStore = create(
  persist(
    (set, get) => ({
      // ========================================
      // STATE
      // ========================================

      // User role (from auth)
      userRole: 'sales_rep', // 'sales_rep' | 'sales_manager' | 'finance' | 'executive'

      // Step 1: Product Selection
      step1Data: {
        deploymentType: 'managed_saas',
        companySize: '',
        industry: '',
        useCases: []
      },
      recommendedTier: null,

      // Step 2: Team Configuration
      step2Data: {
        users: 250,
        powerUserPercent: 20,
        growthRate: 'moderate'
      },
      calculated: {
        monthlyQueries: 0,
        powerUsers: 0,
        regularUsers: 0,
        occasionalUsers: 0
      },

      // Step 3: Usage Builder
      step3Data: {
        connectors: 15,
        storageGB: 850,
        voicePercentage: 15,
        visualPercentage: 10,
        addons: {
          advancedAnalytics: false,
          dedicatedCSM: false
        },
        customConnectorsCount: 0
      },

      // Step 4: Analysis Results
      analysis: null,

      // Step 5: Projections
      projection: null,
      migration: null,

      // Current scenario
      currentScenario: null,

      // Loading states
      isCalculating: false,
      isExporting: false,
      error: null,

      // ========================================
      // ACTIONS
      // ========================================

      // Set user role (from auth)
      setUserRole: (role) => set({ userRole: role }),

      // Step 1
      setStep1Data: (data) => {
        set({ step1Data: data });

        // Auto-recommend tier
        const tier = calculateRecommendedTier(data);
        set({ recommendedTier: tier });
      },

      // Step 2
      setStep2Data: (data) => {
        set({ step2Data: data });

        // Auto-calculate queries
        const calculated = calculateQueries(data);
        set({ calculated });
      },

      // Step 3
      setStep3Data: (data) => set({ step3Data: data }),

      // Perform full pricing analysis
      calculatePricing: async () => {
        set({ isCalculating: true, error: null });

        try {
          const { step1Data, step2Data, step3Data, recommendedTier, userRole } = get();

          // Build config
          const config = {
            tierId: recommendedTier,
            billingPeriod: 'annual',
            deploymentType: step1Data.deploymentType,
            users: step2Data.users,
            connectors: step3Data.connectors,
            storageGB: step3Data.storageGB,
            monthlyQueries: get().calculated.monthlyQueries,
            voicePercentage: step3Data.voicePercentage,
            visualPercentage: step3Data.visualPercentage,
            addons: step3Data.addons,
            customConnectorsCount: step3Data.customConnectorsCount,
            companySize: step1Data.companySize,
            industry: step1Data.industry,
            useCases: step1Data.useCases,
            includeInternal: ['finance', 'executive', 'sales_manager'].includes(userRole)
          };

          // Call API
          const response = await fetch('/api/calculator/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
          });

          const result = await response.json();

          if (result.success) {
            set({ analysis: result.data, isCalculating: false });
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set({ error: error.message, isCalculating: false });
        }
      },

      // Calculate migration
      calculateMigration: async (competitorKey, currentCost) => {
        try {
          const { analysis } = get();

          const response = await fetch('/api/calculator/migration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              competitorKey,
              currentAnnualCost: currentCost,
              echoAnnualCost: analysis.pricing.annual.total
            })
          });

          const result = await response.json();

          if (result.success) {
            set({ migration: result.data });
          }
        } catch (error) {
          set({ error: error.message });
        }
      },

      // Calculate 5-year projection
      calculate5Year: async (growthRate = 40) => {
        try {
          const { step1Data, step2Data, step3Data, recommendedTier, calculated } = get();

          const config = {
            tierId: recommendedTier,
            billingPeriod: 'annual',
            users: step2Data.users,
            connectors: step3Data.connectors,
            storageGB: step3Data.storageGB,
            voicePercentage: step3Data.voicePercentage,
            visualPercentage: step3Data.visualPercentage,
            addons: step3Data.addons
          };

          const response = await fetch('/api/calculator/5year', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config, growthRate })
          });

          const result = await response.json();

          if (result.success) {
            set({ projection: result.data });
          }
        } catch (error) {
          set({ error: error.message });
        }
      },

      // Save scenario
      saveScenario: async (scenarioName, companyName, opportunityId) => {
        try {
          const { step1Data, step2Data, step3Data, recommendedTier, analysis } = get();

          const response = await fetch('/api/scenarios', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              scenarioName,
              companyName,
              crmOpportunityId: opportunityId,
              configuration: {
                step1: step1Data,
                step2: step2Data,
                step3: step3Data,
                tier: recommendedTier
              },
              monthlyCost: analysis.pricing.monthly.total,
              annualCost: analysis.pricing.annual.total
            })
          });

          const result = await response.json();

          if (result.success) {
            set({ currentScenario: result.data });
            return result.data;
          }
        } catch (error) {
          set({ error: error.message });
        }
      },

      // Export PDF
      exportPDF: async (includeInternal = false) => {
        set({ isExporting: true });

        try {
          const { currentScenario } = get();

          const response = await fetch('/api/exports/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scenarioId: currentScenario?.scenarioId,
              includeInternal,
              includeCompetitors: true,
              includeROI: true
            })
          });

          const result = await response.json();

          if (result.success) {
            window.open(result.data.pdfUrl, '_blank');
          }

          set({ isExporting: false });
        } catch (error) {
          set({ error: error.message, isExporting: false });
        }
      },

      // Reset calculator
      reset: () => set({
        step1Data: { deploymentType: 'managed_saas', companySize: '', industry: '', useCases: [] },
        step2Data: { users: 250, powerUserPercent: 20, growthRate: 'moderate' },
        step3Data: { connectors: 15, storageGB: 850, voicePercentage: 15, visualPercentage: 10, addons: {}, customConnectorsCount: 0 },
        recommendedTier: null,
        analysis: null,
        projection: null,
        migration: null,
        currentScenario: null
      })
    }),

    {
      name: 'echo-calculator-storage', // localStorage key
      partialize: (state) => ({
        step1Data: state.step1Data,
        step2Data: state.step2Data,
        step3Data: state.step3Data
      })
    }
  )
);

// Helper functions
function calculateRecommendedTier(data) {
  if (['financial', 'healthcare', 'legal'].includes(data.industry)) {
    return 'enterprise_saas';
  }

  if (['enterprise', 'large-enterprise'].includes(data.companySize)) {
    return 'enterprise_saas';
  }

  if (data.companySize === 'mid-market' || data.useCases.length >= 3) {
    return 'professional_saas';
  }

  return 'starter_saas';
}

function calculateQueries(data) {
  const powerUsers = Math.floor(data.users * (data.powerUserPercent / 100));
  const regularUsers = Math.floor(data.users * 0.6);
  const occasionalUsers = data.users - powerUsers - regularUsers;

  const monthlyQueries =
    powerUsers * 50 * 30 +
    regularUsers * 15 * 30 +
    occasionalUsers * 3 * 30;

  return {
    monthlyQueries,
    powerUsers,
    regularUsers,
    occasionalUsers
  };
}

export default useCalculatorStore;
```

---

## 🎣 Custom Hooks

### `useCalculator.js`

```javascript
import { useEffect } from 'react';
import useCalculatorStore from '../store/calculatorStore';

export function useCalculator() {
  const store = useCalculatorStore();

  return {
    // State
    ...store,

    // Computed values
    canViewInternal: ['finance', 'executive', 'sales_manager'].includes(store.userRole),
    isConfigured: !!store.step1Data.companySize && store.step2Data.users > 0,
    hasAnalysis: !!store.analysis
  };
}

export function useAutoCalculate() {
  const { step3Data, calculatePricing } = useCalculatorStore();

  useEffect(() => {
    // Auto-recalculate when step 3 data changes
    if (step3Data.connectors > 0) {
      const debounce = setTimeout(() => {
        calculatePricing();
      }, 500);

      return () => clearTimeout(debounce);
    }
  }, [step3Data, calculatePricing]);
}
```

---

## 🔒 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message here",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "users",
    "message": "Users must be between 10 and 10,000"
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid input
- `AUTH_ERROR` - Authentication failed
- `PERMISSION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error

---

**Ready for implementation!** 🚀

All API endpoints and state management are fully specified. Copy this into your Replit project and start building!
