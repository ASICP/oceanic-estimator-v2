const express = require('express');
const cors = require('cors');
const path = require('path');
const {
    TIERS,
    COMPETITORS,
    calculateCost,
    calculateROI
} = require('./lib/orca-pricing-engine');

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 to avoid conflict if Dolphin is running

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoints
app.get('/api/metadata', (req, res) => {
    res.json({
        tiers: TIERS,
        competitors: COMPETITORS
    });
});

app.post('/api/calculate', (req, res) => {
    try {
        const config = req.body;
        // Expected: { employees: 1500, analysts: 10, avgSalary: 120000, dealsPerYear: 100, isBYOD: false, wantQuantum: false }

        // 1. Calculate Monthly Cloud/License Cost
        const pricing = calculateCost({
            employees: config.employees,
            isBYOD: config.isBYOD,
            wantQuantum: config.wantQuantum,
            monthlyTokens: config.monthlyTokens || 0
        });

        // 2. Calculate ROI Baseline
        const roi = calculateROI(
            {
                analysts: config.analysts || 5,
                avgSalary: config.avgSalary || 100000,
                dealsPerYear: config.dealsPerYear || 50,
                hoursPerDeal: config.hoursPerDeal || 80
            },
            pricing,
            config.competitor
        );

        res.json({
            success: true,
            data: {
                inputs: config,
                pricing,
                roi
            }
        });
    } catch (error) {
        console.error('Calculation Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🐋 Orca Intelligence Calculator running at http://localhost:${PORT}`);
});
