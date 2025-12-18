# Porpoise v2 Calculator - Technical Implementation Details

**Companion Document to Main Specification**  
**Version:** 2.0  
**Date:** November 21, 2025  

---

## Table of Contents

1. [Database Schema (SQL)](#database-schema-sql)
2. [Pricing Calculation Functions](#pricing-calculation-functions)
3. [UI Component Library](#ui-component-library)
4. [API Endpoints](#api-endpoints)
5. [Hybrid Pricing Management](#hybrid-pricing-management)
6. [Testing Strategy](#testing-strategy)

---

## 1. Database Schema (SQL)

### Complete Database Setup

```sql
-- =======================
-- PORPOISE V2 CALCULATOR
-- Database Schema
-- =======================

-- Drop existing tables (for clean install)
DROP TABLE IF EXISTS migration_analyses;
DROP TABLE IF EXISTS calculator_scenarios;
DROP TABLE IF EXISTS pricing_validation_queue;
DROP TABLE IF EXISTS competitor_pricing_history;
DROP TABLE IF EXISTS competitor_pricing;
DROP TABLE IF EXISTS cogs_structure;
DROP TABLE IF EXISTS usage_pricing;
DROP TABLE IF EXISTS pricing_tiers;

-- =======================
-- Core Pricing Tables
-- =======================

-- Pricing Tiers
CREATE TABLE pricing_tiers (
  tier_id VARCHAR(50) PRIMARY KEY,
  tier_name VARCHAR(100) NOT NULL,
  monthly_price DECIMAL(10,2),
  annual_price DECIMAL(10,2),
  annual_discount_percent DECIMAL(5,2) DEFAULT 10.00,
  
  -- Included resources
  included_users INT,
  included_concurrent_jobs INT,
  included_storage_gb INT,
  included_gpu_hours INT,
  included_api_calls INT,
  included_avatars INT,  -- -1 for unlimited
  
  -- Features
  quick_train_wizard BOOLEAN DEFAULT TRUE,
  advanced_workflows BOOLEAN DEFAULT FALSE,
  ai_interviewer BOOLEAN DEFAULT FALSE,
  sso_saml BOOLEAN DEFAULT FALSE,
  white_label_avatars BOOLEAN DEFAULT FALSE,
  byoc_deployment BOOLEAN DEFAULT FALSE,
  air_gap_deployment BOOLEAN DEFAULT FALSE,
  dedicated_gpu BOOLEAN DEFAULT FALSE,
  
  -- Support level
  support_level VARCHAR(50),
  
  -- Metadata
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage-based Pricing
CREATE TABLE usage_pricing (
  pricing_id SERIAL PRIMARY KEY,
  resource_type VARCHAR(50) NOT NULL,
  price_per_unit DECIMAL(10,4) NOT NULL,
  unit_name VARCHAR(50),
  effective_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_pricing_resource ON usage_pricing(resource_type, effective_date);

-- COGS Structure
CREATE TABLE cogs_structure (
  cogs_id SERIAL PRIMARY KEY,
  cost_category VARCHAR(100) NOT NULL,
  cost_subcategory VARCHAR(100),
  cost_per_unit DECIMAL(10,4) NOT NULL,
  unit_name VARCHAR(50),
  tier_id VARCHAR(50),
  effective_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tier_id) REFERENCES pricing_tiers(tier_id)
);

CREATE INDEX idx_cogs_category ON cogs_structure(cost_category, effective_date);

-- =======================
-- Competitor Intelligence
-- =======================

-- Competitor Pricing
CREATE TABLE competitor_pricing (
  competitor_id SERIAL PRIMARY KEY,
  competitor_key VARCHAR(50) UNIQUE NOT NULL,
  competitor_name VARCHAR(200) NOT NULL,
  
  -- Pricing data
  annual_cost_estimate DECIMAL(10,2) NOT NULL,
  usage_assumptions JSONB,
  
  -- Positioning
  vendor_lock_in VARCHAR(200),
  strengths JSONB,
  weaknesses JSONB,
  
  -- Data source tracking
  data_source VARCHAR(50),
  last_verified_date DATE NOT NULL,
  last_updated_by VARCHAR(100),
  verification_notes TEXT,
  
  -- Scraping config
  pricing_page_url VARCHAR(500),
  scrape_enabled BOOLEAN DEFAULT FALSE,
  scrape_frequency_days INT DEFAULT 90,
  last_scraped_date DATE,
  
  -- Metadata
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competitor_verified ON competitor_pricing(last_verified_date);

-- Competitor Pricing History
CREATE TABLE competitor_pricing_history (
  history_id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL,
  annual_cost_estimate DECIMAL(10,2) NOT NULL,
  change_amount DECIMAL(10,2),
  change_percent DECIMAL(5,2),
  change_reason VARCHAR(200),
  effective_date DATE NOT NULL,
  recorded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (competitor_id) REFERENCES competitor_pricing(competitor_id)
);

CREATE INDEX idx_history_competitor ON competitor_pricing_history(competitor_id, effective_date);

-- Pricing Validation Queue
CREATE TABLE pricing_validation_queue (
  queue_id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL,
  validation_type VARCHAR(50),
  priority VARCHAR(20),
  
  current_price DECIMAL(10,2),
  reported_price DECIMAL(10,2),
  price_difference DECIMAL(10,2),
  
  source VARCHAR(100),
  source_details TEXT,
  
  status VARCHAR(50),
  assigned_to VARCHAR(100),
  reviewed_by VARCHAR(100),
  review_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  
  FOREIGN KEY (competitor_id) REFERENCES competitor_pricing(competitor_id)
);

CREATE INDEX idx_validation_status ON pricing_validation_queue(status);

-- =======================
-- Calculator Scenarios
-- =======================

-- Saved Calculator Scenarios
CREATE TABLE calculator_scenarios (
  scenario_id SERIAL PRIMARY KEY,
  scenario_name VARCHAR(200),
  
  tier_id VARCHAR(50) NOT NULL,
  billing_period VARCHAR(20),
  
  -- Usage profile
  num_users INT,
  concurrent_jobs INT,
  storage_gb DECIMAL(10,2),
  gpu_hours_monthly DECIMAL(10,2),
  api_calls_monthly INT,
  num_avatars INT,
  
  -- Advanced options (JSON)
  advanced_options JSONB,
  
  -- Calculated results (cached)
  monthly_cost DECIMAL(10,2),
  annual_cost DECIMAL(10,2),
  monthly_cogs DECIMAL(10,2),
  annual_cogs DECIMAL(10,2),
  gross_margin_percent DECIMAL(5,2),
  
  -- Metadata
  created_by VARCHAR(100),
  created_for_prospect VARCHAR(200),
  crm_opportunity_id VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tier_id) REFERENCES pricing_tiers(tier_id)
);

CREATE INDEX idx_scenario_created_by ON calculator_scenarios(created_by);
CREATE INDEX idx_scenario_opportunity ON calculator_scenarios(crm_opportunity_id);

-- Migration Analyses
CREATE TABLE migration_analyses (
  migration_id SERIAL PRIMARY KEY,
  scenario_id INT,
  
  current_provider_id INT NOT NULL,
  current_annual_cost DECIMAL(10,2),
  
  -- Migration costs
  data_export_cost DECIMAL(10,2),
  onboarding_cost DECIMAL(10,2),
  retraining_cost DECIMAL(10,2),
  team_training_cost DECIMAL(10,2),
  total_migration_cost DECIMAL(10,2),
  
  -- ROI metrics
  annual_savings DECIMAL(10,2),
  payback_months DECIMAL(5,2),
  three_year_savings DECIMAL(10,2),
  
  -- Migration plan (JSON)
  migration_plan_json JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (scenario_id) REFERENCES calculator_scenarios(scenario_id),
  FOREIGN KEY (current_provider_id) REFERENCES competitor_pricing(competitor_id)
);

CREATE INDEX idx_migration_scenario ON migration_analyses(scenario_id);

-- =======================
-- Seed Data
-- =======================

-- Insert Pricing Tiers
INSERT INTO pricing_tiers VALUES
('starter', 'Starter', 249.00, 2388.00, 10.00,
 10, 3, 10, 20, 5000, 0,
 TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE,
 'community', TRUE, NOW(), NOW()),
 
('professional', 'Professional', 749.00, 7188.00, 10.00,
 50, 10, 100, 100, 50000, 6,
 TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE,
 'email', TRUE, NOW(), NOW()),
 
('team', 'Team', 1999.00, 19188.00, 10.00,
 100, 25, 500, 300, 200000, -1,
 TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE,
 'priority', TRUE, NOW(), NOW()),
 
('enterprise', 'Enterprise', NULL, NULL, NULL,
 -1, -1, -1, -1, -1, -1,
 TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
 '24/7', TRUE, NOW(), NOW());

-- Insert Usage Pricing
INSERT INTO usage_pricing (resource_type, price_per_unit, unit_name, effective_date) VALUES
('gpu_hour', 0.75, 'hour', '2025-01-01'),
('storage_gb', 0.10, 'GB/month', '2025-01-01'),
('api_call', 0.002, 'call', '2025-01-01'),
('inference_token', 0.0008, '1K tokens', '2025-01-01'),
('avatar_addon_starter', 49.00, '6 avatars/month', '2025-01-01'),
('avatar_addon_professional', 25.00, '6 avatars/month', '2025-01-01');

-- Insert COGS Structure
INSERT INTO cogs_structure (cost_category, cost_subcategory, cost_per_unit, unit_name, tier_id, effective_date, notes) VALUES
('infrastructure', 'gpu_compute', 0.45, 'hour', NULL, '2025-01-01', '40% savings vs hyperscalers'),
('infrastructure', 'storage', 0.05, 'GB/month', NULL, '2025-01-01', 'Multi-cloud optimization'),
('infrastructure', 'network', 2.00, 'month', NULL, '2025-01-01', 'Bandwidth allocation'),
('infrastructure', 'multi_cloud_overhead', 1.50, 'percent', NULL, '2025-01-01', 'Management overhead'),
('avatars', 'heygen_credit', 4.50, 'avatar/month', NULL, '2025-01-01', 'HeyGen API costs'),
('twilio', 'sms', 0.0075, 'message', NULL, '2025-01-01', 'Twilio SMS'),
('twilio', 'voice', 0.013, 'minute', NULL, '2025-01-01', 'Twilio Voice'),
('support', 'customer_success', 12.50, 'month', 'starter', '2025-01-01', 'Allocated CS time'),
('support', 'customer_success', 25.00, 'month', 'professional', '2025-01-01', 'Allocated CS time'),
('support', 'customer_success', 50.00, 'month', 'team', '2025-01-01', 'Allocated CS time'),
('support', 'customer_success', 166.67, 'month', 'enterprise', '2025-01-01', 'Allocated CS time');

-- Insert Competitor Pricing
INSERT INTO competitor_pricing (
  competitor_key, competitor_name, annual_cost_estimate, usage_assumptions,
  vendor_lock_in, strengths, weaknesses, data_source, last_verified_date, last_updated_by
) VALUES
('aws_sagemaker', 'AWS SageMaker Canvas', 5850.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'AWS ecosystem',
 '["Integrated with AWS services", "Auto ML capabilities", "Savings Plans discounts"]'::jsonb,
 '["Vendor lock-in", "No avatar capabilities", "AWS-only deployment"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('google_vertex', 'Google Vertex AI AutoML', 6240.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'GCP ecosystem',
 '["BigQuery integration", "Strong AutoML", "Model Garden"]'::jsonb,
 '["GCP-centric", "No video avatars", "Limited multi-cloud"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('azure_ml', 'Azure ML Designer', 5520.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'Azure ecosystem',
 '["Power BI integration", "Visual pipelines", "Reserved Instance savings"]'::jsonb,
 '["Azure lock-in", "Generic templates", "No avatar tools"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('salesforce', 'Salesforce Einstein Model Builder', 9000.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'Salesforce CRM',
 '["CRM integration", "Data Cloud connectors", "Salesforce ecosystem"]'::jsonb,
 '["CRM-tied", "Premium pricing", "50-85% higher TCO"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('oracle_oci', 'Oracle APEX AI / OCI GenAI', 4800.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'Oracle ecosystem',
 '["Multi-cloud via OCI", "Autonomous DB integration", "Universal Credits"]'::jsonb,
 '["DB-centric", "No avatars", "Longer setup time"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('huggingface', 'Hugging Face AutoTrain', 3960.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'None (open source)',
 '["Open source", "Large model library", "Affordable", "Community-driven"]'::jsonb,
 '["Fragmented", "No enterprise integrations", "Variable GPU costs"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('predibase', 'Predibase', 4200.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'None',
 '["Serverless LoRA", "Token-efficient", "Pay-per-use"]'::jsonb,
 '["No data capture tools", "Limited to 16B params", "No avatars"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team'),

('replicate', 'Replicate', 5400.00,
 '{"users": 500, "gpuHours": 1200, "storageGB": 10000}'::jsonb,
 'None',
 '["200+ models", "One-line deploys", "Fast boot", "API-first"]'::jsonb,
 '["Dev-focused", "No enterprise workflows", "Basic training"]'::jsonb,
 'manual', '2025-11-15', 'CLabs Research Team');

-- Grant permissions (adjust based on your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO porpoise_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO porpoise_app;
```

---

## 2. Pricing Calculation Functions

### JavaScript/TypeScript Implementation

```javascript
// pricing-engine.js
// Core pricing calculation logic for Porpoise v2 Calculator

/**
 * Tier pricing structure
 */
const TIER_PRICING = {
  starter: {
    monthly: 249,
    annual: 2388,
    included: {
      users: 10,
      concurrentJobs: 3,
      storageGB: 10,
      gpuHours: 20,
      apiCalls: 5000,
      avatars: 0
    }
  },
  professional: {
    monthly: 749,
    annual: 7188,
    included: {
      users: 50,
      concurrentJobs: 10,
      storageGB: 100,
      gpuHours: 100,
      apiCalls: 50000,
      avatars: 6
    }
  },
  team: {
    monthly: 1999,
    annual: 19188,
    included: {
      users: 100,
      concurrentJobs: 25,
      storageGB: 500,
      gpuHours: 300,
      apiCalls: 200000,
      avatars: -1  // Unlimited
    }
  },
  enterprise: {
    monthly: null,
    annual: null,
    included: {
      users: -1,
      concurrentJobs: -1,
      storageGB: -1,
      gpuHours: -1,
      apiCalls: -1,
      avatars: -1
    }
  }
};

/**
 * Usage-based pricing
 */
const USAGE_PRICING = {
  gpuHourOverage: 0.75,
  storageOverage: 0.10,
  apiCallOverage: 0.002,
  inferenceTokens: 0.0008,
  avatars: {
    starter: { addon: 49, additional: 0 },
    professional: { included: 6, additional: 25 },
    team: { included: -1, additional: 0 },
    enterprise: { included: -1, additional: 0 }
  }
};

/**
 * COGS structure
 */
const COGS_STRUCTURE = {
  infrastructure: {
    gpuComputePerHour: 0.45,
    storagePerGB: 0.05,
    networkPerMonth: 2,
    multiCloudOverhead: 1.5
  },
  avatars: {
    costPerAvatarPerMonth: 4.50
  },
  twilio: {
    smsPerMessage: 0.0075,
    voicePerMinute: 0.013
  },
  support: {
    starter: 150 / 12,
    professional: 300 / 12,
    team: 600 / 12,
    enterprise: 2000 / 12
  },
  platformMaintenance: {
    starter: 75 / 12,
    professional: 100 / 12,
    team: 150 / 12,
    enterprise: 500 / 12
  }
};

/**
 * Calculate monthly subscription cost
 */
function calculateMonthlySubscription(tier, billingPeriod) {
  if (tier === 'enterprise') return null;
  
  const basePrice = TIER_PRICING[tier][billingPeriod];
  
  if (billingPeriod === 'annual') {
    return basePrice / 12;
  }
  
  return basePrice;
}

/**
 * Calculate overage costs
 */
function calculateOverages(tier, usage) {
  const included = TIER_PRICING[tier].included;
  let overages = {
    gpu: 0,
    storage: 0,
    apiCalls: 0,
    total: 0
  };
  
  // GPU Hours
  if (usage.gpuHours > included.gpuHours) {
    overages.gpu = (usage.gpuHours - included.gpuHours) * USAGE_PRICING.gpuHourOverage;
  }
  
  // Storage
  if (usage.storageGB > included.storageGB) {
    overages.storage = (usage.storageGB - included.storageGB) * USAGE_PRICING.storageOverage;
  }
  
  // API Calls
  if (usage.apiCalls > included.apiCalls) {
    overages.apiCalls = (usage.apiCalls - included.apiCalls) * USAGE_PRICING.apiCallOverage;
  }
  
  overages.total = overages.gpu + overages.storage + overages.apiCalls;
  return overages;
}

/**
 * Calculate avatar costs
 */
function calculateAvatarCost(tier, numberOfAvatars) {
  const avatarPricing = USAGE_PRICING.avatars[tier];
  
  if (tier === 'starter') {
    return numberOfAvatars > 0 ? avatarPricing.addon : 0;
  }
  
  if (tier === 'professional') {
    if (numberOfAvatars <= avatarPricing.included) return 0;
    const additional = numberOfAvatars - avatarPricing.included;
    const additionalBlocks = Math.ceil(additional / 6);
    return additionalBlocks * avatarPricing.additional;
  }
  
  return 0;  // Team and Enterprise include unlimited
}

/**
 * Calculate total monthly cost
 */
function calculateTotalMonthlyCost(tier, billingPeriod, usage, numberOfAvatars) {
  const subscription = calculateMonthlySubscription(tier, billingPeriod);
  const overages = calculateOverages(tier, usage);
  const avatars = calculateAvatarCost(tier, numberOfAvatars);
  
  return {
    subscription,
    overages: overages.total,
    overagesBreakdown: {
      gpu: overages.gpu,
      storage: overages.storage,
      apiCalls: overages.apiCalls
    },
    avatars,
    total: subscription + overages.total + avatars
  };
}

/**
 * Calculate infrastructure COGS
 */
function calculateInfrastructureCOGS(usage) {
  const gpu = usage.gpuHours * COGS_STRUCTURE.infrastructure.gpuComputePerHour;
  const storage = usage.storageGB * COGS_STRUCTURE.infrastructure.storagePerGB;
  const network = COGS_STRUCTURE.infrastructure.networkPerMonth;
  const overhead = (gpu + storage) * (COGS_STRUCTURE.infrastructure.multiCloudOverhead / 100);
  
  return {
    gpu,
    storage,
    network,
    overhead,
    total: gpu + storage + network + overhead
  };
}

/**
 * Calculate total COGS
 */
function calculateTotalCOGS(tier, usage, numberOfAvatars) {
  const infrastructure = calculateInfrastructureCOGS(usage);
  
  let avatarCOGS = 0;
  if (tier === 'team' || tier === 'enterprise') {
    avatarCOGS = (numberOfAvatars || 12) * COGS_STRUCTURE.avatars.costPerAvatarPerMonth;
  } else if (numberOfAvatars > 0) {
    avatarCOGS = numberOfAvatars * COGS_STRUCTURE.avatars.costPerAvatarPerMonth;
  }
  
  const support = COGS_STRUCTURE.support[tier] || 0;
  const maintenance = COGS_STRUCTURE.platformMaintenance[tier] || 0;
  
  return {
    infrastructure: infrastructure.total,
    infrastructureBreakdown: infrastructure,
    avatars: avatarCOGS,
    support: support + maintenance,
    total: infrastructure.total + avatarCOGS + support + maintenance
  };
}

/**
 * Calculate gross margin
 */
function calculateGrossMargin(revenue, cogs) {
  const grossProfit = revenue - cogs;
  const grossMarginPercent = (grossProfit / revenue) * 100;
  
  return {
    revenue,
    cogs,
    grossProfit,
    grossMarginPercent,
    withinTarget: grossMarginPercent >= 72 && grossMarginPercent <= 82,
    status: grossMarginPercent < 72 ? 'below_target' :
            grossMarginPercent > 82 ? 'above_target' : 'on_target'
  };
}

/**
 * Perform full pricing analysis
 */
function performFullPricingAnalysis(tier, billingPeriod, usage, numberOfAvatars) {
  // Revenue
  const pricing = calculateTotalMonthlyCost(tier, billingPeriod, usage, numberOfAvatars);
  const monthlyRevenue = pricing.total;
  const annualRevenue = billingPeriod === 'annual' ? 
    pricing.subscription * 12 * 0.9 + (pricing.overages + pricing.avatars) * 12 :
    monthlyRevenue * 12;
  
  // COGS
  const monthlyCOGS = calculateTotalCOGS(tier, usage, numberOfAvatars);
  const annualCOGS = monthlyCOGS.total * 12;
  
  // Margin
  const monthlyMargin = calculateGrossMargin(monthlyRevenue, monthlyCOGS.total);
  const annualMargin = calculateGrossMargin(annualRevenue, annualCOGS);
  
  return {
    pricing: {
      monthly: pricing,
      annual: {
        subscription: pricing.subscription * 12 * (billingPeriod === 'annual' ? 0.9 : 1),
        overages: pricing.overages * 12,
        avatars: pricing.avatars * 12,
        total: annualRevenue
      }
    },
    cogs: {
      monthly: monthlyCOGS,
      annual: annualCOGS
    },
    margin: {
      monthly: monthlyMargin,
      annual: annualMargin
    }
  };
}

// Export functions
module.exports = {
  calculateTotalMonthlyCost,
  calculateTotalCOGS,
  calculateGrossMargin,
  performFullPricingAnalysis,
  TIER_PRICING,
  USAGE_PRICING,
  COGS_STRUCTURE
};
```

---

**END OF TECHNICAL DETAILS DOCUMENT**

This document continues with API endpoints, testing strategy, and component examples in the full implementation.

