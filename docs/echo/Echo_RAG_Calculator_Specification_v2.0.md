# Echo RAG Calculator v2.0 - Complete Specification

**Date:** November 30, 2025  
**Project:** Oceanic Estimator v2 - Echo RAG Module  
**Objective:** Enterprise RAG pricing, analysis, and competitive positioning tool

---

## Executive Summary

The Echo RAG Calculator v2.0 is the second module in the Oceanic Estimator platform, building on the proven Porpoise calculator architecture. This calculator serves as the primary tool for sales, finance, and executive teams to:

- Generate client-facing pricing quotes with real-time cost calculations
- Validate internal margins against targets (82% gross margin)
- Compare against 4 major competitors (Glean, Danswer, Perplexity Enterprise, Hebbia)
- Calculate migration costs for customers switching from competitors
- Simulate growth scenarios and ROI projections
- Demonstrate unique value: 1,300+ connectors, voice+visual search, two-tier strategy

---

## 5-Step User Workflow

### Step 1: Product Selection & Scope Definition
**Purpose:** Understand customer needs and recommend optimal Echo deployment

**User Inputs:**
- **Deployment Model** (Radio buttons):
  - ☁️ Echo Enterprise (Managed SaaS)
  - 🏢 Echo Advanced (Self-Hosted)
  
- **Company Size** (Dropdown):
  - Startup (10-50 employees)
  - Small Business (50-200 employees)
  - Mid-Market (200-1,000 employees)
  - Enterprise (1,000-10,000 employees)
  - Large Enterprise (10,000+ employees)

- **Primary Use Cases** (Multi-select checkboxes):
  - Internal knowledge search
  - Customer support automation
  - Research & due diligence
  - Compliance & audit
  - Developer documentation
  - Sales enablement
  - Meeting search & transcription

- **Industry** (Dropdown):
  - Technology/SaaS
  - Financial Services
  - Healthcare
  - Legal
  - Manufacturing
  - Consulting
  - Other

**Output:**
- Recommended tier: Starter / Professional / Enterprise
- Brief explanation: "Based on your inputs, we recommend..."
- Feature highlights for recommended tier
- "Continue to Configuration" button

**Logic:**
```javascript
function recommendTier(companySize, useCases, industry) {
  // Starter: 10-50 users, 1-2 use cases, non-regulated
  if (companySize === 'startup' && useCases.length <= 2) {
    return 'starter';
  }
  
  // Professional: 50-500 users, 3+ use cases, standard needs
  if (companySize === 'small-business' || companySize === 'mid-market') {
    return 'professional';
  }
  
  // Enterprise: 500+ users, regulated industry, or complex needs
  if (companySize === 'enterprise' || 
      ['financial', 'healthcare', 'legal'].includes(industry) ||
      useCases.length >= 5) {
    return 'enterprise';
  }
  
  return 'professional'; // Default
}
```

---

### Step 2: Team & Resource Configuration
**Purpose:** Define team size and organizational structure

**User Inputs:**

**Team Structure:**
- **Total Users** (Slider: 10 - 10,000+)
  - Display: "250 users across your organization"
  - Smart indicators at: 50, 100, 250, 500, 1000, 2500, 5000

- **Department Breakdown** (Optional - Advanced):
  - Engineering: ___ users
  - Sales: ___ users
  - Customer Success: ___ users
  - Operations: ___ users
  - Other: ___ users
  - Auto-sum must equal Total Users

**User Profiles:**
- **Power Users** (percentage slider: 0-100%)
  - Definition: "Users making 50+ searches/day"
  - Default: 20%
  
- **Regular Users** (auto-calculated)
  - Definition: "Users making 5-20 searches/day"
  
- **Occasional Users** (auto-calculated)
  - Definition: "Users making <5 searches/day"

**Growth Projection:**
- **Expected Growth** (Dropdown):
  - Flat (0% annual growth)
  - Modest (10-20% annual growth)
  - Moderate (25-50% annual growth)
  - High Growth (50-100% annual growth)
  - Hyper Growth (100%+ annual growth)

**Output:**
- User distribution chart (visual)
- Recommended tier adjustment if needed
- Monthly query estimate: "~125,000 queries/month"
- "Continue to Usage Builder" button

---

### Step 3: Usage Scenario Builder
**Purpose:** Configure data sources, storage, and feature requirements

**Data Sources & Connectors:**

**Number of Connectors** (Slider: 1-50)
- Visual display: "15 connectors selected"
- Popular connectors shown with logos:
  - ✓ Slack
  - ✓ Google Drive
  - ✓ Jira
  - ✓ Confluence
  - ✓ Salesforce
  - ✓ GitHub
  - ✓ Notion
  - ✓ SharePoint
  - + 7 more...

**Connector Categories:**
- Communication (Slack, Teams, Email): ___ connectors
- File Storage (Drive, Dropbox, Box): ___ connectors
- Project Management (Jira, Asana, Linear): ___ connectors
- CRM (Salesforce, HubSpot): ___ connectors
- Code (GitHub, GitLab, Bitbucket): ___ connectors
- Databases (PostgreSQL, MySQL, Snowflake): ___ connectors
- Other: ___ connectors

**Storage Requirements:**

**Total Data Volume** (Slider with logarithmic scale):
- 100GB → 500GB → 1TB → 5TB → 10TB
- Helper text: "Estimate: ~10GB per 5,000 documents"
- Visual indicator: Document equivalents

**Data Growth Rate:**
- Monthly data addition: 5GB / 10GB / 25GB / 50GB / 100GB+
- Auto-calculates: "Projected Year 1 storage: 850GB"

**Search & Query Volume:**

**Monthly Queries** (Auto-calculated from Step 2, but editable):
- Default: Users × Profile × 20 queries/day × 30 days
- Example: 250 users × 60% regular × 20/day × 30 = 90,000/month
- Override: Manual input if customer has data

**Voice Query Usage:**
- Percentage of queries via voice: 0% / 10% / 25% / 50%+
- Premium pricing factor for voice processing

**Visual Search Usage:**
- Percentage of queries with images/video: 0% / 10% / 25% / 50%+
- Premium pricing factor for multi-modal

**Features & Add-ons:**

**Core Features** (included in all tiers):
- ✅ Hybrid search (keyword + semantic + vector)
- ✅ Permission-aware RAG
- ✅ OpenWebUI interface
- ✅ SOC 2 Type II certified
- ✅ Unlimited queries (no per-query fees)

**Optional Add-ons** (checkboxes):
- ⬜ **Advanced Analytics Dashboard** (+$2,000/month)
  - Usage insights, search analytics, ROI tracking
  
- ⬜ **Dedicated Customer Success Manager** (+$5,000/month)
  - Weekly check-ins, optimization recommendations
  
- ⬜ **Custom Connector Development**
  - Number needed: ___ (@ $15,000 each one-time)
  - For proprietary/legacy systems
  
- ⬜ **Voice Interface Premium** (included if >25% voice usage)
  - Advanced speech recognition, voice responses
  
- ⬜ **Multi-modal Search Premium** (included if >25% visual usage)
  - Image/video frame analysis, OCR

**Support Level** (Radio buttons - auto-selected by tier but editable):
- 📧 Email Support (24hr response) - Starter
- ⚡ Priority Support (4hr response) - Professional
- 🏆 White-Glove Support (1hr response + CSM) - Enterprise

**Contract Terms:**
- ○ Monthly (pay-as-you-go, no commitment)
- ○ Annual (20% discount)
- ○ Multi-year (contact for custom pricing)

**Output:**
- Real-time pricing preview (sidebar)
- Tier adjustment if needed (e.g., connectors exceed tier limit)
- Storage overage warnings
- "Calculate Full Results" button

---

### Step 4: Cost Analysis & Margin Validation

**Purpose:** Show comprehensive pricing and validate margins (dual view)

#### 4A: Client View (External - Default)

**Pricing Summary Card:**
```
┌─────────────────────────────────────────────────┐
│ Your Echo RAG Configuration                     │
├─────────────────────────────────────────────────┤
│ Recommended Tier: Professional                  │
│ 250 users • 15 connectors • 850GB storage       │
│ 90,000 queries/month • Voice enabled            │
├─────────────────────────────────────────────────┤
│ Monthly Cost:              $12,500/mo           │
│ Annual Cost:               $120,000/yr          │
│ (20% discount applied)                          │
├─────────────────────────────────────────────────┤
│ Setup Fee:                 $0                   │
│ First Year Total:          $120,000             │
└─────────────────────────────────────────────────┘
```

**Detailed Cost Breakdown:**

| Component | Quantity | Unit Price | Monthly | Annual |
|-----------|----------|------------|---------|--------|
| **Base Subscription** |
| Professional Tier | 1 | $10,000/mo | $10,000 | $120,000 |
| **Included in Base:** |
| - Users | 250 (up to 500) | Included | $0 | $0 |
| - Connectors | 15 (up to 20) | Included | $0 | $0 |
| - Storage | 850GB (up to 1TB) | Included | $0 | $0 |
| - Voice Interface | Yes | Included | $0 | $0 |
| - Multi-modal Search | Yes | Included | $0 | $0 |
| **Add-ons** |
| Advanced Analytics | 1 | $2,000/mo | $2,000 | $24,000 |
| Extra Connectors | 0 | $500/each | $0 | $0 |
| Extra Storage | 0 GB | $100/100GB | $0 | $0 |
| Custom Connectors | 2 | $15,000 (one-time) | N/A | $30,000 |
| **Totals** |
| **Recurring Monthly** | | | **$12,000** | |
| **Recurring Annual** | | | | **$144,000** |
| **With 20% Discount** | | | | **$115,200** |
| **One-time Costs** | | | | **$30,000** |
| **First Year Total** | | | | **$145,200** |

**What's Included - Feature Matrix:**

| Feature | Starter | Professional ✓ | Enterprise |
|---------|---------|----------------|------------|
| Users | 10-50 | 50-500 | 500+ |
| Connectors | 5 | 20 | Unlimited |
| Storage | 100GB | 1TB | Unlimited |
| Voice Interface | ✓ | ✓ | ✓ |
| Visual Search | ✓ | ✓ | ✓ |
| Hybrid Search | ✓ | ✓ | ✓ |
| Permission-Aware RAG | ✓ | ✓ | ✓ |
| SOC 2 Certified | ✓ | ✓ | ✓ |
| Support | Email 24hr | Priority 4hr | White-glove 1hr |
| Advanced Analytics | Add-on | Add-on | Included |
| Dedicated CSM | No | Add-on | Included |
| SLA Guarantee | No | 99.5% | 99.9% |
| Custom Connectors | $15K each | $15K each | Included (3/yr) |

**Competitive Comparison:**

```
Annual Cost Comparison (250 users, 15 connectors, 850GB)
├─ Echo Professional:        $115,200  ✓ YOU SAVE 60%
├─ Glean Enterprise:         $290,000  ✗ 151% more expensive
├─ Danswer Self-Hosted:      $20,000 + $80,000 (DevOps) = $100,000
└─ Perplexity Enterprise:    $120,000 (but no internal connectors!)
```

**Why Echo Wins:**

| Feature | Echo | Glean | Danswer | Perplexity |
|---------|------|-------|---------|------------|
| Price (Annual) | $115K | $290K | $100K* | $120K |
| Connectors | 1,300+ | 70 | 50 | Web only |
| Voice Interface | ✓ | ✗ | ✗ | ✗ |
| Visual Search | ✓ | ⚠️ Limited | ✗ | ⚠️ Web images |
| Self-Hosted Option | ✓ | ✗ | ✓ Only | ✗ |
| Managed SaaS Option | ✓ | ✓ Only | ✗ | ✓ Only |
| Setup Time | <2 weeks | 3-6 weeks | 2-4 weeks | 1-2 weeks |

*Danswer requires internal DevOps team ($80K+/year)

**ROI Calculator:**

**Time Savings:**
- Average search time reduction: 65%
- Hours saved per employee per month: 15 hours
- Value per hour (avg salary): $50/hour
- **Monthly productivity gain:** $187,500
- **Annual productivity gain:** $2,250,000

**Onboarding Acceleration:**
- Traditional onboarding time: 4 weeks
- With Echo onboarding time: 3 days
- Onboarding cost savings per hire: $4,500
- New hires per year: 50
- **Annual onboarding savings:** $225,000

**Knowledge Retention:**
- Tribal knowledge captured: 60% more vs. Sharepoint
- Reduced re-work from knowledge loss: 20%
- **Annual efficiency gain:** $350,000

**Total Annual Value Created: $2,825,000**

**ROI Metrics:**
- **Total Investment (Year 1):** $145,200
- **Total Value Created (Year 1):** $2,825,000
- **Net Value:** $2,679,800
- **ROI:** 1,845%
- **Payback Period:** 0.6 months (18 days)

**Action Buttons:**
- 📥 Download PDF Quote
- 📧 Email to Team
- 📊 Export to Excel
- 🔄 Adjust Configuration (back to Step 3)
- 🚀 Start Free Trial
- 💬 Schedule Demo
- 💰 View Internal Margins (Finance/Exec only)

---

#### 4B: Internal View (Finance/Exec Only)

**COGS Breakdown:**

**Infrastructure Costs (Monthly):**
| Component | Calculation | Cost |
|-----------|-------------|------|
| **Compute** |
| Vector Database (Vespa) | 4 nodes × $500/node | $2,000 |
| Search Infrastructure | 2 nodes × $400/node | $800 |
| API Servers | 3 nodes × $300/node | $900 |
| Load Balancers | 2 × $150 | $300 |
| **Storage** |
| Primary Storage (850GB) | 850GB × $0.10/GB | $85 |
| Backup Storage | 850GB × $0.05/GB | $43 |
| Vector Embeddings | 250 users × 10GB × $0.12/GB | $300 |
| **AI/ML Services** |
| Embedding API (OpenAI) | 90K queries × $0.0001/query | $9 |
| Voice Processing (15% voice) | 13.5K × $0.002/min | $27 |
| Image Processing (10% visual) | 9K × $0.001/image | $9 |
| **Data Transfer** |
| Ingress (connectors) | 25GB/day × $0.01/GB × 30 | $8 |
| Egress (API responses) | 50GB/day × $0.02/GB × 30 | $30 |
| **Support & Operations** |
| Customer Support (amortized) | $250/customer/mo | $250 |
| Monitoring & Logging | Fixed | $150 |
| **Total Monthly COGS** | | **$4,911** |

**Margin Analysis:**

```
Revenue:              $12,000/month
COGS:                 $4,911/month (40.9%)
─────────────────────────────────
Gross Profit:         $7,089/month
Gross Margin:         59.1%

⚠️ BELOW TARGET (82% target)
```

**Margin Improvement Suggestions (AI-Driven):**
1. ⚡ **Reduce vector storage costs:** Use dimensionality reduction (768→384 dims) → Save $150/mo
2. ⚡ **Optimize embedding batch size:** Batch queries to reduce API calls 40% → Save $4/mo
3. ⚡ **Right-size compute:** Current utilization only 45%, reduce to 3 nodes → Save $300/mo
4. **Upsell Advanced Analytics:** +$2,000/mo revenue, minimal COGS (+$50) → Margin boost to 69%

**Margin by Tier:**

| Tier | Avg Monthly Revenue | Avg COGS | Gross Margin | Status |
|------|---------------------|----------|--------------|--------|
| Starter | $2,500 | $650 | 74% | ⚠️ Below target |
| Professional | $12,000 | $4,911 | 59% | ❌ Below target |
| Enterprise | $35,000 | $6,200 | 82% | ✅ At target |
| **Blended Avg** | **$16,500** | **$3,920** | **76%** | ⚠️ **Below target** |

**Customer Lifetime Value:**

**LTV Calculation:**
```
Avg Customer Tenure:     36 months (3 years)
Monthly Revenue:         $12,000
Annual Revenue:          $144,000
Total LTV (3 years):     $432,000

Gross Margin:            59.1%
LTV after COGS:          $255,312

Churn Rate:              8% annually
Adjusted LTV:            $234,887
```

**CAC Analysis:**

| Channel | CAC | Conversion | Blended CAC |
|---------|-----|------------|-------------|
| Product-Led Growth | $500 | 40% | $200 |
| Content Marketing | $3,000 | 30% | $900 |
| Outbound Sales | $15,000 | 20% | $3,000 |
| Community/Ecosystem | $1,000 | 10% | $100 |
| **Blended Average** | | | **$4,200** |

**LTV:CAC Ratio: 55.9:1** ✅ Excellent (target >3:1)

**Payback Period:** 1.8 months ✅ Excellent (target <12 months)

**Access Control Note:**
> This internal view is only visible to Finance, Executive, and Sales Management roles. Sales reps see client view only.

---

### Step 5: Finalize & Simulate

**Purpose:** Explore scenarios, migrations, and export quotes

#### 5A: Growth Simulator

**Interactive 5-Year Projection:**

**Growth Assumptions:**
- Year 1: 250 users (current)
- Annual user growth: 40% (adjustable slider)
- Connector growth: 2 new connectors/year
- Storage growth: 25% annually
- Tier upgrades: Professional → Enterprise at 500 users

**Projected Costs:**

| Year | Users | Connectors | Storage | Tier | Monthly Cost | Annual Cost |
|------|-------|------------|---------|------|--------------|-------------|
| 1 | 250 | 15 | 850GB | Professional | $12,000 | $115,200 |
| 2 | 350 | 17 | 1.1TB | Professional | $14,200 | $136,320 |
| 3 | 490 | 19 | 1.4TB | Professional | $17,500 | $168,000 |
| 4 | 686 | 21 | 1.7TB | Enterprise | $28,000 | $268,800 |
| 5 | 960 | 23 | 2.2TB | Enterprise | $35,000 | $336,000 |
| **Total** | | | | | | **$1,024,320** |

**Value Created (5-Year):**

| Year | Users | Productivity Value | Onboarding Savings | Total Value |
|------|-------|--------------------|--------------------|-------------|
| 1 | 250 | $2,250,000 | $225,000 | $2,475,000 |
| 2 | 350 | $3,150,000 | $315,000 | $3,465,000 |
| 3 | 490 | $4,410,000 | $441,000 | $4,851,000 |
| 4 | 686 | $6,174,000 | $617,400 | $6,791,400 |
| 5 | 960 | $8,640,000 | $864,000 | $9,504,000 |
| **Total** | | | | **$27,086,400** |

**5-Year ROI:**
- Total Investment: $1,024,320
- Total Value: $27,086,400
- Net Value: $26,062,080
- **ROI: 2,544%**

**Interactive Chart:**
- Line graph: Cost vs. Value over 5 years
- Adjustable growth rate slider (0-100%)
- Export to Excel with formulas

---

#### 5B: Migration Calculator

**Purpose:** Calculate costs to migrate from competitor to Echo

**Select Current Solution:**
- ○ Glean
- ○ Danswer (Self-Hosted)
- ○ Perplexity Enterprise
- ○ Hebbia
- ○ SharePoint/Internal Search
- ○ Other: _________

**Current Solution Details:**
- Current annual cost: $_______
- Number of data sources connected: _______
- Total storage: _______ GB
- Number of users: _______
- Contract end date: MM/YYYY

**Migration Costs (One-Time):**

| Phase | Tasks | Duration | Cost |
|-------|-------|----------|------|
| **Phase 1: Planning** (Week 1) |
| - Migration assessment | | 20 hours @ $200/hr | $4,000 |
| - Stakeholder alignment | | 10 hours @ $150/hr | $1,500 |
| - Risk analysis | | 10 hours @ $150/hr | $1,500 |
| **Phase 2: Data Export** (Weeks 2-3) |
| - Extract from current system | | 40 hours @ $150/hr | $6,000 |
| - Data cleaning/transformation | | 30 hours @ $150/hr | $4,500 |
| - Validation | | 20 hours @ $150/hr | $3,000 |
| **Phase 3: Echo Setup** (Week 4) |
| - Configure Echo instance | | 16 hours @ $150/hr | $2,400 |
| - Connect data sources | | 24 hours @ $150/hr | $3,600 |
| - Permission mapping | | 20 hours @ $150/hr | $3,000 |
| **Phase 4: Testing** (Week 5) |
| - UAT with power users | | 30 hours @ $150/hr | $4,500 |
| - Performance tuning | | 20 hours @ $150/hr | $3,000 |
| - Bug fixes | | 20 hours @ $150/hr | $3,000 |
| **Phase 5: Training** (Week 6) |
| - Admin training | | 8 hours @ $150/hr | $1,200 |
| - End-user training | | 16 hours @ $150/hr | $2,400 |
| - Documentation | | 16 hours @ $150/hr | $2,400 |
| **Phase 6: Cutover** (Week 7) |
| - Final data sync | | 16 hours @ $150/hr | $2,400 |
| - Go-live support | | 24 hours @ $200/hr | $4,800 |
| - Post-launch monitoring | | 16 hours @ $150/hr | $2,400 |
| **Total Migration Cost** | | **7 weeks** | **$55,600** |

**Migration ROI Analysis:**

```
Current Solution (Annual):        $290,000 (Glean example)
Echo Professional (Annual):       $115,200
Annual Savings:                   $174,800

Migration Cost (One-time):        $55,600
Payback Period:                   3.8 months

Year 1 Net Savings:               $119,200
Year 2 Net Savings:               $174,800
Year 3 Net Savings:               $174,800
3-Year Total Savings:             $468,800
```

**Migration Timeline (Gantt Chart):**
```
Week 1: ████ Planning
Week 2: ████████ Data Export
Week 3: ████████ Data Export (cont.)
Week 4: ████████ Echo Setup
Week 5: ████████ Testing
Week 6: ████████ Training
Week 7: ████ Cutover
Week 8: ✓ Go-Live!
```

**Export Migration Plan:**
- 📄 Download PDF (6-phase detailed plan)
- 📊 Export to Excel (with timeline)
- 📧 Email to stakeholders

---

#### 5C: Scenario Comparison

**Compare Multiple Configurations Side-by-Side:**

| Scenario | Tier | Users | Connectors | Monthly | Annual | Notes |
|----------|------|-------|------------|---------|--------|-------|
| **Current** | Professional | 250 | 15 | $12,000 | $115,200 | As configured |
| **Minimal** | Starter | 50 | 5 | $2,500 | $24,000 | Start small |
| **Growth** | Professional | 500 | 20 | $18,000 | $172,800 | 2x users |
| **Enterprise** | Enterprise | 1,000 | Unlimited | $35,000 | $336,000 | Full scale |

**Add Custom Scenario:** [+ New Scenario]

**Export Comparison:**
- 📊 Export to Excel
- 📄 Generate PDF report

---

#### 5D: Export Options

**Quote Formats:**

1. **📄 PDF Quote (Client-Facing)**
   - Clean professional layout
   - Cetacean Labs branding
   - Pricing summary
   - Feature comparison
   - ROI highlights
   - Valid for: 30 days
   - Quote #: ECHO-2025-1234

2. **📊 Excel Financial Model**
   - Full 5-year projections
   - Editable assumptions
   - COGS breakdown (if authorized)
   - Margin analysis (if authorized)
   - Formulas included

3. **📧 Email Summary**
   - Send to: ________@________.com
   - CC: ________@________.com
   - Include: ☑ PDF Quote ☑ Excel Model ☐ Migration Plan

4. **🔗 Share Link**
   - Generates unique URL: echo-calculator.oceanic.io/quote/abc123
   - Expires in: 30 days
   - Password protected: Yes / No
   - Track views: Yes

5. **💾 Save Configuration**
   - Save for later editing
   - Requires login
   - Accessible from dashboard

---

## Database Schema

### Core Tables

#### 1. pricing_tiers
```sql
CREATE TABLE pricing_tiers (
  id SERIAL PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL, -- 'starter', 'professional', 'enterprise'
  deployment_type VARCHAR(50) NOT NULL, -- 'managed_saas', 'self_hosted'
  base_price_monthly DECIMAL(10,2) NOT NULL,
  base_price_annual DECIMAL(10,2) NOT NULL,
  users_min INT,
  users_max INT,
  connectors_included INT,
  storage_included_gb INT,
  support_level VARCHAR(50),
  sla_uptime DECIMAL(5,2),
  features JSONB, -- JSON array of included features
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO pricing_tiers VALUES
(1, 'starter', 'managed_saas', 2500, 24000, 10, 50, 5, 100, 'email_24hr', 99.0, '["hybrid_search", "voice_interface", "visual_search", "permission_aware_rag"]'),
(2, 'professional', 'managed_saas', 10000, 96000, 50, 500, 20, 1024, 'priority_4hr', 99.5, '["hybrid_search", "voice_interface", "visual_search", "permission_aware_rag", "advanced_rbac"]'),
(3, 'enterprise', 'managed_saas', 25000, 240000, 500, NULL, -1, -1, 'white_glove_1hr', 99.9, '["hybrid_search", "voice_interface", "visual_search", "permission_aware_rag", "advanced_rbac", "advanced_analytics", "dedicated_csm", "custom_connectors"]'),
(4, 'community', 'self_hosted', 0, 0, 0, 20, -1, -1, 'community_forums', NULL, '["hybrid_search", "basic_features"]'),
(5, 'enterprise', 'self_hosted', 1667, 20000, 20, 200, -1, -1, 'priority_8hr', NULL, '["hybrid_search", "voice_interface", "visual_search", "permission_aware_rag", "advanced_rbac"]'),
(6, 'enterprise_plus', 'self_hosted', 4167, 50000, 200, NULL, -1, -1, '24_7_csm', NULL, '["all_features", "professional_services_40hrs"]');
```

#### 2. usage_pricing
```sql
CREATE TABLE usage_pricing (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'connector', 'storage', 'addon', 'one_time'
  unit_price DECIMAL(10,2) NOT NULL,
  unit_type VARCHAR(50), -- 'per_month', 'per_100gb', 'one_time'
  description TEXT,
  applies_to_tiers VARCHAR[] DEFAULT ARRAY['all'], -- or ['starter', 'professional']
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO usage_pricing VALUES
(1, 'extra_connector', 'connector', 500.00, 'per_month', 'Additional connector beyond tier limit', ARRAY['starter', 'professional']),
(2, 'extra_storage_100gb', 'storage', 100.00, 'per_month', 'Additional 100GB storage beyond tier limit', ARRAY['all']),
(3, 'advanced_analytics', 'addon', 2000.00, 'per_month', 'Usage insights, search analytics, ROI dashboard', ARRAY['starter', 'professional']),
(4, 'dedicated_csm', 'addon', 5000.00, 'per_month', 'Dedicated customer success manager', ARRAY['starter', 'professional']),
(5, 'custom_connector_development', 'one_time', 15000.00, 'one_time', 'Build proprietary integration', ARRAY['all']),
(6, 'voice_interface_premium', 'addon', 1000.00, 'per_month', 'Advanced voice processing (>25% usage)', ARRAY['all']),
(7, 'multimodal_search_premium', 'addon', 1500.00, 'per_month', 'Advanced image/video analysis (>25% usage)', ARRAY['all']);
```

#### 3. cogs_structure
```sql
CREATE TABLE cogs_structure (
  id SERIAL PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL,
  deployment_type VARCHAR(50) NOT NULL,
  user_count_bracket VARCHAR(50), -- '0-50', '50-500', '500+'
  compute_cost DECIMAL(10,2),
  storage_cost_per_gb DECIMAL(6,4),
  ai_ml_cost_per_1k_queries DECIMAL(6,4),
  data_transfer_cost DECIMAL(10,2),
  support_cost_per_customer DECIMAL(10,2),
  other_costs DECIMAL(10,2),
  total_cogs_monthly DECIMAL(10,2),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed data (example for Professional tier)
INSERT INTO cogs_structure VALUES
(1, 'professional', 'managed_saas', '50-500', 4000.00, 0.10, 0.05, 38.00, 250.00, 150.00, 4911.00, 'Based on 250 users, 850GB, 90K queries/mo', NOW());
```

#### 4. competitor_pricing
```sql
CREATE TABLE competitor_pricing (
  id SERIAL PRIMARY KEY,
  competitor_name VARCHAR(100) NOT NULL,
  competitor_tier VARCHAR(100),
  deployment_type VARCHAR(50),
  base_price_annual DECIMAL(12,2),
  user_count_assumption INT,
  connectors_included INT,
  storage_included_gb INT,
  voice_interface BOOLEAN DEFAULT FALSE,
  visual_search BOOLEAN DEFAULT FALSE,
  self_hosted_option BOOLEAN DEFAULT FALSE,
  managed_saas_option BOOLEAN DEFAULT TRUE,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  source_url VARCHAR(500),
  last_verified_date DATE,
  verified_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO competitor_pricing VALUES
(1, 'Glean', 'Enterprise', 'managed_saas', 290000, 250, 70, 1000, FALSE, FALSE, FALSE, TRUE, 50000, 'Annual contract, volume discounts available', 'https://glean.com/pricing', '2025-11-01', 'Finance Team'),
(2, 'Danswer', 'Self-Hosted', 'self_hosted', 20000, 250, 50, NULL, FALSE, FALSE, TRUE, FALSE, 0, 'Plus ~$80K/year DevOps costs', 'https://danswer.ai', '2025-11-01', 'Finance Team'),
(3, 'Perplexity Enterprise', 'Enterprise', 'managed_saas', 120000, 250, 0, NULL, FALSE, FALSE, FALSE, TRUE, 0, 'Web-only, no internal connectors', 'https://perplexity.ai/enterprise', '2025-11-01', 'Finance Team'),
(4, 'Hebbia', 'Enterprise', 'managed_saas', 250000, 250, 100, 2000, FALSE, TRUE, FALSE, TRUE, 100000, 'High-end positioning, long sales cycle', 'Contact sales', '2025-10-15', 'Sales Team');
```

#### 5. calculator_scenarios
```sql
CREATE TABLE calculator_scenarios (
  id SERIAL PRIMARY KEY,
  scenario_name VARCHAR(200),
  user_id VARCHAR(100), -- email or user ID
  company_name VARCHAR(200),
  configuration JSONB NOT NULL, -- Full calculator state
  monthly_cost DECIMAL(10,2),
  annual_cost DECIMAL(10,2),
  recommended_tier VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(100) UNIQUE
);
```

#### 6. migration_analyses
```sql
CREATE TABLE migration_analyses (
  id SERIAL PRIMARY KEY,
  scenario_id INT REFERENCES calculator_scenarios(id),
  current_solution VARCHAR(100),
  current_annual_cost DECIMAL(12,2),
  echo_annual_cost DECIMAL(12,2),
  migration_cost_onetime DECIMAL(10,2),
  annual_savings DECIMAL(12,2),
  payback_months DECIMAL(5,2),
  three_year_savings DECIMAL(12,2),
  migration_timeline_weeks INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Pricing Calculation Engine

### Core Functions (JavaScript/TypeScript)

```javascript
/**
 * Main pricing calculator
 */
class EchoCalculator {
  
  /**
   * Calculate total monthly cost based on configuration
   */
  calculateMonthly(config) {
    const {
      deploymentType,
      companySize,
      useCases,
      users,
      connectors,
      storageGB,
      monthlyQueries,
      voicePercentage,
      visualPercentage,
      addons,
      supportLevel,
      growthRate
    } = config;
    
    // Step 1: Determine base tier
    const tier = this.determineTier(users, connectors, storageGB, useCases);
    const basePricing = this.getBasePricing(tier, deploymentType);
    
    let totalMonthly = basePricing.basePrice;
    let breakdown = {
      base: basePricing.basePrice,
      connectors: 0,
      storage: 0,
      addons: 0,
      voice: 0,
      visual: 0
    };
    
    // Step 2: Calculate connector overages
    if (connectors > basePricing.connectorsIncluded && basePricing.connectorsIncluded !== -1) {
      const extraConnectors = connectors - basePricing.connectorsIncluded;
      const connectorCost = extraConnectors * 500; // $500 per connector
      breakdown.connectors = connectorCost;
      totalMonthly += connectorCost;
    }
    
    // Step 3: Calculate storage overages
    if (storageGB > basePricing.storageIncluded && basePricing.storageIncluded !== -1) {
      const extraGB = storageGB - basePricing.storageIncluded;
      const storageBlocks = Math.ceil(extraGB / 100);
      const storageCost = storageBlocks * 100; // $100 per 100GB
      breakdown.storage = storageCost;
      totalMonthly += storageCost;
    }
    
    // Step 4: Add-ons
    if (addons.advancedAnalytics && tier !== 'enterprise') {
      breakdown.addons += 2000;
      totalMonthly += 2000;
    }
    
    if (addons.dedicatedCSM && tier !== 'enterprise') {
      breakdown.addons += 5000;
      totalMonthly += 5000;
    }
    
    // Step 5: Voice premium (if >25% voice usage)
    if (voicePercentage > 25 && !this.isIncludedInTier(tier, 'voice_premium')) {
      breakdown.voice = 1000;
      totalMonthly += 1000;
    }
    
    // Step 6: Visual search premium (if >25% visual usage)
    if (visualPercentage > 25 && !this.isIncludedInTier(tier, 'visual_premium')) {
      breakdown.visual = 1500;
      totalMonthly += 1500;
    }
    
    return {
      tier,
      monthly: totalMonthly,
      breakdown,
      basePricing
    };
  }
  
  /**
   * Calculate annual cost with discount
   */
  calculateAnnual(monthlyResult, contractTerm = 'annual') {
    const monthlyTotal = monthlyResult.monthly;
    
    if (contractTerm === 'monthly') {
      return {
        annual: monthlyTotal * 12,
        discount: 0,
        discountPercentage: 0
      };
    }
    
    if (contractTerm === 'annual') {
      const annualWithoutDiscount = monthlyTotal * 12;
      const discount = annualWithoutDiscount * 0.20; // 20% discount
      const annual = annualWithoutDiscount - discount;
      
      return {
        annual,
        discount,
        discountPercentage: 20,
        monthlySavings: discount / 12
      };
    }
    
    // Multi-year: contact sales
    return null;
  }
  
  /**
   * Determine appropriate tier based on inputs
   */
  determineTier(users, connectors, storageGB, useCases) {
    // Enterprise: 500+ users OR regulated industries OR complex needs
    if (users >= 500 || connectors > 20 || storageGB > 1024) {
      return 'enterprise';
    }
    
    // Professional: 50-500 users, moderate needs
    if (users >= 50 || connectors > 5 || storageGB > 100) {
      return 'professional';
    }
    
    // Starter: <50 users, basic needs
    return 'starter';
  }
  
  /**
   * Get base pricing for tier
   */
  getBasePricing(tier, deploymentType) {
    const pricingTable = {
      starter: {
        managed_saas: {
          basePrice: 2500,
          connectorsIncluded: 5,
          storageIncluded: 100,
          usersMin: 10,
          usersMax: 50
        }
      },
      professional: {
        managed_saas: {
          basePrice: 10000,
          connectorsIncluded: 20,
          storageIncluded: 1024,
          usersMin: 50,
          usersMax: 500
        }
      },
      enterprise: {
        managed_saas: {
          basePrice: 25000,
          connectorsIncluded: -1, // unlimited
          storageIncluded: -1, // unlimited
          usersMin: 500,
          usersMax: null
        }
      },
      community: {
        self_hosted: {
          basePrice: 0,
          connectorsIncluded: -1,
          storageIncluded: -1,
          usersMin: 0,
          usersMax: 20
        }
      },
      enterprise: {
        self_hosted: {
          basePrice: 1667, // $20K annual / 12
          connectorsIncluded: -1,
          storageIncluded: -1,
          usersMin: 20,
          usersMax: 200
        }
      },
      enterprise_plus: {
        self_hosted: {
          basePrice: 4167, // $50K annual / 12
          connectorsIncluded: -1,
          storageIncluded: -1,
          usersMin: 200,
          usersMax: null
        }
      }
    };
    
    return pricingTable[tier]?.[deploymentType] || pricingTable.professional.managed_saas;
  }
  
  /**
   * Calculate COGS for internal margin analysis
   */
  calculateCOGS(config, monthlyResult) {
    const { users, storageGB, monthlyQueries, voicePercentage, visualPercentage } = config;
    
    // Compute infrastructure
    const computeNodes = Math.ceil(users / 100); // 1 node per 100 users
    const computeCost = computeNodes * 500;
    
    // Storage costs
    const storageCost = storageGB * 0.10; // $0.10 per GB
    const backupCost = storageGB * 0.05; // $0.05 per GB
    const vectorCost = users * 10 * 0.12; // 10GB per user @ $0.12/GB
    
    // AI/ML services
    const embeddingCost = (monthlyQueries / 1000) * 0.10; // $0.10 per 1K queries
    const voiceQueries = monthlyQueries * (voicePercentage / 100);
    const voiceCost = (voiceQueries / 1000) * 2.00; // $2 per 1K voice minutes
    const visualQueries = monthlyQueries * (visualPercentage / 100);
    const visualCost = (visualQueries / 1000) * 1.00; // $1 per 1K images
    
    // Data transfer
    const transferCost = 38; // Average per customer
    
    // Support
    const supportCost = 250; // Amortized per customer
    
    // Monitoring
    const monitoringCost = 150; // Fixed
    
    const totalCOGS = 
      computeCost +
      storageCost +
      backupCost +
      vectorCost +
      embeddingCost +
      voiceCost +
      visualCost +
      transferCost +
      supportCost +
      monitoringCost;
    
    const revenue = monthlyResult.monthly;
    const grossProfit = revenue - totalCOGS;
    const grossMargin = (grossProfit / revenue) * 100;
    
    return {
      compute: computeCost,
      storage: storageCost + backupCost + vectorCost,
      aiml: embeddingCost + voiceCost + visualCost,
      transfer: transferCost,
      support: supportCost,
      monitoring: monitoringCost,
      total: totalCOGS,
      revenue,
      grossProfit,
      grossMargin,
      meetsTarget: grossMargin >= 82
    };
  }
  
  /**
   * Calculate ROI metrics
   */
  calculateROI(config, annualCost) {
    const { users } = config;
    
    // Time savings
    const hoursPerUserPerMonth = 15; // Average search time saved
    const valuePerHour = 50; // Average salary/hour
    const monthlyProductivityValue = users * hoursPerUserPerMonth * valuePerHour;
    const annualProductivityValue = monthlyProductivityValue * 12;
    
    // Onboarding savings
    const traditionalOnboarding = 4 * 5 * 8; // 4 weeks * 5 days * 8 hours
    const echoOnboarding = 3 * 8; // 3 days * 8 hours
    const hoursSaved = traditionalOnboarding - echoOnboarding;
    const savingsPerHire = hoursSaved * valuePerHour;
    const newHiresPerYear = Math.ceil(users * 0.20); // 20% growth
    const annualOnboardingSavings = savingsPerHire * newHiresPerYear;
    
    // Knowledge retention
    const annualEfficiencyGain = users * 1400; // $1,400 per user/year
    
    const totalAnnualValue = 
      annualProductivityValue +
      annualOnboardingSavings +
      annualEfficiencyGain;
    
    const netValue = totalAnnualValue - annualCost;
    const roi = (netValue / annualCost) * 100;
    const paybackMonths = (annualCost / totalAnnualValue) * 12;
    
    return {
      productivityValue: annualProductivityValue,
      onboardingSavings: annualOnboardingSavings,
      efficiencyGain: annualEfficiencyGain,
      totalValue: totalAnnualValue,
      investment: annualCost,
      netValue,
      roi,
      paybackMonths
    };
  }
  
  /**
   * Calculate migration costs from competitor
   */
  calculateMigration(currentSolution, currentAnnualCost, echoAnnualCost) {
    // Fixed migration phases
    const migrationPhases = {
      planning: { hours: 40, rate: 175, duration: 1 },
      dataExport: { hours: 90, rate: 150, duration: 2 },
      echoSetup: { hours: 60, rate: 150, duration: 1 },
      testing: { hours: 70, rate: 150, duration: 1 },
      training: { hours: 40, rate: 150, duration: 1 },
      cutover: { hours: 56, rate: 175, duration: 1 }
    };
    
    let totalCost = 0;
    let totalWeeks = 0;
    
    Object.values(migrationPhases).forEach(phase => {
      totalCost += phase.hours * phase.rate;
      totalWeeks += phase.duration;
    });
    
    const annualSavings = currentAnnualCost - echoAnnualCost;
    const paybackMonths = (totalCost / annualSavings) * 12;
    const threeYearSavings = (annualSavings * 3) - totalCost;
    
    return {
      migrationCost: totalCost,
      migrationWeeks: totalWeeks,
      annualSavings,
      paybackMonths,
      year1NetSavings: annualSavings - totalCost,
      year2NetSavings: annualSavings,
      year3NetSavings: annualSavings,
      threeYearSavings
    };
  }
  
  /**
   * Project 5-year growth
   */
  project5Year(config, monthlyResult, growthRate) {
    const years = [];
    let currentUsers = config.users;
    let currentConnectors = config.connectors;
    let currentStorage = config.storageGB;
    
    for (let year = 1; year <= 5; year++) {
      // Apply growth
      if (year > 1) {
        currentUsers = Math.ceil(currentUsers * (1 + growthRate / 100));
        currentConnectors = Math.min(currentConnectors + 2, 50); // +2 per year, cap at 50
        currentStorage = Math.ceil(currentStorage * 1.25); // 25% storage growth
      }
      
      // Recalculate for this year
      const yearConfig = {
        ...config,
        users: currentUsers,
        connectors: currentConnectors,
        storageGB: currentStorage
      };
      
      const yearMonthly = this.calculateMonthly(yearConfig);
      const yearAnnual = this.calculateAnnual(yearMonthly, 'annual');
      const yearROI = this.calculateROI(yearConfig, yearAnnual.annual);
      
      years.push({
        year,
        users: currentUsers,
        connectors: currentConnectors,
        storage: currentStorage,
        tier: yearMonthly.tier,
        monthly: yearMonthly.monthly,
        annual: yearAnnual.annual,
        value: yearROI.totalValue
      });
    }
    
    const totalInvestment = years.reduce((sum, y) => sum + y.annual, 0);
    const totalValue = years.reduce((sum, y) => sum + y.value, 0);
    const netValue = totalValue - totalInvestment;
    const roi = (netValue / totalInvestment) * 100;
    
    return {
      years,
      totals: {
        investment: totalInvestment,
        value: totalValue,
        netValue,
        roi
      }
    };
  }
}

// Export for use
module.exports = EchoCalculator;
```

---

## Success Metrics

### Usage Targets (Year 1):
- Monthly unique users: 50+ (Sales, Finance, Exec teams)
- Quotes generated: 50+ per month
- Quote-to-deal conversion: 30%
- Average deal size: $120K annual

### Business Impact:
- Deal velocity: 20% faster quote-to-close
- Win rate: 10% increase in competitive displacement
- Margin protection: Zero deals below 82% gross margin
- Upsell rate: 25% of Starter quotes → Professional/Enterprise
- Time savings: 80% reduction in manual quote creation

### Data Quality:
- Pricing accuracy: 95% vs actuals
- Competitor data freshness: 100% verified quarterly
- Validation rate: 90% of flagged changes reviewed within 7 days

---

## Implementation Roadmap

### Phase 1: Core Calculator (Weeks 1-3)
**Week 1: Foundation**
- Database schema setup (PostgreSQL + Prisma)
- Seed data (pricing tiers, usage pricing, competitors)
- Basic API endpoints (GET pricing, POST calculate)
- Development environment (Replit or local)

**Week 2: Calculation Engine**
- Implement EchoCalculator class
- Unit tests for pricing logic
- COGS calculation functions
- ROI calculator
- Migration calculator

**Week 3: UI - Steps 1-3**
- React components with Tailwind CSS
- Step 1: Product Selection
- Step 2: Team Configuration
- Step 3: Usage Builder
- Real-time pricing preview sidebar

### Phase 2: Analysis & Intelligence (Weeks 4-5)
**Week 4: Step 4 - Dual View**
- Client view (clean pricing)
- Internal view (COGS, margins)
- Competitive comparison table
- ROI calculator UI
- Access control (role-based)

**Week 5: Competitor Intelligence**
- Competitor pricing database
- Migration calculator UI
- Historical price tracking
- Validation queue system

### Phase 3: Simulation & Export (Weeks 6-7)
**Week 6: Step 5 - Simulate**
- 5-year growth projections
- Scenario comparison
- Interactive charts (Chart.js or Recharts)
- Migration timeline (Gantt)

**Week 7: Export & Polish**
- PDF quote generation (jsPDF)
- Excel export (SheetJS)
- Email integration
- Share link generation
- UI/UX refinements

### Phase 4: Deployment (Week 8)
- Production deployment (Vercel/Railway)
- Environment configuration
- SSL certificates
- Monitoring setup (Sentry, LogRocket)
- User training & documentation
- Go-live!

---

## Technical Stack

### Frontend:
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS 3+
- **Charts:** Recharts or Chart.js
- **Forms:** React Hook Form
- **State:** Zustand or Context API
- **Routing:** React Router v6

### Backend:
- **Runtime:** Node.js 20+
- **Framework:** Express or Fastify
- **ORM:** Prisma
- **Database:** PostgreSQL 15+
- **Auth:** JWT + bcrypt
- **Validation:** Zod

### Hosting & Deployment:
- **Primary:** Vercel (frontend) + Railway (backend + DB)
- **Alternative:** Replit (all-in-one)
- **CDN:** Cloudflare
- **Monitoring:** Sentry + LogRocket

### Exports & Integrations:
- **PDF:** jsPDF or Puppeteer
- **Excel:** SheetJS (xlsx)
- **Email:** SendGrid or Resend
- **CRM:** Salesforce API (future)

---

## Security & Access Control

### Role-Based Access:

| Role | Access Level |
|------|--------------|
| **Sales Rep** | Client view only, Steps 1-4 (client), export quotes, save scenarios |
| **Sales Manager** | All sales rep + internal margins (Step 4B), competitor data |
| **Finance** | All views + COGS editing, margin validation, LTV:CAC, competitor pricing updates |
| **Executive** | All views + strategic reports, competitor intelligence, historical data |
| **Prospect (Public)** | Steps 1-3 only, no internal data, no competitor details, limited features |

### Authentication:
- Email/password login
- SSO via Google Workspace (for internal users)
- Magic link for prospects (passwordless)
- Session timeout: 30 minutes
- MFA optional for Finance/Exec

---

## Maintenance Plan

### Quarterly Reviews (Every 90 Days):
- ✅ Verify all 4 competitor prices
- ✅ Update COGS assumptions
- ✅ Review margin targets
- ✅ Validate ROI assumptions
- ✅ Customer feedback integration

### Automated Monitoring:
- Daily: Database backups
- Weekly: Competitor price scraping (validation)
- Monthly: Usage analytics report
- Quarterly: Comprehensive pricing audit

### Version Control:
- All pricing changes tracked in `pricing_tiers` history
- Competitor price history in `competitor_pricing_history`
- Migration analyses saved for reference

---

## Next Steps

### Immediate Actions:
1. ✅ Review & approve specification
2. ⏳ Assign development resources (1-2 developers)
3. ⏳ Set up development environment
4. ⏳ Confirm 8-week timeline or adjust
5. ⏳ Kickoff meeting with stakeholders

### Pre-Development Questions:
1. **Budget:** Any constraints for development/hosting?
2. **Access:** Who needs Finance/Exec views? (provide list)
3. **Integrations:** Which CRM for future integration?
4. **Branding:** Use Oceanic brand guidelines? (provide assets)
5. **Timeline:** Is 8 weeks acceptable or need acceleration?

---

## Status

**Status:** ✅ Specification Complete - Ready for Development  
**Last Updated:** November 30, 2025  
**Version:** 2.0  
**Author:** Claude + Cetacean Labs Team  
**Next Review:** December 7, 2025

---

**End of Specification**
