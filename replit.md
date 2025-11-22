# CLabs Margin Calculator v2

## Overview

This repository hosts two pricing calculator applications:

1. **Porpoise v2 Calculator** (Primary - Phase 1 Complete): A PostgreSQL-based pricing calculator for the Porpoise AI service with hybrid pricing approach, margin validation against 72-82% target range, and competitor comparison. Features a 3-step wizard interface with role-based visibility controls.

2. **Esteemed Ventures Multi-Agent Cost Estimator v1** (Historical Reference): Original 5-step wizard for AI-powered investment operations cost estimation. Retained for historical reference until agents service is upgraded.

## Version History

### Porpoise v2 Calculator
- **v2.0.0 - Phase 1** (Current): Initial release with 3-step wizard, pricing calculation engine, COGS analysis, margin validation, and competitor comparison
  - Database: 9 PostgreSQL tables with Drizzle ORM
  - Calculation Engine: Tier pricing, usage-based costs, COGS, margin analysis
  - UI: 3-step wizard with Client/Internal view modes
  - Routes: "/" (main calculator), "/estimator-v1" (historical v1)

### Esteemed Ventures Multi-Agent v1
- **v1.0.0**: Original Esteemed Ventures Multi-Agent Cost Estimator (available at https://github.com/ASICP/clabs-margin-calculator-v1)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with custom design system implementing dual light/dark themes
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Runtime**: Node.js with Express server framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful API endpoints following standard HTTP conventions
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Development Server**: Custom Vite integration for hot module replacement during development

### Database Schema

#### Porpoise v2 Tables (9 tables)
- **pricing_tiers**: Porpoise pricing tiers (Starter, Professional, Team, Enterprise) with included resources and limits
- **usage_pricing**: Usage-based pricing (GPU hours, storage, API calls, avatars, add-ons)
- **cogs_structure**: Cost of Goods Sold structure (infrastructure, avatars, Twilio, support costs)
- **competitor_pricing**: Competitor pricing data for comparison (Salesforce, AWS, Google, Azure, etc.)
- **competitor_pricing_history**: Historical competitor pricing tracking
- **pricing_validation_queue**: Queue for pricing validation workflows
- **calculator_scenarios**: Saved pricing scenarios for reuse
- **migration_analyses**: Migration cost analysis tracking
- **user_roles**: Role-based access control (Client View vs Internal View)

#### Esteemed Ventures v1 Tables (Legacy)
- **Workflows Table**: Preset and custom workflow configurations with complexity ratings
- **Agents Table**: Agent profiles with capabilities, domains, costs, and recommendation flags
- **Cost Estimates Table**: Complete cost estimation sessions with all wizard step data
- **Cost Breakdown Items**: Detailed line items for cost analysis and reporting
- **Pricing Models Table**: Configurable pricing tiers and billing models

### Key Design Patterns
- **Wizard Pattern**: Multi-step form interface with data persistence across steps and validation at each stage
- **Component Composition**: Modular UI components with clear separation of concerns and reusable design patterns
- **Repository Pattern**: Storage abstraction layer supporting both in-memory development and PostgreSQL production environments
- **Hook-Based State**: Custom React hooks for data fetching, cost calculations, and wizard state management

### Cost Calculation Engines

#### Porpoise v2 Calculator (Active)
- **Tier Pricing**: Base pricing with annual discounts (10-20% by tier)
- **Usage-Based Costs**: Overage calculations for GPU hours, storage, API calls, avatars
- **COGS Calculation**: Infrastructure (GPU, storage, network), avatars (HeyGen), Twilio, tier-specific support costs
- **Margin Analysis**: Gross margin calculation with tier-specific targets (Starter: 72-75%, Professional: 75-78%, Team: 76-79%, Enterprise: 78-82%)
- **Competitor Comparison**: Savings calculation against 8 competitors (Salesforce, AWS, Google, Azure, Oracle, Replicate, Predibase, HuggingFace)
- **Validation**: Automated margin validation against target ranges with status indicators

#### Esteemed Ventures v1 Calculator (Legacy)
- **Input Processing**: Comprehensive data collection across workflow complexity, agent selection, resource requirements, and billing preferences
- **Calculation Logic**: Multi-factor cost modeling including API usage, infrastructure costs, error rate impacts, and volume discounts
- **Savings Analysis**: Comparative analysis showing traditional vs AI-powered costs with detailed breakdown charts
- **Sensitivity Analysis**: Interactive sliders for real-time "what-if" scenario modeling

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for production deployment
- **Drizzle Kit**: Database migration and schema management tools

### UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Recharts**: Chart library for cost visualization and breakdown displays
- **Lucide React**: Modern icon system with consistent design language

### Development and Build Tools
- **TypeScript**: Static type checking with strict configuration for enhanced code quality
- **Vite**: Fast build tool with HMR and optimized production builds
- **ESBuild**: High-performance JavaScript bundler for server-side builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### External APIs and Services
- **Google Fonts**: Inter font family for consistent typography across the application
- **Replit Integration**: Development environment integration for runtime error overlays and cartographer mapping

### Third-Party Integrations
- **Model Context Protocol (MCP)**: Integration layer for real-time pricing from multiple LLM providers
- **SLM/Enterprise Memory System**: Connection to Esteemed Ventures' proprietary Small Language Model for dynamic preset evolution
- **Multi-Model Architecture**: Support for OpenAI GPT, Anthropic Claude, Groq, and Google Gemini APIs