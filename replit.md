# Esteemed Ventures Multi-Agent Cost Estimator

## Overview

This is a React/TypeScript web application that provides cost estimation for AI-powered investment operations using Esteemed Ventures' specialized agent platform. The application features a 5-step wizard interface that helps users estimate costs and time for completing projects using EV's SME Agents Service. The system covers the full investment lifecycle including deal sourcing, financial modeling, legal review, and portfolio optimization, with the goal of providing 60-70% operational cost savings compared to traditional methods.

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
- **Workflows Table**: Stores preset and custom workflow configurations with complexity ratings and default agent assignments
- **Agents Table**: Contains agent profiles with capabilities, domains, costs, and recommendation flags
- **Cost Estimates Table**: Persists complete cost estimation sessions with all wizard step data
- **Cost Breakdown Items**: Detailed line items for cost analysis and reporting
- **Pricing Models Table**: Configurable pricing tiers and billing models

### Key Design Patterns
- **Wizard Pattern**: Multi-step form interface with data persistence across steps and validation at each stage
- **Component Composition**: Modular UI components with clear separation of concerns and reusable design patterns
- **Repository Pattern**: Storage abstraction layer supporting both in-memory development and PostgreSQL production environments
- **Hook-Based State**: Custom React hooks for data fetching, cost calculations, and wizard state management

### Cost Calculation Engine
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