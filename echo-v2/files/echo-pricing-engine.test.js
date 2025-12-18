/**
 * ========================================
 * ECHO RAG CALCULATOR v2.0
 * Pricing Engine - Test & Examples
 * ========================================
 *
 * Comprehensive examples and unit tests for the pricing engine
 *
 * @version 2.0
 * @date November 30, 2025
 */

const {
  determineTier,
  calculateTotalMonthlyCost,
  calculateTotalCOGS,
  calculateGrossMargin,
  calculateROI,
  calculateMigration,
  project5Year,
  performFullPricingAnalysis
} = require('./echo-pricing-engine');

// ========================================
// EXAMPLE SCENARIOS
// ========================================

console.log('========================================');
console.log('ECHO RAG CALCULATOR - PRICING EXAMPLES');
console.log('========================================\n');

// ========================================
// SCENARIO 1: Startup (Starter Tier)
// ========================================
console.log('SCENARIO 1: Tech Startup');
console.log('─────────────────────────────────────────');

const startupConfig = {
  tierId: 'starter_saas',
  billingPeriod: 'annual',
  users: 25,
  connectors: 5,
  storageGB: 80,
  voicePercentage: 10,
  visualPercentage: 5,
  addons: {
    advancedAnalytics: false,
    dedicatedCSM: false
  },
  customConnectorsCount: 0,
  // Context
  companySize: 'startup',
  industry: 'technology',
  useCases: ['internal_knowledge', 'developer_docs']
};

const startupAnalysis = performFullPricingAnalysis(startupConfig);

console.log(`Tier: ${startupAnalysis.tier.name} (${startupAnalysis.tier.deploymentType})`);
console.log(`\nPricing (Monthly):`);
console.log(`  Subscription: $${startupAnalysis.pricing.monthly.subscription.toLocaleString()}`);
console.log(`  Connector Overage: $${startupAnalysis.pricing.monthly.connectorOverage.toLocaleString()}`);
console.log(`  Storage Overage: $${startupAnalysis.pricing.monthly.storageOverage.toLocaleString()}`);
console.log(`  Add-ons: $${startupAnalysis.pricing.monthly.addons.toLocaleString()}`);
console.log(`  ─────────────`);
console.log(`  Total Monthly: $${startupAnalysis.pricing.monthly.total.toLocaleString()}`);

console.log(`\nPricing (Annual):`);
console.log(`  Total Annual: $${startupAnalysis.pricing.annual.total.toLocaleString()}`);
console.log(`  (20% discount applied)`);

console.log(`\nCOGS (Monthly): $${startupAnalysis.cogs.monthly.total.toLocaleString()}`);
console.log(`  Infrastructure: $${startupAnalysis.cogs.monthly.infrastructure.toLocaleString()}`);
console.log(`  AI/ML: $${startupAnalysis.cogs.monthly.aiml.toLocaleString()}`);
console.log(`  Data Transfer: $${startupAnalysis.cogs.monthly.dataTransfer.toLocaleString()}`);
console.log(`  Support: $${startupAnalysis.cogs.monthly.support.toLocaleString()}`);
console.log(`  Monitoring: $${startupAnalysis.cogs.monthly.monitoring.toLocaleString()}`);

console.log(`\nGross Margin:`);
console.log(`  Margin: ${startupAnalysis.margin.monthly.grossMarginPercent.toFixed(2)}%`);
console.log(`  Target: ${startupAnalysis.margin.monthly.targetMargin}%`);
console.log(`  Status: ${startupAnalysis.margin.monthly.status}`);
console.log(`  Meets Target: ${startupAnalysis.margin.monthly.meetsTarget ? 'Yes ✓' : 'No ✗'}`);

console.log(`\nROI Analysis (Year 1):`);
console.log(`  Investment: $${startupAnalysis.roi.investment.toLocaleString()}`);
console.log(`  Value Created: $${startupAnalysis.roi.totalValue.toLocaleString()}`);
console.log(`  Net Value: $${startupAnalysis.roi.netValue.toLocaleString()}`);
console.log(`  ROI: ${startupAnalysis.roi.roi.toFixed(0)}%`);
console.log(`  Payback: ${startupAnalysis.roi.paybackMonths.toFixed(1)} months`);

console.log('\n');

// ========================================
// SCENARIO 2: Mid-Market (Professional Tier)
// ========================================
console.log('SCENARIO 2: Mid-Market Company');
console.log('─────────────────────────────────────────');

const midMarketConfig = {
  tierId: 'professional_saas',
  billingPeriod: 'annual',
  users: 250,
  connectors: 15,
  storageGB: 850,
  voicePercentage: 15,
  visualPercentage: 10,
  addons: {
    advancedAnalytics: true,
    dedicatedCSM: false
  },
  customConnectorsCount: 2,
  companySize: 'mid-market',
  industry: 'financial',
  useCases: ['internal_knowledge', 'customer_support', 'compliance', 'research']
};

const midMarketAnalysis = performFullPricingAnalysis(midMarketConfig);

console.log(`Tier: ${midMarketAnalysis.tier.name}`);
console.log(`\nMonthly Revenue: $${midMarketAnalysis.pricing.monthly.total.toLocaleString()}`);
console.log(`  Base: $${midMarketAnalysis.pricing.monthly.subscription.toLocaleString()}`);
console.log(`  Connectors: $${midMarketAnalysis.pricing.monthly.connectorOverage.toLocaleString()}`);
console.log(`  Storage: $${midMarketAnalysis.pricing.monthly.storageOverage.toLocaleString()}`);
console.log(`  Add-ons: $${midMarketAnalysis.pricing.monthly.addons.toLocaleString()}`);

console.log(`\nAnnual Costs:`);
console.log(`  Recurring: $${(midMarketAnalysis.pricing.annual.total - midMarketAnalysis.pricing.annual.oneTime).toLocaleString()}`);
console.log(`  One-Time (Custom Connectors): $${midMarketAnalysis.pricing.annual.oneTime.toLocaleString()}`);
console.log(`  Total Year 1: $${midMarketAnalysis.pricing.annual.total.toLocaleString()}`);

console.log(`\nMargin Analysis:`);
console.log(`  Monthly Revenue: $${midMarketAnalysis.margin.monthly.revenue.toLocaleString()}`);
console.log(`  Monthly COGS: $${midMarketAnalysis.margin.monthly.cogs.toLocaleString()}`);
console.log(`  Gross Profit: $${midMarketAnalysis.margin.monthly.grossProfit.toLocaleString()}`);
console.log(`  Margin: ${midMarketAnalysis.margin.monthly.grossMarginPercent.toFixed(2)}%`);
console.log(`  Variance: ${midMarketAnalysis.margin.monthly.variance > 0 ? '+' : ''}${midMarketAnalysis.margin.monthly.variance.toFixed(2)}% vs target`);

console.log(`\nROI Breakdown:`);
console.log(`  Productivity Savings: $${midMarketAnalysis.roi.productivityValue.toLocaleString()}`);
console.log(`  Onboarding Savings: $${midMarketAnalysis.roi.onboardingSavings.toLocaleString()}`);
console.log(`  Efficiency Gains: $${midMarketAnalysis.roi.efficiencyGain.toLocaleString()}`);
console.log(`  Total Annual Value: $${midMarketAnalysis.roi.totalValue.toLocaleString()}`);
console.log(`  ROI: ${midMarketAnalysis.roi.roi.toFixed(0)}%`);

console.log('\n');

// ========================================
// SCENARIO 3: Enterprise
// ========================================
console.log('SCENARIO 3: Large Enterprise');
console.log('─────────────────────────────────────────');

const enterpriseConfig = {
  tierId: 'enterprise_saas',
  billingPeriod: 'annual',
  users: 1500,
  connectors: 45,
  storageGB: 5000,
  voicePercentage: 30,
  visualPercentage: 25,
  addons: {
    advancedAnalytics: false, // Included
    dedicatedCSM: false       // Included
  },
  customConnectorsCount: 5,
  companySize: 'enterprise',
  industry: 'healthcare',
  useCases: ['internal_knowledge', 'customer_support', 'compliance', 'research', 'sales_enablement', 'audit']
};

const enterpriseAnalysis = performFullPricingAnalysis(enterpriseConfig);

console.log(`Tier: ${enterpriseAnalysis.tier.name}`);
console.log(`Users: ${enterpriseConfig.users.toLocaleString()}`);
console.log(`Connectors: ${enterpriseConfig.connectors} (unlimited included)`);
console.log(`Storage: ${(enterpriseConfig.storageGB / 1024).toFixed(1)}TB (unlimited included)`);

console.log(`\nPricing:`);
console.log(`  Monthly: $${enterpriseAnalysis.pricing.monthly.total.toLocaleString()}`);
console.log(`  Annual (Recurring): $${(enterpriseAnalysis.pricing.annual.total - enterpriseAnalysis.pricing.annual.oneTime).toLocaleString()}`);
console.log(`  One-Time (5 Custom Connectors): $${enterpriseAnalysis.pricing.annual.oneTime.toLocaleString()}`);
console.log(`  Total Year 1: $${enterpriseAnalysis.pricing.annual.total.toLocaleString()}`);

console.log(`\nIncluded Features:`);
console.log(`  ✓ Unlimited connectors`);
console.log(`  ✓ Unlimited storage`);
console.log(`  ✓ Advanced Analytics Dashboard`);
console.log(`  ✓ Dedicated Customer Success Manager`);
console.log(`  ✓ 3 Custom Connectors per year`);
console.log(`  ✓ 99.9% SLA`);
console.log(`  ✓ White-glove support (1hr response)`);

console.log(`\nMargin: ${enterpriseAnalysis.margin.monthly.grossMarginPercent.toFixed(2)}%`);
console.log(`Status: ${enterpriseAnalysis.margin.monthly.meetsTarget ? '✓ Meets 82% target' : '✗ Below target'}`);

console.log(`\nValue Creation (Annual):`);
console.log(`  Total Value: $${enterpriseAnalysis.roi.totalValue.toLocaleString()}`);
console.log(`  Investment: $${enterpriseAnalysis.roi.investment.toLocaleString()}`);
console.log(`  Net Value: $${enterpriseAnalysis.roi.netValue.toLocaleString()}`);
console.log(`  Payback Period: ${enterpriseAnalysis.roi.paybackMonths.toFixed(1)} months`);

console.log('\n');

// ========================================
// SCENARIO 4: Tier Recommendation
// ========================================
console.log('SCENARIO 4: Automatic Tier Recommendation');
console.log('─────────────────────────────────────────');

const unknownConfig = {
  deploymentType: 'managed_saas',
  users: 350,
  connectors: 18,
  storageGB: 1200,
  useCases: ['internal_knowledge', 'customer_support', 'research'],
  industry: 'legal'
};

const recommendedTier = determineTier(unknownConfig);
console.log(`Input:`);
console.log(`  Users: ${unknownConfig.users}`);
console.log(`  Connectors: ${unknownConfig.connectors}`);
console.log(`  Storage: ${unknownConfig.storageGB}GB`);
console.log(`  Industry: ${unknownConfig.industry}`);
console.log(`  Use Cases: ${unknownConfig.useCases.length}`);

console.log(`\nRecommended Tier: ${recommendedTier}`);

const tierChangeTests = [
  { users: 30, connectors: 4, storageGB: 50, industry: 'technology', expected: 'starter_saas' },
  { users: 200, connectors: 15, storageGB: 800, industry: 'technology', expected: 'professional_saas' },
  { users: 800, connectors: 25, storageGB: 2000, industry: 'technology', expected: 'enterprise_saas' },
  { users: 100, connectors: 10, storageGB: 500, industry: 'healthcare', expected: 'enterprise_saas' }, // Regulated
];

console.log(`\nTier Recommendation Tests:`);
tierChangeTests.forEach((test, i) => {
  const tier = determineTier({ ...test, deploymentType: 'managed_saas' });
  const match = tier === test.expected ? '✓' : '✗';
  console.log(`  ${match} Test ${i + 1}: ${test.users} users, ${test.connectors} conn → ${tier}`);
});

console.log('\n');

// ========================================
// SCENARIO 5: Migration from Competitor
// ========================================
console.log('SCENARIO 5: Migration from Glean');
console.log('─────────────────────────────────────────');

const gleanMigration = calculateMigration('glean', 290000, midMarketAnalysis.pricing.annual.total);

console.log(`Current Solution: ${gleanMigration.competitor}`);
console.log(`Current Annual Cost: $${gleanMigration.currentAnnualCost.toLocaleString()}`);
console.log(`Echo Annual Cost: $${gleanMigration.echoAnnualCost.toLocaleString()}`);
console.log(`\nMigration Costs (7-week project):`);
Object.entries(gleanMigration.breakdown).forEach(([phase, cost]) => {
  console.log(`  ${phase}: $${cost.toLocaleString()}`);
});
console.log(`  ─────────────`);
console.log(`  Total Migration Cost: $${gleanMigration.migrationCost.toLocaleString()}`);

console.log(`\nSavings Analysis:`);
console.log(`  Annual Savings: $${gleanMigration.annualSavings.toLocaleString()}`);
console.log(`  Payback Period: ${gleanMigration.paybackMonths.toFixed(1)} months`);
console.log(`  Year 1 Net Savings: $${gleanMigration.year1NetSavings.toLocaleString()}`);
console.log(`  Year 2 Net Savings: $${gleanMigration.year2NetSavings.toLocaleString()}`);
console.log(`  Year 3 Net Savings: $${gleanMigration.year3NetSavings.toLocaleString()}`);
console.log(`  3-Year Total Savings: $${gleanMigration.threeYearSavings.toLocaleString()}`);

console.log('\n');

// ========================================
// SCENARIO 6: 5-Year Growth Projection
// ========================================
console.log('SCENARIO 6: 5-Year Growth Projection');
console.log('─────────────────────────────────────────');

const projection = project5Year(midMarketConfig, 40); // 40% annual growth

console.log(`Starting Configuration:`);
console.log(`  Users: ${midMarketConfig.users}`);
console.log(`  Connectors: ${midMarketConfig.connectors}`);
console.log(`  Storage: ${midMarketConfig.storageGB}GB`);
console.log(`  Growth Rate: 40% annually`);

console.log(`\nYear-by-Year Projection:`);
console.log(`┌──────┬───────┬───────────┬──────────┬─────────────┬────────────┬────────┐`);
console.log(`│ Year │ Users │ Connector │  Storage │        Tier │     Annual │ Margin │`);
console.log(`├──────┼───────┼───────────┼──────────┼─────────────┼────────────┼────────┤`);

projection.years.forEach(year => {
  const users = year.users.toString().padStart(5);
  const conn = year.connectors.toString().padStart(9);
  const storage = `${(year.storageGB / 1024).toFixed(1)}TB`.padStart(8);
  const tier = year.tier.replace('_saas', '').padStart(11);
  const annual = `$${(year.annualRevenue / 1000).toFixed(0)}K`.padStart(10);
  const margin = `${year.grossMargin.toFixed(1)}%`.padStart(6);
  console.log(`│  ${year.year}   │${users} │${conn} │${storage} │${tier} │${annual} │${margin} │`);
});

console.log(`└──────┴───────┴───────────┴──────────┴─────────────┴────────────┴────────┘`);

console.log(`\n5-Year Totals:`);
console.log(`  Total Investment: $${projection.totals.investment.toLocaleString()}`);
console.log(`  Total Value Created: $${projection.totals.value.toLocaleString()}`);
console.log(`  Net Value: $${projection.totals.netValue.toLocaleString()}`);
console.log(`  5-Year ROI: ${projection.totals.roi.toFixed(0)}%`);

console.log('\n');

// ========================================
// SCENARIO 7: Competitor Comparison
// ========================================
console.log('SCENARIO 7: Competitive Comparison (250 users)');
console.log('─────────────────────────────────────────');

const { COMPETITOR_DATA } = require('./echo-pricing-engine');

console.log(`Echo Professional: $${midMarketAnalysis.pricing.annual.total.toLocaleString()} (baseline)`);
console.log(`\nCompetitors:`);

Object.entries(COMPETITOR_DATA).forEach(([key, comp]) => {
  const diff = comp.annualCost - midMarketAnalysis.pricing.annual.total;
  const percent = ((diff / midMarketAnalysis.pricing.annual.total) * 100).toFixed(0);
  const sign = diff > 0 ? '+' : '';
  console.log(`  ${comp.name}: $${comp.annualCost.toLocaleString()} (${sign}${percent}%)`);
  console.log(`    Connectors: ${comp.connectors || 'N/A'}`);
  console.log(`    Voice: ${comp.voiceInterface ? 'Yes' : 'No'} | Visual: ${comp.visualSearch ? 'Yes' : 'No'}`);
  if (comp.setupFee) console.log(`    Setup Fee: $${comp.setupFee.toLocaleString()}`);
  console.log('');
});

console.log('\n');

// ========================================
// SCENARIO 8: Voice/Visual Premium Pricing
// ========================================
console.log('SCENARIO 8: Voice & Visual Premium Add-ons');
console.log('─────────────────────────────────────────');

const premiumTests = [
  { voice: 10, visual: 10, desc: 'Standard usage (no premium)' },
  { voice: 30, visual: 15, desc: 'High voice usage (>25%)' },
  { voice: 15, visual: 30, desc: 'High visual usage (>25%)' },
  { voice: 35, visual: 40, desc: 'High voice + visual (both >25%)' }
];

premiumTests.forEach(test => {
  const config = {
    ...startupConfig,
    voicePercentage: test.voice,
    visualPercentage: test.visual
  };

  const result = calculateTotalMonthlyCost(config);

  console.log(`${test.desc}:`);
  console.log(`  Voice: ${test.voice}% | Visual: ${test.visual}%`);
  console.log(`  Premium charges: $${result.addons.toLocaleString()}/month`);
  if (result.addonsBreakdown.voicePremium) {
    console.log(`    - Voice Premium: $${result.addonsBreakdown.voicePremium}`);
  }
  if (result.addonsBreakdown.visualPremium) {
    console.log(`    - Visual Premium: $${result.addonsBreakdown.visualPremium}`);
  }
  console.log('');
});

console.log('\n========================================');
console.log('ALL TESTS COMPLETED');
console.log('========================================\n');

// ========================================
// UNIT TESTS (Simple Assertions)
// ========================================

console.log('Running Unit Tests...\n');

let passedTests = 0;
let totalTests = 0;

function test(description, condition) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ ${description}`);
  } else {
    console.log(`✗ ${description}`);
  }
}

// Tier determination tests
test('Starter tier for 25 users', determineTier({ deploymentType: 'managed_saas', users: 25, connectors: 5, storageGB: 100 }) === 'starter_saas');
test('Professional tier for 250 users', determineTier({ deploymentType: 'managed_saas', users: 250, connectors: 15, storageGB: 850 }) === 'professional_saas');
test('Enterprise tier for 800 users', determineTier({ deploymentType: 'managed_saas', users: 800, connectors: 25, storageGB: 2000 }) === 'enterprise_saas');
test('Enterprise tier for regulated industry', determineTier({ deploymentType: 'managed_saas', users: 100, connectors: 10, storageGB: 500, industry: 'healthcare' }) === 'enterprise_saas');

// Pricing tests
test('Starter monthly price is $2,500', calculateTotalMonthlyCost({ tierId: 'starter_saas', billingPeriod: 'monthly', users: 25, connectors: 5, storageGB: 100 }).totalMonthly === 2500);
test('Professional monthly price is $10,000', calculateTotalMonthlyCost({ tierId: 'professional_saas', billingPeriod: 'monthly', users: 250, connectors: 20, storageGB: 1024 }).totalMonthly === 10000);

// Annual discount test
const annualTest = calculateTotalMonthlyCost({ tierId: 'professional_saas', billingPeriod: 'annual', users: 250, connectors: 20, storageGB: 1024 });
test('Annual billing applies 20% discount', annualTest.subscription === 8000); // $10k * 0.8

// Overage tests
const overageTest = calculateTotalMonthlyCost({ tierId: 'starter_saas', billingPeriod: 'monthly', users: 25, connectors: 8, storageGB: 300 });
test('Connector overage calculated (3 extra × $500)', overageTest.connectorOverage === 1500);
test('Storage overage calculated (2 blocks × $100)', overageTest.storageOverage === 200);

// Margin tests
const marginTest = calculateGrossMargin(10000, 3000);
test('Gross margin calculation is correct', marginTest.grossMarginPercent === 70);
test('Margin target is 82%', marginTest.targetMargin === 82);
test('Below target status detected', marginTest.status === 'below_target');

console.log(`\n─────────────────────────────────────────`);
console.log(`Tests Passed: ${passedTests}/${totalTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log(`─────────────────────────────────────────\n`);

// Export test results for CI/CD
if (passedTests === totalTests) {
  console.log('✓ ALL TESTS PASSED');
  process.exit(0);
} else {
  console.log('✗ SOME TESTS FAILED');
  process.exit(1);
}
