/**
 * Orca Intelligence Pricing Engine
 * Based on Technical Spec v2.0
 */

const TIERS = {
    small_business: {
        id: 'small_business',
        name: 'Small Business',
        maxEmployees: 99,
        orcaBase: 999,
        echoBase: 499,
        bundlePrice: 1499,
        includedTokens: 5000000, // 5M
        features: ['Standard Support', '5 Users', 'Basic Connectors']
    },
    mid_market: {
        id: 'mid_market',
        name: 'Mid-Market',
        maxEmployees: 999,
        orcaBase: 2999,
        echoBase: 1999,
        bundlePrice: 4999,
        includedTokens: 25000000, // 25M
        features: ['Priority Support', '20 Users', 'Adv. Connectors', 'Voice Interface']
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        maxEmployees: 100000, // Unlimited
        orcaBase: 9999,
        echoBase: 4999,
        bundlePrice: 14998,
        includedTokens: 100000000, // 100M
        features: ['24/7 Support', 'Unlimited Users', 'All Connectors', 'SSO/Audit Logs']
    },
    quantum: {
        id: 'quantum',
        name: 'Quantum Enterprise',
        maxEmployees: 100000,
        orcaBase: 24999,
        echoBase: 0, // Included
        bundlePrice: 24999,
        includedTokens: 100000000,
        features: ['Quantum Credits ($25k/mo)', 'Sublinear Optimization', 'Dedicated Architect']
    }
};

const USAGE_RATES = {
    tokenPricePer1k: 0.02,
    setupFee: {
        enterprise: 150000,
        quantum: 250000,
        standard: 5000 // Assumed onboarding for smaller tiers? Spec mostly mentions Ent.
    }
};

const COMPETITORS = {
    palantir: { id: 'palantir', name: "Palantir Foundry", setup: 750000, annual: 1000000 },
    c3: { id: 'c3', name: "C3 AI Suite", setup: 500000, annual: 850000 },
    custom: { id: 'custom', name: "Custom (Snowflake/Databricks)", setup: 300000, annual: 600000 },
    consulting: { id: 'consulting', name: "Big 4 Consulting Team", setup: 50000, annual: 2500000 }
};

/**
 * Determine Tier based on Employee Count
 */
function determineTier(employees, wantQuantum = false) {
    if (wantQuantum) return TIERS.quantum;
    if (employees >= 1000) return TIERS.enterprise;
    if (employees >= 100) return TIERS.mid_market;
    return TIERS.small_business;
}

/**
 * Calculate Monthly Cost
 */
function calculateCost(config) {
    const {
        employees,
        isBYOD = false, // If true, don't charge Echo base (but only valid for Ent)
        wantQuantum = false,
        monthlyTokens = 0
    } = config;

    const tier = determineTier(employees, wantQuantum);

    // Base Subscription
    let basePrice = tier.bundlePrice;
    if (isBYOD && (tier.id === 'enterprise' || tier.id === 'quantum')) {
        // BYOD removes Echo cost (approx) or uses Orca Only pricing
        // Spec 4.3 Path 2: Enterprise BYOD Base = $9,999 (Orca only)
        basePrice = tier.orcaBase;
    }

    // Usage (Tokens)
    const billableTokens = Math.max(0, monthlyTokens - tier.includedTokens);
    const tokenCost = (billableTokens / 1000) * USAGE_RATES.tokenPricePer1k;

    return {
        tier,
        baseMonthly: basePrice,
        tokenCost,
        totalMonthly: basePrice + tokenCost,
        setupFee: (tier.id === 'enterprise' || tier.id === 'quantum') ? USAGE_RATES.setupFee[tier.id] : USAGE_RATES.setupFee.standard
    };
}

/**
 * Calculate ROI vs Human Baseline
 */
function calculateROI(humanData, orcaCostData, competitorId = 'palantir') {
    const { analysts, avgSalary, dealsPerYear, hoursPerDeal } = humanData;

    // Human Baseline
    const hourlyRate = avgSalary / 2000; // approx working hours
    const humanCostPerDeal = hoursPerDeal * hourlyRate;
    const totalHumanAnnualCost = analysts * avgSalary;

    // Comparison: Competitor
    const comp = COMPETITORS[competitorId] || COMPETITORS.palantir;

    // Orca Performance
    // Spec: 600x faster, but let's use the conservative "10x throughput" from DiligenceGPT case study
    const orcaThroughputMultiplier = 10;
    const potentialDealsWithOrca = dealsPerYear * orcaThroughputMultiplier;

    const orcaAnnualCost = (orcaCostData.totalMonthly * 12) + orcaCostData.setupFee;

    // ROI
    const netSavings = totalHumanAnnualCost - orcaAnnualCost;

    // Cost per deal
    const costPerDealHuman = totalHumanAnnualCost / dealsPerYear;
    const costPerDealOrca = orcaAnnualCost / potentialDealsWithOrca;

    return {
        human: {
            annualCost: totalHumanAnnualCost,
            throughput: dealsPerYear,
            costPerDeal: costPerDealHuman,
            timePerDeal: hoursPerDeal + " hrs"
        },
        orca: {
            annualCost: orcaAnnualCost,
            throughput: potentialDealsWithOrca,
            costPerDeal: costPerDealOrca,
            timePerDeal: (hoursPerDeal / 600 * 60).toFixed(1) + " mins", // 600x speedup
            savingsVsHuman: netSavings > 0 ? netSavings : 0,
            roiPercent: ((netSavings / orcaAnnualCost) * 100).toFixed(0)
        },
        competitor: {
            name: comp.name,
            setup: comp.setup,
            annual: comp.annual
        }
    };
}

module.exports = {
    TIERS,
    USAGE_RATES,
    COMPETITORS,
    determineTier,
    calculateCost,
    calculateROI
};
