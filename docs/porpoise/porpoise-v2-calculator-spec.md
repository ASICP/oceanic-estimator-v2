# Porpoise v2 Calculator - Comprehensive Specification Document

**Version:** 2.0  
**Date:** November 21, 2025  
**Product:** Porpoise (No-Code AI Training Platform)  
**Current Calculator:** https://github.com/ASICP/clabs-margin-calculator-v1 (on Replit)  

---

## Executive Summary

### Objectives
The Porpoise v2 Calculator upgrades the existing CLabs margin calculator to provide:
- **Client-facing pricing** for all Porpoise tiers and usage scenarios
- **Internal margin validation** showing COGS breakdown and gross margin targets (72-82%)
- **Competitor comparison** against 8 major platforms (AWS, GCP, Azure, Salesforce, Oracle, HuggingFace, Predibase, Replicate)
- **Migration cost analysis** for customers switching from competitors
- **Scenario simulation** for growth projections and ROI analysis

### Key Differentiators
- **40% multi-cloud GPU savings** vs competitors
- **Unique video avatar interviewer** (HeyGen-powered)
- **35,000+ pre-loaded templates** for instant value
- **27-minute median time-to-trained-model** vs days for competitors
- **94% success rate** vs 61% for AWS SageMaker first-time users

---

## Implementation Roadmap

### Phase 1: Core Calculator (Weeks 1-3)

**Week 1: Backend & Database**
- Set up database schema (all tables)
- Seed pricing tiers data
- Seed usage pricing data
- Seed COGS structure data
- Seed competitor pricing (8 competitors with Nov 2025 data)
- Create database connection layer
- Implement pricing calculation engine
- Implement COGS calculation engine
- Implement margin calculation functions

**Week 2: User Workflow (Steps 1-3)**
- Build Step 1: Product Selection & Scope
  - Workflow type selection
  - Use case category selector
  - Deployment preference
- Build Step 2: Team & Resource Configuration
  - User count input with tier auto-suggestion
  - Training capacity configuration
  - Avatar add-on calculator
  - Integration checkboxes
- Build Step 3: Usage Scenario Builder
  - Training activity inputs
  - Model specification selectors
  - Data & storage projections
  - API access configuration
  - Advanced options (collapsible)

**Week 3: Analysis & Output (Steps 4-5)**
- Build Step 4: Cost Analysis & Margins
  - Client-facing pricing summary
  - Internal margin analysis (access-controlled)
  - Competitor comparison table
  - ROI analysis calculator
- Build Step 5: Finalize & Simulate
  - 12-month projection generator
  - Migration cost calculator
  - Scaling scenarios (2x, 5x, 10x)
  - Export functionality (PDF, Excel, Share Link)

---

### Phase 2: Competitor Intelligence (Weeks 4-5)

**Week 4: Hybrid Pricing System**
- Build competitor pricing management dashboard
- Implement manual update workflow
- Create pricing history tracking
- Build validation queue system
- Implement automated scraping validation (for public pricing pages)
- Create quarterly review dashboard

**Week 5: Migration Calculator**
- Build migration cost calculation engine
- Implement competitor-specific migration logic
- Create migration ROI calculator
- Build migration plan generator (6-phase plan)
- Design migration plan PDF export template

---

### Phase 3: Integration & Polish (Weeks 6-7)

**Week 6: API Integrations**
- Build export API (PDF, Excel)
- Implement CRM integration (save to opportunity)
- Create shareable link generator
- Implement Blue Whale integration hooks (placeholder for future)
- Build webhook system for real-time updates

**Week 7: UI/UX & Testing**
- Implement design system (colors, typography, spacing)
- Build reusable UI components
- Add responsive design (mobile/tablet)
- Create access control system (client view vs internal view)
- Comprehensive testing (unit, integration, E2E)
- Performance optimization
- Security audit

---

### Phase 4: Deployment & Training (Week 8)

**Week 8: Launch**
- Deploy to production (Replit or dedicated hosting)
- Migrate from v1 calculator
- Create user documentation
- Record training videos for sales team
- Conduct sales team training session
- Set up monitoring & analytics
- Establish quarterly review process for competitor pricing

---

## Technical Stack Recommendations

### Frontend
- **Framework:** React 18+ (already on Replit)
- **State Management:** React Context API or Zustand (lightweight)
- **Styling:** Tailwind CSS (rapid development, consistent design)
- **Charts:** Recharts (for projections and comparisons)
- **Forms:** React Hook Form (performance, validation)
- **Export:** jsPDF (PDFs), SheetJS (Excel)

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js or Fastify
- **Database:** PostgreSQL 15+ (robust, supports JSON)
- **ORM:** Prisma (type-safe, migrations)
- **Auth:** JWT + role-based access control
- **Caching:** Redis (for competitor pricing, calculations)

### Deployment
- **Hosting:** Replit (current) or Vercel/Railway (scalability)
- **Database:** Supabase or Railway Postgres
- **CDN:** Cloudflare (static assets)
- **Monitoring:** Sentry (errors), PostHog (analytics)

---

## Security & Access Control

### User Roles

| Role | Access |
|------|--------|
| **Sales Rep** | Steps 1-5 (client view only), Export quotes, Save to CRM |
| **Sales Manager** | All sales rep + Internal margins view, Competitor data view |
| **Finance** | All views + COGS editing, Margin validation, LTV:CAC analysis |
| **Executive** | All views + Competitor pricing updates, Strategic reports |
| **Prospect (Public)** | Steps 1-3 only, No internal data, No competitor details |

### Data Protection
- **API Keys:** Stored in environment variables, never in code
- **Competitor Data:** Encrypted at rest, access-logged
- **Internal Margins:** Role-based access, audit trail
- **CRM Integration:** OAuth 2.0, token rotation
- **Exports:** Watermarked PDFs, expiring share links

---

## Success Metrics

### Calculator Performance
- **Usage:** 50+ quotes/month by Month 3
- **Conversion:** 30% of calculator quotes → deals
- **Time Savings:** 80% reduction in manual quote creation time
- **Accuracy:** 95% pricing accuracy (validated against actuals)

### Competitive Intelligence
- **Data Freshness:** 100% of competitors verified quarterly
- **Validation Rate:** 90% of flagged pricing changes reviewed within 7 days
- **Win Rate:** 10% increase in competitive displacement deals

### Business Impact
- **Deal Velocity:** 20% faster quote-to-close
- **Margin Protection:** Zero deals below 72% gross margin
- **Upsell Rate:** 25% of Starter quotes convert to Professional/Team
- **Customer Satisfaction:** 4.5/5 stars for pricing transparency

---

## Maintenance & Updates

### Quarterly Reviews (Every 90 Days)
1. Review all competitor pricing (manual verification)
2. Update COGS structure based on actual costs
3. Validate margin targets against business actuals
4. Update templates library count (35K+)
5. Refresh ROI benchmarks (time-to-model, success rates)

### Monthly Updates
- Review validation queue items
- Update pricing tier features (if product changes)
- Analyze calculator usage patterns
- Export top 10 scenarios for sales training

### Ad-Hoc Updates
- Competitor launches new pricing model → Immediate review
- Porpoise adds new features → Update calculator within 1 week
- Major cloud provider price change → Validate COGS within 3 days

---

## Appendices

### A. COGS Calculation Formulas (Summary)

```
Infrastructure COGS:
- GPU: actual_hours × $0.45/hr
- Storage: actual_GB × $0.05/GB/month
- Network: $2/month flat
- Multi-cloud overhead: (GPU + Storage) × 1.5%

Avatar COGS:
- HeyGen: num_avatars × $4.50/avatar/month

Twilio COGS:
- SMS: num_messages × $0.0075
- Voice: num_minutes × $0.013

Support COGS (monthly allocation):
- Starter: $12.50/month
- Professional: $25/month
- Team: $50/month
- Enterprise: $166.67/month

Total COGS = Infrastructure + Avatars + Twilio + Support
```

### B. Competitor Pricing Summary (Nov 2025)

| Competitor | Annual Cost | vs Porpoise (Starter @$3,462) |
|------------|-------------|-------------------------------|
| AWS SageMaker | $5,850 | +69% |
| Google Vertex | $6,240 | +80% |
| Azure ML | $5,520 | +59% |
| Salesforce | $9,000 | +160% |
| Oracle OCI | $4,800 | +39% |
| HuggingFace | $3,960 | +14% |
| Predibase | $4,200 | +21% |
| Replicate | $5,400 | +56% |

*Based on 500 users, 1,200 GPU-hours/year, 10TB storage usage profile*

### C. Margin Targets by Tier

| Tier | Year 1 Target | Year 5 Target | LTV:CAC Target |
|------|---------------|---------------|----------------|
| Starter | 72-75% | 78-82% | 3:1 minimum |
| Professional | 75-78% | 80-83% | 5:1 target |
| Team | 76-79% | 81-84% | 8:1 target |
| Enterprise | 78-82% | 82-85% | 10:1+ target |

### D. Migration Cost Assumptions

| Provider | Data Egress Cost | Typical Dataset Size | Estimated Export Cost |
|----------|------------------|----------------------|-----------------------|
| AWS | $0.09/GB | 100-500GB | $9-$45 |
| Google Cloud | $0.12/GB | 100-500GB | $12-$60 |
| Azure | $0.087/GB | 100-500GB | $8.70-$43.50 |
| Salesforce | $0 (API) | 50-200GB | $0 |
| Oracle | $0.05/GB | 100-500GB | $5-$25 |
| HuggingFace | $0 (open) | 50-200GB | $0 |
| Predibase | $0 (API) | 50-200GB | $0 |
| Replicate | $0 (API) | 50-200GB | $0 |

---

**END OF SPECIFICATION DOCUMENT**

---

## Next Steps

1. **Approve specification** - Review with stakeholders
2. **Prioritize features** - Determine MVP vs. nice-to-have
3. **Assign resources** - Development team allocation
4. **Set timeline** - Confirm 8-week roadmap or adjust
5. **Begin Phase 1** - Database schema & backend setup

For questions or clarifications, contact: [Project Lead Name]
