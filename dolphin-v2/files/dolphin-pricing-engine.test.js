/**
 * ========================================
 * DOLPHIN AGENT CALCULATOR v2.0
 * Test Suite
 * ========================================
 */

const {
    TIER_PRICING,
    determineTier,
    calculateTotalMonthlyCost,
    calculateTotalCOGS,
    calculateGrossMargin
} = require('./dolphin-pricing-engine');

// ========================================
// TEST HELPERS
// ========================================

function runTest(name, config, expected) {
    console.log(`\nTEST: ${name}`);

    // Tier Determination
    const tierId = determineTier(config);
    if (expected.tierId && tierId !== expected.tierId) {
        console.error(`❌ Tier Mismatch: Expected ${expected.tierId}, Got ${tierId}`);
        return false;
    }
    console.log(`✓ Tier: ${tierId}`);

    // Pricing
    const pricing = calculateTotalMonthlyCost({ ...config, tierId });
    if (expected.monthlyCost && Math.abs(pricing.totalMonthly - expected.monthlyCost) > 1) {
        console.error(`❌ Cost Mismatch: Expected $${expected.monthlyCost}, Got $${pricing.totalMonthly}`);
        return false;
    }
    console.log(`✓ Cost: $${pricing.totalMonthly.toFixed(2)}`);

    // COGS
    const cogs = calculateTotalCOGS({ ...config, tierId });
    // Margin
    const margin = calculateGrossMargin(pricing.totalMonthly, cogs.total);

    if (expected.margin && Math.abs(margin.grossMarginPercent - expected.margin) > 5) {
        console.log(`⚠️ Margin Variance: Expected ${expected.margin}%, Got ${margin.grossMarginPercent.toFixed(1)}%`);
    } else {
        console.log(`✓ Margin: ${margin.grossMarginPercent.toFixed(1)}%`);
    }

    return true;
}

// ========================================
// TEST CASES
// ========================================

const tests = [
    {
        name: 'Small Team (Starter)',
        config: {
            agents: 3,
            runs: 500,
            deploymentType: 'managed_saas'
        },
        expected: {
            tierId: 'starter_agent',
            monthlyCost: 1500, // Base price
            margin: 80
        }
    },
    {
        name: 'Growing Dept (Professional)',
        config: {
            agents: 10,
            runs: 3000,
            deploymentType: 'managed_saas'
        },
        expected: {
            tierId: 'professional_agent',
            monthlyCost: 5000,
            margin: 80
        }
    },
    {
        name: 'Large Org (Enterprise)',
        config: {
            agents: 50,
            runs: 15000,
            deploymentType: 'managed_saas'
        },
        expected: {
            tierId: 'enterprise_agent',
            monthlyCost: 15000,
            margin: 85 // Higher volume usually better margin
        }
    },
    {
        name: 'Heavy Usage (Overage)',
        config: {
            agents: 5,
            runs: 5000, // 4000 over limit of 1000
            deploymentType: 'managed_saas'
        },
        // 5 Agents = Starter Tier limits
        // But 5000 runs might push to Pro?
        // Logic: if agents > 5 OR runs > 1000 -> Pro.
        // 5000 runs > 1000 -> Pro.
        expected: {
            tierId: 'professional_agent',
            monthlyCost: 5000,
            margin: 80
        }
    }
];

// ========================================
// RUN TESTS
// ========================================

let passed = 0;
tests.forEach(test => {
    if (runTest(test.name, test.config, test.expected)) passed++;
});

console.log(`\nTests Passed: ${passed}/${tests.length}`);
