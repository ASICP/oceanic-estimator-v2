/**
 * ========================================
 * ECHO RAG CALCULATOR v2.0
 * Pricing Calculation Engine
 * ========================================
 *
 * Core pricing logic for Echo RAG Calculator
 * Adapted from Porpoise Calculator blueprint
 *
 * @version 2.0
 * @date November 30, 2025
 * @description Complete pricing, COGS, ROI, and migration calculations
 */

// ========================================
// PRICING CONSTANTS
// ========================================

/**
 * Tier pricing structure for Managed SaaS
 */
const TIER_PRICING = {
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
      monthlyQueries: -1, // unlimited
      voiceInterface: true,
      visualSearch: true,
      advancedAnalytics: false,
      dedicatedCSM: false,
      customConnectors: 0,
      ssoSAML: false
    },
    support: 'email_24hr',
    sla: 99.0
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
      voiceInterface: true,
      visualSearch: true,
      advancedAnalytics: false,
      dedicatedCSM: false,
      customConnectors: 0,
      ssoSAML: true
    },
    support: 'priority_4hr',
    sla: 99.5
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
      usersMax: -1, // unlimited
      connectors: -1, // unlimited
      storageGB: -1, // unlimited
      monthlyQueries: -1,
      voiceInterface: true,
      visualSearch: true,
      advancedAnalytics: true,
      dedicatedCSM: true,
      customConnectors: 3, // per year
      ssoSAML: true
    },
    support: 'white_glove_1hr',
    sla: 99.9
  },

  // Self-Hosted Tiers
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
      voiceInterface: false,
      visualSearch: false,
      advancedAnalytics: false,
      dedicatedCSM: false,
      customConnectors: 0,
      ssoSAML: false
    },
    support: 'community_forums',
    sla: null
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
      voiceInterface: true,
      visualSearch: true,
      advancedAnalytics: false,
      dedicatedCSM: false,
      customConnectors: 0,
      ssoSAML: true
    },
    support: 'priority_8hr',
    sla: null
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
      voiceInterface: true,
      visualSearch: true,
      advancedAnalytics: true,
      dedicatedCSM: true,
      customConnectors: -1,
      ssoSAML: true
    },
    support: '24_7_csm',
    sla: null
  }
};

/**
 * Usage-based pricing
 */
const USAGE_PRICING = {
  // Overages
  connectorOverage: 500.00,        // per connector per month
  storageOveragePer100GB: 100.00,  // per 100GB per month

  // Add-ons
  advancedAnalytics: 2000.00,      // per month (Starter/Professional)
  dedicatedCSM: 5000.00,           // per month (Starter/Professional)
  voicePremium: 1000.00,           // per month (if >25% voice usage)
  visualPremium: 1500.00,          // per month (if >25% visual usage)

  // One-time
  customConnectorDevelopment: 15000.00  // one-time per connector
};

/**
 * COGS structure for margin calculations
 */
const COGS_STRUCTURE = {
  // Infrastructure compute (scales with users)
  infrastructure: {
    vectorDBNodePerMonth: 500.00,        // Vespa vector DB
    searchNodePerMonth: 400.00,          // Search infrastructure
    apiServerNodePerMonth: 300.00,       // API servers
    loadBalancerPerMonth: 150.00,        // Load balancers

    // Infrastructure scales: 1 vector DB node per 100 users
    nodesPerUsers: 100,

    // Storage
    primaryStoragePerGB: 0.10,           // per GB per month
    backupStoragePerGB: 0.05,            // per GB per month
    vectorEmbeddingsPerGB: 0.12          // per GB per month (10GB per user avg)
  },

  // AI/ML services
  aiml: {
    embeddingPerQuery: 0.0001,           // OpenAI embedding API
    voiceProcessingPerMinute: 0.002,     // Voice processing
    imageProcessingPerImage: 0.001       // Image/video analysis
  },

  // Data transfer
  dataTransfer: {
    ingressPerGB: 0.01,                  // Data from connectors
    egressPerGB: 0.02,                   // API responses
    avgDailyIngressGB: 25,               // Average per customer
    avgDailyEgressGB: 50                 // Average per customer
  },

  // Support (amortized per customer)
  support: {
    starter_saas: 150.00,                // per month
    professional_saas: 250.00,           // per month
    enterprise_saas: 500.00,             // per month
    community_self: 0,
    enterprise_self: 100.00,
    enterprise_plus_self: 200.00
  },

  // Monitoring & operations
  monitoring: {
    perCustomerPerMonth: 150.00          // Fixed cost
  }
};

/**
 * Competitor pricing data
 */
const COMPETITOR_DATA = {
  glean: {
    name: 'Glean Enterprise',
    annualCost: 290000,
    connectors: 70,
    voiceInterface: false,
    visualSearch: false,
    setupFee: 50000,
    strengths: ['Strong enterprise adoption', 'Good search UX', '70 connectors', 'AI insights'],
    weaknesses: ['151% more expensive', 'No voice', 'No visual', 'Only 70 connectors']
  },
  danswer: {
    name: 'Danswer Self-Hosted',
    annualCost: 100000, // $20K software + $80K DevOps
    connectors: 50,
    voiceInterface: false,
    visualSearch: false,
    setupFee: 0,
    devOpsCostAnnual: 80000,
    strengths: ['Open source', 'Self-hosted', '50 connectors', 'No SaaS lock-in'],
    weaknesses: ['Requires $80K/year DevOps', 'No voice', 'No visual', 'Self-hosted only']
  },
  perplexity: {
    name: 'Perplexity Enterprise',
    annualCost: 120000,
    connectors: 0,
    voiceInterface: false,
    visualSearch: true,
    setupFee: 0,
    strengths: ['Excellent web search', 'Clean UX', 'Fast responses', 'Visual web search'],
    weaknesses: ['No internal connectors', 'Web-only', 'Cannot search Slack/Drive/Jira']
  },
  hebbia: {
    name: 'Hebbia Enterprise',
    annualCost: 250000,
    connectors: 100,
    voiceInterface: false,
    visualSearch: true,
    setupFee: 100000,
    strengths: ['Advanced multi-modal', '100+ connectors', 'Research/due diligence', 'Visual docs'],
    weaknesses: ['117% more expensive', '$100K setup fee', 'Long sales cycle', 'Overkill']
  }
};

/**
 * ROI assumptions
 */
const ROI_ASSUMPTIONS = {
  // Time savings
  avgSearchTimeReductionPercent: 65,
  hoursSavedPerUserPerMonth: 15,
  avgSalaryPerHour: 50,

  // Onboarding
  traditionalOnboardingWeeks: 4,
  echoOnboardingDays: 3,
  hoursPerWeek: 40,
  avgNewHireGrowthPercent: 20,

  // Knowledge retention
  tribalKnowledgeCaptureIncrease: 60, // % more vs SharePoint
  reworkReductionPercent: 20,
  avgValuePerUserPerYear: 1400
};

// ========================================
// CORE PRICING FUNCTIONS
// ========================================

/**
 * Determine recommended tier based on inputs
 */
function determineTier(config) {
  const { users, connectors, storageGB, useCases, industry, deploymentType } = config;

  // Self-hosted path
  if (deploymentType === 'self_hosted') {
    if (users <= 20) return 'community_self';
    if (users <= 200) return 'enterprise_self';
    return 'enterprise_plus_self';
  }

  // Managed SaaS path
  // Enterprise triggers
  if (users >= 500 ||
      connectors > 20 ||
      storageGB > 1024 ||
      ['financial', 'healthcare', 'legal'].includes(industry) ||
      (useCases && useCases.length >= 5)) {
    return 'enterprise_saas';
  }

  // Professional triggers
  if (users >= 50 || connectors > 5 || storageGB > 100) {
    return 'professional_saas';
  }

  // Default: Starter
  return 'starter_saas';
}

/**
 * Get base pricing for a tier
 */
function getBasePricing(tierId) {
  return TIER_PRICING[tierId] || TIER_PRICING.professional_saas;
}

/**
 * Calculate monthly subscription cost
 */
function calculateMonthlySubscription(tierId, billingPeriod) {
  const tier = getBasePricing(tierId);

  if (tier.monthly === null || tier.monthly === 0) {
    return 0; // Community or custom pricing
  }

  if (billingPeriod === 'annual') {
    // Annual billing: apply discount
    const annualTotal = tier.annual || (tier.monthly * 12 * (1 - tier.annualDiscountPercent / 100));
    return annualTotal / 12;
  }

  return tier.monthly;
}

/**
 * Calculate connector overages
 */
function calculateConnectorOverage(tierId, actualConnectors) {
  const tier = getBasePricing(tierId);

  // Unlimited connectors
  if (tier.included.connectors === -1) return 0;

  // No overage
  if (actualConnectors <= tier.included.connectors) return 0;

  const extraConnectors = actualConnectors - tier.included.connectors;
  return extraConnectors * USAGE_PRICING.connectorOverage;
}

/**
 * Calculate storage overages
 */
function calculateStorageOverage(tierId, actualStorageGB) {
  const tier = getBasePricing(tierId);

  // Unlimited storage
  if (tier.included.storageGB === -1) return 0;

  // No overage
  if (actualStorageGB <= tier.included.storageGB) return 0;

  const extraGB = actualStorageGB - tier.included.storageGB;
  const blocks = Math.ceil(extraGB / 100);
  return blocks * USAGE_PRICING.storageOveragePer100GB;
}

/**
 * Calculate add-on costs
 */
function calculateAddons(tierId, addons, voicePercentage, visualPercentage) {
  const tier = getBasePricing(tierId);
  let total = 0;
  const breakdown = {};

  // Advanced Analytics (if not included)
  if (addons.advancedAnalytics && !tier.included.advancedAnalytics) {
    breakdown.advancedAnalytics = USAGE_PRICING.advancedAnalytics;
    total += USAGE_PRICING.advancedAnalytics;
  }

  // Dedicated CSM (if not included)
  if (addons.dedicatedCSM && !tier.included.dedicatedCSM) {
    breakdown.dedicatedCSM = USAGE_PRICING.dedicatedCSM;
    total += USAGE_PRICING.dedicatedCSM;
  }

  // Voice Premium (if >25% voice usage)
  if (voicePercentage > 25) {
    breakdown.voicePremium = USAGE_PRICING.voicePremium;
    total += USAGE_PRICING.voicePremium;
  }

  // Visual Premium (if >25% visual usage)
  if (visualPercentage > 25) {
    breakdown.visualPremium = USAGE_PRICING.visualPremium;
    total += USAGE_PRICING.visualPremium;
  }

  return { total, breakdown };
}

/**
 * Calculate one-time costs
 */
function calculateOneTimeCosts(customConnectorsCount) {
  return customConnectorsCount * USAGE_PRICING.customConnectorDevelopment;
}

/**
 * Calculate total monthly cost
 */
function calculateTotalMonthlyCost(config) {
  const {
    tierId,
    billingPeriod = 'monthly',
    users,
    connectors,
    storageGB,
    addons = {},
    voicePercentage = 0,
    visualPercentage = 0,
    customConnectorsCount = 0
  } = config;

  const subscription = calculateMonthlySubscription(tierId, billingPeriod);
  const connectorOverage = calculateConnectorOverage(tierId, connectors);
  const storageOverage = calculateStorageOverage(tierId, storageGB);
  const addonsResult = calculateAddons(tierId, addons, voicePercentage, visualPercentage);
  const oneTime = calculateOneTimeCosts(customConnectorsCount);

  const totalMonthly = subscription + connectorOverage + storageOverage + addonsResult.total;

  return {
    subscription,
    connectorOverage,
    storageOverage,
    addons: addonsResult.total,
    addonsBreakdown: addonsResult.breakdown,
    totalMonthly,
    oneTimeCosts: oneTime,
    billingPeriod
  };
}

// ========================================
// COGS CALCULATION FUNCTIONS
// ========================================

/**
 * Calculate infrastructure COGS
 */
function calculateInfrastructureCOGS(users, storageGB) {
  const { infrastructure } = COGS_STRUCTURE;

  // Compute nodes scale with users
  const nodesNeeded = Math.ceil(users / infrastructure.nodesPerUsers);

  const vectorDB = nodesNeeded * infrastructure.vectorDBNodePerMonth;
  const searchNodes = Math.max(2, Math.ceil(nodesNeeded / 2)) * infrastructure.searchNodePerMonth;
  const apiServers = Math.max(3, Math.ceil(nodesNeeded / 1.5)) * infrastructure.apiServerNodePerMonth;
  const loadBalancers = 2 * infrastructure.loadBalancerPerMonth;

  const compute = vectorDB + searchNodes + apiServers + loadBalancers;

  // Storage costs
  const primaryStorage = storageGB * infrastructure.primaryStoragePerGB;
  const backupStorage = storageGB * infrastructure.backupStoragePerGB;
  const vectorEmbeddings = users * 10 * infrastructure.vectorEmbeddingsPerGB; // 10GB per user

  const storage = primaryStorage + backupStorage + vectorEmbeddings;

  return {
    compute,
    computeBreakdown: { vectorDB, searchNodes, apiServers, loadBalancers },
    storage,
    storageBreakdown: { primaryStorage, backupStorage, vectorEmbeddings },
    total: compute + storage
  };
}

/**
 * Calculate AI/ML COGS
 */
function calculateAIMLCOGS(monthlyQueries, voicePercentage, visualPercentage) {
  const { aiml } = COGS_STRUCTURE;

  // Embedding costs (all queries)
  const embedding = monthlyQueries * aiml.embeddingPerQuery;

  // Voice processing (assume 2 min per voice query)
  const voiceQueries = monthlyQueries * (voicePercentage / 100);
  const voiceMinutes = voiceQueries * 2;
  const voice = voiceMinutes * aiml.voiceProcessingPerMinute;

  // Visual processing
  const visualQueries = monthlyQueries * (visualPercentage / 100);
  const visual = visualQueries * aiml.imageProcessingPerImage;

  return {
    embedding,
    voice,
    visual,
    total: embedding + voice + visual
  };
}

/**
 * Calculate data transfer COGS
 */
function calculateDataTransferCOGS() {
  const { dataTransfer } = COGS_STRUCTURE;

  // Monthly data transfer (30 days)
  const ingress = dataTransfer.avgDailyIngressGB * 30 * dataTransfer.ingressPerGB;
  const egress = dataTransfer.avgDailyEgressGB * 30 * dataTransfer.egressPerGB;

  return {
    ingress,
    egress,
    total: ingress + egress
  };
}

/**
 * Calculate total COGS
 */
function calculateTotalCOGS(config) {
  const {
    tierId,
    users,
    storageGB,
    monthlyQueries = users * 0.6 * 20 * 30, // Default: 60% users * 20 queries/day * 30 days
    voicePercentage = 0,
    visualPercentage = 0
  } = config;

  const infrastructure = calculateInfrastructureCOGS(users, storageGB);
  const aiml = calculateAIMLCOGS(monthlyQueries, voicePercentage, visualPercentage);
  const dataTransfer = calculateDataTransferCOGS();
  const support = COGS_STRUCTURE.support[tierId] || 0;
  const monitoring = COGS_STRUCTURE.monitoring.perCustomerPerMonth;

  const total = infrastructure.total + aiml.total + dataTransfer.total + support + monitoring;

  return {
    infrastructure: infrastructure.total,
    infrastructureBreakdown: infrastructure,
    aiml: aiml.total,
    aimlBreakdown: aiml,
    dataTransfer: dataTransfer.total,
    dataTransferBreakdown: dataTransfer,
    support,
    monitoring,
    total
  };
}

/**
 * Calculate gross margin
 */
function calculateGrossMargin(revenue, cogs) {
  const grossProfit = revenue - cogs;
  const grossMarginPercent = (grossProfit / revenue) * 100;

  // Echo target: 82%
  const targetMargin = 82;
  const meetsTarget = grossMarginPercent >= targetMargin;

  let status = 'on_target';
  if (grossMarginPercent < targetMargin) status = 'below_target';
  if (grossMarginPercent > 85) status = 'above_target';

  return {
    revenue,
    cogs,
    grossProfit,
    grossMarginPercent,
    targetMargin,
    meetsTarget,
    status,
    variance: grossMarginPercent - targetMargin
  };
}

// ========================================
// ROI CALCULATION
// ========================================

/**
 * Calculate ROI metrics
 */
function calculateROI(config, annualCost) {
  const { users } = config;
  const assumptions = ROI_ASSUMPTIONS;

  // Time savings
  const monthlyProductivityValue = users * assumptions.hoursSavedPerUserPerMonth * assumptions.avgSalaryPerHour;
  const annualProductivityValue = monthlyProductivityValue * 12;

  // Onboarding savings
  const traditionalHours = assumptions.traditionalOnboardingWeeks * assumptions.hoursPerWeek;
  const echoHours = (assumptions.echoOnboardingDays / 5) * assumptions.hoursPerWeek;
  const hoursSaved = traditionalHours - echoHours;
  const savingsPerHire = hoursSaved * assumptions.avgSalaryPerHour;
  const newHiresPerYear = Math.ceil(users * (assumptions.avgNewHireGrowthPercent / 100));
  const annualOnboardingSavings = savingsPerHire * newHiresPerYear;

  // Knowledge retention
  const annualEfficiencyGain = users * assumptions.avgValuePerUserPerYear;

  const totalAnnualValue = annualProductivityValue + annualOnboardingSavings + annualEfficiencyGain;
  const netValue = totalAnnualValue - annualCost;
  const roi = (netValue / annualCost) * 100;
  const paybackMonths = (annualCost / totalAnnualValue) * 12;

  return {
    productivityValue: annualProductivityValue,
    onboardingSavings: annualOnboardingSavings,
    efficiencyGain: annualEfficiencyGain,
    totalValue: totalAnnualValue,
    investment: annualCost,
    netValue,
    roi,
    paybackMonths,
    breakdown: {
      hoursSavedPerUserPerMonth: assumptions.hoursSavedPerUserPerMonth,
      newHiresPerYear,
      savingsPerHire
    }
  };
}

// ========================================
// MIGRATION CALCULATOR
// ========================================

/**
 * Calculate migration costs from competitor
 */
function calculateMigration(competitorKey, currentAnnualCost, echoAnnualCost) {
  const competitor = COMPETITOR_DATA[competitorKey];

  // 6-phase migration costs (from spec)
  const migrationPhases = {
    planning: { hours: 40, rate: 175 },
    dataExport: { hours: 90, rate: 150 },
    echoSetup: { hours: 60, rate: 150 },
    testing: { hours: 70, rate: 150 },
    training: { hours: 40, rate: 150 },
    cutover: { hours: 56, rate: 175 }
  };

  let totalCost = 0;
  const breakdown = {};

  Object.entries(migrationPhases).forEach(([phase, data]) => {
    const cost = data.hours * data.rate;
    breakdown[phase] = cost;
    totalCost += cost;
  });

  const annualSavings = currentAnnualCost - echoAnnualCost;
  const paybackMonths = (totalCost / annualSavings) * 12;
  const year1NetSavings = annualSavings - totalCost;
  const threeYearSavings = (annualSavings * 3) - totalCost;

  return {
    competitor: competitor ? competitor.name : competitorKey,
    migrationCost: totalCost,
    migrationWeeks: 7,
    breakdown,
    currentAnnualCost,
    echoAnnualCost,
    annualSavings,
    paybackMonths,
    year1NetSavings,
    year2NetSavings: annualSavings,
    year3NetSavings: annualSavings,
    threeYearSavings
  };
}

// ========================================
// 5-YEAR PROJECTION
// ========================================

/**
 * Project 5-year growth
 */
function project5Year(config, growthRate = 40) {
  const years = [];
  let currentUsers = config.users;
  let currentConnectors = config.connectors;
  let currentStorage = config.storageGB;

  for (let year = 1; year <= 5; year++) {
    // Apply growth (after year 1)
    if (year > 1) {
      currentUsers = Math.ceil(currentUsers * (1 + growthRate / 100));
      currentConnectors = Math.min(currentConnectors + 2, 50); // +2/year, cap at 50
      currentStorage = Math.ceil(currentStorage * 1.25); // 25% storage growth
    }

    // Recalculate for this year
    const yearConfig = {
      ...config,
      users: currentUsers,
      connectors: currentConnectors,
      storageGB: currentStorage
    };

    // Determine if tier upgrade needed
    yearConfig.tierId = determineTier(yearConfig);

    const pricing = calculateTotalMonthlyCost(yearConfig);
    const cogs = calculateTotalCOGS(yearConfig);

    // Annual calculations
    const annualRevenue = pricing.billingPeriod === 'annual'
      ? pricing.totalMonthly * 12
      : pricing.totalMonthly * 12 * 0.8; // 20% discount

    const annualCOGS = cogs.total * 12;
    const margin = calculateGrossMargin(annualRevenue, annualCOGS);
    const roi = calculateROI(yearConfig, annualRevenue);

    years.push({
      year,
      users: currentUsers,
      connectors: currentConnectors,
      storageGB: currentStorage,
      tier: yearConfig.tierId,
      monthlyRevenue: pricing.totalMonthly,
      annualRevenue,
      annualCOGS,
      grossMargin: margin.grossMarginPercent,
      value: roi.totalValue
    });
  }

  const totalInvestment = years.reduce((sum, y) => sum + y.annualRevenue, 0);
  const totalValue = years.reduce((sum, y) => sum + y.value, 0);
  const netValue = totalValue - totalInvestment;
  const roi = (netValue / totalInvestment) * 100;

  return {
    years,
    totals: {
      investment: totalInvestment,
      value: totalValue,
      netValue,
      roi
    }
  };
}

// ========================================
// FULL PRICING ANALYSIS
// ========================================

/**
 * Perform complete pricing analysis
 */
function performFullPricingAnalysis(config) {
  // Revenue calculations
  const pricing = calculateTotalMonthlyCost(config);

  const monthlyRevenue = pricing.totalMonthly;
  const annualRevenue = pricing.billingPeriod === 'annual'
    ? pricing.totalMonthly * 12 + pricing.oneTimeCosts
    : pricing.totalMonthly * 12 * 0.8 + pricing.oneTimeCosts; // 20% annual discount

  // COGS calculations
  const monthlyCOGS = calculateTotalCOGS(config);
  const annualCOGS = monthlyCOGS.total * 12;

  // Margin analysis
  const monthlyMargin = calculateGrossMargin(monthlyRevenue, monthlyCOGS.total);
  const annualMargin = calculateGrossMargin(annualRevenue, annualCOGS);

  // ROI analysis
  const roi = calculateROI(config, annualRevenue);

  // Tier info
  const tier = getBasePricing(config.tierId);

  return {
    tier: {
      id: tier.id,
      name: tier.name,
      deploymentType: tier.deploymentType
    },
    pricing: {
      monthly: {
        subscription: pricing.subscription,
        connectorOverage: pricing.connectorOverage,
        storageOverage: pricing.storageOverage,
        addons: pricing.addons,
        total: pricing.totalMonthly
      },
      annual: {
        subscription: pricing.subscription * 12 * (pricing.billingPeriod === 'annual' ? 0.8 : 1),
        overages: (pricing.connectorOverage + pricing.storageOverage) * 12,
        addons: pricing.addons * 12,
        oneTime: pricing.oneTimeCosts,
        total: annualRevenue
      }
    },
    cogs: {
      monthly: {
        infrastructure: monthlyCOGS.infrastructure,
        aiml: monthlyCOGS.aiml,
        dataTransfer: monthlyCOGS.dataTransfer,
        support: monthlyCOGS.support,
        monitoring: monthlyCOGS.monitoring,
        total: monthlyCOGS.total
      },
      annual: annualCOGS
    },
    margin: {
      monthly: monthlyMargin,
      annual: annualMargin
    },
    roi
  };
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
  // Constants
  TIER_PRICING,
  USAGE_PRICING,
  COGS_STRUCTURE,
  COMPETITOR_DATA,
  ROI_ASSUMPTIONS,

  // Core functions
  determineTier,
  getBasePricing,
  calculateMonthlySubscription,
  calculateConnectorOverage,
  calculateStorageOverage,
  calculateAddons,
  calculateOneTimeCosts,
  calculateTotalMonthlyCost,

  // COGS functions
  calculateInfrastructureCOGS,
  calculateAIMLCOGS,
  calculateDataTransferCOGS,
  calculateTotalCOGS,
  calculateGrossMargin,

  // Analysis functions
  calculateROI,
  calculateMigration,
  project5Year,
  performFullPricingAnalysis
};
