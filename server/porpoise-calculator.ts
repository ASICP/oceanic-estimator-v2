import { z } from 'zod';
import { db } from './db';
import { pricingTiers, usagePricing, cogsStructure, competitorPricing } from '@shared/schema';
import { eq } from 'drizzle-orm';

// ========================================
// Types and Schemas
// ========================================

export const porpoiseCalculationSchema = z.object({
  // Step 1: Product Selection
  tierId: z.enum(['starter', 'professional', 'team', 'enterprise']),
  billingPeriod: z.enum(['monthly', 'annual']),
  
  // Step 2: Team & Resource Configuration
  numUsers: z.number().min(1).default(10),
  concurrentJobs: z.number().min(0).default(3),
  storageGb: z.number().min(0).default(10),
  gpuHoursMonthly: z.number().min(0).default(20),
  apiCallsMonthly: z.number().min(0).default(5000),
  numAvatars: z.number().min(0).default(0),
  
  // Step 3: Advanced Options (optional)
  deploymentType: z.enum(['cloud', 'byoc', 'air_gap']).optional().default('cloud'),
  ssoRequired: z.boolean().optional().default(false),
  whiteLabelAvatars: z.boolean().optional().default(false)
});

export type PorpoiseCalculationInput = z.infer<typeof porpoiseCalculationSchema>;

export interface PorpoiseCalculationResult {
  // Pricing Details
  tierPricing: {
    tierId: string;
    tierName: string;
    baseMonthlyCost: number;
    baseAnnualCost: number;
    billingPeriod: string;
    discount: number;
  };
  
  // Usage Costs
  usageCosts: {
    gpuCost: number;
    storageCost: number;
    apiCallsCost: number;
    avatarCost: number;
    totalUsageCost: number;
  };
  
  // Total Customer-Facing Costs
  customerCosts: {
    monthlyCost: number;
    annualCost: number;
    effectiveMonthlyCost: number; // annual / 12
  };
  
  // Internal COGS (Cost of Goods Sold)
  cogs: {
    infrastructureCost: number;
    avatarCost: number;
    twilioCost: number;
    supportCost: number;
    totalMonthlyCogs: number;
    totalAnnualCogs: number;
  };
  
  // Margin Analysis
  margins: {
    grossMarginPercent: number;
    monthlyGrossProfit: number;
    annualGrossProfit: number;
    targetMarginRange: { min: number; max: number };
    marginStatus: 'below_target' | 'in_target' | 'above_target';
  };
  
  // Competitor Comparison
  competitors: Array<{
    competitorKey: string;
    competitorName: string;
    annualCost: number;
    savings: number;
    savingsPercent: number;
  }>;
  
  // Input Echo (for display purposes)
  inputSummary: {
    numUsers: number;
    gpuHoursMonthly: number;
    storageGb: number;
    apiCallsMonthly: number;
    numAvatars: number;
  };
}

// ========================================
// Pricing Calculation Engine
// ========================================

export class PorpoiseCalculator {
  /**
   * Main calculation function
   */
  static async calculate(input: PorpoiseCalculationInput): Promise<PorpoiseCalculationResult> {
    console.log('[PORPOISE_CALC] Starting calculation with input:', JSON.stringify(input, null, 2));
    
    // 1. Get tier pricing
    const tierPricing = await this.calculateTierPricing(input);
    
    // 2. Calculate usage costs
    const usageCosts = await this.calculateUsageCosts(input, tierPricing.includedResources);
    
    // 3. Calculate total customer-facing costs
    const customerCosts = this.calculateCustomerCosts(tierPricing, usageCosts, input.billingPeriod);
    
    // 4. Calculate COGS
    const cogs = await this.calculateCOGS(input, tierPricing.tierId);
    
    // 5. Calculate margins
    const margins = this.calculateMargins(customerCosts, cogs, tierPricing.tierId);
    
    // 6. Get competitor comparisons
    const competitors = await this.getCompetitorComparisons(customerCosts.annualCost);
    
    return {
      tierPricing: {
        tierId: tierPricing.tierId,
        tierName: tierPricing.tierName,
        baseMonthlyCost: tierPricing.monthlyPrice,
        baseAnnualCost: tierPricing.annualPrice,
        billingPeriod: input.billingPeriod,
        discount: tierPricing.discount
      },
      usageCosts,
      customerCosts,
      cogs,
      margins,
      competitors,
      inputSummary: {
        numUsers: input.numUsers,
        gpuHoursMonthly: input.gpuHoursMonthly,
        storageGb: input.storageGb,
        apiCallsMonthly: input.apiCallsMonthly,
        numAvatars: input.numAvatars
      }
    };
  }

  /**
   * Calculate tier pricing and included resources
   */
  private static async calculateTierPricing(input: PorpoiseCalculationInput) {
    const [tier] = await db.select().from(pricingTiers).where(eq(pricingTiers.tierId, input.tierId));
    
    if (!tier) {
      throw new Error(`Tier not found: ${input.tierId}`);
    }
    
    const monthlyPrice = tier.monthlyPrice ? parseFloat(tier.monthlyPrice) : 0;
    const annualPrice = tier.annualPrice ? parseFloat(tier.annualPrice) : 0;
    const discount = tier.annualDiscountPercent ? parseFloat(tier.annualDiscountPercent) : 0;
    
    return {
      tierId: tier.tierId,
      tierName: tier.tierName,
      monthlyPrice,
      annualPrice,
      discount,
      includedResources: {
        users: tier.includedUsers || 0,
        gpuHours: tier.includedGpuHours || 0,
        storageGb: tier.includedStorageGb || 0,
        apiCalls: tier.includedApiCalls || 0,
        avatars: tier.includedAvatars || 0
      }
    };
  }

  /**
   * Calculate usage-based costs (overage charges)
   */
  private static async calculateUsageCosts(
    input: PorpoiseCalculationInput,
    includedResources: any
  ) {
    // Get current usage pricing
    const pricingData = await db.select().from(usagePricing);
    const pricingMap = new Map(pricingData.map(p => [p.resourceType, parseFloat(p.pricePerUnit)]));
    
    // Calculate overages
    const gpuOverage = Math.max(0, input.gpuHoursMonthly - includedResources.gpuHours);
    const storageOverage = Math.max(0, input.storageGb - includedResources.storageGb);
    const apiOverage = Math.max(0, input.apiCallsMonthly - includedResources.apiCalls);
    const avatarOverage = includedResources.avatars === -1 ? 0 : Math.max(0, input.numAvatars - includedResources.avatars);
    
    // Calculate costs
    const gpuCost = gpuOverage * (pricingMap.get('gpu_hour') || 0.75);
    const storageCost = storageOverage * (pricingMap.get('storage_gb') || 0.10);
    const apiCallsCost = apiOverage * (pricingMap.get('api_call') || 0.002);
    
    // Avatar add-on costs (different pricing per tier)
    let avatarCost = 0;
    if (avatarOverage > 0) {
      const addonKey = input.tierId === 'starter' ? 'avatar_addon_starter' : 'avatar_addon_professional';
      const addonPrice = pricingMap.get(addonKey) || 49.00;
      const addonPacks = Math.ceil(avatarOverage / 6); // Sold in packs of 6
      avatarCost = addonPacks * addonPrice;
    }
    
    return {
      gpuCost,
      storageCost,
      apiCallsCost,
      avatarCost,
      totalUsageCost: gpuCost + storageCost + apiCallsCost + avatarCost
    };
  }

  /**
   * Calculate total customer-facing costs
   */
  private static calculateCustomerCosts(
    tierPricing: any,
    usageCosts: any,
    billingPeriod: string
  ) {
    const baseCost = billingPeriod === 'annual' ? tierPricing.annualPrice : tierPricing.monthlyPrice;
    const monthlyCost = billingPeriod === 'annual' 
      ? (tierPricing.annualPrice / 12) + usageCosts.totalUsageCost
      : tierPricing.monthlyPrice + usageCosts.totalUsageCost;
    
    const annualCost = billingPeriod === 'annual'
      ? tierPricing.annualPrice + (usageCosts.totalUsageCost * 12)
      : (tierPricing.monthlyPrice + usageCosts.totalUsageCost) * 12;
    
    return {
      monthlyCost,
      annualCost,
      effectiveMonthlyCost: annualCost / 12
    };
  }

  /**
   * Calculate COGS (Cost of Goods Sold)
   */
  private static async calculateCOGS(input: PorpoiseCalculationInput, tierId: string) {
    // Get COGS data
    const cogsData = await db.select().from(cogsStructure);
    
    // Infrastructure costs
    const gpuUnitCost = cogsData.find(c => c.costSubcategory === 'gpu_compute')?.costPerUnit || '0.45';
    const storageUnitCost = cogsData.find(c => c.costSubcategory === 'storage')?.costPerUnit || '0.05';
    const networkCost = cogsData.find(c => c.costSubcategory === 'network')?.costPerUnit || '2.00';
    const multiCloudOverhead = cogsData.find(c => c.costSubcategory === 'multi_cloud_overhead')?.costPerUnit || '1.50';
    
    const gpuCost = input.gpuHoursMonthly * parseFloat(gpuUnitCost);
    const storageCost = input.storageGb * parseFloat(storageUnitCost);
    const baseInfrastructureCost = gpuCost + storageCost + parseFloat(networkCost);
    const overheadCost = baseInfrastructureCost * (parseFloat(multiCloudOverhead) / 100);
    const infrastructureCost = baseInfrastructureCost + overheadCost;
    
    // Avatar costs (HeyGen)
    const heygenUnitCost = cogsData.find(c => c.costSubcategory === 'heygen_credit')?.costPerUnit || '4.50';
    const avatarCost = input.numAvatars * parseFloat(heygenUnitCost);
    
    // Twilio costs (estimated based on usage - simplified)
    const smsCost = cogsData.find(c => c.costSubcategory === 'sms')?.costPerUnit || '0.0075';
    const voiceCost = cogsData.find(c => c.costSubcategory === 'voice')?.costPerUnit || '0.013';
    // Assume 100 SMS and 50 voice minutes per month for estimation
    const twilioCost = (100 * parseFloat(smsCost)) + (50 * parseFloat(voiceCost));
    
    // Support costs (tier-specific)
    const supportCostData = cogsData.find(c => 
      c.costCategory === 'support' && c.tierId === tierId
    );
    const supportCost = supportCostData ? parseFloat(supportCostData.costPerUnit) : 12.50;
    
    const totalMonthlyCogs = infrastructureCost + avatarCost + twilioCost + supportCost;
    
    return {
      infrastructureCost,
      avatarCost,
      twilioCost,
      supportCost,
      totalMonthlyCogs,
      totalAnnualCogs: totalMonthlyCogs * 12
    };
  }

  /**
   * Calculate margins
   */
  private static calculateMargins(
    customerCosts: any,
    cogs: any,
    tierId: string
  ) {
    const monthlyRevenue = customerCosts.monthlyCost;
    const annualRevenue = customerCosts.annualCost;
    
    const monthlyGrossProfit = monthlyRevenue - cogs.totalMonthlyCogs;
    const annualGrossProfit = annualRevenue - cogs.totalAnnualCogs;
    
    const grossMarginPercent = (annualGrossProfit / annualRevenue) * 100;
    
    // Target margin ranges by tier (from spec)
    const targetRanges: Record<string, { min: number; max: number }> = {
      starter: { min: 72, max: 75 },
      professional: { min: 75, max: 78 },
      team: { min: 76, max: 79 },
      enterprise: { min: 78, max: 82 }
    };
    
    const targetMarginRange = targetRanges[tierId] || { min: 72, max: 82 };
    
    let marginStatus: 'below_target' | 'in_target' | 'above_target' = 'in_target';
    if (grossMarginPercent < targetMarginRange.min) {
      marginStatus = 'below_target';
    } else if (grossMarginPercent > targetMarginRange.max) {
      marginStatus = 'above_target';
    }
    
    return {
      grossMarginPercent,
      monthlyGrossProfit,
      annualGrossProfit,
      targetMarginRange,
      marginStatus
    };
  }

  /**
   * Get competitor comparisons
   */
  private static async getCompetitorComparisons(porpoiseAnnualCost: number) {
    const competitors = await db.select().from(competitorPricing).where(eq(competitorPricing.active, true));
    
    return competitors.map(comp => {
      const competitorAnnualCost = parseFloat(comp.annualCostEstimate);
      const savings = competitorAnnualCost - porpoiseAnnualCost;
      const savingsPercent = (savings / competitorAnnualCost) * 100;
      
      return {
        competitorKey: comp.competitorKey,
        competitorName: comp.competitorName,
        annualCost: competitorAnnualCost,
        savings,
        savingsPercent
      };
    }).sort((a, b) => b.savingsPercent - a.savingsPercent); // Sort by highest savings first
  }
}
