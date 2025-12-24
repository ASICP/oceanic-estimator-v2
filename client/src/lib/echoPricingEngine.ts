/**
 * ECHO RAG CALCULATOR v2.0
 * Pricing Calculation Engine
 * Adapted for TypeScript/React from echo-pricing-engine.js
 */

export type DeploymentType = 'managed_saas' | 'self_hosted';
export type BillingPeriod = 'monthly' | 'annual';
export type TierId = 'starter_saas' | 'professional_saas' | 'enterprise_saas' | 'community_self' | 'enterprise_self' | 'enterprise_plus_self';

export interface EchoConfig {
    deploymentType: DeploymentType;
    industry?: string;
    useCases?: string[];
    users: number;
    connectors: number;
    storageGB: number;
    monthlyQueries?: number;
    voicePercentage?: number;
    visualPercentage?: number;
    powerUserPercent?: number;
    billingPeriod?: BillingPeriod;
    addons?: {
        advancedAnalytics: boolean;
        dedicatedCSM: boolean;
        dedicatedVPC?: boolean;
        humanSeats?: number;
    };
    customConnectorsCount?: number;
    manualAgentCount?: number;
    tierId?: TierId;
}

// ========================================
// PRICING CONSTANTS
// ========================================

const TIER_PRICING: Record<TierId, any> = {
    starter_saas: {
        id: 'starter_saas',
        name: 'Starter',
        deploymentType: 'managed_saas',
        monthly: 2500,
        annual: 24000,
        annualDiscountPercent: 20,
        included: {
            usersMin: 10,
            usersMax: 50,
            connectors: 5,
            storageGB: 100,
            monthlyQueries: -1,
            advancedAnalytics: false,
            dedicatedCSM: false
        }
    },
    professional_saas: {
        id: 'professional_saas',
        name: 'Professional',
        deploymentType: 'managed_saas',
        monthly: 10000,
        annual: 96000,
        annualDiscountPercent: 20,
        included: {
            usersMin: 50,
            usersMax: 500,
            connectors: 20,
            storageGB: 1024,
            monthlyQueries: -1,
            advancedAnalytics: false,
            dedicatedCSM: false
        }
    },
    enterprise_saas: {
        id: 'enterprise_saas',
        name: 'Enterprise',
        deploymentType: 'managed_saas',
        monthly: 25000,
        annual: 240000,
        annualDiscountPercent: 20,
        included: {
            usersMin: 500,
            usersMax: -1,
            connectors: -1,
            storageGB: -1,
            monthlyQueries: -1,
            advancedAnalytics: true,
            dedicatedCSM: true
        }
    },
    community_self: {
        id: 'community_self',
        name: 'Community',
        deploymentType: 'self_hosted',
        monthly: 0,
        annual: 0,
        annualDiscountPercent: 0,
        included: {
            usersMin: 0,
            usersMax: 20,
            connectors: -1,
            storageGB: -1,
            monthlyQueries: -1,
            advancedAnalytics: false,
            dedicatedCSM: false
        }
    },
    enterprise_self: {
        id: 'enterprise_self',
        name: 'Enterprise',
        deploymentType: 'self_hosted',
        monthly: 1667,
        annual: 20000,
        annualDiscountPercent: 0,
        included: {
            usersMin: 20,
            usersMax: 200,
            connectors: -1,
            storageGB: -1,
            monthlyQueries: -1,
            advancedAnalytics: false,
            dedicatedCSM: false
        }
    },
    enterprise_plus_self: {
        id: 'enterprise_plus_self',
        name: 'Enterprise Plus',
        deploymentType: 'self_hosted',
        monthly: 4167,
        annual: 50000,
        annualDiscountPercent: 0,
        included: {
            usersMin: 200,
            usersMax: -1,
            connectors: -1,
            storageGB: -1,
            monthlyQueries: -1,
            advancedAnalytics: true,
            dedicatedCSM: true
        }
    }
};

const USAGE_PRICING = {
    connectorOverage: 500.00,
    storageOveragePer100GB: 100.00,
    advancedAnalytics: 2000.00,
    dedicatedCSM: 5000.00,
    voicePremium: 1000.00,
    visualPremium: 1500.00,
    customConnectorDevelopment: 15000.00
};

const COGS_STRUCTURE = {
    infrastructure: {
        vectorDBNodePerMonth: 500.00,
        searchNodePerMonth: 400.00,
        apiServerNodePerMonth: 300.00,
        loadBalancerPerMonth: 150.00,
        nodesPerUsers: 100,
        primaryStoragePerGB: 0.10,
        backupStoragePerGB: 0.05,
        vectorEmbeddingsPerGB: 0.12
    },
    aiml: {
        embeddingPerQuery: 0.0001,
        voiceProcessingPerMinute: 0.002,
        imageProcessingPerImage: 0.001
    },
    dataTransfer: {
        ingressPerGB: 0.01,
        egressPerGB: 0.02,
        avgDailyIngressGB: 25,
        avgDailyEgressGB: 50
    },
    support: {
        starter_saas: 150.00,
        professional_saas: 250.00,
        enterprise_saas: 500.00,
        community_self: 0,
        enterprise_self: 100.00,
        enterprise_plus_self: 200.00
    },
    monitoring: {
        perCustomerPerMonth: 150.00
    }
};

export const ROI_ASSUMPTIONS = {
    hoursSavedPerUserPerMonth: 15,
    avgSalaryPerHour: 50,
    traditionalOnboardingWeeks: 4,
    echoOnboardingDays: 3,
    hoursPerWeek: 40,
    avgNewHireGrowthPercent: 20,
    avgValuePerUserPerYear: 1400
};

// ========================================
// CORE FUNCTIONS
// ========================================

export function determineTier(config: EchoConfig): TierId {
    const { users, connectors, storageGB, useCases, industry, deploymentType } = config;

    if (deploymentType === 'self_hosted') {
        if (users <= 20) return 'community_self';
        if (users <= 200) return 'enterprise_self';
        return 'enterprise_plus_self';
    }

    // Managed SaaS
    if (users >= 500 ||
        connectors > 20 ||
        storageGB > 1024 ||
        ['financial', 'healthcare', 'legal'].includes(industry || '') ||
        (useCases && useCases.length >= 5)) {
        return 'enterprise_saas';
    }

    if (users >= 50 || connectors > 5 || storageGB > 100) {
        return 'professional_saas';
    }

    return 'starter_saas';
}

function getBasePricing(tierId: TierId) {
    return TIER_PRICING[tierId] || TIER_PRICING.professional_saas;
}

export function calculateTotalMonthlyCost(config: EchoConfig) {
    const {
        tierId,
        billingPeriod = 'monthly',
        connectors,
        storageGB,
        addons = { advancedAnalytics: false, dedicatedCSM: false },
        voicePercentage = 0,
        visualPercentage = 0,
        customConnectorsCount = 0
    } = config;

    const actualTierId = tierId || determineTier(config);
    const tier = getBasePricing(actualTierId);

    // Subscription
    let subscription = tier.monthly;
    if (billingPeriod === 'annual' && tier.monthly > 0) {
        subscription = tier.annual / 12;
    }

    // Overages
    let connectorOverage = 0;
    if (tier.included.connectors !== -1 && connectors > tier.included.connectors) {
        connectorOverage = (connectors - tier.included.connectors) * USAGE_PRICING.connectorOverage;
    }

    let storageOverage = 0;
    if (tier.included.storageGB !== -1 && storageGB > tier.included.storageGB) {
        const extraGB = storageGB - tier.included.storageGB;
        const blocks = Math.ceil(extraGB / 100);
        storageOverage = blocks * USAGE_PRICING.storageOveragePer100GB;
    }

    // Add-ons
    let addonsCost = 0;
    const addonsBreakdown: Record<string, number> = {};

    if (addons.advancedAnalytics && !tier.included.advancedAnalytics) {
        addonsCost += USAGE_PRICING.advancedAnalytics;
        addonsBreakdown.advancedAnalytics = USAGE_PRICING.advancedAnalytics;
    }

    if (addons.dedicatedCSM && !tier.included.dedicatedCSM) {
        addonsCost += USAGE_PRICING.dedicatedCSM;
        addonsBreakdown.dedicatedCSM = USAGE_PRICING.dedicatedCSM;
    }

    if (voicePercentage > 25) {
        addonsCost += USAGE_PRICING.voicePremium;
        addonsBreakdown.voicePremium = USAGE_PRICING.voicePremium;
    }

    if (visualPercentage > 25) {
        addonsCost += USAGE_PRICING.visualPremium;
        addonsBreakdown.visualPremium = USAGE_PRICING.visualPremium;
    }

    const oneTimeCosts = customConnectorsCount * USAGE_PRICING.customConnectorDevelopment;
    const totalMonthly = subscription + connectorOverage + storageOverage + addonsCost;

    return {
        tier: tier.name,
        subscription,
        connectorOverage,
        storageOverage,
        addons: addonsCost,
        addonsBreakdown,
        totalMonthly,
        oneTimeCosts,
        billingPeriod
    };
}

export function calculateMargin(config: EchoConfig, totalMonthlyRevenue: number) {
    const {
        users,
        storageGB,
        monthlyQueries = users * 0.6 * 20 * 30,
        voicePercentage = 0,
        visualPercentage = 0
    } = config;
    const tierId = config.tierId || determineTier(config);

    // Infrastructure COGS
    const { infrastructure } = COGS_STRUCTURE;
    const nodesNeeded = Math.ceil(users / infrastructure.nodesPerUsers);
    const compute =
        (nodesNeeded * infrastructure.vectorDBNodePerMonth) +
        (Math.max(2, Math.ceil(nodesNeeded / 2)) * infrastructure.searchNodePerMonth) +
        (Math.max(3, Math.ceil(nodesNeeded / 1.5)) * infrastructure.apiServerNodePerMonth) +
        (2 * infrastructure.loadBalancerPerMonth);

    const storage =
        (storageGB * infrastructure.primaryStoragePerGB) +
        (storageGB * infrastructure.backupStoragePerGB) +
        (users * 10 * infrastructure.vectorEmbeddingsPerGB);

    // AI/ML COGS
    const { aiml } = COGS_STRUCTURE;
    const embedding = monthlyQueries * aiml.embeddingPerQuery;
    const voice = (monthlyQueries * (voicePercentage / 100) * 2) * aiml.voiceProcessingPerMinute;
    const visual = (monthlyQueries * (visualPercentage / 100)) * aiml.imageProcessingPerImage;

    const support = COGS_STRUCTURE.support[tierId] || 0;
    const monitoring = COGS_STRUCTURE.monitoring.perCustomerPerMonth;
    const dataTransfer = (COGS_STRUCTURE.dataTransfer.avgDailyIngressGB * 30 * COGS_STRUCTURE.dataTransfer.ingressPerGB) + (COGS_STRUCTURE.dataTransfer.avgDailyEgressGB * 30 * COGS_STRUCTURE.dataTransfer.egressPerGB);

    const totalCOGS = compute + storage + embedding + voice + visual + support + monitoring + dataTransfer;
    const grossProfit = totalMonthlyRevenue - totalCOGS;
    const marginPercent = (grossProfit / totalMonthlyRevenue) * 100;

    return {
        totalCOGS,
        grossProfit,
        marginPercent,
        target: 82,
        breakdown: {
            compute, storage, aiml: embedding + voice + visual, support, monitoring, dataTransfer
        }
    };
}

export function calculateROI(config: EchoConfig, annualCost: number) {
    const { users } = config;
    const a = ROI_ASSUMPTIONS;

    const productivityValue = users * a.hoursSavedPerUserPerMonth * a.avgSalaryPerHour * 12;
    const newHires = Math.ceil(users * (a.avgNewHireGrowthPercent / 100));
    const onboardingSavings = ((a.traditionalOnboardingWeeks * a.hoursPerWeek) - (a.echoOnboardingDays / 5 * a.hoursPerWeek)) * a.avgSalaryPerHour * newHires;
    const efficiencyGain = users * a.avgValuePerUserPerYear;

    const totalValue = productivityValue + onboardingSavings + efficiencyGain;
    const netValue = totalValue - annualCost;
    const roiPercent = (netValue / annualCost) * 100;
    const paybackMonths = (annualCost / totalValue) * 12;

    return {
        totalValue,
        investment: annualCost,
        netValue,
        roiPercent,
        paybackMonths
    };
}
