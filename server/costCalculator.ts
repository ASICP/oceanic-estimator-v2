import { z } from "zod";

// Enhanced cost calculation engine with sensitivity analysis
export interface CostCalculationInput {
  workflow: {
    complexity: "Low" | "Medium" | "High";
    duration: string;
    domain: string;
    presetId?: string;
  };
  agents: Array<{
    id: string;
    name: string;
    role: string;
    baseCostPerHour?: string;
    domain: string;
  }>;
  resources: {
    apiCalls: number;
    dataTransfer: number;
    errorRate: number;
    batchSize: number;
    modelProvider: string;
    autoScale: boolean;
    multiModel: boolean;
  };
  billing: {
    model: "pay-per-use" | "subscription" | "hybrid" | "custom";
    tier: "individual" | "department" | "enterprise";
    volumeDiscount: boolean;
    byoApiKeys: boolean;
    taxRate: number;
    margin: number;
  };
}

export interface CostCalculationResult {
  totalCost: number;
  traditionalCost: number;
  savings: number;
  savingsPercentage: number;
  breakdown: Array<{
    category: string;
    cost: number;
    color: string;
    description?: string;
  }>;
  baseCost: number;
  taxAmount: number;
  marginAmount: number;
  // Individual cost components for frontend breakdown display
  agentCost: number;
  apiCost: number;
  dataCost: number;
  infrastructureCost: number;
  metadata: {
    agentCount: number;
    complexityMultiplier: number;
    retryMultiplier: number;
    modelMultiplier: number;
    billingMultiplier: number;
    volumeDiscountApplied: boolean;
    byoKeysDiscountApplied: boolean;
  };
  sensitivityAnalysis: {
    errorRateImpact: Array<{ errorRate: number; additionalCost: number; totalCost: number }>;
    agentCountImpact: Array<{ agentCount: number; totalCost: number; savingsPercentage: number }>;
    modelProviderComparison: Array<{ provider: string; totalCost: number; description: string }>;
  };
  projections: {
    monthly: number;
    quarterly: number;
    annual: number;
    irr?: number; // For credit/investment workflows
    downsideProtection?: number;
  };
}

export class CostCalculator {
  // Base pricing constants
  private static readonly BASE_AGENT_COST_PER_HOUR = 150;
  private static readonly TRADITIONAL_MULTIPLIER = 2.8; // 65-70% savings
  private static readonly API_COST_PER_1K = 0.02;
  private static readonly DATA_TRANSFER_COST_PER_MB = 0.1;

  // Complexity multipliers
  private static readonly COMPLEXITY_MULTIPLIERS = {
    "Low": 1.0,
    "Medium": 1.2,
    "High": 1.5
  };

  // Model provider multipliers
  private static readonly MODEL_MULTIPLIERS = {
    "openai": 1.2,
    "claude": 1.0,
    "groq": 0.8,
    "multi": 1.1
  };

  // Billing model multipliers
  private static readonly BILLING_MULTIPLIERS = {
    "pay-per-use": 1.0,
    "subscription": 0.85,
    "hybrid": 0.9,
    "custom": 1.0
  };

  // Tier-based pricing
  private static readonly TIER_PRICING = {
    "individual": { seatPrice: 29, tokenRate: 0.015 },
    "department": { seatPrice: 49, tokenRate: 0.01 },
    "enterprise": { seatPrice: 149, tokenRate: 0.005 }
  };

  public static calculate(input: CostCalculationInput): CostCalculationResult {
    const { workflow, agents, resources, billing } = input;

    // Base calculations
    const complexityMultiplier = this.COMPLEXITY_MULTIPLIERS[workflow.complexity];
    const modelMultiplier = this.MODEL_MULTIPLIERS[resources.modelProvider as keyof typeof this.MODEL_MULTIPLIERS] || 1.0;
    const billingMultiplier = this.BILLING_MULTIPLIERS[billing.model];
    const retryMultiplier = 1 + (resources.errorRate / 100);

    // Calculate base costs
    const agentCost = this.calculateAgentCosts(agents, workflow, complexityMultiplier);
    const apiCost = this.calculateApiCosts(resources, agents.length, modelMultiplier);
    const dataCost = this.calculateDataCosts(resources);
    const infrastructureCost = this.calculateInfrastructureCosts(agentCost, resources);

    // Apply multipliers
    let totalOperationalCost = (agentCost + apiCost + dataCost + infrastructureCost) * 
                              retryMultiplier * billingMultiplier;

    // Apply discounts
    const volumeDiscountApplied = billing.volumeDiscount && agents.length >= 5;
    const byoKeysDiscountApplied = billing.byoApiKeys;

    if (volumeDiscountApplied) {
      totalOperationalCost *= 0.9; // 10% volume discount
    }

    if (byoKeysDiscountApplied) {
      totalOperationalCost *= 0.7; // 30% BYO keys discount
    }

    // Calculate final costs
    const baseCost = Math.floor(totalOperationalCost);
    const taxAmount = Math.floor(baseCost * (billing.taxRate / 100));
    const marginAmount = Math.floor(baseCost * (billing.margin / 100));
    const totalCost = baseCost + taxAmount + marginAmount;

    // Traditional cost calculation
    const traditionalCost = Math.floor(totalCost * this.TRADITIONAL_MULTIPLIER);
    const savings = traditionalCost - totalCost;
    const savingsPercentage = Math.round((savings / traditionalCost) * 100);

    // Cost breakdown
    const breakdown = [
      {
        category: "AI Agents",
        cost: Math.floor(agentCost * complexityMultiplier),
        color: "hsl(var(--chart-1))",
        description: `${agents.length} agents with ${workflow.complexity.toLowerCase()} complexity`
      },
      {
        category: "API Calls",
        cost: Math.floor(apiCost * modelMultiplier),
        color: "hsl(var(--chart-2))",
        description: `${resources.apiCalls * agents.length} calls via ${resources.modelProvider}`
      },
      {
        category: "Data Processing",
        cost: dataCost,
        color: "hsl(var(--chart-3))",
        description: `${resources.dataTransfer}MB transfer and processing`
      },
      {
        category: "Infrastructure",
        cost: infrastructureCost,
        color: "hsl(var(--chart-4))",
        description: "Platform, monitoring, and operational overhead"
      }
    ];

    // Sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(input, baseCost);

    // Projections
    const projections = this.calculateProjections(totalCost, workflow);

    return {
      totalCost,
      traditionalCost,
      savings,
      savingsPercentage,
      breakdown,
      baseCost,
      taxAmount,
      marginAmount,
      // Individual cost components for frontend breakdown display
      agentCost: Math.floor(agentCost * complexityMultiplier * retryMultiplier * billingMultiplier * 
                            (volumeDiscountApplied ? 0.9 : 1) * (byoKeysDiscountApplied ? 0.7 : 1)),
      apiCost: Math.floor(apiCost * modelMultiplier * retryMultiplier * billingMultiplier * 
                          (volumeDiscountApplied ? 0.9 : 1) * (byoKeysDiscountApplied ? 0.7 : 1)),
      dataCost: Math.floor(dataCost * retryMultiplier * billingMultiplier * 
                           (volumeDiscountApplied ? 0.9 : 1) * (byoKeysDiscountApplied ? 0.7 : 1)),
      infrastructureCost: Math.floor(infrastructureCost * retryMultiplier * billingMultiplier * 
                                     (volumeDiscountApplied ? 0.9 : 1) * (byoKeysDiscountApplied ? 0.7 : 1)),
      metadata: {
        agentCount: agents.length,
        complexityMultiplier,
        retryMultiplier,
        modelMultiplier,
        billingMultiplier,
        volumeDiscountApplied,
        byoKeysDiscountApplied
      },
      sensitivityAnalysis,
      projections
    };
  }

  private static calculateAgentCosts(
    agents: CostCalculationInput["agents"], 
    workflow: CostCalculationInput["workflow"],
    complexityMultiplier: number
  ): number {
    const hoursFromDuration = this.parseHoursFromDuration(workflow.duration);
    return agents.reduce((total, agent) => {
      const hourlyRate = agent.baseCostPerHour ? 
        parseFloat(agent.baseCostPerHour) : 
        this.BASE_AGENT_COST_PER_HOUR;
      return total + (hourlyRate * hoursFromDuration * complexityMultiplier);
    }, 0);
  }

  private static calculateApiCosts(
    resources: CostCalculationInput["resources"],
    agentCount: number,
    modelMultiplier: number
  ): number {
    const totalCalls = resources.apiCalls * agentCount;
    return Math.floor((totalCalls / 1000) * this.API_COST_PER_1K * modelMultiplier);
  }

  private static calculateDataCosts(resources: CostCalculationInput["resources"]): number {
    return Math.floor(resources.dataTransfer * this.DATA_TRANSFER_COST_PER_MB);
  }

  private static calculateInfrastructureCosts(
    agentCost: number,
    resources: CostCalculationInput["resources"]
  ): number {
    let baseCost = Math.floor(agentCost * 0.15); // 15% infrastructure overhead
    
    // Auto-scaling premium
    if (resources.autoScale) {
      baseCost *= 1.1;
    }
    
    // Multi-model routing premium  
    if (resources.multiModel) {
      baseCost *= 1.05;
    }
    
    return Math.floor(baseCost);
  }

  private static parseHoursFromDuration(duration: string): number {
    // Parse duration strings like "4-8 hrs", "6-12 hours", "2-3 days"
    const match = duration.match(/(\d+)[-–]?(\d+)?\s*(hr|hour|day)/i);
    if (!match) return 8; // Default to 8 hours
    
    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    const avg = (min + max) / 2;
    
    if (match[3].toLowerCase().startsWith('day')) {
      return avg * 8; // 8 hours per day
    }
    
    return avg;
  }

  private static performSensitivityAnalysis(
    input: CostCalculationInput,
    baseCost: number
  ): CostCalculationResult["sensitivityAnalysis"] {
    // Error rate impact analysis
    const errorRateImpact = [0, 5, 10, 15, 20, 25].map(errorRate => {
      const retryMultiplier = 1 + (errorRate / 100);
      const additionalCost = Math.floor(baseCost * (retryMultiplier - 1));
      return {
        errorRate,
        additionalCost,
        totalCost: baseCost + additionalCost
      };
    });

    // Agent count impact analysis - calculate directly without recursion
    const agentCountImpact = [1, 3, 5, 7, 10].map(agentCount => {
      // Calculate costs directly for different agent counts to avoid recursion
      const complexityMultiplier = this.COMPLEXITY_MULTIPLIERS[input.workflow.complexity];
      const modelMultiplier = this.MODEL_MULTIPLIERS[input.resources.modelProvider as keyof typeof this.MODEL_MULTIPLIERS] || 1.0;
      const billingMultiplier = this.BILLING_MULTIPLIERS[input.billing.model];
      const retryMultiplier = 1 + (input.resources.errorRate / 100);
      
      // Calculate base costs with modified agent count
      const hoursFromDuration = this.parseHoursFromDuration(input.workflow.duration);
      const sampleAgent = input.agents[0] || { id: "1", name: "Agent", role: "AI", domain: "General", baseCostPerHour: undefined };
      const hourlyRate = sampleAgent.baseCostPerHour ? 
        parseFloat(sampleAgent.baseCostPerHour) : 
        this.BASE_AGENT_COST_PER_HOUR;
      
      const agentCost = hourlyRate * hoursFromDuration * complexityMultiplier * agentCount;
      const apiCost = Math.floor((input.resources.apiCalls * agentCount / 1000) * this.API_COST_PER_1K * modelMultiplier);
      const dataCost = Math.floor(input.resources.dataTransfer * this.DATA_TRANSFER_COST_PER_MB);
      const infrastructureCost = Math.floor(agentCost * 0.15);
      
      let totalOperationalCost = (agentCost + apiCost + dataCost + infrastructureCost) * 
                                retryMultiplier * billingMultiplier;
      
      // Apply discounts
      if (input.billing.volumeDiscount && agentCount >= 5) {
        totalOperationalCost *= 0.9;
      }
      if (input.billing.byoApiKeys) {
        totalOperationalCost *= 0.7;
      }
      
      const finalBaseCost = Math.floor(totalOperationalCost);
      const taxAmount = Math.floor(finalBaseCost * (input.billing.taxRate / 100));
      const marginAmount = Math.floor(finalBaseCost * (input.billing.margin / 100));
      const totalCost = finalBaseCost + taxAmount + marginAmount;
      const traditionalCost = Math.floor(totalCost * this.TRADITIONAL_MULTIPLIER);
      const savingsPercentage = Math.round(((traditionalCost - totalCost) / traditionalCost) * 100);
      
      return {
        agentCount,
        totalCost,
        savingsPercentage
      };
    });

    // Model provider comparison
    const modelProviderComparison = Object.entries(this.MODEL_MULTIPLIERS).map(([provider, multiplier]) => ({
      provider,
      totalCost: Math.floor(baseCost * multiplier),
      description: this.getProviderDescription(provider)
    }));

    return {
      errorRateImpact,
      agentCountImpact,
      modelProviderComparison
    };
  }

  private static getProviderDescription(provider: string): string {
    const descriptions = {
      "openai": "Premium quality, highest accuracy",
      "claude": "Balanced performance and cost",
      "groq": "High speed, cost-effective", 
      "multi": "Intelligent routing for optimization"
    };
    return descriptions[provider as keyof typeof descriptions] || "Custom provider";
  }

  private static calculateProjections(
    totalCost: number,
    workflow: CostCalculationInput["workflow"]
  ): CostCalculationResult["projections"] {
    // Assume this is a one-time project cost, so scale for recurring usage
    const monthly = Math.floor(totalCost * 0.8); // 20% efficiency gain over time
    const quarterly = monthly * 3;
    const annual = monthly * 12;

    // Special projections for credit/investment workflows
    let irr: number | undefined;
    let downsideProtection: number | undefined;

    if (workflow.domain?.toLowerCase().includes("credit") || 
        workflow.domain?.toLowerCase().includes("investment")) {
      irr = 15.5; // 12-18% IRR typical for credit operations
      downsideProtection = 1.7; // 1.5-2x downside protection
    }

    return {
      monthly,
      quarterly, 
      annual,
      irr,
      downsideProtection
    };
  }
}

// Export validation schema for API
export const costCalculationSchema = z.object({
  workflow: z.object({
    complexity: z.enum(["Low", "Medium", "High"]),
    duration: z.string(),
    domain: z.string(),
    presetId: z.string().optional()
  }),
  agents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    baseCostPerHour: z.string().optional(),
    domain: z.string()
  })),
  resources: z.object({
    apiCalls: z.number().min(0),
    dataTransfer: z.number().min(0),
    errorRate: z.number().min(0).max(100),
    batchSize: z.number().min(1),
    modelProvider: z.string(),
    autoScale: z.boolean(),
    multiModel: z.boolean()
  }),
  billing: z.object({
    model: z.enum(["pay-per-use", "subscription", "hybrid", "custom"]),
    tier: z.enum(["individual", "department", "enterprise"]),
    volumeDiscount: z.boolean(),
    byoApiKeys: z.boolean(),
    taxRate: z.number().min(0).max(100),
    margin: z.number().min(0).max(100)
  })
});