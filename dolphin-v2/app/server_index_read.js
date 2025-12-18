const express = require('express');
const cors = require('cors');
const path = require('path');
const {
    determineTier,
    calculateTotalMonthlyCost,
    calculateTotalCOGS,
    calculateGrossMargin,
    TIER_PRICING,
    COMPETITOR_DATA
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
        competitors: COMPETITOR_DATA
    });
});

app.post('/api/calculate', (req, res) => {
    try {
        const config = req.body;

        // Auto-determine tier if not provided
        if (!config.tierId) {
            config.tierId = determineTier(config);
        }

        const pricing = calculateTotalMonthlyCost(config);
        const cogs = calculateTotalCOGS({ ...config, tierId: config.tierId });

        // Annual revenue calculation for margin
        const annualRevenue = pricing.billingPeriod === 'annual'
            ? pricing.totalMonthly * 12
            : pricing.totalMonthly * 12 * 0.8; // assumption of discount logic parity

        const annualCOGS = cogs.total * 12;
        const margin = calculateGrossMargin(annualRevenue, annualCOGS);

        res.json({
            success: true,
            data: {
                inputs: config,
                recommendedTier: config.tierId,
                pricing,
                cogs,
                margin
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🐬 Dolphin Calculator running at http://localhost:${PORT}`);
});
