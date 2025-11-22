import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertWorkflowSchema,
  insertAgentSchema, 
  insertCostEstimateSchema,
  insertCostBreakdownItemSchema,
  insertPricingModelSchema,
  type InsertSharedResult,
  type InsertContract
} from "@shared/schema";
import { 
  requireAuth, 
  requireCSRF, 
  loginHandler, 
  logoutHandler, 
  getCurrentUser, 
  generateApiToken 
} from "./auth-middleware";
import { CostCalculator, costCalculationSchema } from "./costCalculator";
import { GitHubSync } from "./github-sync";
import { seedPorpoiseData } from "./porpoise-seed";
import { PorpoiseCalculator, porpoiseCalculationSchema } from "./porpoise-calculator";
import { db } from "./db";
import { pricingTiers, competitorPricing } from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const router = Router();

// Authentication routes
router.post("/api/auth/login", loginHandler);
router.post("/api/auth/logout", logoutHandler);
router.get("/api/auth/user", getCurrentUser);
router.post("/api/auth/token", generateApiToken);

// Workflow routes
router.get("/api/workflows", async (req, res) => {
  try {
    const workflows = await storage.getWorkflows();
    res.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
});

router.get("/api/workflows/:id", async (req, res) => {
  try {
    const workflow = await storage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    res.json(workflow);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    res.status(500).json({ error: "Failed to fetch workflow" });
  }
});

router.post("/api/workflows", async (req, res) => {
  try {
    const validation = insertWorkflowSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid workflow data", details: validation.error });
    }
    
    const workflow = await storage.createWorkflow(validation.data);
    res.status(201).json(workflow);
  } catch (error) {
    console.error("Error creating workflow:", error);
    res.status(500).json({ error: "Failed to create workflow" });
  }
});

router.put("/api/workflows/:id", async (req, res) => {
  try {
    const validation = insertWorkflowSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid workflow data", details: validation.error });
    }
    
    const workflow = await storage.updateWorkflow(req.params.id, validation.data);
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    res.json(workflow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    res.status(500).json({ error: "Failed to update workflow" });
  }
});

router.delete("/api/workflows/:id", async (req, res) => {
  try {
    const success = await storage.deleteWorkflow(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting workflow:", error);
    res.status(500).json({ error: "Failed to delete workflow" });
  }
});

// Agent routes
router.get("/api/agents", async (req, res) => {
  try {
    const { domain } = req.query;
    const agents = domain 
      ? await storage.getAgentsByDomain(domain as string)
      : await storage.getAgents();
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

router.get("/api/agents/:id", async (req, res) => {
  try {
    const agent = await storage.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ error: "Failed to fetch agent" });
  }
});

router.post("/api/agents", async (req, res) => {
  try {
    const validation = insertAgentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid agent data", details: validation.error });
    }
    
    const agent = await storage.createAgent(validation.data);
    res.status(201).json(agent);
  } catch (error) {
    console.error("Error creating agent:", error);
    res.status(500).json({ error: "Failed to create agent" });
  }
});

router.put("/api/agents/:id", async (req, res) => {
  try {
    const validation = insertAgentSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid agent data", details: validation.error });
    }
    
    const agent = await storage.updateAgent(req.params.id, validation.data);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ error: "Failed to update agent" });
  }
});

router.delete("/api/agents/:id", async (req, res) => {
  try {
    const success = await storage.deleteAgent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Agent not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

// Cost estimate routes
router.get("/api/cost-estimates", async (req, res) => {
  try {
    const estimates = await storage.getCostEstimates();
    res.json(estimates);
  } catch (error) {
    console.error("Error fetching cost estimates:", error);
    res.status(500).json({ error: "Failed to fetch cost estimates" });
  }
});

router.get("/api/cost-estimates/:id", async (req, res) => {
  try {
    const estimate = await storage.getCostEstimate(req.params.id);
    if (!estimate) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }
    res.json(estimate);
  } catch (error) {
    console.error("Error fetching cost estimate:", error);
    res.status(500).json({ error: "Failed to fetch cost estimate" });
  }
});

router.post("/api/cost-estimates", async (req, res) => {
  try {
    const validation = insertCostEstimateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid cost estimate data", details: validation.error });
    }
    
    const estimate = await storage.createCostEstimate(validation.data);
    res.status(201).json(estimate);
  } catch (error) {
    console.error("Error creating cost estimate:", error);
    res.status(500).json({ error: "Failed to create cost estimate" });
  }
});

router.put("/api/cost-estimates/:id", async (req, res) => {
  try {
    const validation = insertCostEstimateSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid cost estimate data", details: validation.error });
    }
    
    const estimate = await storage.updateCostEstimate(req.params.id, validation.data);
    if (!estimate) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }
    res.json(estimate);
  } catch (error) {
    console.error("Error updating cost estimate:", error);
    res.status(500).json({ error: "Failed to update cost estimate" });
  }
});

router.delete("/api/cost-estimates/:id", async (req, res) => {
  try {
    const success = await storage.deleteCostEstimate(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cost estimate:", error);
    res.status(500).json({ error: "Failed to delete cost estimate" });
  }
});

// Enhanced cost calculation using the cost calculator engine

router.post("/api/calculate-costs", async (req, res) => {
  try {
    console.log('[COST_DEBUG] Received request:', JSON.stringify(req.body, null, 2));
    
    const validation = costCalculationSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('[COST_DEBUG] Validation failed:', validation.error);
      return res.status(400).json({ error: "Invalid calculation data", details: validation.error });
    }
    
    console.log('[COST_DEBUG] Validation passed, calculating...');
    const result = CostCalculator.calculate(validation.data);
    console.log('[COST_DEBUG] Calculation result:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("[COST_DEBUG] Error calculating costs:", error);
    res.status(500).json({ error: "Failed to calculate costs" });
  }
});

// Pricing models routes
router.get("/api/pricing-models", async (req, res) => {
  try {
    const models = await storage.getPricingModels();
    res.json(models);
  } catch (error) {
    console.error("Error fetching pricing models:", error);
    res.status(500).json({ error: "Failed to fetch pricing models" });
  }
});

router.get("/api/pricing-models/:id", async (req, res) => {
  try {
    const model = await storage.getPricingModel(req.params.id);
    if (!model) {
      return res.status(404).json({ error: "Pricing model not found" });
    }
    res.json(model);
  } catch (error) {
    console.error("Error fetching pricing model:", error);
    res.status(500).json({ error: "Failed to fetch pricing model" });
  }
});

router.post("/api/pricing-models", async (req, res) => {
  try {
    const validation = insertPricingModelSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid pricing model data", details: validation.error });
    }
    
    const model = await storage.createPricingModel(validation.data);
    res.status(201).json(model);
  } catch (error) {
    console.error("Error creating pricing model:", error);
    res.status(500).json({ error: "Failed to create pricing model" });
  }
});

// PDF Export endpoints
router.post("/api/export-pdf", async (req, res) => {
  try {
    const { estimateId, type } = req.body; // type: 'summary' or 'detailed'
    
    const estimate = await storage.getCostEstimate(estimateId);
    if (!estimate) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }

    // Generate PDF URL (this will be handled by the frontend)
    const fileName = `${type === 'detailed' ? 'detailed_' : ''}cost_estimate_${estimateId}.pdf`;
    
    res.json({ 
      success: true, 
      fileName,
      estimate,
      downloadUrl: `/api/download-pdf/${estimateId}?type=${type}`
    });
  } catch (error) {
    console.error("Error preparing PDF export:", error);
    res.status(500).json({ error: "Failed to prepare PDF export" });
  }
});

// Share Results endpoints
router.post("/api/share-results", async (req, res) => {
  try {
    const { estimateId, title } = req.body;
    
    const estimate = await storage.getCostEstimate(estimateId);
    if (!estimate) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }
    
    // Generate unique share URL
    const shareUrl = `share/${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    
    const sharedResult: InsertSharedResult = {
      estimateId,
      shareUrl,
      title: title || estimate.title || 'Cost Estimation Results',
      isPublic: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
    
    const result = await storage.createSharedResult(sharedResult);
    
    // Generate social media sharing URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullShareUrl = `${baseUrl}/${shareUrl}`;
    const encodedUrl = encodeURIComponent(fullShareUrl);
    const encodedTitle = encodeURIComponent(`Check out this cost estimation: ${result.title}`);
    
    const socialLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=I wanted to share this cost estimation with you: ${encodedUrl}`
    };
    
    res.json({ 
      success: true, 
      shareUrl: fullShareUrl,
      socialLinks,
      result
    });
  } catch (error) {
    console.error("Error creating shared result:", error);
    res.status(500).json({ error: "Failed to create shared result" });
  }
});

router.get("/api/shared/:shareUrl", async (req, res) => {
  try {
    const sharedResult = await storage.getSharedResultByUrl(`share/${req.params.shareUrl}`);
    if (!sharedResult) {
      return res.status(404).json({ error: "Shared result not found" });
    }
    
    // Increment view count
    await storage.updateSharedResult(sharedResult.id, {
      viewCount: (sharedResult.viewCount || 0) + 1
    });
    
    const estimate = await storage.getCostEstimate(sharedResult.estimateId);
    res.json({ sharedResult, estimate });
  } catch (error) {
    console.error("Error fetching shared result:", error);
    res.status(500).json({ error: "Failed to fetch shared result" });
  }
});

// Contract/Stripe endpoints
router.post("/api/generate-contract", async (req, res) => {
  try {
    const { estimateId, clientName, clientEmail } = req.body;
    
    const estimate = await storage.getCostEstimate(estimateId);
    if (!estimate) {
      return res.status(404).json({ error: "Cost estimate not found" });
    }
    
    // Generate contract number
    const contractNumber = `EV-${Date.now().toString(36).toUpperCase()}`;
    
    const contract: InsertContract = {
      estimateId,
      contractNumber,
      clientName,
      clientEmail,
      totalAmount: estimate.totalCost,
      status: "draft"
    };
    
    const createdContract = await storage.createContract(contract);
    
    res.json({ 
      success: true,
      contract: createdContract,
      invoiceUrl: `/api/invoice/${createdContract.id}`,
      checkoutUrl: `/api/checkout/${createdContract.id}`
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    res.status(500).json({ error: "Failed to generate contract" });
  }
});

router.get("/api/invoice/:contractId", async (req, res) => {
  try {
    const contract = await storage.getContract(req.params.contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    
    const estimate = await storage.getCostEstimate(contract.estimateId);
    
    // Generate invoice data
    const invoice = {
      contractNumber: contract.contractNumber,
      clientName: contract.clientName,
      clientEmail: contract.clientEmail,
      totalAmount: contract.totalAmount,
      status: contract.status,
      estimate,
      issueDate: contract.createdAt,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [
        {
          description: `Cost Estimation Implementation: ${estimate?.title || 'Custom Workflow'}`,
          quantity: 1,
          unitPrice: contract.totalAmount,
          total: contract.totalAmount
        }
      ]
    };
    
    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

router.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { contractId } = req.body;
    
    const contract = await storage.getContract(contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    
    const estimate = await storage.getCostEstimate(contract.estimateId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Cost Estimation Implementation: ${estimate?.title || 'Custom Workflow'}`,
            description: `Contract ${contract.contractNumber}`,
          },
          unit_amount: Math.round(parseFloat(contract.totalAmount.toString()) * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: contract.clientEmail || undefined,
      metadata: {
        contractId: contract.id,
        estimateId: contract.estimateId
      }
    });
    
    // Update contract with checkout session ID
    await storage.updateContract(contract.id, {
      stripeCheckoutSessionId: session.id,
      status: "sent"
    });
    
    res.json({ sessionId: session.id, checkoutUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Database seeding endpoint (for development)
router.post("/api/seed-database", async (req, res) => {
  try {
    // Check if data already exists
    const existingWorkflows = await storage.getWorkflows();
    if (existingWorkflows.length > 0) {
      return res.json({ message: "Database already seeded" });
    }
    
    // Seed workflows
    const sampleWorkflows = [
      {
        title: "Deal Sourcing",
        domain: "Investment Ops",
        description: "Autonomous sourcing & pipeline mgmt for roll-ups/SaaS targets.",
        complexity: "Medium",
        duration: "4-8 hrs",
        isPreset: true,
        defaultAgentIds: ["clay", "lyla", "gemma"],
        costModel: "Token + seat ($49/month + $0.01/1K)",
        savingsPercentage: 65
      },
      {
        title: "Financial Modeling",
        domain: "Investment Ops", 
        description: "Qualify deals, build models for EBITDA analysis.",
        complexity: "High",
        duration: "6-12 hrs",
        isPreset: true,
        defaultAgentIds: ["finley", "clay", "financebot"],
        costModel: "Hybrid ($149/dept + tokens)",
        savingsPercentage: 70
      },
      {
        title: "Legal Review",
        domain: "Deal Execution",
        description: "Dataroom prep, term sheets, redlines.",
        complexity: "Medium", 
        duration: "3-6 hrs",
        isPreset: true,
        defaultAgentIds: ["lex", "ivy", "bree"],
        costModel: "Pay-per-use ($0.005/1K via Groq)",
        savingsPercentage: 60
      }
    ];
    
    for (const workflow of sampleWorkflows) {
      await storage.createWorkflow(workflow);
    }
    
    // Seed agents
    const sampleAgents = [
      {
        name: "Clay",
        role: "Project Manager", 
        domain: "Investment Ops",
        description: "Manages projects, sourcing, pipeline management, and diligence checklists with Harvard-level capabilities.",
        capabilities: ["Project Management", "Pipeline Mgmt", "Diligence", "Sourcing"],
        avatarUrl: "/assets/generated_images/Professional_Clay_agent_avatar_12ae85f9.png",
        isRecommended: true,
        baseCostPerHour: "150.00"
      },
      {
        name: "Finley",
        role: "Financial Modeling",
        domain: "Investment Ops",
        description: "Deal qualification, financial modeling, and EBITDA analysis with advanced Harvard Business School graduate capabilities.",
        capabilities: ["Financial Modeling", "Deal Analysis", "EBITDA", "Valuation"],
        avatarUrl: "/assets/generated_images/Professional_Finley_agent_avatar_b19d0057.png",
        isRecommended: true,
        baseCostPerHour: "200.00"
      },
      {
        name: "Lex",
        role: "Legal Specialist",
        domain: "Deal Execution",
        description: "Legal review, dataroom preparation, term sheet automation, and compliance management.",
        capabilities: ["Legal Review", "Compliance", "Term Sheets", "Due Diligence"],
        avatarUrl: "/assets/generated_images/Professional_Lex_agent_avatar_bcd47740.png",
        isRecommended: true,
        baseCostPerHour: "175.00"
      },
      {
        name: "Bree",
        role: "Investor Relations",
        domain: "Fund Admin & IR", 
        description: "LP communications, reporting, subscription document processing, and investor relations management.",
        capabilities: ["LP Comms", "Reporting", "IR", "Documentation"],
        avatarUrl: "/assets/generated_images/Professional_Bree_agent_avatar_c0a3af89.png",
        isRecommended: false,
        baseCostPerHour: "125.00"
      }
    ];
    
    for (const agent of sampleAgents) {
      await storage.createAgent(agent);
    }
    
    // Seed pricing models
    const samplePricingModels = [
      {
        name: "Individual",
        tier: "individual",
        seatPrice: "29.00",
        tokenRate: "0.015",
        description: "For small teams and individual users",
        isActive: true
      },
      {
        name: "Department", 
        tier: "department",
        seatPrice: "49.00",
        tokenRate: "0.01",
        description: "For department-level operations",
        isActive: true
      },
      {
        name: "Enterprise",
        tier: "enterprise", 
        seatPrice: "149.00",
        tokenRate: "0.005",
        description: "For large-scale enterprise deployments",
        isActive: true
      }
    ];
    
    for (const model of samplePricingModels) {
      await storage.createPricingModel(model);
    }
    
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

// Porpoise v2 Seed Data endpoint
router.post("/api/seed-porpoise", async (req, res) => {
  try {
    const result = await seedPorpoiseData();
    res.json(result);
  } catch (error) {
    console.error("Error seeding Porpoise data:", error);
    res.status(500).json({ error: "Failed to seed Porpoise data" });
  }
});

// Porpoise v2 Calculator endpoint
router.post("/api/porpoise/calculate", async (req, res) => {
  try {
    console.log('[PORPOISE_API] Received calculation request:', JSON.stringify(req.body, null, 2));
    
    const validation = porpoiseCalculationSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('[PORPOISE_API] Validation failed:', validation.error);
      return res.status(400).json({ error: "Invalid calculation data", details: validation.error });
    }
    
    console.log('[PORPOISE_API] Validation passed, calculating...');
    const result = await PorpoiseCalculator.calculate(validation.data);
    console.log('[PORPOISE_API] Calculation complete');
    res.json(result);
  } catch (error) {
    console.error("[PORPOISE_API] Error calculating costs:", error);
    res.status(500).json({ error: "Failed to calculate costs" });
  }
});

// Porpoise v2 Save Scenario endpoint
router.post("/api/porpoise/scenarios", async (req, res) => {
  try {
    const { name, description, formData, calculationResult } = req.body;
    
    const { calculatorScenarios } = await import("@shared/schema");
    
    // Prepare advanced options JSON
    const advancedOptions = {
      deploymentType: formData.deploymentType,
      ssoRequired: formData.ssoRequired,
      whiteLabelAvatars: formData.whiteLabelAvatars,
      description: description || ''
    };
    
    // Save to database (using calculator_scenarios table)
    const result = await db.insert(calculatorScenarios).values({
      scenarioName: name || `Scenario ${new Date().toLocaleDateString()}`,
      tierId: formData.tierId,
      billingPeriod: formData.billingPeriod,
      numUsers: formData.numUsers,
      concurrentJobs: formData.concurrentJobs || 0,
      storageGb: formData.storageGb.toString(),
      gpuHoursMonthly: formData.gpuHoursMonthly.toString(),
      apiCallsMonthly: formData.apiCallsMonthly,
      numAvatars: formData.numAvatars,
      advancedOptions: advancedOptions,
      monthlyCost: calculationResult.customerCosts.monthlyCost.toString(),
      annualCost: calculationResult.customerCosts.annualCost.toString(),
      monthlyCogs: calculationResult.cogs.totalMonthlyCogs.toString(),
      annualCogs: calculationResult.cogs.totalAnnualCogs.toString(),
      grossMarginPercent: calculationResult.margins.grossMarginPercent.toString()
    }).returning();
    
    const scenario = result[0];
    
    res.status(201).json({
      id: scenario.scenarioId,
      shareUrl: `/?scenario=${scenario.scenarioId}`,
      scenario: scenario
    });
  } catch (error) {
    console.error("[PORPOISE_API] Error saving scenario:", error);
    res.status(500).json({ error: "Failed to save scenario" });
  }
});

// Porpoise v2 Get Scenario endpoint
router.get("/api/porpoise/scenarios/:id", async (req, res) => {
  try {
    const { calculatorScenarios } = await import("@shared/schema");
    const scenarioId = parseInt(req.params.id);
    
    if (isNaN(scenarioId)) {
      return res.status(400).json({ error: "Invalid scenario ID" });
    }
    
    const scenario = await db.select().from(calculatorScenarios).where(eq(calculatorScenarios.scenarioId, scenarioId)).limit(1);
    
    if (!scenario || scenario.length === 0) {
      return res.status(404).json({ error: "Scenario not found" });
    }
    
    res.json(scenario[0]);
  } catch (error) {
    console.error("[PORPOISE_API] Error fetching scenario:", error);
    res.status(500).json({ error: "Failed to fetch scenario" });
  }
});

// Get Porpoise pricing tiers
router.get("/api/porpoise/tiers", async (req, res) => {
  try {
    const tiers = await db.select().from(pricingTiers).where(eq(pricingTiers.active, true));
    res.json(tiers);
  } catch (error) {
    console.error("Error fetching pricing tiers:", error);
    res.status(500).json({ error: "Failed to fetch pricing tiers" });
  }
});

// Get Porpoise competitors
router.get("/api/porpoise/competitors", async (req, res) => {
  try {
    const competitors = await db.select().from(competitorPricing).where(eq(competitorPricing.active, true));
    res.json(competitors);
  } catch (error) {
    console.error("Error fetching competitors:", error);
    res.status(500).json({ error: "Failed to fetch competitors" });
  }
});

// GitHub integration routes - ALL PROTECTED
router.get("/api/github/repositories", requireAuth, async (req, res) => {
  try {
    const repositories = await GitHubSync.getRepositories();
    res.json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

router.post("/api/github/create-repository", requireAuth, requireCSRF, async (req, res) => {
  try {
    const { name, isPrivate = true } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }
    
    const repoFullName = await GitHubSync.createRepository(name, isPrivate);
    res.json({ repoFullName, message: "Repository created successfully" });
  } catch (error: any) {
    console.error("Error creating repository:", error);
    res.status(500).json({ error: error.message || "Failed to create repository" });
  }
});

router.post("/api/github/sync-files", requireAuth, requireCSRF, async (req, res) => {
  try {
    const { repoName, branch = 'main' } = req.body;
    
    if (!repoName) {
      return res.status(400).json({ error: "Repository name is required" });
    }
    
    await GitHubSync.syncFilesToRepo(repoName, branch);
    res.json({ message: "Files synced successfully to GitHub repository" });
  } catch (error: any) {
    console.error("Error syncing files:", error);
    res.status(500).json({ error: error.message || "Failed to sync files" });
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all our API routes
  app.use(router);

  const httpServer = createServer(app);
  return httpServer;
}