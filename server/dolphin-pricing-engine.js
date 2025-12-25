/**
 * ========================================
 * DOLPHIN AGENT CALCULATOR v2.1
 * Pricing Calculation Engine
 * ========================================
 *
 * Core pricing logic for Dolphin Agent Orchestration
 * Focused on "Assemble Team" functionality
 * aligned with Technical Spec v1.0 (Nov 20, 2025)
 *
 * @version 2.1
 * @date December 18, 2025
 */

// ========================================
// PRICING CONSTANTS
// ========================================

/**
 * Tier pricing structure for Agent Services
 */
const TIER_PRICING = {
    starter_agent: {
        id: 'starter_agent',
        name: 'Starter Agent (Individual)',
        monthly: 49,
        annual: 490, // Not explicitly defined, assuming ~10x or just monthly * 12 used later if no discount
        tokenLimit: 500000,
        sessionLimitHours: 8,
        description: 'For individuals & small business',
        deploymentType: 'managed_saas'
    },
    professional_agent: {
        id: 'professional_agent',
        name: 'Professional Agent',
        monthly: 149,
        tokenLimit: 2000000,
        sessionLimitHours: 16,
        description: 'For growing businesses & pros',
        deploymentType: 'managed_saas'
    },
    enterprise_agent: {
        id: 'enterprise_agent',
        name: 'Enterprise Agent',
        monthly: 399,
        tokenLimit: 10000000,
        sessionLimitHours: 24, // 24/7
        description: 'For Fortune 500 & Regulated',
        deploymentType: 'managed_saas'
    }
};

/**
 * Pod & Volume Discounts
 */
const BUNDLE_PRICING = {
    pod_3: {
        name: 'Pod (3 Agents)',
        totalMonthly: 349,
        effectiveDiscount: 22, // ~22%
        minAgents: 3
    },
    pod_5: {
        name: 'Pod (5 Agents)',
        totalMonthly: 549,
        effectiveDiscount: 26,
        minAgents: 5
    },
    super_pod_15: {
        name: 'Super Pod (15 Agents)',
        totalMonthly: 1499,
        effectiveDiscount: 33,
        minAgents: 15
    },
    super_pod_30: {
        name: 'Super Pod (30 Agents)',
        totalMonthly: 2499,
        effectiveDiscount: 44,
        minAgents: 30
    }
};

const VOLUME_DISCOUNTS = {
    tier_1: { min: 1, max: 2, discount: 0 },
    tier_2: { min: 3, max: 4, discount: 0.15 }, // 15%
    tier_3: { min: 5, max: 9, discount: 0.25 }, // 25%
    tier_4: { min: 10, max: 19, discount: 0.33 }, // 33%
    tier_5: { min: 20, max: 49, discount: 0.40 }, // 40%
    tier_6: { min: 50, max: 9999, discount: 0.50 } // Custom/50%
};

/**
 * Agent Roles / Personas
 */
const AGENT_ROLES = [
    { id: 'tara', name: 'Tara (Sr. Full-Stack)', description: 'React/Node.js, Testing, Architecture', icon: '👩‍💻' },
    { id: 'gemma', name: 'Gemma (QA Lead)', description: 'Testing automation, Quality assurance', icon: '🕵️‍♀️' },
    { id: 'jax', name: 'Jax (Product Manager)', description: 'Roadmapping, User stories, Planning', icon: '📋' },
    { id: 'clay', name: 'Clay (Project Coord)', description: 'Sprint planning, Task tracking', icon: '⏱️' },
    { id: 'chibs', name: 'Chibs (DevOps)', description: 'CI/CD, Infrastructure, Kubernetes', icon: '🏗️' },
    { id: 'happy', name: 'Happy (QA Auto)', description: 'Test scripts, Regression testing', icon: '🤖' },
    { id: 'lyla', name: 'Lyla (UX Research)', description: 'User interviews, Usability testing', icon: '🧠' },
    { id: 'finley', name: 'Finley (Finance)', description: 'Financial modeling, Analysis', icon: '📈' }
];

/**
 * Usage & Add-on Pricing
 */
const USAGE_PRICING = {
    hybridFee: 500, // Monthly fee for hybrid deployment
    dedicatedVPC: 2000,
    storageOveragePer100GB: 50
};

/**
 * COGS structure
 */
const COGS_STRUCTURE = {
    compute: {
        perAgent: 25, // Reserved instance cost
        perToken1k: 0.005 // Blended inference cost
    },
    support: {
        starter: 10,
        professional: 30,
        enterprise: 100
    }
};

// ========================================
// CALCULATOR LOGIC
// ========================================

function determineTier(agentCount) {
    if (agentCount >= 20) return TIER_PRICING.enterprise_agent;
    if (agentCount >= 5) return TIER_PRICING.professional_agent;
    return TIER_PRICING.starter_agent;
}

function calculateTotalMonthlyCost(config) {
    const {
        agents, // Total count OR map of roles
        billingPeriod = 'monthly', // monthly vs annual
        deploymentType = 'managed_saas', // managed_saas, hybrid, self_hosted
        addons = {}
    } = config;

    let totalAgents = 0;
    if (typeof agents === 'number') {
        totalAgents = agents;
    } else {
        totalAgents = Object.values(agents).reduce((a, b) => a + b, 0);
    }

    // Determine Base Price per Agent (Default to Professional for business calc, or logic?)
    // Spec says: $149/mo is the standard business unit. 
    // Let's use Professional ($149) as the base for volume logic unless specified.
    // However, if totalAgents <= 2, might be Starter ($49).
    // Spec Logic: "Volume discounts applied automatically based on total agents" using $149 base usually.
    // Let's stick to the Volume Discount Table from Spec 5.3.

    let baseRate = 149; // Professional default
    if (totalAgents <= 2) {
        // This is ambiguous in spec. 
        // "Tier 1: 1-2 agents, 0% discount, $149/mo" 
        // BUT Starter is $49. 
        // Let's assume if user explicitly selects "Starter" mode (Personal Use) use 49.
        // But for "Team Assembly" it implies Professional Context.
        // We will default to 149 base.
    }

    let discount = 0;
    if (totalAgents >= 50) discount = 0.50; // Custom
    else if (totalAgents >= 20) discount = 0.40;
    else if (totalAgents >= 10) discount = 0.33;
    else if (totalAgents >= 5) discount = 0.25;
    else if (totalAgents >= 3) discount = 0.15;

    let subTotal = totalAgents * baseRate;
    let discountAmount = subTotal * discount;
    let finalSubscription = subTotal - discountAmount;

    // Check for Bundle Overrides (Exact Matches)
    if (totalAgents === 3) finalSubscription = 349;
    if (totalAgents === 5) finalSubscription = 549;
    if (totalAgents === 15) finalSubscription = 1499;
    if (totalAgents === 30) finalSubscription = 2499;

    // Deployment Fees
    let deploymentCost = 0;
    if (deploymentType === 'hybrid') deploymentCost = USAGE_PRICING.hybridFee;

    // Add-ons
    let addonCost = 0;
    if (addons.dedicatedVPC) addonCost += USAGE_PRICING.dedicatedVPC;

    // Billing Period Adjustment (Commitment Discount)
    // Spec mentions "Annual contract: Discount for annual commitment" in Enterprise.
    // Generally SaaS uses 20%.
    if (billingPeriod === 'annual') {
        finalSubscription = finalSubscription * 0.8;
    }

    return {
        totalAgents,
        baseRate,
        discountPercent: (discount * 100).toFixed(0),
        subscription: finalSubscription,
        deployment: deploymentCost,
        addons: addonCost,
        totalMonthly: finalSubscription + deploymentCost + addonCost
    };
}

function calculateGrossMargin(revenue, totalAgents) {
    // COGS estimation
    // 1 agent = ~2M tokens/mo (Pro)
    const tokens = totalAgents * 2000; // in thousands (2M)
    const inferenceCost = tokens * COGS_STRUCTURE.compute.perToken1k;
    const computeCost = totalAgents * COGS_STRUCTURE.compute.perAgent;
    const supportCost = totalAgents * COGS_STRUCTURE.support.professional;

    const totalCOGS = inferenceCost + computeCost + supportCost;
    const margin = revenue - totalCOGS;
    const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0;

    return {
        revenue,
        cogs: { total: totalCOGS },
        grossMarginPercent: marginPercent,
        meetsTarget: marginPercent >= 70
    };
}

export {
    TIER_PRICING,
    BUNDLE_PRICING,
    AGENT_ROLES,
    USAGE_PRICING,
    calculateTotalMonthlyCost,
    calculateGrossMargin,
    determineTier
};
