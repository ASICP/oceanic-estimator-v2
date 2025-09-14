import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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