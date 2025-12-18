const express = require('express');
const cors = require('cors');
const path = require('path');
const {
    determineTier,
    calculateTotalMonthlyCost,
    calculateGrossMargin,
    TIER_PRICING,
    AGENT_ROLES
} = require('./lib/dolphin-pricing-engine');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoints
app.get('/api/metadata', (req, res) => {
    res.json({
        tiers: TIER_PRICING,
        roles: AGENT_ROLES
    });
});

app.post('/api/calculate', (req, res) => {
    try {
        const config = req.body; // { agents: 5, runs: 1000, ... }

        // 1. Calculate Costs first to get totalAgents
        const pricing = calculateTotalMonthlyCost(config);

        // 2. Determine Tier (purely for display)
        // determineTier expects a number
        const tierObj = determineTier(pricing.totalAgents);
        const recommendedTier = tierObj ? tierObj.id : 'professional_agent';

        // 3. Calculate Margin (Internal)
        // calculateGrossMargin(revenue, totalAgents)
        // We use annual revenue for standardizing margin calc
        const annualRevenue = pricing.billingPeriod === 'annual'
            ? pricing.totalMonthly * 12
            : pricing.totalMonthly * 12;

        const margin = calculateGrossMargin(annualRevenue, pricing.totalAgents);

        res.json({
            success: true,
            data: {
                inputs: config,
                recommendedTier: recommendedTier,
                pricing, // contains deployment, addons, overages
                margin   // contains cogs, grossMarginPercent
            }
        });
    } catch (error) {
        console.error('Calculation Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🐬 Dolphin Calculator v2.2 running at http://localhost:${PORT}`);
});
