import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Workflows table - stores user-defined workflows
export const workflows = pgTable("workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  description: text("description").notNull(),
  complexity: text("complexity").notNull(), // Low, Medium, High
  duration: text("duration").notNull(),
  isPreset: boolean("is_preset").default(false),
  defaultAgentIds: text("default_agent_ids").array(),
  costModel: text("cost_model").notNull(),
  savingsPercentage: integer("savings_percentage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Agents table - stores agent configurations
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  domain: text("domain").notNull(),
  description: text("description").notNull(),
  capabilities: text("capabilities").array(),
  avatarUrl: text("avatar_url"),
  isRecommended: boolean("is_recommended").default(false),
  baseCostPerHour: decimal("base_cost_per_hour", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Cost estimates table - stores complete cost estimations
export const costEstimates = pgTable("cost_estimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").references(() => workflows.id),
  title: text("title").notNull(),
  
  // Step 1: Workflow Definition
  selectedWorkflow: jsonb("selected_workflow"),
  customComplexity: integer("custom_complexity"),
  customDuration: text("custom_duration"),
  customCategory: text("custom_category"),
  
  // Step 2: Agent Team
  selectedAgents: jsonb("selected_agents"),
  agentCount: integer("agent_count").notNull(),
  
  // Step 3: Resource Needs
  apiCalls: integer("api_calls").notNull(),
  dataTransfer: integer("data_transfer").notNull(),
  errorRate: integer("error_rate").notNull(),
  batchSize: integer("batch_size").notNull(),
  autoScale: boolean("auto_scale").default(true),
  multiModel: boolean("multi_model").default(true),
  modelProvider: text("model_provider").notNull(),
  
  // Step 4: Pricing & Billing
  billingModel: text("billing_model").notNull(),
  tier: text("tier").notNull(),
  volumeDiscount: boolean("volume_discount").default(false),
  byoApiKeys: boolean("byo_api_keys").default(false),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }),
  margin: decimal("margin", { precision: 5, scale: 2 }),
  
  // Cost Results
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
  traditionalCost: decimal("traditional_cost", { precision: 12, scale: 2 }).notNull(),
  savingsAmount: decimal("savings_amount", { precision: 12, scale: 2 }).notNull(),
  savingsPercentage: decimal("savings_percentage", { precision: 5, scale: 2 }).notNull(),
  costBreakdown: jsonb("cost_breakdown"),
  
  // Metadata
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Cost breakdown items - detailed cost analysis
export const costBreakdownItems = pgTable("cost_breakdown_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => costEstimates.id),
  category: text("category").notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  color: text("color"),
  sortOrder: integer("sort_order").default(0)
});

// Pricing models - configurable pricing structures
export const pricingModels = pgTable("pricing_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  seatPrice: decimal("seat_price", { precision: 8, scale: 2 }).notNull(),
  tokenRate: decimal("token_rate", { precision: 8, scale: 5 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true)
});

// Export schemas
export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true
});

export const insertCostEstimateSchema = createInsertSchema(costEstimates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCostBreakdownItemSchema = createInsertSchema(costBreakdownItems).omit({
  id: true
});

export const insertPricingModelSchema = createInsertSchema(pricingModels).omit({
  id: true
});

// Export types
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type CostEstimate = typeof costEstimates.$inferSelect;
export type InsertCostEstimate = z.infer<typeof insertCostEstimateSchema>;

export type CostBreakdownItem = typeof costBreakdownItems.$inferSelect;
export type InsertCostBreakdownItem = z.infer<typeof insertCostBreakdownItemSchema>;

export type PricingModel = typeof pricingModels.$inferSelect;
export type InsertPricingModel = z.infer<typeof insertPricingModelSchema>;

// Complex types for frontend consumption
export type CompleteWorkflow = Workflow & {
  defaultAgents?: Agent[];
};

// Shared Results table - for sharing cost estimates via public links
export const sharedResults = pgTable("shared_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => costEstimates.id).notNull(),
  shareUrl: text("share_url").notNull().unique(),
  title: text("title").notNull(),
  isPublic: boolean("is_public").default(true),
  expiresAt: timestamp("expires_at"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

// Contracts table - for generating sales contracts and invoices
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => costEstimates.id).notNull(),
  contractNumber: text("contract_number").notNull().unique(),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, cancelled
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export type CompleteCostEstimate = CostEstimate & {
  workflow?: Workflow;
  agents?: Agent[];
  breakdownItems?: CostBreakdownItem[];
};

export type SharedResult = typeof sharedResults.$inferSelect;
export type InsertSharedResult = typeof sharedResults.$inferInsert;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ========================================
// PORPOISE V2 CALCULATOR TABLES
// ========================================

// Pricing Tiers - Porpoise subscription tiers
export const pricingTiers = pgTable("pricing_tiers", {
  tierId: varchar("tier_id", { length: 50 }).primaryKey(),
  tierName: varchar("tier_name", { length: 100 }).notNull(),
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
  annualPrice: decimal("annual_price", { precision: 10, scale: 2 }),
  annualDiscountPercent: decimal("annual_discount_percent", { precision: 5, scale: 2 }).default("10.00"),
  
  // Included resources
  includedUsers: integer("included_users"),
  includedConcurrentJobs: integer("included_concurrent_jobs"),
  includedStorageGb: integer("included_storage_gb"),
  includedGpuHours: integer("included_gpu_hours"),
  includedApiCalls: integer("included_api_calls"),
  includedAvatars: integer("included_avatars"), // -1 for unlimited
  
  // Features
  quickTrainWizard: boolean("quick_train_wizard").default(true),
  advancedWorkflows: boolean("advanced_workflows").default(false),
  aiInterviewer: boolean("ai_interviewer").default(false),
  ssoSaml: boolean("sso_saml").default(false),
  whiteLabelAvatars: boolean("white_label_avatars").default(false),
  byocDeployment: boolean("byoc_deployment").default(false),
  airGapDeployment: boolean("air_gap_deployment").default(false),
  dedicatedGpu: boolean("dedicated_gpu").default(false),
  
  // Support level
  supportLevel: varchar("support_level", { length: 50 }),
  
  // Metadata
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Usage-based Pricing
export const usagePricing = pgTable("usage_pricing", {
  pricingId: serial("pricing_id").primaryKey(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 4 }).notNull(),
  unitName: varchar("unit_name", { length: 50 }),
  effectiveDate: date("effective_date").notNull(),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// COGS Structure
export const cogsStructure = pgTable("cogs_structure", {
  cogsId: serial("cogs_id").primaryKey(),
  costCategory: varchar("cost_category", { length: 100 }).notNull(),
  costSubcategory: varchar("cost_subcategory", { length: 100 }),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 4 }).notNull(),
  unitName: varchar("unit_name", { length: 50 }),
  tierId: varchar("tier_id", { length: 50 }).references(() => pricingTiers.tierId),
  effectiveDate: date("effective_date").notNull(),
  endDate: date("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Competitor Pricing
export const competitorPricing = pgTable("competitor_pricing", {
  competitorId: serial("competitor_id").primaryKey(),
  competitorKey: varchar("competitor_key", { length: 50 }).notNull().unique(),
  competitorName: varchar("competitor_name", { length: 200 }).notNull(),
  
  // Pricing data
  annualCostEstimate: decimal("annual_cost_estimate", { precision: 10, scale: 2 }).notNull(),
  usageAssumptions: jsonb("usage_assumptions"),
  
  // Positioning
  vendorLockIn: varchar("vendor_lock_in", { length: 200 }),
  strengths: jsonb("strengths"),
  weaknesses: jsonb("weaknesses"),
  
  // Data source tracking
  dataSource: varchar("data_source", { length: 50 }),
  lastVerifiedDate: date("last_verified_date").notNull(),
  lastUpdatedBy: varchar("last_updated_by", { length: 100 }),
  verificationNotes: text("verification_notes"),
  
  // Scraping config
  pricingPageUrl: varchar("pricing_page_url", { length: 500 }),
  scrapeEnabled: boolean("scrape_enabled").default(false),
  scrapeFrequencyDays: integer("scrape_frequency_days").default(90),
  lastScrapedDate: date("last_scraped_date"),
  
  // Metadata
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Competitor Pricing History
export const competitorPricingHistory = pgTable("competitor_pricing_history", {
  historyId: serial("history_id").primaryKey(),
  competitorId: integer("competitor_id").notNull().references(() => competitorPricing.competitorId),
  annualCostEstimate: decimal("annual_cost_estimate", { precision: 10, scale: 2 }).notNull(),
  changeAmount: decimal("change_amount", { precision: 10, scale: 2 }),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }),
  changeReason: varchar("change_reason", { length: 200 }),
  effectiveDate: date("effective_date").notNull(),
  recordedBy: varchar("recorded_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Pricing Validation Queue
export const pricingValidationQueue = pgTable("pricing_validation_queue", {
  queueId: serial("queue_id").primaryKey(),
  competitorId: integer("competitor_id").notNull().references(() => competitorPricing.competitorId),
  validationType: varchar("validation_type", { length: 50 }),
  priority: varchar("priority", { length: 20 }),
  
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  reportedPrice: decimal("reported_price", { precision: 10, scale: 2 }),
  priceDifference: decimal("price_difference", { precision: 10, scale: 2 }),
  
  source: varchar("source", { length: 100 }),
  sourceDetails: text("source_details"),
  
  status: varchar("status", { length: 50 }),
  assignedTo: varchar("assigned_to", { length: 100 }),
  reviewedBy: varchar("reviewed_by", { length: 100 }),
  reviewNotes: text("review_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at")
});

// Calculator Scenarios - Saved pricing calculations
export const calculatorScenarios = pgTable("calculator_scenarios", {
  scenarioId: serial("scenario_id").primaryKey(),
  scenarioName: varchar("scenario_name", { length: 200 }),
  
  tierId: varchar("tier_id", { length: 50 }).notNull().references(() => pricingTiers.tierId),
  billingPeriod: varchar("billing_period", { length: 20 }),
  
  // Usage profile
  numUsers: integer("num_users"),
  concurrentJobs: integer("concurrent_jobs"),
  storageGb: decimal("storage_gb", { precision: 10, scale: 2 }),
  gpuHoursMonthly: decimal("gpu_hours_monthly", { precision: 10, scale: 2 }),
  apiCallsMonthly: integer("api_calls_monthly"),
  numAvatars: integer("num_avatars"),
  
  // Advanced options (JSON)
  advancedOptions: jsonb("advanced_options"),
  
  // Calculated results (cached)
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }),
  annualCost: decimal("annual_cost", { precision: 10, scale: 2 }),
  monthlyCogs: decimal("monthly_cogs", { precision: 10, scale: 2 }),
  annualCogs: decimal("annual_cogs", { precision: 10, scale: 2 }),
  grossMarginPercent: decimal("gross_margin_percent", { precision: 5, scale: 2 }),
  
  // Metadata
  createdBy: varchar("created_by", { length: 100 }),
  createdForProspect: varchar("created_for_prospect", { length: 200 }),
  crmOpportunityId: varchar("crm_opportunity_id", { length: 100 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Migration Analyses
export const migrationAnalyses = pgTable("migration_analyses", {
  migrationId: serial("migration_id").primaryKey(),
  scenarioId: integer("scenario_id").references(() => calculatorScenarios.scenarioId),
  
  currentProviderId: integer("current_provider_id").notNull().references(() => competitorPricing.competitorId),
  currentAnnualCost: decimal("current_annual_cost", { precision: 10, scale: 2 }),
  
  // Migration costs
  dataExportCost: decimal("data_export_cost", { precision: 10, scale: 2 }),
  onboardingCost: decimal("onboarding_cost", { precision: 10, scale: 2 }),
  retrainingCost: decimal("retraining_cost", { precision: 10, scale: 2 }),
  teamTrainingCost: decimal("team_training_cost", { precision: 10, scale: 2 }),
  totalMigrationCost: decimal("total_migration_cost", { precision: 10, scale: 2 }),
  
  // ROI metrics
  annualSavings: decimal("annual_savings", { precision: 10, scale: 2 }),
  paybackMonths: decimal("payback_months", { precision: 5, scale: 2 }),
  threeYearSavings: decimal("three_year_savings", { precision: 10, scale: 2 }),
  
  // Migration plan (JSON)
  migrationPlanJson: jsonb("migration_plan_json"),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Export Porpoise v2 insert schemas
export const insertPricingTierSchema = createInsertSchema(pricingTiers).omit({
  createdAt: true,
  updatedAt: true
});

export const insertUsagePricingSchema = createInsertSchema(usagePricing).omit({
  pricingId: true,
  createdAt: true,
  updatedAt: true
});

export const insertCogsStructureSchema = createInsertSchema(cogsStructure).omit({
  cogsId: true,
  createdAt: true,
  updatedAt: true
});

export const insertCompetitorPricingSchema = createInsertSchema(competitorPricing).omit({
  competitorId: true,
  createdAt: true,
  updatedAt: true
});

export const insertCompetitorPricingHistorySchema = createInsertSchema(competitorPricingHistory).omit({
  historyId: true,
  createdAt: true
});

export const insertPricingValidationQueueSchema = createInsertSchema(pricingValidationQueue).omit({
  queueId: true,
  createdAt: true
});

export const insertCalculatorScenarioSchema = createInsertSchema(calculatorScenarios).omit({
  scenarioId: true,
  createdAt: true,
  updatedAt: true
});

export const insertMigrationAnalysisSchema = createInsertSchema(migrationAnalyses).omit({
  migrationId: true,
  createdAt: true
});

// Export Porpoise v2 types
export type PricingTier = typeof pricingTiers.$inferSelect;
export type InsertPricingTier = z.infer<typeof insertPricingTierSchema>;

export type UsagePricing = typeof usagePricing.$inferSelect;
export type InsertUsagePricing = z.infer<typeof insertUsagePricingSchema>;

export type CogsStructure = typeof cogsStructure.$inferSelect;
export type InsertCogsStructure = z.infer<typeof insertCogsStructureSchema>;

export type CompetitorPricing = typeof competitorPricing.$inferSelect;
export type InsertCompetitorPricing = z.infer<typeof insertCompetitorPricingSchema>;

export type CompetitorPricingHistory = typeof competitorPricingHistory.$inferSelect;
export type InsertCompetitorPricingHistory = z.infer<typeof insertCompetitorPricingHistorySchema>;

export type PricingValidationQueue = typeof pricingValidationQueue.$inferSelect;
export type InsertPricingValidationQueue = z.infer<typeof insertPricingValidationQueueSchema>;

export type CalculatorScenario = typeof calculatorScenarios.$inferSelect;
export type InsertCalculatorScenario = z.infer<typeof insertCalculatorScenarioSchema>;

export type MigrationAnalysis = typeof migrationAnalyses.$inferSelect;
export type InsertMigrationAnalysis = z.infer<typeof insertMigrationAnalysisSchema>;