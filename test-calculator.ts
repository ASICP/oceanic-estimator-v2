import { PorpoiseCalculator, type PorpoiseCalculationInput } from './server/porpoise-calculator';

async function testCalculator() {
  console.log('🧪 Testing Porpoise Calculator...\n');
  
  // Test Case 1: Starter tier with typical usage
  const testInput: PorpoiseCalculationInput = {
    tierId: 'starter',
    billingPeriod: 'annual',
    numUsers: 10,
    concurrentJobs: 3,
    storageGb: 15, // 5GB overage
    gpuHoursMonthly: 25, // 5 hours overage
    apiCallsMonthly: 7000, // 2000 overage
    numAvatars: 6 // 6 avatar overage (need 1 addon pack)
  };
  
  try {
    const result = await PorpoiseCalculator.calculate(testInput);
    
    console.log('📊 CALCULATION RESULTS\n');
    console.log('='.repeat(60));
    
    console.log('\n1️⃣ TIER PRICING:');
    console.log(`   Tier: ${result.tierPricing.tierName}`);
    console.log(`   Base Monthly: $${result.tierPricing.baseMonthlyCost.toFixed(2)}`);
    console.log(`   Base Annual: $${result.tierPricing.baseAnnualCost.toFixed(2)}`);
    console.log(`   Billing Period: ${result.tierPricing.billingPeriod}`);
    console.log(`   Discount: ${result.tierPricing.discount}%`);
    
    console.log('\n2️⃣ USAGE COSTS (Overages):');
    console.log(`   GPU Hours: $${result.usageCosts.gpuCost.toFixed(2)}`);
    console.log(`   Storage: $${result.usageCosts.storageCost.toFixed(2)}`);
    console.log(`   API Calls: $${result.usageCosts.apiCallsCost.toFixed(2)}`);
    console.log(`   Avatars: $${result.usageCosts.avatarCost.toFixed(2)}`);
    console.log(`   ─────────────────────────`);
    console.log(`   Total Usage: $${result.usageCosts.totalUsageCost.toFixed(2)}`);
    
    console.log('\n3️⃣ CUSTOMER COSTS:');
    console.log(`   Monthly Cost: $${result.customerCosts.monthlyCost.toFixed(2)}`);
    console.log(`   Annual Cost: $${result.customerCosts.annualCost.toFixed(2)}`);
    console.log(`   Effective Monthly: $${result.customerCosts.effectiveMonthlyCost.toFixed(2)}`);
    
    console.log('\n4️⃣ COGS (Internal):');
    console.log(`   Infrastructure: $${result.cogs.infrastructureCost.toFixed(2)}`);
    console.log(`   Avatars: $${result.cogs.avatarCost.toFixed(2)}`);
    console.log(`   Twilio: $${result.cogs.twilioCost.toFixed(2)}`);
    console.log(`   Support: $${result.cogs.supportCost.toFixed(2)}`);
    console.log(`   ─────────────────────────`);
    console.log(`   Monthly COGS: $${result.cogs.totalMonthlyCogs.toFixed(2)}`);
    console.log(`   Annual COGS: $${result.cogs.totalAnnualCogs.toFixed(2)}`);
    
    console.log('\n5️⃣ MARGINS:');
    console.log(`   Gross Margin: ${result.margins.grossMarginPercent.toFixed(2)}%`);
    console.log(`   Monthly Profit: $${result.margins.monthlyGrossProfit.toFixed(2)}`);
    console.log(`   Annual Profit: $${result.margins.annualGrossProfit.toFixed(2)}`);
    console.log(`   Target Range: ${result.margins.targetMarginRange.min}% - ${result.margins.targetMarginRange.max}%`);
    console.log(`   Status: ${result.margins.marginStatus.toUpperCase()}`);
    
    console.log('\n6️⃣ COMPETITOR COMPARISON (Top 3):');
    result.competitors.slice(0, 3).forEach((comp, i) => {
      console.log(`   ${i + 1}. ${comp.competitorName}`);
      console.log(`      Annual Cost: $${comp.annualCost.toFixed(2)}`);
      console.log(`      Savings: $${comp.savings.toFixed(2)} (${comp.savingsPercent.toFixed(1)}%)`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Calculator test passed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Calculator test failed:', error);
    process.exit(1);
  }
}

testCalculator();
