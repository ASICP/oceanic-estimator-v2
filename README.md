# Oceanic Estimator v2

**Enterprise pricing calculators for Cetacean Labs products**

---

## 📦 Projects

### 🐋 Echo RAG Calculator v2.0
**Status:** ✅ Ready for Development (Phase 1-2 Complete)

Enterprise RAG pricing calculator with competitor intelligence and ROI analysis.

**Location:** [`/echo-v2/`](./echo-v2/)

**Features:**
- 5-step pricing workflow
- Real-time cost calculations
- Competitor comparison (Glean, Danswer, Perplexity, Hebbia)
- ROI calculator
- Migration cost analysis
- 5-year growth projections
- Internal margin validation (82% target)

**Quick Start:**
```bash
cd echo-v2/files
# Follow QUICK_START_REPLIT.md for 30-minute deployment
```

**Documentation:**
- 📘 [Quick Start Guide](./echo-v2/files/QUICK_START_REPLIT.md) - Deploy in 30 minutes
- 📗 [Full Specification](./echo-v2/files/Echo_RAG_Calculator_Specification_v2.0.md) - Complete requirements
- 📕 [Component Wireframes](./echo-v2/files/COMPONENT_WIREFRAMES.md) - UI specifications
- 📙 [API & State Specs](./echo-v2/files/API_AND_STATE_SPECS.md) - Backend integration

**Implementation Files:**
- `echo-rag-calculator-schema.sql` - PostgreSQL database (650 lines, production-ready)
- `echo-pricing-engine.js` - Pricing calculations (896 lines, 100% tested)
- `echo-pricing-engine.test.js` - Test suite (12 tests, all passing ✓)

---

### 🐬 Porpoise Calculator v2.0
**Status:** 📚 Reference Implementation

AI training platform pricing calculator (serves as blueprint for Echo).

**Location:** [`/porpoise-v2/`](./porpoise-v2/)

**Documentation:**
- [Calculator Specification](./porpoise-v2/porpoise-v2-calculator-spec.md)
- [Technical Details](./porpoise-v2/porpoise-v2-calculator-technical-details.md)
- [Executive Summary](./porpoise-v2/porpoise-v2-executive-summary.md)

---

---

### 🐬 Dolphin Agent Calculator v2.0
**Status:** ✅ Reference Implementation

Agile Agent Team Assembly & Orchestration pricing calculator.

**Location:** [`/dolphin-v2/`](./dolphin-v2/)

**Documentation:**
- [Calculator Specification](./dolphin-v2/files/dolphin-v2-calculator-spec.md)

---

## 🚀 Getting Started

### Echo RAG Calculator (Recommended)

1. **Review the specs:**
   ```bash
   cd echo-v2/files
   open QUICK_START_REPLIT.md
   ```

2. **Deploy to Replit:**
   - Follow the 10-step guide in `QUICK_START_REPLIT.md`
   - Backend + Database + Frontend in 30 minutes

3. **Build the UI:**
   - Use `COMPONENT_WIREFRAMES.md` for detailed component specs
   - Use `API_AND_STATE_SPECS.md` for integration

### Prerequisites
- Replit account (or Node.js 20+)
- Neon/Supabase database (free tier works)
- 30 minutes for initial setup

---

## 📊 Project Status

| Project | Phase | Status | Completion |
|---------|-------|--------|------------|
| Echo RAG Calculator | Backend & Logic | ✅ Complete | 100% |
| Echo RAG Calculator | UI Components | 🚧 In Progress | 0% |
| Echo RAG Calculator | Integration | ⏳ Pending | 0% |
| Echo RAG Calculator | Deployment | ⏳ Pending | 0% |
| Porpoise Calculator | Reference Docs | ✅ Complete | 100% |
| Dolphin Agent Calculator | Backend & Logic | ✅ Complete | 100% |

---

## 🛠️ Tech Stack

### Echo RAG Calculator
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Neon/Supabase)
- **ORM:** Prisma
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Charts:** Recharts
- **Deployment:** Replit / Vercel + Railway

---

## 📈 Deliverables

### Echo RAG v2.0 (Complete)
- ✅ Database schema (9 tables, seed data)
- ✅ Pricing calculation engine (896 lines)
- ✅ Test suite (100% passing)
- ✅ API specifications (11 endpoints)
- ✅ Component wireframes (5 steps)
- ✅ State management architecture
- ✅ Deployment guides (Replit-optimized)
- ✅ Business plan (35+ pages)

**Total:** 215KB of production-ready code & documentation

---

## 🧪 Testing

Run the Echo pricing engine tests:
```bash
cd echo-v2/files
node echo-pricing-engine.test.js
```

Expected output:
```
Tests Passed: 12/12 (100%)
✓ ALL TESTS PASSED
```

---

## 📞 Support

**Project Lead:** c.mcgrath@esteemed.io | 360.701.7353

**Documentation Issues:** Open an issue on GitHub

---

## 📄 License

Proprietary - Cetacean Labs © 2025

---

**Last Updated:** November 30, 2025
**Version:** 2.0
