import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertWorkflowSchema,
  insertAgentSchema, 
  insertCostEstimateSchema,
  insertCostBreakdownItemSchema,
  insertPricingModelSchema
} from "@shared/schema";
import { CostCalculator, costCalculationSchema } from "./costCalculator";

const router = Router();

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
    const validation = costCalculationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid calculation data", details: validation.error });
    }
    
    const result = CostCalculator.calculate(validation.data);
    res.json(result);
  } catch (error) {
    console.error("Error calculating costs:", error);
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all our API routes
  app.use(router);

  const httpServer = createServer(app);
  return httpServer;
}