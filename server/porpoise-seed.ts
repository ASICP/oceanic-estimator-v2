import { db } from './db';
import { 
  pricingTiers,
  usagePricing,
  cogsStructure,
  competitorPricing,
  type InsertPricingTier,
  type InsertUsagePricing,
  type InsertCogsStructure,
  type InsertCompetitorPricing
} from '@shared/schema';

export async function seedPorpoiseData() {
  console.log('[PORPOISE_SEED] Starting Porpoise v2 data seeding...');
  
  try {
    // Check if data already exists
    const existingTiers = await db.select().from(pricingTiers);
    if (existingTiers.length > 0) {
      console.log('[PORPOISE_SEED] Data already seeded, skipping...');
      return { message: 'Porpoise data already seeded' };
    }

    // ========================================
    // 1. Seed Pricing Tiers
    // ========================================
    console.log('[PORPOISE_SEED] Seeding pricing tiers...');
    
    const tiers: InsertPricingTier[] = [
      {
        tierId: 'starter',
        tierName: 'Starter',
        monthlyPrice: '249.00',
        annualPrice: '2388.00',
        annualDiscountPercent: '10.00',
        includedUsers: 10,
        includedConcurrentJobs: 3,
        includedStorageGb: 10,
        includedGpuHours: 20,
        includedApiCalls: 5000,
        includedAvatars: 0,
        quickTrainWizard: true,
        advancedWorkflows: false,
        aiInterviewer: true,
        ssoSaml: false,
        whiteLabelAvatars: false,
        byocDeployment: false,
        airGapDeployment: false,
        dedicatedGpu: false,
        supportLevel: 'community',
        active: true
      },
      {
        tierId: 'professional',
        tierName: 'Professional',
        monthlyPrice: '749.00',
        annualPrice: '7188.00',
        annualDiscountPercent: '10.00',
        includedUsers: 50,
        includedConcurrentJobs: 10,
        includedStorageGb: 100,
        includedGpuHours: 100,
        includedApiCalls: 50000,
        includedAvatars: 6,
        quickTrainWizard: true,
        advancedWorkflows: true,
        aiInterviewer: true,
        ssoSaml: false,
        whiteLabelAvatars: false,
        byocDeployment: false,
        airGapDeployment: false,
        dedicatedGpu: false,
        supportLevel: 'email',
        active: true
      },
      {
        tierId: 'team',
        tierName: 'Team',
        monthlyPrice: '1999.00',
        annualPrice: '19188.00',
        annualDiscountPercent: '10.00',
        includedUsers: 100,
        includedConcurrentJobs: 25,
        includedStorageGb: 500,
        includedGpuHours: 300,
        includedApiCalls: 200000,
        includedAvatars: -1, // Unlimited
        quickTrainWizard: true,
        advancedWorkflows: true,
        aiInterviewer: true,
        ssoSaml: true,
        whiteLabelAvatars: false,
        byocDeployment: true,
        airGapDeployment: false,
        dedicatedGpu: false,
        supportLevel: 'priority',
        active: true
      },
      {
        tierId: 'enterprise',
        tierName: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        annualDiscountPercent: null,
        includedUsers: -1, // Unlimited
        includedConcurrentJobs: -1, // Unlimited
        includedStorageGb: -1, // Unlimited
        includedGpuHours: -1, // Unlimited
        includedApiCalls: -1, // Unlimited
        includedAvatars: -1, // Unlimited
        quickTrainWizard: true,
        advancedWorkflows: true,
        aiInterviewer: true,
        ssoSaml: true,
        whiteLabelAvatars: true,
        byocDeployment: true,
        airGapDeployment: true,
        dedicatedGpu: true,
        supportLevel: '24/7',
        active: true
      }
    ];

    await db.insert(pricingTiers).values(tiers);
    console.log(`[PORPOISE_SEED] Inserted ${tiers.length} pricing tiers`);

    // ========================================
    // 2. Seed Usage Pricing
    // ========================================
    console.log('[PORPOISE_SEED] Seeding usage pricing...');
    
    const usagePricingData: InsertUsagePricing[] = [
      {
        resourceType: 'gpu_hour',
        pricePerUnit: '0.75',
        unitName: 'hour',
        effectiveDate: '2025-01-01'
      },
      {
        resourceType: 'storage_gb',
        pricePerUnit: '0.10',
        unitName: 'GB/month',
        effectiveDate: '2025-01-01'
      },
      {
        resourceType: 'api_call',
        pricePerUnit: '0.002',
        unitName: 'call',
        effectiveDate: '2025-01-01'
      },
      {
        resourceType: 'inference_token',
        pricePerUnit: '0.0008',
        unitName: '1K tokens',
        effectiveDate: '2025-01-01'
      },
      {
        resourceType: 'avatar_addon_starter',
        pricePerUnit: '49.00',
        unitName: '6 avatars/month',
        effectiveDate: '2025-01-01'
      },
      {
        resourceType: 'avatar_addon_professional',
        pricePerUnit: '25.00',
        unitName: '6 avatars/month',
        effectiveDate: '2025-01-01'
      }
    ];

    await db.insert(usagePricing).values(usagePricingData);
    console.log(`[PORPOISE_SEED] Inserted ${usagePricingData.length} usage pricing items`);

    // ========================================
    // 3. Seed COGS Structure
    // ========================================
    console.log('[PORPOISE_SEED] Seeding COGS structure...');
    
    const cogsData: InsertCogsStructure[] = [
      // Infrastructure COGS (tier-agnostic)
      {
        costCategory: 'infrastructure',
        costSubcategory: 'gpu_compute',
        costPerUnit: '0.45',
        unitName: 'hour',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: '40% savings vs hyperscalers'
      },
      {
        costCategory: 'infrastructure',
        costSubcategory: 'storage',
        costPerUnit: '0.05',
        unitName: 'GB/month',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'Multi-cloud optimization'
      },
      {
        costCategory: 'infrastructure',
        costSubcategory: 'network',
        costPerUnit: '2.00',
        unitName: 'month',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'Bandwidth allocation'
      },
      {
        costCategory: 'infrastructure',
        costSubcategory: 'multi_cloud_overhead',
        costPerUnit: '1.50',
        unitName: 'percent',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'Management overhead'
      },
      
      // Avatar COGS
      {
        costCategory: 'avatars',
        costSubcategory: 'heygen_credit',
        costPerUnit: '4.50',
        unitName: 'avatar/month',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'HeyGen API costs'
      },
      
      // Twilio COGS
      {
        costCategory: 'twilio',
        costSubcategory: 'sms',
        costPerUnit: '0.0075',
        unitName: 'message',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'Twilio SMS'
      },
      {
        costCategory: 'twilio',
        costSubcategory: 'voice',
        costPerUnit: '0.013',
        unitName: 'minute',
        tierId: null,
        effectiveDate: '2025-01-01',
        notes: 'Twilio Voice'
      },
      
      // Support COGS (tier-specific)
      {
        costCategory: 'support',
        costSubcategory: 'customer_success',
        costPerUnit: '12.50',
        unitName: 'month',
        tierId: 'starter',
        effectiveDate: '2025-01-01',
        notes: 'Allocated CS time'
      },
      {
        costCategory: 'support',
        costSubcategory: 'customer_success',
        costPerUnit: '25.00',
        unitName: 'month',
        tierId: 'professional',
        effectiveDate: '2025-01-01',
        notes: 'Allocated CS time'
      },
      {
        costCategory: 'support',
        costSubcategory: 'customer_success',
        costPerUnit: '50.00',
        unitName: 'month',
        tierId: 'team',
        effectiveDate: '2025-01-01',
        notes: 'Allocated CS time'
      },
      {
        costCategory: 'support',
        costSubcategory: 'customer_success',
        costPerUnit: '166.67',
        unitName: 'month',
        tierId: 'enterprise',
        effectiveDate: '2025-01-01',
        notes: 'Allocated CS time'
      }
    ];

    await db.insert(cogsStructure).values(cogsData);
    console.log(`[PORPOISE_SEED] Inserted ${cogsData.length} COGS structure items`);

    // ========================================
    // 4. Seed Competitor Pricing (8 competitors)
    // ========================================
    console.log('[PORPOISE_SEED] Seeding competitor pricing...');
    
    const competitors: InsertCompetitorPricing[] = [
      {
        competitorKey: 'aws_sagemaker',
        competitorName: 'AWS SageMaker Canvas',
        annualCostEstimate: '5850.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'AWS ecosystem',
        strengths: ['Integrated with AWS services', 'Auto ML capabilities', 'Savings Plans discounts'],
        weaknesses: ['Vendor lock-in', 'No avatar capabilities', 'AWS-only deployment'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'google_vertex',
        competitorName: 'Google Vertex AI AutoML',
        annualCostEstimate: '6240.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'GCP ecosystem',
        strengths: ['BigQuery integration', 'Strong AutoML', 'Model Garden'],
        weaknesses: ['GCP-centric', 'No video avatars', 'Limited multi-cloud'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'azure_ml',
        competitorName: 'Azure ML Designer',
        annualCostEstimate: '5520.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'Azure ecosystem',
        strengths: ['Power BI integration', 'Visual pipelines', 'Reserved Instance savings'],
        weaknesses: ['Azure lock-in', 'Generic templates', 'No avatar tools'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'salesforce',
        competitorName: 'Salesforce Einstein Model Builder',
        annualCostEstimate: '9000.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'Salesforce CRM',
        strengths: ['CRM integration', 'Data Cloud connectors', 'Salesforce ecosystem'],
        weaknesses: ['CRM-tied', 'Premium pricing', '50-85% higher TCO'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'oracle_oci',
        competitorName: 'Oracle APEX AI / OCI GenAI',
        annualCostEstimate: '4800.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'Oracle ecosystem',
        strengths: ['Multi-cloud via OCI', 'Autonomous DB integration', 'Universal Credits'],
        weaknesses: ['DB-centric', 'No avatars', 'Longer setup time'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'huggingface',
        competitorName: 'Hugging Face AutoTrain',
        annualCostEstimate: '3960.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'None (open source)',
        strengths: ['Open source', 'Large model library', 'Affordable', 'Community-driven'],
        weaknesses: ['Fragmented', 'No enterprise integrations', 'Variable GPU costs'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'predibase',
        competitorName: 'Predibase',
        annualCostEstimate: '4200.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'None',
        strengths: ['Serverless LoRA', 'Token-efficient', 'Pay-per-use'],
        weaknesses: ['No data capture tools', 'Limited to 16B params', 'No avatars'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      },
      {
        competitorKey: 'replicate',
        competitorName: 'Replicate',
        annualCostEstimate: '5400.00',
        usageAssumptions: { users: 500, gpuHours: 1200, storageGB: 10000 },
        vendorLockIn: 'None',
        strengths: ['200+ models', 'One-line deploys', 'Fast boot', 'API-first'],
        weaknesses: ['Dev-focused', 'No enterprise workflows', 'Basic training'],
        dataSource: 'manual',
        lastVerifiedDate: '2025-11-15',
        lastUpdatedBy: 'CLabs Research Team',
        active: true
      }
    ];

    await db.insert(competitorPricing).values(competitors);
    console.log(`[PORPOISE_SEED] Inserted ${competitors.length} competitors`);

    console.log('[PORPOISE_SEED] ✅ Porpoise v2 data seeding completed successfully!');
    
    return {
      message: 'Porpoise v2 data seeded successfully',
      stats: {
        pricingTiers: tiers.length,
        usagePricing: usagePricingData.length,
        cogsItems: cogsData.length,
        competitors: competitors.length
      }
    };
    
  } catch (error) {
    console.error('[PORPOISE_SEED] Error seeding Porpoise data:', error);
    throw error;
  }
}
