-- ========================================
-- ECHO RAG CALCULATOR v2.0
-- Database Schema (PostgreSQL 15+)
-- Adapted from Porpoise Calculator Blueprint
-- ========================================
-- Date: November 30, 2025
-- Description: Complete database schema for Echo RAG pricing calculator
-- Features: Managed SaaS + Self-Hosted tiers, Competitor intelligence, COGS tracking
-- ========================================

-- Drop existing tables (for clean install)
DROP TABLE IF EXISTS migration_analyses CASCADE;
DROP TABLE IF EXISTS calculator_scenarios CASCADE;
DROP TABLE IF EXISTS pricing_validation_queue CASCADE;
DROP TABLE IF EXISTS competitor_pricing_history CASCADE;
DROP TABLE IF EXISTS competitor_pricing CASCADE;
DROP TABLE IF EXISTS cogs_structure CASCADE;
DROP TABLE IF EXISTS usage_pricing CASCADE;
DROP TABLE IF EXISTS pricing_tiers CASCADE;
DROP TABLE IF EXISTS access_control CASCADE;

-- ========================================
-- CORE PRICING TABLES
-- ========================================

-- 1. Pricing Tiers
CREATE TABLE pricing_tiers (
  tier_id VARCHAR(50) PRIMARY KEY,
  tier_name VARCHAR(100) NOT NULL,
  deployment_type VARCHAR(50) NOT NULL, -- 'managed_saas' or 'self_hosted'

  -- Pricing
  monthly_price DECIMAL(10,2),
  annual_price DECIMAL(10,2),
  annual_discount_percent DECIMAL(5,2) DEFAULT 20.00,

  -- Included resources (-1 = unlimited)
  users_min INT,
  users_max INT,
  connectors_included INT,
  storage_gb_included INT,
  monthly_queries_included INT,  -- -1 for unlimited

  -- Features (boolean flags)
  hybrid_search BOOLEAN DEFAULT TRUE,
  permission_aware_rag BOOLEAN DEFAULT TRUE,
  voice_interface BOOLEAN DEFAULT TRUE,
  visual_search BOOLEAN DEFAULT TRUE,
  advanced_analytics BOOLEAN DEFAULT FALSE,
  dedicated_csm BOOLEAN DEFAULT FALSE,
  custom_connectors_included INT DEFAULT 0,
  sso_saml BOOLEAN DEFAULT FALSE,
  air_gap_deployment BOOLEAN DEFAULT FALSE,

  -- Support & SLA
  support_level VARCHAR(50),
  sla_uptime_percent DECIMAL(5,2),

  -- Metadata
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE pricing_tiers IS 'Echo RAG pricing tiers: Starter, Professional, Enterprise (SaaS + Self-Hosted)';
COMMENT ON COLUMN pricing_tiers.deployment_type IS 'managed_saas or self_hosted';
COMMENT ON COLUMN pricing_tiers.connectors_included IS '-1 for unlimited connectors';
COMMENT ON COLUMN pricing_tiers.storage_gb_included IS '-1 for unlimited storage';

-- 2. Usage-Based Pricing
CREATE TABLE usage_pricing (
  pricing_id SERIAL PRIMARY KEY,
  resource_type VARCHAR(50) NOT NULL,
  resource_name VARCHAR(100) NOT NULL,
  price_per_unit DECIMAL(10,4) NOT NULL,
  unit_name VARCHAR(50),
  applies_to_tiers VARCHAR[] DEFAULT ARRAY['all'],
  effective_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_pricing_resource ON usage_pricing(resource_type, effective_date);

COMMENT ON TABLE usage_pricing IS 'Usage-based pricing for connectors, storage, voice, visual search add-ons';
COMMENT ON COLUMN usage_pricing.applies_to_tiers IS 'Array of tier_ids or [''all''] for universal pricing';

-- 3. COGS Structure
CREATE TABLE cogs_structure (
  cogs_id SERIAL PRIMARY KEY,
  cost_category VARCHAR(100) NOT NULL,
  cost_subcategory VARCHAR(100),
  cost_per_unit DECIMAL(10,4) NOT NULL,
  unit_name VARCHAR(50),
  tier_id VARCHAR(50),
  user_count_bracket VARCHAR(50), -- '0-50', '50-500', '500+'
  effective_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tier_id) REFERENCES pricing_tiers(tier_id)
);

CREATE INDEX idx_cogs_category ON cogs_structure(cost_category, effective_date);
CREATE INDEX idx_cogs_tier ON cogs_structure(tier_id);

COMMENT ON TABLE cogs_structure IS 'Infrastructure costs for margin analysis: compute, storage, AI/ML, data transfer, support';
COMMENT ON COLUMN cogs_structure.cost_category IS 'infrastructure, ai_ml, data_transfer, support, monitoring';

-- ========================================
-- COMPETITOR INTELLIGENCE
-- ========================================

-- 4. Competitor Pricing
CREATE TABLE competitor_pricing (
  competitor_id SERIAL PRIMARY KEY,
  competitor_key VARCHAR(50) UNIQUE NOT NULL,
  competitor_name VARCHAR(200) NOT NULL,

  -- Pricing data
  annual_cost_estimate DECIMAL(10,2) NOT NULL,
  usage_assumptions JSONB, -- {users: 250, connectors: 15, storageGB: 850, queries: 90000}

  -- Feature comparison
  connectors_count INT,
  voice_interface BOOLEAN DEFAULT FALSE,
  visual_search BOOLEAN DEFAULT FALSE,
  self_hosted_option BOOLEAN DEFAULT FALSE,
  managed_saas_option BOOLEAN DEFAULT TRUE,

  -- Positioning
  vendor_lock_in VARCHAR(200),
  strengths JSONB,
  weaknesses JSONB,

  -- Data source tracking (hybrid system)
  data_source VARCHAR(50), -- 'manual', 'scrape', 'api'
  last_verified_date DATE NOT NULL,
  last_updated_by VARCHAR(100),
  verification_notes TEXT,

  -- Automated scraping config
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
CREATE INDEX idx_competitor_key ON competitor_pricing(competitor_key);

COMMENT ON TABLE competitor_pricing IS 'Competitor pricing for Glean, Danswer, Perplexity, Hebbia';
COMMENT ON COLUMN competitor_pricing.data_source IS 'Hybrid: manual quarterly review + automated scraping validation';

-- 5. Competitor Pricing History
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

  FOREIGN KEY (competitor_id) REFERENCES competitor_pricing(competitor_id) ON DELETE CASCADE
);

CREATE INDEX idx_history_competitor ON competitor_pricing_history(competitor_id, effective_date);

COMMENT ON TABLE competitor_pricing_history IS 'Track competitor price changes over time';

-- 6. Pricing Validation Queue
CREATE TABLE pricing_validation_queue (
  queue_id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL,
  validation_type VARCHAR(50), -- 'quarterly_review', 'scrape_change', 'customer_report'
  priority VARCHAR(20), -- 'low', 'medium', 'high', 'critical'

  current_price DECIMAL(10,2),
  reported_price DECIMAL(10,2),
  price_difference DECIMAL(10,2),

  source VARCHAR(100),
  source_details TEXT,

  status VARCHAR(50), -- 'pending', 'in_review', 'approved', 'rejected'
  assigned_to VARCHAR(100),
  reviewed_by VARCHAR(100),
  review_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,

  FOREIGN KEY (competitor_id) REFERENCES competitor_pricing(competitor_id) ON DELETE CASCADE
);

CREATE INDEX idx_validation_status ON pricing_validation_queue(status);
CREATE INDEX idx_validation_priority ON pricing_validation_queue(priority, status);

COMMENT ON TABLE pricing_validation_queue IS 'Queue for reviewing competitor pricing changes';

-- ========================================
-- CALCULATOR SCENARIOS & MIGRATIONS
-- ========================================

-- 7. Saved Calculator Scenarios
CREATE TABLE calculator_scenarios (
  scenario_id SERIAL PRIMARY KEY,
  scenario_name VARCHAR(200),

  -- Tier selection
  tier_id VARCHAR(50) NOT NULL,
  deployment_type VARCHAR(50),
  billing_period VARCHAR(20), -- 'monthly', 'annual'

  -- Company profile
  company_name VARCHAR(200),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  use_cases JSONB, -- Array of selected use cases

  -- Usage profile
  num_users INT,
  num_connectors INT,
  storage_gb DECIMAL(10,2),
  monthly_queries INT,
  voice_percentage DECIMAL(5,2),
  visual_percentage DECIMAL(5,2),

  -- Add-ons (boolean flags stored as JSONB for flexibility)
  addons_selected JSONB, -- {advancedAnalytics: true, dedicatedCSM: false, ...}
  custom_connectors_count INT DEFAULT 0,

  -- Advanced options
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
  share_token VARCHAR(100) UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tier_id) REFERENCES pricing_tiers(tier_id)
);

CREATE INDEX idx_scenario_created_by ON calculator_scenarios(created_by);
CREATE INDEX idx_scenario_opportunity ON calculator_scenarios(crm_opportunity_id);
CREATE INDEX idx_scenario_share_token ON calculator_scenarios(share_token);

COMMENT ON TABLE calculator_scenarios IS 'Saved customer configurations for quotes and scenarios';

-- 8. Migration Analyses
CREATE TABLE migration_analyses (
  migration_id SERIAL PRIMARY KEY,
  scenario_id INT,

  -- Current provider
  current_provider_id INT NOT NULL,
  current_annual_cost DECIMAL(10,2),
  current_data_sources INT,
  current_storage_gb DECIMAL(10,2),
  current_users INT,

  -- Migration costs (6-phase plan)
  planning_cost DECIMAL(10,2),
  data_export_cost DECIMAL(10,2),
  echo_setup_cost DECIMAL(10,2),
  testing_cost DECIMAL(10,2),
  training_cost DECIMAL(10,2),
  cutover_cost DECIMAL(10,2),
  total_migration_cost DECIMAL(10,2),

  -- Timeline
  migration_weeks INT DEFAULT 7,

  -- ROI metrics
  echo_annual_cost DECIMAL(10,2),
  annual_savings DECIMAL(10,2),
  payback_months DECIMAL(5,2),
  year1_net_savings DECIMAL(10,2),
  year2_net_savings DECIMAL(10,2),
  year3_net_savings DECIMAL(10,2),
  three_year_savings DECIMAL(10,2),

  -- Migration plan (JSON)
  migration_plan_json JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (scenario_id) REFERENCES calculator_scenarios(scenario_id) ON DELETE CASCADE,
  FOREIGN KEY (current_provider_id) REFERENCES competitor_pricing(competitor_id)
);

CREATE INDEX idx_migration_scenario ON migration_analyses(scenario_id);

COMMENT ON TABLE migration_analyses IS 'Migration cost analysis from competitors to Echo';

-- 9. Access Control
CREATE TABLE access_control (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  user_role VARCHAR(50) NOT NULL, -- 'sales_rep', 'sales_manager', 'finance', 'executive', 'prospect'
  can_view_internal_margins BOOLEAN DEFAULT FALSE,
  can_view_cogs BOOLEAN DEFAULT FALSE,
  can_edit_competitor_data BOOLEAN DEFAULT FALSE,
  can_edit_pricing BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_email ON access_control(email);
CREATE INDEX idx_access_role ON access_control(user_role);

COMMENT ON TABLE access_control IS 'Role-based access control for internal vs client views';

-- ========================================
-- SEED DATA: PRICING TIERS
-- ========================================

-- Managed SaaS Tiers
INSERT INTO pricing_tiers (
  tier_id, tier_name, deployment_type,
  monthly_price, annual_price, annual_discount_percent,
  users_min, users_max, connectors_included, storage_gb_included, monthly_queries_included,
  hybrid_search, permission_aware_rag, voice_interface, visual_search,
  advanced_analytics, dedicated_csm, custom_connectors_included, sso_saml, air_gap_deployment,
  support_level, sla_uptime_percent, active
) VALUES
-- Starter (Managed SaaS)
('starter_saas', 'Starter', 'managed_saas',
 2500.00, 24000.00, 20.00,
 10, 50, 5, 100, -1,
 TRUE, TRUE, TRUE, TRUE,
 FALSE, FALSE, 0, FALSE, FALSE,
 'email_24hr', 99.0, TRUE),

-- Professional (Managed SaaS)
('professional_saas', 'Professional', 'managed_saas',
 10000.00, 96000.00, 20.00,
 50, 500, 20, 1024, -1,
 TRUE, TRUE, TRUE, TRUE,
 FALSE, FALSE, 0, TRUE, FALSE,
 'priority_4hr', 99.5, TRUE),

-- Enterprise (Managed SaaS)
('enterprise_saas', 'Enterprise', 'managed_saas',
 25000.00, 240000.00, 20.00,
 500, -1, -1, -1, -1,
 TRUE, TRUE, TRUE, TRUE,
 TRUE, TRUE, 3, TRUE, FALSE,
 'white_glove_1hr', 99.9, TRUE),

-- Self-Hosted Tiers
-- Community (Self-Hosted)
('community_self', 'Community', 'self_hosted',
 0.00, 0.00, 0.00,
 0, 20, -1, -1, -1,
 TRUE, TRUE, FALSE, FALSE,
 FALSE, FALSE, 0, FALSE, FALSE,
 'community_forums', NULL, TRUE),

-- Enterprise (Self-Hosted)
('enterprise_self', 'Enterprise', 'self_hosted',
 1667.00, 20000.00, 0.00,
 20, 200, -1, -1, -1,
 TRUE, TRUE, TRUE, TRUE,
 FALSE, FALSE, 0, TRUE, TRUE,
 'priority_8hr', NULL, TRUE),

-- Enterprise Plus (Self-Hosted)
('enterprise_plus_self', 'Enterprise Plus', 'self_hosted',
 4167.00, 50000.00, 0.00,
 200, -1, -1, -1, -1,
 TRUE, TRUE, TRUE, TRUE,
 TRUE, TRUE, -1, TRUE, TRUE,
 '24_7_csm', NULL, TRUE);

-- ========================================
-- SEED DATA: USAGE PRICING
-- ========================================

INSERT INTO usage_pricing (
  resource_type, resource_name, price_per_unit, unit_name,
  applies_to_tiers, effective_date, notes
) VALUES
-- Connector overages
('connector', 'Extra Connector', 500.00, 'per_month',
 ARRAY['starter_saas', 'professional_saas'], '2025-01-01',
 'Additional connector beyond tier limit'),

-- Storage overages
('storage', 'Extra Storage (100GB)', 100.00, 'per_month',
 ARRAY['all'], '2025-01-01',
 'Additional 100GB storage beyond tier limit'),

-- Add-ons
('addon', 'Advanced Analytics Dashboard', 2000.00, 'per_month',
 ARRAY['starter_saas', 'professional_saas'], '2025-01-01',
 'Usage insights, search analytics, ROI tracking'),

('addon', 'Dedicated Customer Success Manager', 5000.00, 'per_month',
 ARRAY['starter_saas', 'professional_saas'], '2025-01-01',
 'Weekly check-ins, optimization recommendations'),

('addon', 'Voice Interface Premium', 1000.00, 'per_month',
 ARRAY['all'], '2025-01-01',
 'Advanced voice processing (if >25% voice usage)'),

('addon', 'Multi-modal Search Premium', 1500.00, 'per_month',
 ARRAY['all'], '2025-01-01',
 'Advanced image/video analysis (if >25% visual usage)'),

-- One-time costs
('one_time', 'Custom Connector Development', 15000.00, 'one_time',
 ARRAY['all'], '2025-01-01',
 'Build proprietary integration for legacy systems');

-- ========================================
-- SEED DATA: COGS STRUCTURE
-- ========================================

INSERT INTO cogs_structure (
  cost_category, cost_subcategory, cost_per_unit, unit_name,
  tier_id, user_count_bracket, effective_date, notes
) VALUES
-- Infrastructure: Compute
('infrastructure', 'vector_database_node', 500.00, 'per_node_month',
 NULL, NULL, '2025-01-01', 'Vespa vector DB nodes'),
('infrastructure', 'search_infrastructure_node', 400.00, 'per_node_month',
 NULL, NULL, '2025-01-01', 'Search infrastructure nodes'),
('infrastructure', 'api_server_node', 300.00, 'per_node_month',
 NULL, NULL, '2025-01-01', 'API server nodes'),
('infrastructure', 'load_balancer', 150.00, 'per_lb_month',
 NULL, NULL, '2025-01-01', 'Load balancers'),

-- Infrastructure: Storage
('infrastructure', 'primary_storage', 0.10, 'per_gb_month',
 NULL, NULL, '2025-01-01', 'Primary storage cost'),
('infrastructure', 'backup_storage', 0.05, 'per_gb_month',
 NULL, NULL, '2025-01-01', 'Backup storage cost'),
('infrastructure', 'vector_embeddings', 0.12, 'per_gb_month',
 NULL, NULL, '2025-01-01', 'Vector embedding storage'),

-- AI/ML Services
('ai_ml', 'embedding_api', 0.0001, 'per_query',
 NULL, NULL, '2025-01-01', 'OpenAI embedding API cost'),
('ai_ml', 'voice_processing', 0.002, 'per_minute',
 NULL, NULL, '2025-01-01', 'Voice processing cost'),
('ai_ml', 'image_processing', 0.001, 'per_image',
 NULL, NULL, '2025-01-01', 'Image/video processing cost'),

-- Data Transfer
('data_transfer', 'ingress', 0.01, 'per_gb',
 NULL, NULL, '2025-01-01', 'Data ingress from connectors'),
('data_transfer', 'egress', 0.02, 'per_gb',
 NULL, NULL, '2025-01-01', 'API response data egress'),

-- Support & Operations (by tier)
('support', 'customer_support', 250.00, 'per_customer_month',
 'professional_saas', '50-500', '2025-01-01', 'Amortized customer support cost'),
('support', 'customer_support', 500.00, 'per_customer_month',
 'enterprise_saas', '500+', '2025-01-01', 'Amortized customer support cost'),

-- Monitoring
('monitoring', 'monitoring_logging', 150.00, 'per_month',
 NULL, NULL, '2025-01-01', 'Monitoring, logging, alerting');

-- ========================================
-- SEED DATA: COMPETITOR PRICING
-- ========================================

INSERT INTO competitor_pricing (
  competitor_key, competitor_name, annual_cost_estimate, usage_assumptions,
  connectors_count, voice_interface, visual_search, self_hosted_option, managed_saas_option,
  vendor_lock_in, strengths, weaknesses,
  data_source, last_verified_date, last_updated_by, verification_notes
) VALUES
-- Glean
('glean', 'Glean Enterprise', 290000.00,
 '{"users": 250, "connectors": 15, "storageGB": 850, "monthlyQueries": 90000}'::jsonb,
 70, FALSE, FALSE, FALSE, TRUE,
 'Glean ecosystem',
 '["Strong enterprise adoption", "Good search UX", "70 connectors", "AI-powered insights"]'::jsonb,
 '["151% more expensive", "No voice interface", "No visual search", "Only 70 connectors vs Echo''s 1,300+"]'::jsonb,
 'manual', '2025-11-30', 'CLabs Research Team',
 'Verified via sales conversations and public pricing discussions'),

-- Danswer
('danswer', 'Danswer Self-Hosted', 100000.00,
 '{"users": 250, "connectors": 15, "storageGB": 850, "monthlyQueries": 90000, "devOpsCost": 80000}'::jsonb,
 50, FALSE, FALSE, TRUE, FALSE,
 'Requires DevOps team',
 '["Open source", "Self-hosted", "50 connectors", "No SaaS lock-in"]'::jsonb,
 '["Requires $80K/year DevOps team", "No voice interface", "No visual search", "Self-hosted only"]'::jsonb,
 'manual', '2025-11-30', 'CLabs Research Team',
 '$20K software + $80K DevOps = $100K total'),

-- Perplexity Enterprise
('perplexity', 'Perplexity Enterprise', 120000.00,
 '{"users": 250, "connectors": 0, "storageGB": 0, "monthlyQueries": 90000}'::jsonb,
 0, FALSE, TRUE, FALSE, TRUE,
 'Web-only search',
 '["Excellent web search", "Clean UX", "Fast responses", "Visual web search"]'::jsonb,
 '["No internal connectors", "Web-only (no internal data)", "Cannot search Slack/Drive/Jira"]'::jsonb,
 'manual', '2025-11-30', 'CLabs Research Team',
 'Verified pricing from enterprise sales. Web-only, no internal connectors'),

-- Hebbia
('hebbia', 'Hebbia Enterprise', 250000.00,
 '{"users": 250, "connectors": 100, "storageGB": 2000, "monthlyQueries": 90000}'::jsonb,
 100, FALSE, TRUE, FALSE, TRUE,
 'High-end positioning',
 '["Advanced multi-modal search", "100+ connectors", "Strong for research/due diligence", "Visual document analysis"]'::jsonb,
 '["117% more expensive", "High setup fee ($100K)", "Long sales cycle", "Overkill for most use cases"]'::jsonb,
 'manual', '2025-11-30', 'CLabs Research Team',
 'High-end competitor, $250K annual + $100K setup fee');

-- ========================================
-- SEED DATA: ACCESS CONTROL ROLES
-- ========================================

INSERT INTO access_control (
  email, user_role, can_view_internal_margins, can_view_cogs, can_edit_competitor_data, can_edit_pricing, active
) VALUES
-- Examples (replace with actual users)
('finance@cetaceanlabs.com', 'finance', TRUE, TRUE, TRUE, TRUE, TRUE),
('exec@cetaceanlabs.com', 'executive', TRUE, TRUE, TRUE, FALSE, TRUE),
('sales.manager@cetaceanlabs.com', 'sales_manager', TRUE, FALSE, FALSE, FALSE, TRUE),
('sales@cetaceanlabs.com', 'sales_rep', FALSE, FALSE, FALSE, FALSE, TRUE);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_pricing_updated_at BEFORE UPDATE ON usage_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cogs_structure_updated_at BEFORE UPDATE ON cogs_structure
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_pricing_updated_at BEFORE UPDATE ON competitor_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_scenarios_updated_at BEFORE UPDATE ON calculator_scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_control_updated_at BEFORE UPDATE ON access_control
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View: Active Managed SaaS Tiers
CREATE OR REPLACE VIEW v_active_saas_tiers AS
SELECT
  tier_id,
  tier_name,
  monthly_price,
  annual_price,
  users_min,
  users_max,
  connectors_included,
  storage_gb_included,
  support_level,
  sla_uptime_percent
FROM pricing_tiers
WHERE deployment_type = 'managed_saas' AND active = TRUE
ORDER BY monthly_price ASC NULLS LAST;

-- View: Competitor Comparison Summary
CREATE OR REPLACE VIEW v_competitor_comparison AS
SELECT
  competitor_name,
  annual_cost_estimate,
  connectors_count,
  voice_interface,
  visual_search,
  self_hosted_option,
  managed_saas_option,
  vendor_lock_in,
  last_verified_date
FROM competitor_pricing
WHERE active = TRUE
ORDER BY annual_cost_estimate ASC;

-- View: COGS by Category
CREATE OR REPLACE VIEW v_cogs_by_category AS
SELECT
  cost_category,
  cost_subcategory,
  cost_per_unit,
  unit_name,
  tier_id,
  notes
FROM cogs_structure
WHERE (end_date IS NULL OR end_date > CURRENT_DATE)
  AND effective_date <= CURRENT_DATE
ORDER BY cost_category, cost_subcategory;

-- ========================================
-- GRANTS (adjust based on your setup)
-- ========================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO echo_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO echo_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO echo_app;

-- ========================================
-- END OF SCHEMA
-- ========================================

COMMENT ON DATABASE postgres IS 'Echo RAG Calculator v2.0 - Pricing & Competitor Intelligence';
