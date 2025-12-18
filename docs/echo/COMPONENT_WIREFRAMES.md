# Echo RAG Calculator - Component Wireframes & Specifications

**Version:** 2.0
**Date:** November 30, 2025

This document provides detailed specifications for each React component in the 5-step workflow.

---

## 📐 Design System

### Color Palette
```css
/* Primary (Ocean Blue) */
--primary-50: #e0f2fe
--primary-100: #bae6fd
--primary-500: #0ea5e9
--primary-600: #0284c7
--primary-700: #0369a1

/* Success (Green) */
--success-500: #10b981
--success-600: #059669

/* Warning (Amber) */
--warning-500: #f59e0b
--warning-600: #d97706

/* Error (Red) */
--error-500: #ef4444
--error-600: #dc2626

/* Neutral (Gray) */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827
```

### Typography
- **Headings:** Inter font, font-semibold
- **Body:** Inter font, font-normal
- **Monospace:** Fira Code (for pricing)

---

## 🎯 Step 1: Product Selection & Scope

### Component: `Step1ProductSelection.jsx`

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    Echo RAG Calculator v2.0                     │
│                  Step 1 of 5: Product Selection                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Deployment Model *                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ☁️ Echo Enterprise │  │ 🏢 Echo Advanced  │              │
│  │  (Managed SaaS)    │  │  (Self-Hosted)    │              │
│  │  [SELECTED]        │  │                   │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  Company Size *                                                 │
│  [Dropdown: Mid-Market (200-1,000 employees) ▼]                │
│                                                                 │
│  Industry *                                                     │
│  [Dropdown: Financial Services ▼]                              │
│                                                                 │
│  Primary Use Cases * (Select all that apply)                   │
│  ☑ Internal knowledge search                                   │
│  ☑ Customer support automation                                 │
│  ☑ Research & due diligence                                    │
│  ☑ Compliance & audit                                          │
│  ☐ Developer documentation                                     │
│  ☐ Sales enablement                                            │
│  ☐ Meeting search & transcription                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📊 Recommended Tier: Enterprise                               │
│                                                                 │
│  Based on your selections (Financial Services industry with    │
│  compliance needs), we recommend the Enterprise tier for:      │
│  • Advanced security & compliance features                     │
│  • SOC 2 Type II certification                                 │
│  • Dedicated customer success manager                          │
│  • 99.9% SLA guarantee                                         │
│                                                                 │
│  [Continue to Team Configuration →]                            │
└─────────────────────────────────────────────────────────────────┘
```

#### Props & State
```typescript
interface Step1Props {
  onNext: (data: Step1Data) => void;
  initialData?: Step1Data;
}

interface Step1Data {
  deploymentType: 'managed_saas' | 'self_hosted';
  companySize: 'startup' | 'small-business' | 'mid-market' | 'enterprise' | 'large-enterprise';
  industry: string;
  useCases: string[];
}

interface Step1State {
  formData: Step1Data;
  recommendedTier: string;
  errors: Record<string, string>;
}
```

#### Component Code (Skeleton)
```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '../store/calculatorStore';

export default function Step1ProductSelection() {
  const navigate = useNavigate();
  const { step1Data, setStep1Data } = useCalculatorStore();

  const [formData, setFormData] = useState({
    deploymentType: step1Data?.deploymentType || 'managed_saas',
    companySize: step1Data?.companySize || '',
    industry: step1Data?.industry || '',
    useCases: step1Data?.useCases || []
  });

  const [recommendedTier, setRecommendedTier] = useState('');

  // Auto-calculate recommended tier when selections change
  useEffect(() => {
    if (formData.companySize && formData.industry && formData.useCases.length > 0) {
      const tier = calculateRecommendedTier(formData);
      setRecommendedTier(tier);
    }
  }, [formData]);

  const calculateRecommendedTier = (data) => {
    // Regulatory industries → Enterprise
    if (['financial', 'healthcare', 'legal'].includes(data.industry)) {
      return 'enterprise_saas';
    }

    // Large companies → Enterprise
    if (['enterprise', 'large-enterprise'].includes(data.companySize)) {
      return 'enterprise_saas';
    }

    // Mid-market → Professional
    if (data.companySize === 'mid-market' || data.useCases.length >= 3) {
      return 'professional_saas';
    }

    return 'starter_saas';
  };

  const handleNext = () => {
    setStep1Data(formData);
    navigate('/step2');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-2">Echo RAG Calculator v2.0</h1>
      <p className="text-gray-600 mb-8">Step 1 of 5: Product Selection</p>

      {/* Deployment Type */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-4">Deployment Model *</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Deployment type buttons */}
        </div>
      </div>

      {/* Company Size */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Company Size *</label>
        <select className="w-full p-3 border rounded-lg">
          {/* Options */}
        </select>
      </div>

      {/* Industry */}
      {/* Use Cases */}

      {/* Recommended Tier */}
      {recommendedTier && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          {/* Tier recommendation */}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!formData.companySize || !formData.industry || formData.useCases.length === 0}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Continue to Team Configuration →
      </button>
    </div>
  );
}
```

#### Validation Rules
- `deploymentType`: Required
- `companySize`: Required
- `industry`: Required
- `useCases`: At least 1 selected

---

## 👥 Step 2: Team & Resource Configuration

### Component: `Step2TeamConfiguration.jsx`

#### Layout
```
┌───────────────────────────────────────────────────┬──────────────┐
│  Step 2 of 5: Team Configuration                 │  SIDEBAR     │
│                                                   │              │
│  Team Structure                                   │  Preview:    │
│  ─────────────────────────────────────────────    │              │
│  Total Users *                                    │  Professional│
│  ┌─────────────────────────────────────────────┐ │  $10,000/mo  │
│  │ ●────────────●──────────────────────────────│ │              │
│  │ 10          250                        10000 │ │  Annual:     │
│  └─────────────────────────────────────────────┘ │  $96,000     │
│  250 users across your organization              │  (20% off)   │
│                                                   │              │
│  User Profiles                                    │  Users:      │
│  ─────────────────────────────────────────────    │  250         │
│  Power Users (50+ searches/day): 20% [●────────] │              │
│  Regular Users (5-20 searches/day): 60% (auto)   │  Queries:    │
│  Occasional Users (<5 searches/day): 20% (auto)  │  ~90K/mo     │
│                                                   │              │
│  Growth Projection                                │              │
│  ─────────────────────────────────────────────    │  [Next →]    │
│  Expected Growth: [Moderate (25-50%) ▼]          │              │
│                                                   │              │
│  📈 Estimated Monthly Queries: 90,000             │              │
│     Based on 250 users (20% power, 80% regular)  │              │
│                                                   │              │
│  [← Back]  [Continue to Usage Builder →]         │              │
└───────────────────────────────────────────────────┴──────────────┘
```

#### Props & State
```typescript
interface Step2Props {
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  initialData?: Step2Data;
}

interface Step2Data {
  users: number;
  powerUserPercent: number;
  growthRate: 'flat' | 'modest' | 'moderate' | 'high' | 'hyper';
  departmentBreakdown?: {
    engineering: number;
    sales: number;
    customerSuccess: number;
    operations: number;
    other: number;
  };
}

interface Step2Calculated {
  monthlyQueries: number;
  powerUsers: number;
  regularUsers: number;
  occasionalUsers: number;
}
```

#### Component Code (Skeleton)
```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '../store/calculatorStore';
import PricingSidebar from '../components/PricingSidebar';

export default function Step2TeamConfiguration() {
  const navigate = useNavigate();
  const { step1Data, step2Data, setStep2Data, recommendedTier } = useCalculatorStore();

  const [formData, setFormData] = useState({
    users: step2Data?.users || 250,
    powerUserPercent: step2Data?.powerUserPercent || 20,
    growthRate: step2Data?.growthRate || 'moderate'
  });

  const [calculated, setCalculated] = useState({
    monthlyQueries: 0,
    powerUsers: 0,
    regularUsers: 0,
    occasionalUsers: 0
  });

  // Calculate derived metrics
  useEffect(() => {
    const powerUsers = Math.floor(formData.users * (formData.powerUserPercent / 100));
    const regularUsers = Math.floor(formData.users * 0.6);
    const occasionalUsers = formData.users - powerUsers - regularUsers;

    const monthlyQueries =
      powerUsers * 50 * 30 +     // Power: 50 queries/day
      regularUsers * 15 * 30 +   // Regular: 15 queries/day
      occasionalUsers * 3 * 30;  // Occasional: 3 queries/day

    setCalculated({
      monthlyQueries,
      powerUsers,
      regularUsers,
      occasionalUsers
    });
  }, [formData]);

  const handleNext = () => {
    setStep2Data({ ...formData, calculated });
    navigate('/step3');
  };

  return (
    <div className="flex gap-8 max-w-7xl mx-auto p-8">
      <div className="flex-1">
        {/* Form content */}
      </div>
      <PricingSidebar
        tier={recommendedTier}
        users={formData.users}
        queries={calculated.monthlyQueries}
      />
    </div>
  );
}
```

#### Interactive Elements
- **User Slider**: Logarithmic scale (10, 50, 100, 250, 500, 1000, 2500, 5000, 10000)
- **Power User %**: Linear slider 0-100%
- **Growth Dropdown**: 5 preset options
- **Real-time calculation** of monthly queries

---

## ⚙️ Step 3: Usage Scenario Builder

### Component: `Step3UsageBuilder.jsx`

#### Layout
```
┌───────────────────────────────────────────────────┬──────────────┐
│  Step 3 of 5: Usage Scenario Builder             │  SIDEBAR     │
│                                                   │              │
│  Data Sources & Connectors                        │  Professional│
│  ───────────────────────────────────────────────  │              │
│  Number of Connectors * : 15                      │  Base:       │
│  ┌───────────────────────────────────────────┐   │  $10,000     │
│  │ ●────●──────────────────────────────────  │   │              │
│  │ 1   15                                 50 │   │  Add-ons:    │
│  └───────────────────────────────────────────┘   │  +$2,000     │
│                                                   │  Analytics   │
│  Popular Connectors:                              │              │
│  [✓] Slack  [✓] Google Drive  [✓] Jira          │  Total:      │
│  [✓] Confluence  [✓] Salesforce  [✓] GitHub     │  $12,000/mo  │
│  [✓] Notion  [✓] SharePoint  + 7 more...        │              │
│                                                   │  Annual:     │
│  Storage Requirements                             │  $115,200    │
│  ───────────────────────────────────────────────  │              │
│  Total Data Volume: 850 GB                        │  ──────────  │
│  [●──────●────────────────────────────────────]   │              │
│  100GB  850GB  1TB   5TB   10TB                   │  Margin:     │
│                                                   │  55.6% ⚠️    │
│  Estimated: ~85,000 documents                     │  (Below 82%) │
│                                                   │              │
│  Search & Query Features                          │              │
│  ───────────────────────────────────────────────  │  [Next →]    │
│  Voice Query Usage: 15% [●──────────────────]     │              │
│  Visual Search Usage: 10% [●─────────────────]    │              │
│                                                   │              │
│  Add-ons                                          │              │
│  ───────────────────────────────────────────────  │              │
│  [✓] Advanced Analytics Dashboard (+$2,000/mo)   │              │
│  [ ] Dedicated CSM (+$5,000/mo)                   │              │
│  Custom Connectors: [2] @ $15,000 each           │              │
│                                                   │              │
│  [← Back]  [Calculate Full Results →]            │              │
└───────────────────────────────────────────────────┴──────────────┘
```

#### Props & State
```typescript
interface Step3Props {
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  initialData?: Step3Data;
}

interface Step3Data {
  connectors: number;
  storageGB: number;
  voicePercentage: number;
  visualPercentage: number;
  addons: {
    advancedAnalytics: boolean;
    dedicatedCSM: boolean;
  };
  customConnectorsCount: number;
}
```

#### Component Code (Skeleton)
```jsx
import React, { useState, useEffect } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import PricingSidebar from '../components/PricingSidebar';

export default function Step3UsageBuilder() {
  const { setStep3Data, calculatePricing } = useCalculatorStore();

  const [formData, setFormData] = useState({
    connectors: 15,
    storageGB: 850,
    voicePercentage: 15,
    visualPercentage: 10,
    addons: {
      advancedAnalytics: true,
      dedicatedCSM: false
    },
    customConnectorsCount: 2
  });

  // Real-time pricing calculation
  useEffect(() => {
    calculatePricing(formData);
  }, [formData]);

  const handleConnectorChange = (value) => {
    setFormData(prev => ({ ...prev, connectors: value }));
  };

  return (
    <div className="flex gap-8">
      {/* Form */}
      <div className="flex-1">
        {/* Connector slider */}
        {/* Storage slider */}
        {/* Voice/Visual sliders */}
        {/* Add-ons checkboxes */}
      </div>

      {/* Real-time pricing sidebar */}
      <PricingSidebar />
    </div>
  );
}
```

#### Validation & Warning Logic
```javascript
// Tier upgrade warning
if (connectors > tierLimits.connectors) {
  showWarning(`You've selected ${connectors} connectors.
               Professional tier includes 20.
               Consider upgrading to Enterprise for unlimited connectors.`);
}

// Voice/Visual premium trigger
if (voicePercentage > 25) {
  showInfo(`Voice usage >25% triggers Voice Premium add-on (+$1,000/mo)`);
}

if (visualPercentage > 25) {
  showInfo(`Visual usage >25% triggers Visual Premium add-on (+$1,500/mo)`);
}
```

---

## 📊 Step 4: Cost Analysis & Margin Validation

### Component: `Step4Analysis.jsx`

#### Layout (Client View)
```
┌──────────────────────────────────────────────────────────────────┐
│  Step 4 of 5: Cost Analysis                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Your Echo RAG Configuration                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Recommended Tier: Professional                             │ │
│  │ 250 users • 15 connectors • 850GB storage                  │ │
│  │ 90,000 queries/month • Voice enabled                       │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Monthly Cost:              $12,000/mo                      │ │
│  │ Annual Cost:               $115,200/yr                     │ │
│  │ (20% discount applied)                                     │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Setup Fee:                 $0                              │ │
│  │ One-Time Costs:            $30,000 (2 custom connectors)   │ │
│  │ First Year Total:          $145,200                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Tabs: Pricing | Features | Competitors | ROI]                 │
│                                                                  │
│  ┌─ PRICING TAB ──────────────────────────────────────────────┐ │
│  │ Component         │ Quantity │ Unit Price │ Monthly │ Annual││
│  ├───────────────────┼──────────┼────────────┼─────────┼───────┤│
│  │ Base Subscription │ 1        │ $10,000/mo │ $10,000 │ $96K  ││
│  │ Extra Connectors  │ 0        │ $500 each  │ $0      │ $0    ││
│  │ Extra Storage     │ 0 GB     │ $100/100GB │ $0      │ $0    ││
│  │ Advanced Analytics│ 1        │ $2,000/mo  │ $2,000  │ $24K  ││
│  │ Custom Connectors │ 2        │ $15K each  │ N/A     │ $30K  ││
│  ├───────────────────┴──────────┴────────────┴─────────┴───────┤│
│  │ TOTAL RECURRING:                           $12,000  $144K   ││
│  │ ONE-TIME COSTS:                                     $30K    ││
│  │ FIRST YEAR TOTAL:                                   $174K   ││
│  └───────────────────────────────────────────────────────────── ┘│
│                                                                  │
│  [Download PDF] [Export Excel] [Email Quote] [Share Link]       │
│  [💰 View Internal Margins] (Finance/Exec only)                 │
└──────────────────────────────────────────────────────────────────┘
```

#### Internal View (Finance/Exec)
```
┌─ INTERNAL MARGINS (Finance/Exec Only) ─────────────────────────┐
│                                                                 │
│  COGS Breakdown (Monthly)                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Component            │ Calculation       │ Cost         │   │
│  ├──────────────────────┼───────────────────┼──────────────┤   │
│  │ Infrastructure       │                   │              │   │
│  │  Vector DB (Vespa)   │ 4 nodes × $500    │ $2,000       │   │
│  │  Search              │ 2 nodes × $400    │ $800         │   │
│  │  API Servers         │ 3 nodes × $300    │ $900         │   │
│  │ Storage              │                   │              │   │
│  │  Primary (850GB)     │ 850 × $0.10       │ $85          │   │
│  │  Backup (850GB)      │ 850 × $0.05       │ $43          │   │
│  │  Embeddings          │ 250 users × 10GB  │ $300         │   │
│  │ AI/ML                │                   │              │   │
│  │  Embeddings API      │ 90K × $0.0001     │ $9           │   │
│  │  Voice Processing    │ 13.5K × $0.002/m  │ $27          │   │
│  │ Support & Monitoring │                   │ $400         │   │
│  ├──────────────────────┴───────────────────┼──────────────┤   │
│  │ TOTAL MONTHLY COGS:                      │ $4,564       │   │
│  └──────────────────────────────────────────┴──────────────┘   │
│                                                                 │
│  Margin Analysis                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Revenue:        $12,000/month                           │   │
│  │ COGS:           $4,564/month (38.0%)                    │   │
│  │ ──────────────────────────────────────────────────      │   │
│  │ Gross Profit:   $7,436/month                            │   │
│  │ Gross Margin:   62.0%                                   │   │
│  │                                                          │   │
│  │ ⚠️ BELOW TARGET (82% target)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  💡 Margin Improvement Suggestions:                            │
│  1. Reduce vector storage: Use dimensionality reduction        │
│     (768→384 dims) → Save $150/mo                             │
│  2. Optimize embedding batch size: 40% reduction → Save $4/mo  │
│  3. Right-size compute: Current utilization 45% → Save $300/mo │
│  4. Upsell Dedicated CSM: +$5K revenue, +$50 COGS → 69% margin │
└─────────────────────────────────────────────────────────────────┘
```

#### Props & State
```typescript
interface Step4Props {
  analysisData: FullAnalysis;
  userRole: 'sales_rep' | 'sales_manager' | 'finance' | 'executive';
}

interface FullAnalysis {
  pricing: PricingResult;
  cogs: COGSResult;
  margin: MarginResult;
  roi: ROIResult;
}
```

#### Component Code (Skeleton)
```jsx
import React, { useState } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import CompetitorComparison from '../components/CompetitorComparison';
import ROICalculator from '../components/ROICalculator';
import ExportButtons from '../components/ExportButtons';

export default function Step4Analysis() {
  const { analysis, userRole } = useCalculatorStore();
  const [activeTab, setActiveTab] = useState('pricing');
  const [showInternalView, setShowInternalView] = useState(false);

  const canViewInternal = ['finance', 'executive', 'sales_manager'].includes(userRole);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Pricing Summary Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {/* Summary */}
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <button onClick={() => setActiveTab('pricing')}>Pricing</button>
        <button onClick={() => setActiveTab('features')}>Features</button>
        <button onClick={() => setActiveTab('competitors')}>Competitors</button>
        <button onClick={() => setActiveTab('roi')}>ROI</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pricing' && <PricingTable data={analysis.pricing} />}
      {activeTab === 'features' && <FeatureMatrix tier={analysis.tier} />}
      {activeTab === 'competitors' && <CompetitorComparison />}
      {activeTab === 'roi' && <ROICalculator data={analysis.roi} />}

      {/* Internal View Toggle (if authorized) */}
      {canViewInternal && (
        <button onClick={() => setShowInternalView(!showInternalView)}>
          💰 {showInternalView ? 'Hide' : 'View'} Internal Margins
        </button>
      )}

      {/* Internal Margin View */}
      {showInternalView && canViewInternal && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mt-8">
          <COGSBreakdown data={analysis.cogs} />
          <MarginAnalysis data={analysis.margin} />
          <MarginImprovementSuggestions />
        </div>
      )}

      {/* Export Buttons */}
      <ExportButtons />
    </div>
  );
}
```

---

## 🚀 Step 5: Finalize & Simulate

### Component: `Step5Simulate.jsx`

#### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Step 5 of 5: Finalize & Simulate                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Tabs: 5-Year Growth | Migration | Scenarios]                  │
│                                                                  │
│  ┌─ 5-YEAR GROWTH PROJECTION ──────────────────────────────────┐ │
│  │                                                              │ │
│  │  Growth Rate: [40% annually ▼]                              │ │
│  │                                                              │ │
│  │  📈 [Interactive Chart - Cost vs Value]                     │ │
│  │  Year 1: $145K investment → $2.9M value                     │ │
│  │  Year 2: $173K investment → $4.1M value                     │ │
│  │  Year 3: $201K investment → $5.8M value                     │ │
│  │  Year 4: $269K investment → $8.1M value                     │ │
│  │  Year 5: $336K investment → $11.4M value                    │ │
│  │                                                              │ │
│  │  5-Year Totals:                                             │ │
│  │  Total Investment: $1,124,000                               │ │
│  │  Total Value:      $32,300,000                              │ │
│  │  Net Value:        $31,176,000                              │ │
│  │  ROI:              2,774%                                   │ │
│  │                                                              │ │
│  │  [Export Excel with formulas]                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ MIGRATION CALCULATOR ───────────────────────────────────────┐ │
│  │  Current Solution: [Glean ▼]                                │ │
│  │  Current Annual Cost: $290,000                              │ │
│  │                                                              │ │
│  │  Migration Costs (7-week project):                          │ │
│  │  • Planning:     $7,000                                     │ │
│  │  • Data Export:  $13,500                                    │ │
│  │  • Echo Setup:   $9,000                                     │ │
│  │  • Testing:      $10,500                                    │ │
│  │  • Training:     $6,000                                     │ │
│  │  • Cutover:      $9,800                                     │ │
│  │  Total:          $55,800                                    │ │
│  │                                                              │ │
│  │  💰 Savings Analysis:                                       │ │
│  │  Annual Savings:     $140,000                               │ │
│  │  Payback Period:     4.8 months                             │ │
│  │  3-Year Savings:     $364,200                               │ │
│  │                                                              │ │
│  │  [Download Migration Plan PDF]                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [💾 Save Configuration] [🔗 Generate Share Link] [📧 Email]    │
│  [← Back to Analysis]                                           │
└──────────────────────────────────────────────────────────────────┘
```

#### Component Code (Skeleton)
```jsx
import React, { useState } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import GrowthProjection from '../components/GrowthProjection';
import MigrationCalculator from '../components/MigrationCalculator';

export default function Step5Simulate() {
  const { fullConfig, saveScenario, generateShareLink } = useCalculatorStore();
  const [activeTab, setActiveTab] = useState('growth');

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Tabs */}
      <div className="border-b mb-6">
        <button onClick={() => setActiveTab('growth')}>5-Year Growth</button>
        <button onClick={() => setActiveTab('migration')}>Migration</button>
        <button onClick={() => setActiveTab('scenarios')}>Scenarios</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'growth' && <GrowthProjection config={fullConfig} />}
      {activeTab === 'migration' && <MigrationCalculator config={fullConfig} />}
      {activeTab === 'scenarios' && <ScenarioComparison />}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button onClick={saveScenario}>💾 Save Configuration</button>
        <button onClick={generateShareLink}>🔗 Generate Share Link</button>
        <button>📧 Email Quote</button>
      </div>
    </div>
  );
}
```

---

## 🎨 Shared Components

### PricingSidebar.jsx
```jsx
// Real-time pricing preview (sticky sidebar)
export default function PricingSidebar({ tier, users, connectors, storageGB, addons }) {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    // Call pricing engine
    const result = calculatePricing({ tier, users, connectors, storageGB, addons });
    setPricing(result);
  }, [tier, users, connectors, storageGB, addons]);

  return (
    <div className="sticky top-8 w-80 bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold mb-4">{tier.name}</h3>
      <div className="text-3xl font-bold mb-2">
        ${pricing?.monthly.toLocaleString()}<span className="text-sm">/mo</span>
      </div>
      <div className="text-gray-600 mb-4">
        ${pricing?.annual.toLocaleString()}/year
      </div>
      {/* Breakdown */}
    </div>
  );
}
```

### CompetitorComparison.jsx
### ROICalculator.jsx
### ExportButtons.jsx
### GrowthProjection.jsx
### MigrationCalculator.jsx

---

## 📱 Responsive Design

All components should be mobile-responsive:

```css
/* Desktop: Side-by-side layout */
@media (min-width: 1024px) {
  .calculator-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }
}

/* Mobile: Stacked layout */
@media (max-width: 1023px) {
  .calculator-layout {
    display: flex;
    flex-direction: column;
  }

  .pricing-sidebar {
    position: sticky;
    bottom: 0;
    width: 100%;
  }
}
```

---

**Next: State Management & API Specs** → See `STATE_MANAGEMENT.md` and `API_SPECS.md`
