# Oceanic Estimator v2 - Executive Summary

**Date:** November 21, 2025  
**Project:** Upgrade CLabs Margin Calculator (v1) to Oceanic Estimator v2: This version focuses first on Porpoise
**Objective:** Comprehensive pricing, analysis, and competitive positioning tool  

---

## Project Overview

The Porpoise v2 Calculator is an upgrade to the existing CLabs margin calculator (github.com/ASICP/clabs-margin-calculator-v1) focused exclusively on **Porpoise**, Cetacean Labs' no-code AI training platform. This calculator will serve as the primary tool for sales, finance, and executive teams to:

1. **Generate client-facing pricing quotes** with real-time cost calculations
2. **Validate internal margins** against targets (72-82% gross margin)
3. **Compare against 8 major competitors** (AWS, GCP, Azure, Salesforce, Oracle, HuggingFace, Predibase, Replicate)
4. **Calculate migration costs** for customers switching from competitors
5. **Simulate growth scenarios** and ROI projections

---

## Key Deliverables

### 1. Five-Step User Workflow
- **Step 1:** Product Selection & Scope Definition
- **Step 2:** Team & Resource Configuration
- **Step 3:** Usage Scenario Builder
- **Step 4:** Cost Analysis & Margin Validation (dual view: client vs internal)
- **Step 5:** Finalize & Simulate (projections, migration calculator, exports)

### 2. Hybrid Competitor Pricing System
- **Manual curation:** Quarterly reviews of all 8 competitors
- **Automated validation:** Web scraping for public pricing pages
- **Customer reporting:** Crowdsource pricing intel from sales conversations
- **Historical tracking:** Price change history and trend analysis

### 3. Internal Margin Analysis
- **Real-time COGS calculation:** Infrastructure, avatars, Twilio, support
- **Margin validation:** Against 72-82% target range with status indicators
- **LTV:CAC tracking:** Customer lifetime value and acquisition cost ratios
- **Improvement suggestions:** AI-driven recommendations to optimize margins

### 4. Competitor Migration Calculator
- **One-time migration costs:** Data export, onboarding, re-training, team training
- **ROI analysis:** Annual savings, payback period, 3-year net savings
- **6-phase migration plan:** Detailed PDF export with timeline and costs
- **Competitive positioning:** Strengths/weaknesses comparison matrix

---

## Business Impact

### Porpoise Competitive Advantages (Built Into Calculator)
1. **40% multi-cloud GPU savings** vs competitors
2. **Video avatar interviewer** (HeyGen-powered) - unique to Porpoise
3. **35,000+ pre-loaded templates** for instant value
4. **27-minute median time-to-trained-model** (vs days for competitors)
5. **94% success rate** (vs 61% for AWS SageMaker first-time users)

### Expected Outcomes
- **Deal Velocity:** 20% faster quote-to-close cycle
- **Margin Protection:** Zero deals below 72% gross margin threshold
- **Win Rate:** 10% increase in competitive displacement deals
- **Upsell Rate:** 25% of Starter quotes convert to Professional/Team tiers
- **Time Savings:** 80% reduction in manual quote creation time

---

## Technical Architecture

### Recommended Stack
- **Frontend:** React 18+ with Tailwind CSS
- **Backend:** Node.js 20+ with Express/Fastify
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Hosting:** Replit (current) or Vercel/Railway (scalability)
- **Exports:** jsPDF (PDFs), SheetJS (Excel)

### Database Schema
- **9 core tables:** pricing_tiers, usage_pricing, cogs_structure, competitor_pricing, competitor_pricing_history, pricing_validation_queue, calculator_scenarios, migration_analyses, and access control
- **Seed data:** 4 tiers, 8 competitors, complete COGS structure
- **JSONB fields:** For flexible usage assumptions, advanced options, migration plans

### Security & Access Control

| Role | Access Level |
|------|--------------|
| **Sales Rep** | Client view only, export quotes, save to CRM |
| **Sales Manager** | All sales rep + internal margins, competitor data |
| **Finance** | All views + COGS editing, margin validation, LTV:CAC |
| **Executive** | All views + competitor pricing updates, strategic reports |
| **Prospect (Public)** | Steps 1-3 only, no internal data, no competitor details |

---

## Implementation Timeline

### 8-Week Roadmap

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1:** Core Calculator | Weeks 1-3 | Backend, database, Steps 1-5, pricing engine |
| **Phase 2:** Competitor Intelligence | Weeks 4-5 | Hybrid pricing system, migration calculator |
| **Phase 3:** Integration & Polish | Weeks 6-7 | API integrations, UI/UX, testing |
| **Phase 4:** Deployment | Week 8 | Launch, training, documentation |

### Critical Path Items
1. **Week 1:** Database schema & pricing engine (foundational)
2. **Week 3:** Internal margin analysis (validates business model)
3. **Week 5:** Migration calculator (competitive differentiator)
4. **Week 7:** Access control & security (protects internal data)

---

## Hybrid Pricing Data Management (Question #5 Answer)

### Recommended Approach: **Hybrid Model**

**Primary Strategy:** Manually Curated Database
- Quarterly reviews (every 90 days) of all 8 competitors
- Sources: Official vendor pricing pages, IDC/Forrester reports, customer intel, public contracts
- Version control with pricing history tracking
- "Last Updated" timestamp visible to users

**Secondary Strategy:** Automated Validation Layer
- Web scraping for public pricing pages (validation only, not primary source)
- Quarterly scraping to flag discrepancies (>10% difference triggers manual review)
- Alert system when competitors change published rates
- Validation queue for review and approval

**Why Hybrid > Fully Automated:**
1. Enterprise pricing is negotiated case-by-case (no single "price")
2. Volume discounts vary wildly (20-50% range)
3. APIs don't exist for most competitor platforms
4. Risk of legal issues scraping competitor sites
5. Pricing often behind login walls

**Workflow:**
- **Quarterly Review:** Finance team verifies all 8 competitors every 90 days
- **Automated Validation:** Scraper runs quarterly to flag changes >10%
- **Customer Reporting:** Sales team submits pricing intel from conversations
- **Approval Process:** Changes reviewed and approved before updating calculator

---

## Success Metrics

### Calculator Performance (Month 3 Targets)
- **Usage:** 50+ quotes/month
- **Conversion:** 30% of calculator quotes → deals
- **Time Savings:** 80% reduction in manual quote creation
- **Accuracy:** 95% pricing accuracy vs actuals

### Competitive Intelligence
- **Data Freshness:** 100% of competitors verified quarterly
- **Validation Rate:** 90% of flagged pricing changes reviewed within 7 days
- **Win Rate:** 10% increase in competitive displacement

### Business Impact (Year 1 Targets)
- **ARR:** $1.24M (per documentation)
- **Gross Margin:** 72% (scaling to 82% by Year 5)
- **LTV:CAC:** 13.2:1 blended average
- **Churn:** <8% weighted average

---

## Documents Provided

1. **-v2-calculator-spec.md** (Main specification document)
   - Complete 5-step user workflow with wireframes
   - Implementation roadmap (8-week timeline)
   - Technical stack recommendations
   - Security & access control
   - Success metrics & maintenance plan

2. **-v2-calculator-technical-details.md** (Technical implementation)
   - Complete SQL database schema with seed data
   - JavaScript pricing calculation functions
   - UI component library examples
   - API endpoint specifications
   - Testing strategy

3. **-v2-executive-summary.md** (This document)
   - High-level project overview
   - Business impact summary
   - Pricing & COGS summary
   - Hybrid pricing data approach (Question #5 answer)

---

## Next Steps

### Immediate Actions (This Week)
1. **Review & Approve:** Stakeholder review of specification documents
2. **Prioritize Features:** Confirm MVP vs. nice-to-have features
3. **Assign Resources:** Allocate development team (1-2 developers)
4. **Confirm Timeline:** Validate 8-week roadmap or adjust

### Phase 1 Kickoff (Week 1)
1. Set up PostgreSQL database on Replit/Supabase
2. Implement database schema and seed data
3. Build pricing calculation engine (Node.js)
4. Create basic React UI shell with navigation

### Questions for Stakeholders
- **Budget:** Any budget constraints for development or hosting?
- **Access:** Who needs access to internal margin views? (Finance, Exec, Sales Mgmt)
- **Integrations:** Which CRM to integrate with? (Salesforce, HubSpot, other)
- **Branding:** Design preferences for UI (use existing Oceanic brand guidelines?)
- **Timeline:** Is 8-week timeline acceptable or need to accelerate/decelerate?


---

**Status:** ✅ Specification Complete - Ready for Stakeholder Review  
**Last Updated:** November 21, 2025  
**Version:** 2.0 (Porpoise Focus Only - Other Oceanic products in future versions)
