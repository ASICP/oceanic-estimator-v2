# Oceanic Estimator v2

**Enterprise pricing calculators for Cetacean Labs products**

**Project:** Unified pricing, analysis, and competitive positioning platform
**Date:** November 30, 2025
**Version:** 2.0

---

## 📦 Calculators

### 🐋 Echo RAG Calculator (**NEW - Nov 2025**)
**Status:** ✅ Phase 1-2 Complete | 🚧 UI Development (Phase 3) In Progress

Enterprise RAG pricing calculator with competitor intelligence and ROI analysis.

**Quick Start:** [`docs/echo/QUICK_START_REPLIT.md`](./docs/echo/QUICK_START_REPLIT.md) - Deploy in 30 minutes

**Key Features:**
- 5-step pricing workflow
- Real-time cost calculations
- Competitor comparison (Glean, Danswer, Perplexity, Hebbia)
- ROI calculator (1,800%+ typical ROI)
- Migration cost analysis
- 5-year growth projections
- Internal margin validation (82% target)

**Differentiators:**
- 1,300+ connectors (vs 0-100 for competitors)
- Voice + Visual search interface
- Two-tier strategy (SaaS + Self-Hosted)
- 60% cost savings vs Glean

**Documentation:**
- 📘 [`docs/echo/QUICK_START_REPLIT.md`](./docs/echo/QUICK_START_REPLIT.md) - 30-minute deployment guide
- 📗 [`docs/echo/Echo_RAG_Calculator_Specification_v2.0.md`](./docs/echo/Echo_RAG_Calculator_Specification_v2.0.md) - Full specification
- 📕 [`docs/echo/COMPONENT_WIREFRAMES.md`](./docs/echo/COMPONENT_WIREFRAMES.md) - UI component specs
- 📙 [`docs/echo/API_AND_STATE_SPECS.md`](./docs/echo/API_AND_STATE_SPECS.md) - API endpoints & state management
- 📄 [`docs/echo/Echo_Calculator_Implementation_Summary.md`](./docs/echo/Echo_Calculator_Implementation_Summary.md) - Quick reference

**Implementation Files:**
- `docs/echo/echo-rag-calculator-schema.sql` - PostgreSQL database (650 lines, production-ready)
- `docs/echo/echo-pricing-engine.js` - Pricing calculations (896 lines, 100% tested)
- `docs/echo/echo-pricing-engine.test.js` - Test suite (12 tests, all passing ✓)

---

### 🐬 Porpoise Calculator
**Status:** 🏗️ Active | 📚 Reference Implementation

AI training platform pricing calculator (serves as architectural blueprint).

**Key Features:**
- 5-step pricing workflow
- 8 competitor comparison (AWS, GCP, Azure, Salesforce, Oracle, HF, Predibase, Replicate)
- 40% multi-cloud GPU savings
- Video avatar interviewer (HeyGen-powered)
- 35,000+ templates
- 72-82% margin targets

**Documentation:**
- [`docs/porpoise/porpoise-v2-calculator-spec.md`](./docs/porpoise/porpoise-v2-calculator-spec.md) - Full specification
- [`docs/porpoise/porpoise-v2-calculator-technical-details.md`](./docs/porpoise/porpoise-v2-calculator-technical-details.md) - Technical implementation
- [`docs/porpoise/porpoise-v2-executive-summary.md`](./docs/porpoise/porpoise-v2-executive-summary.md) - Executive summary

---

## 🚀 Quick Start

### For Echo RAG Calculator (Recommended)

```bash
# 1. Review the quick start guide
open docs/echo/QUICK_START_REPLIT.md

# 2. Deploy to Replit (30 minutes)
# Follow the 10-step guide in QUICK_START_REPLIT.md

# 3. Test the backend
node docs/echo/echo-pricing-engine.test.js
# Expected: Tests Passed: 12/12 (100%)
```

### Prerequisites
- Replit account (or Node.js 20+)
- Neon/Supabase database (free tier works)
- 30 minutes for initial setup

---

## 📊 Project Status

| Calculator | Backend | Database | UI | Integration | Status |
|-----------|---------|----------|-----|-------------|--------|
| **Echo RAG** | ✅ 100% | ✅ 100% | 🚧 0% | ⏳ 0% | Phase 2 Complete |
| **Porpoise** | ✅ 100% | ✅ 100% | ✅ 80% | ✅ 60% | Active Development |

### Echo RAG Implementation Progress
- [x] Database schema (9 tables, seed data)
- [x] Pricing calculation engine (896 lines)
- [x] Test suite (100% passing)
- [x] API specifications (11 endpoints)
- [x] Component wireframes (5 steps)
- [x] State management architecture
- [x] Deployment guides (Replit-optimized)
- [x] Business plan (35+ pages)
- [ ] React UI components (Steps 1-5)
- [ ] API integration
- [ ] PDF/Excel exports
- [ ] Production deployment

---

## 🛠️ Technology Stack

### Shared Infrastructure
- **Backend:** Node.js 20+ with Express
- **Database:** PostgreSQL 15+ (Neon/Supabase)
- **ORM:** Prisma
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Charts:** Recharts
- **Hosting:** Replit / Vercel + Railway

### Echo-Specific
- **Pricing Engine:** Pure JavaScript (no dependencies)
- **Exports:** jsPDF (PDF), SheetJS (Excel)
- **Authentication:** JWT + role-based access control
- **Testing:** Jest / Node.js test runner

---

## 📂 Repository Structure

```
oceanic-estimator-v2/
├── docs/
│   ├── echo/                          # Echo RAG Calculator
│   │   ├── QUICK_START_REPLIT.md      # 30-min deployment guide
│   │   ├── Echo_RAG_Calculator_Specification_v2.0.md
│   │   ├── COMPONENT_WIREFRAMES.md    # UI component specs
│   │   ├── API_AND_STATE_SPECS.md     # API & state management
│   │   ├── echo-rag-calculator-schema.sql
│   │   ├── echo-pricing-engine.js     # Core calculation logic
│   │   ├── echo-pricing-engine.test.js
│   │   └── ...                        # Additional docs
│   │
│   └── porpoise/                      # Porpoise Calculator
│       ├── porpoise-v2-calculator-spec.md
│       ├── porpoise-v2-calculator-technical-details.md
│       └── porpoise-v2-executive-summary.md
│
├── server/                            # Shared backend API
├── client/                            # Shared frontend
├── shared/                            # Shared utilities
├── package.json
└── README.md                          # This file
```

---

## 🧪 Testing

### Test Echo Pricing Engine
```bash
cd docs/echo
node echo-pricing-engine.test.js
```

**Expected Output:**
```
========================================
ECHO RAG CALCULATOR - PRICING EXAMPLES
========================================

SCENARIO 1: Tech Startup
...
SCENARIO 8: Voice & Visual Premium Add-ons
...

Tests Passed: 12/12 (100%)
✓ ALL TESTS PASSED
```

### Test Coverage
- ✅ Tier determination (4 tests)
- ✅ Pricing calculations (2 tests)
- ✅ Annual discount (1 test)
- ✅ Overages (2 tests)
- ✅ Margin calculations (3 tests)

---

## 📈 Business Impact

### Echo RAG Calculator
- **Target Market:** 250-1,500 user enterprises
- **Typical Deal Size:** $115K-$350K annual
- **ROI:** 1,800%+ (typical customer)
- **Payback Period:** <1 month
- **Gross Margin Target:** 82%
- **Competitive Savings:** 60% vs Glean, 20% vs Perplexity

### Porpoise Calculator
- **Target Market:** 10-500 user organizations
- **Typical Deal Size:** $3.5K-$120K annual
- **GPU Savings:** 40% vs hyperscalers
- **Gross Margin Target:** 72-82%
- **Time to Model:** 27 minutes (vs days)

---

## 📞 Support & Contact

**Project Lead:** c.mcgrath@esteemed.io | 360.701.7353

**GitHub Repository:** https://github.com/ASICP/oceanic-estimator-v2

**Documentation Issues:** Open an issue on GitHub

---

## 🎯 Roadmap

### Q4 2025
- [x] Echo RAG Calculator - Backend & Logic (Phase 1-2)
- [ ] Echo RAG Calculator - UI Components (Phase 3)
- [ ] Echo RAG Calculator - Production Deployment (Phase 4)

### Q1 2026
- [ ] Additional Cetacean Labs product calculators
- [ ] Unified dashboard (multi-calculator view)
- [ ] Advanced analytics & reporting
- [ ] CRM integrations (Salesforce, HubSpot)

---

## 📄 License

Proprietary - Cetacean Labs © 2025

---

**Last Updated:** November 30, 2025
**Version:** 2.0 (Echo RAG + Porpoise)
