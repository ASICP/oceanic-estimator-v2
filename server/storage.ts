import { 
  type Workflow, 
  type InsertWorkflow,
  type Agent,
  type InsertAgent,
  type CostEstimate,
  type InsertCostEstimate,
  type CostBreakdownItem,
  type InsertCostBreakdownItem,
  type PricingModel,
  type InsertPricingModel,
  type CompleteWorkflow,
  type CompleteCostEstimate,
  type SharedResult,
  type InsertSharedResult,
  type Contract,
  type InsertContract
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Workflow operations
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<CompleteWorkflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: string): Promise<boolean>;
  
  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentsByDomain(domain: string): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;
  
  // Cost estimate operations
  getCostEstimates(): Promise<CostEstimate[]>;
  getCostEstimate(id: string): Promise<CompleteCostEstimate | undefined>;
  createCostEstimate(estimate: InsertCostEstimate): Promise<CostEstimate>;
  updateCostEstimate(id: string, estimate: Partial<InsertCostEstimate>): Promise<CostEstimate | undefined>;
  deleteCostEstimate(id: string): Promise<boolean>;
  
  // Cost breakdown operations
  getCostBreakdownItems(estimateId: string): Promise<CostBreakdownItem[]>;
  createCostBreakdownItem(item: InsertCostBreakdownItem): Promise<CostBreakdownItem>;
  updateCostBreakdownItem(id: string, item: Partial<InsertCostBreakdownItem>): Promise<CostBreakdownItem | undefined>;
  deleteCostBreakdownItem(id: string): Promise<boolean>;
  
  // Pricing model operations
  getPricingModels(): Promise<PricingModel[]>;
  getPricingModel(id: string): Promise<PricingModel | undefined>;
  createPricingModel(model: InsertPricingModel): Promise<PricingModel>;
  updatePricingModel(id: string, model: Partial<InsertPricingModel>): Promise<PricingModel | undefined>;
  
  // Shared results operations
  getSharedResults(): Promise<SharedResult[]>;
  getSharedResult(id: string): Promise<SharedResult | undefined>;
  getSharedResultByUrl(shareUrl: string): Promise<SharedResult | undefined>;
  createSharedResult(result: InsertSharedResult): Promise<SharedResult>;
  updateSharedResult(id: string, result: Partial<InsertSharedResult>): Promise<SharedResult | undefined>;
  deleteSharedResult(id: string): Promise<boolean>;
  
  // Contract operations  
  getContracts(): Promise<Contract[]>;
  getContract(id: string): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private workflows: Map<string, Workflow>;
  private agents: Map<string, Agent>;
  private costEstimates: Map<string, CostEstimate>;
  private costBreakdownItems: Map<string, CostBreakdownItem>;
  private pricingModels: Map<string, PricingModel>;

  constructor() {
    this.workflows = new Map();
    this.agents = new Map();
    this.costEstimates = new Map();
    this.costBreakdownItems = new Map();
    this.pricingModels = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample workflows (presets)
    const sampleWorkflows: InsertWorkflow[] = [
      {
        title: "Deal Sourcing",
        domain: "Investment Ops",
        description: "Autonomous sourcing & pipeline mgmt for roll-ups/SaaS targets.",
        complexity: "Medium",
        duration: "4-8 hrs",
        isPreset: true,
        defaultAgentIds: ["clay", "lyla", "gemma"],
        costModel: "Token + seat ($49/month + $0.01/1K)",
        savingsPercentage: 65
      },
      {
        title: "Financial Modeling",
        domain: "Investment Ops", 
        description: "Qualify deals, build models for EBITDA analysis.",
        complexity: "High",
        duration: "6-12 hrs",
        isPreset: true,
        defaultAgentIds: ["finley", "clay", "financebot"],
        costModel: "Hybrid ($149/dept + tokens)",
        savingsPercentage: 70
      },
      {
        title: "Legal Review",
        domain: "Deal Execution",
        description: "Dataroom prep, term sheets, redlines.",
        complexity: "Medium", 
        duration: "3-6 hrs",
        isPreset: true,
        defaultAgentIds: ["lex", "ivy", "bree"],
        costModel: "Pay-per-use ($0.005/1K via Groq)",
        savingsPercentage: 60
      }
    ];

    for (const workflow of sampleWorkflows) {
      await this.createWorkflow(workflow);
    }

    // Sample agents
    const sampleAgents: InsertAgent[] = [
      {
        name: "Clay",
        role: "Project Manager", 
        domain: "Investment Ops",
        description: "Manages projects, sourcing, pipeline management, and diligence checklists with Harvard-level capabilities.",
        capabilities: ["Project Management", "Pipeline Mgmt", "Diligence", "Sourcing"],
        avatarUrl: "/assets/generated_images/Professional_Clay_agent_avatar_12ae85f9.png",
        isRecommended: true,
        baseCostPerHour: "150.00"
      },
      {
        name: "Finley",
        role: "Financial Modeling",
        domain: "Investment Ops",
        description: "Deal qualification, financial modeling, and EBITDA analysis with advanced Harvard Business School graduate capabilities.",
        capabilities: ["Financial Modeling", "Deal Analysis", "EBITDA", "Valuation"],
        avatarUrl: "/assets/generated_images/Professional_Finley_agent_avatar_b19d0057.png",
        isRecommended: true,
        baseCostPerHour: "200.00"
      },
      {
        name: "Lex",
        role: "Legal Specialist",
        domain: "Deal Execution",
        description: "Legal review, dataroom preparation, term sheet automation, and compliance management.",
        capabilities: ["Legal Review", "Compliance", "Term Sheets", "Due Diligence"],
        avatarUrl: "/assets/generated_images/Professional_Lex_agent_avatar_bcd47740.png",
        isRecommended: true,
        baseCostPerHour: "175.00"
      },
      {
        name: "Bree",
        role: "Investor Relations",
        domain: "Fund Admin & IR", 
        description: "LP communications, reporting, subscription document processing, and investor relations management.",
        capabilities: ["LP Comms", "Reporting", "IR", "Documentation"],
        avatarUrl: "/assets/generated_images/Professional_Bree_agent_avatar_c0a3af89.png",
        isRecommended: false,
        baseCostPerHour: "125.00"
      }
    ];

    for (const agent of sampleAgents) {
      await this.createAgent(agent);
    }

    // Sample pricing models
    const samplePricingModels: InsertPricingModel[] = [
      {
        name: "Individual",
        tier: "individual",
        seatPrice: "29.00",
        tokenRate: "0.015",
        description: "For small teams and individual users",
        isActive: true
      },
      {
        name: "Department", 
        tier: "department",
        seatPrice: "49.00",
        tokenRate: "0.01",
        description: "For department-level operations",
        isActive: true
      },
      {
        name: "Enterprise",
        tier: "enterprise", 
        seatPrice: "149.00",
        tokenRate: "0.005",
        description: "For large-scale enterprise deployments",
        isActive: true
      }
    ];

    for (const model of samplePricingModels) {
      await this.createPricingModel(model);
    }
  }

  // Workflow operations
  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<CompleteWorkflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    
    // Attach default agents if they exist
    const defaultAgents = workflow.defaultAgentIds 
      ? workflow.defaultAgentIds.map(agentId => this.agents.get(agentId)).filter(Boolean) as Agent[]
      : [];
    
    return { ...workflow, defaultAgents };
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = randomUUID();
    const workflow: Workflow = {
      ...insertWorkflow,
      id,
      isPreset: insertWorkflow.isPreset ?? false,
      defaultAgentIds: insertWorkflow.defaultAgentIds ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: string, updates: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    
    const updated: Workflow = { ...workflow, ...updates, updatedAt: new Date() };
    this.workflows.set(id, updated);
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAgentsByDomain(domain: string): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(agent => agent.domain === domain);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = {
      ...insertAgent,
      id,
      capabilities: insertAgent.capabilities ?? null,
      avatarUrl: insertAgent.avatarUrl ?? null,
      isRecommended: insertAgent.isRecommended ?? false,
      baseCostPerHour: insertAgent.baseCostPerHour ?? null,
      createdAt: new Date()
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updated: Agent = { ...agent, ...updates };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Cost estimate operations
  async getCostEstimates(): Promise<CostEstimate[]> {
    return Array.from(this.costEstimates.values());
  }

  async getCostEstimate(id: string): Promise<CompleteCostEstimate | undefined> {
    const estimate = this.costEstimates.get(id);
    if (!estimate) return undefined;
    
    // Attach related data
    const workflow = estimate.workflowId ? this.workflows.get(estimate.workflowId) : undefined;
    const breakdownItems = Array.from(this.costBreakdownItems.values())
      .filter(item => item.estimateId === id);
    
    // Extract agents from selected agents JSON
    const selectedAgents = estimate.selectedAgents as any[];
    const agents = selectedAgents ? selectedAgents.map(agentData => {
      // Find the full agent record by ID if available, otherwise use the data from JSON
      const fullAgent = this.agents.get(agentData.id);
      return fullAgent || agentData;
    }) : [];
    
    return { ...estimate, workflow, agents, breakdownItems };
  }

  async createCostEstimate(insertEstimate: InsertCostEstimate): Promise<CostEstimate> {
    const id = randomUUID();
    const estimate: CostEstimate = {
      ...insertEstimate,
      id,
      workflowId: insertEstimate.workflowId ?? null,
      selectedWorkflow: insertEstimate.selectedWorkflow ?? null,
      customComplexity: insertEstimate.customComplexity ?? null,
      customDuration: insertEstimate.customDuration ?? null,
      customCategory: insertEstimate.customCategory ?? null,
      selectedAgents: insertEstimate.selectedAgents ?? null,
      autoScale: insertEstimate.autoScale ?? true,
      multiModel: insertEstimate.multiModel ?? true,
      volumeDiscount: insertEstimate.volumeDiscount ?? false,
      byoApiKeys: insertEstimate.byoApiKeys ?? false,
      taxRate: insertEstimate.taxRate ?? null,
      margin: insertEstimate.margin ?? null,
      costBreakdown: insertEstimate.costBreakdown ?? null,
      isCompleted: insertEstimate.isCompleted ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costEstimates.set(id, estimate);
    return estimate;
  }

  async updateCostEstimate(id: string, updates: Partial<InsertCostEstimate>): Promise<CostEstimate | undefined> {
    const estimate = this.costEstimates.get(id);
    if (!estimate) return undefined;
    
    const updated: CostEstimate = { ...estimate, ...updates, updatedAt: new Date() };
    this.costEstimates.set(id, updated);
    return updated;
  }

  async deleteCostEstimate(id: string): Promise<boolean> {
    return this.costEstimates.delete(id);
  }

  // Cost breakdown operations
  async getCostBreakdownItems(estimateId: string): Promise<CostBreakdownItem[]> {
    return Array.from(this.costBreakdownItems.values())
      .filter(item => item.estimateId === estimateId);
  }

  async createCostBreakdownItem(insertItem: InsertCostBreakdownItem): Promise<CostBreakdownItem> {
    const id = randomUUID();
    const item: CostBreakdownItem = { 
      ...insertItem, 
      id,
      description: insertItem.description ?? null,
      estimateId: insertItem.estimateId ?? null,
      color: insertItem.color ?? null,
      sortOrder: insertItem.sortOrder ?? 0
    };
    this.costBreakdownItems.set(id, item);
    return item;
  }

  async updateCostBreakdownItem(id: string, updates: Partial<InsertCostBreakdownItem>): Promise<CostBreakdownItem | undefined> {
    const item = this.costBreakdownItems.get(id);
    if (!item) return undefined;
    
    const updated: CostBreakdownItem = { ...item, ...updates };
    this.costBreakdownItems.set(id, updated);
    return updated;
  }

  async deleteCostBreakdownItem(id: string): Promise<boolean> {
    return this.costBreakdownItems.delete(id);
  }

  // Pricing model operations
  async getPricingModels(): Promise<PricingModel[]> {
    return Array.from(this.pricingModels.values());
  }

  async getPricingModel(id: string): Promise<PricingModel | undefined> {
    return this.pricingModels.get(id);
  }

  async createPricingModel(insertModel: InsertPricingModel): Promise<PricingModel> {
    const id = randomUUID();
    const model: PricingModel = { 
      ...insertModel, 
      id,
      description: insertModel.description ?? null,
      isActive: insertModel.isActive ?? true
    };
    this.pricingModels.set(id, model);
    return model;
  }

  async updatePricingModel(id: string, updates: Partial<InsertPricingModel>): Promise<PricingModel | undefined> {
    const model = this.pricingModels.get(id);
    if (!model) return undefined;
    
    const updated: PricingModel = { ...model, ...updates };
    this.pricingModels.set(id, updated);
    return updated;
  }

  // Shared results operations (stubbed for MemStorage)
  async getSharedResults(): Promise<SharedResult[]> {
    return [];
  }

  async getSharedResult(id: string): Promise<SharedResult | undefined> {
    return undefined;
  }

  async getSharedResultByUrl(shareUrl: string): Promise<SharedResult | undefined> {
    return undefined;
  }

  async createSharedResult(insertResult: InsertSharedResult): Promise<SharedResult> {
    // Stub implementation for MemStorage
    const result = { ...insertResult, id: randomUUID(), createdAt: new Date(), viewCount: 0 } as SharedResult;
    return result;
  }

  async updateSharedResult(id: string, updates: Partial<InsertSharedResult>): Promise<SharedResult | undefined> {
    return undefined;
  }

  async deleteSharedResult(id: string): Promise<boolean> {
    return false;
  }

  // Contract operations (stubbed for MemStorage)  
  async getContracts(): Promise<Contract[]> {
    return [];
  }

  async getContract(id: string): Promise<Contract | undefined> {
    return undefined;
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    // Stub implementation for MemStorage
    const contract = { 
      ...insertContract, 
      id: randomUUID(), 
      contractNumber: `CONTRACT-${Date.now()}`,
      status: "draft",
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as Contract;
    return contract;
  }

  async updateContract(id: string, updates: Partial<InsertContract>): Promise<Contract | undefined> {
    return undefined;
  }

  async deleteContract(id: string): Promise<boolean> {
    return false;
  }
}

// Database storage implementation using PostgreSQL with Drizzle ORM
import { db } from './db';
import { 
  workflows,
  agents,
  costEstimates,
  costBreakdownItems,
  pricingModels,
  sharedResults,
  contracts
} from '@shared/schema';
import { eq } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Workflow operations
  async getWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows);
  }

  async getWorkflow(id: string): Promise<CompleteWorkflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) return undefined;
    
    // Get default agents if they exist
    const defaultAgents = workflow.defaultAgentIds 
      ? await db.select().from(agents).where(eq(agents.id, workflow.defaultAgentIds[0])) // Simple implementation for now
      : [];
    
    return { ...workflow, defaultAgents };
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db.insert(workflows).values(insertWorkflow).returning();
    return workflow;
  }

  async updateWorkflow(id: string, updates: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const [workflow] = await db.update(workflows).set({...updates, updatedAt: new Date()}).where(eq(workflows.id, id)).returning();
    return workflow || undefined;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async getAgentsByDomain(domain: string): Promise<Agent[]> {
    return await db.select().from(agents).where(eq(agents.domain, domain));
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [agent] = await db.update(agents).set(updates).where(eq(agents.id, id)).returning();
    return agent || undefined;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cost estimate operations
  async getCostEstimates(): Promise<CostEstimate[]> {
    return await db.select().from(costEstimates);
  }

  async getCostEstimate(id: string): Promise<CompleteCostEstimate | undefined> {
    const [estimate] = await db.select().from(costEstimates).where(eq(costEstimates.id, id));
    if (!estimate) return undefined;
    
    // Get related workflow
    const workflow = estimate.workflowId 
      ? (await db.select().from(workflows).where(eq(workflows.id, estimate.workflowId)))[0]
      : undefined;
    
    // Get breakdown items
    const breakdownItems = await db.select().from(costBreakdownItems)
      .where(eq(costBreakdownItems.estimateId, id));
    
    // Extract agents from selectedAgents JSON - simple implementation for now
    const selectedAgents = estimate.selectedAgents as any[];
    const agentsData = selectedAgents || [];
    
    return { ...estimate, workflow, agents: agentsData, breakdownItems };
  }

  async createCostEstimate(insertEstimate: InsertCostEstimate): Promise<CostEstimate> {
    const [estimate] = await db.insert(costEstimates).values(insertEstimate).returning();
    return estimate;
  }

  async updateCostEstimate(id: string, updates: Partial<InsertCostEstimate>): Promise<CostEstimate | undefined> {
    const [estimate] = await db.update(costEstimates).set({...updates, updatedAt: new Date()}).where(eq(costEstimates.id, id)).returning();
    return estimate || undefined;
  }

  async deleteCostEstimate(id: string): Promise<boolean> {
    const result = await db.delete(costEstimates).where(eq(costEstimates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cost breakdown operations
  async getCostBreakdownItems(estimateId: string): Promise<CostBreakdownItem[]> {
    return await db.select().from(costBreakdownItems).where(eq(costBreakdownItems.estimateId, estimateId));
  }

  async createCostBreakdownItem(insertItem: InsertCostBreakdownItem): Promise<CostBreakdownItem> {
    const [item] = await db.insert(costBreakdownItems).values(insertItem).returning();
    return item;
  }

  async updateCostBreakdownItem(id: string, updates: Partial<InsertCostBreakdownItem>): Promise<CostBreakdownItem | undefined> {
    const [item] = await db.update(costBreakdownItems).set(updates).where(eq(costBreakdownItems.id, id)).returning();
    return item || undefined;
  }

  async deleteCostBreakdownItem(id: string): Promise<boolean> {
    const result = await db.delete(costBreakdownItems).where(eq(costBreakdownItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Pricing model operations
  async getPricingModels(): Promise<PricingModel[]> {
    return await db.select().from(pricingModels);
  }

  async getPricingModel(id: string): Promise<PricingModel | undefined> {
    const [model] = await db.select().from(pricingModels).where(eq(pricingModels.id, id));
    return model || undefined;
  }

  async createPricingModel(insertModel: InsertPricingModel): Promise<PricingModel> {
    const [model] = await db.insert(pricingModels).values(insertModel).returning();
    return model;
  }

  async updatePricingModel(id: string, updates: Partial<InsertPricingModel>): Promise<PricingModel | undefined> {
    const [model] = await db.update(pricingModels).set(updates).where(eq(pricingModels.id, id)).returning();
    return model || undefined;
  }

  // Shared results operations
  async getSharedResults(): Promise<SharedResult[]> {
    return await db.select().from(sharedResults);
  }

  async getSharedResult(id: string): Promise<SharedResult | undefined> {
    const [result] = await db.select().from(sharedResults).where(eq(sharedResults.id, id));
    return result || undefined;
  }

  async getSharedResultByUrl(shareUrl: string): Promise<SharedResult | undefined> {
    const [result] = await db.select().from(sharedResults).where(eq(sharedResults.shareUrl, shareUrl));
    return result || undefined;
  }

  async createSharedResult(insertResult: InsertSharedResult): Promise<SharedResult> {
    const [result] = await db.insert(sharedResults).values(insertResult).returning();
    return result;
  }

  async updateSharedResult(id: string, updates: Partial<InsertSharedResult>): Promise<SharedResult | undefined> {
    const [result] = await db.update(sharedResults).set(updates).where(eq(sharedResults.id, id)).returning();
    return result || undefined;
  }

  async deleteSharedResult(id: string): Promise<boolean> {
    const result = await db.delete(sharedResults).where(eq(sharedResults.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contract operations
  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contracts);
  }

  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(insertContract).returning();
    return contract;
  }

  async updateContract(id: string, updates: Partial<InsertContract>): Promise<Contract | undefined> {
    const [contract] = await db.update(contracts).set({...updates, updatedAt: new Date()}).where(eq(contracts.id, id)).returning();
    return contract || undefined;
  }

  async deleteContract(id: string): Promise<boolean> {
    const result = await db.delete(contracts).where(eq(contracts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

// Switch to database storage - needed for persistence between API requests
export const storage = new DatabaseStorage();

// Use MemStorage for development only (not persistent)
// export const storage = new MemStorage();