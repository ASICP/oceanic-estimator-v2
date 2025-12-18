import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

// Types for cost estimation workflow
export interface WorkflowData {
  selectedPreset?: any;
  complexity?: string;
  duration?: string;
  category?: string;
}

export interface AgentData {
  selectedAgents: any[];
  agentCount: number;
}

export interface ResourceData {
  apiCalls: number;
  dataTransfer: number;
  errorRate: number;
  batchSize: number;
  autoScale: boolean;
  multiModel: boolean;
  modelProvider: string;
  estimatedCost: number;
}

export interface PricingData {
  billingModel: string;
  tier: string;
  agentCount: number;
  costs: any;
  volumeDiscount: boolean;
  byoApiKeys: boolean;
  taxRate: number;
  margin: number;
}

export interface CostCalculationInput {
  workflow: {
    complexity: "Low" | "Medium" | "High";
    duration: string;
    domain: string;
    presetId?: string;
  };
  agents: Array<{
    id: string;
    name: string;
    role: string;
    baseCostPerHour?: string;
    domain: string;
  }>;
  resources: {
    apiCalls: number;
    dataTransfer: number;
    errorRate: number;
    batchSize: number;
    modelProvider: string;
    autoScale: boolean;
    multiModel: boolean;
  };
  billing: {
    model: "pay-per-use" | "subscription" | "hybrid" | "custom";
    tier: "individual" | "department" | "enterprise";
    volumeDiscount: boolean;
    byoApiKeys: boolean;
    taxRate: number;
    margin: number;
  };
}

export interface EstimationState {
  step1?: WorkflowData;
  step2?: AgentData;
  step3?: ResourceData;
  step4?: PricingData;
}

export function useCostEstimation() {
  const [estimationData, setEstimationData] = useState<EstimationState>({});

  // Fetch workflows (presets)
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['/api/workflows'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch agents
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Cost calculation mutation
  const calculateCostsMutation = useMutation({
    mutationFn: async (input: CostCalculationInput) => {
      const response = await apiRequest('POST', '/api/calculate-costs', input);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Cost calculation successful:', data);
    },
    onError: (error) => {
      console.error('Cost calculation failed:', error);
    }
  });

  // Save cost estimate mutation
  const saveEstimateMutation = useMutation({
    mutationFn: async (estimateData: any) => {
      const response = await apiRequest('POST', '/api/cost-estimates', estimateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cost-estimates'] });
    }
  });

  // Update estimation data for a specific step
  const updateStepData = useCallback((step: number, data: any) => {
    setEstimationData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));
  }, []);

  // Build cost calculation input from current state
  const buildCalculationInput = useCallback((): CostCalculationInput | null => {
    const { step1, step2, step3, step4 } = estimationData;
    
    if (!step1 || !step2 || !step3 || !step4) {
      return null;
    }

    return {
      workflow: {
        complexity: (step1.selectedPreset?.complexity || step1.complexity || "Medium") as "Low" | "Medium" | "High",
        duration: step1.selectedPreset?.duration || step1.duration || "4-8 hrs",
        domain: step1.selectedPreset?.domain || step1.category || "Investment Ops",
        presetId: step1.selectedPreset?.id
      },
      agents: step2.selectedAgents?.map(agent => ({
        id: agent.id,
        name: agent.name,
        role: agent.role,
        baseCostPerHour: agent.baseCostPerHour,
        domain: agent.domain
      })) || [],
      resources: {
        apiCalls: step3.apiCalls,
        dataTransfer: step3.dataTransfer,
        errorRate: step3.errorRate,
        batchSize: step3.batchSize,
        modelProvider: step3.modelProvider,
        autoScale: step3.autoScale,
        multiModel: step3.multiModel
      },
      billing: {
        model: step4.billingModel as "pay-per-use" | "subscription" | "hybrid" | "custom",
        tier: step4.tier as "individual" | "department" | "enterprise",
        volumeDiscount: step4.volumeDiscount,
        byoApiKeys: step4.byoApiKeys,
        taxRate: step4.taxRate,
        margin: step4.margin
      }
    };
  }, [estimationData]);

  // Calculate costs based on current data
  const calculateCosts = useCallback(async () => {
    const input = buildCalculationInput();
    if (!input) {
      throw new Error('Insufficient data for cost calculation');
    }
    
    return await calculateCostsMutation.mutateAsync(input);
  }, [buildCalculationInput, calculateCostsMutation]);

  // Save complete estimation
  const saveEstimation = useCallback(async (title: string, costResult: any) => {
    const input = buildCalculationInput();
    if (!input) {
      throw new Error('Insufficient data to save estimation');
    }

    const estimateData = {
      title,
      workflowId: input.workflow.presetId || null,
      selectedWorkflow: estimationData.step1?.selectedPreset || null,
      customComplexity: input.workflow.complexity === "Medium" ? null : 
                       input.workflow.complexity === "Low" ? 1 : 3,
      customDuration: estimationData.step1?.duration || null,
      customCategory: estimationData.step1?.category || null,
      selectedAgents: input.agents,
      agentCount: input.agents.length,
      apiCalls: input.resources.apiCalls,
      dataTransfer: input.resources.dataTransfer,
      errorRate: input.resources.errorRate,
      batchSize: input.resources.batchSize,
      autoScale: input.resources.autoScale,
      multiModel: input.resources.multiModel,
      modelProvider: input.resources.modelProvider,
      billingModel: input.billing.model,
      tier: input.billing.tier,
      volumeDiscount: input.billing.volumeDiscount,
      byoApiKeys: input.billing.byoApiKeys,
      taxRate: input.billing.taxRate.toString(),
      margin: input.billing.margin.toString(),
      totalCost: costResult.totalCost.toString(),
      traditionalCost: costResult.traditionalCost.toString(),
      savingsAmount: costResult.savings.toString(),
      savingsPercentage: costResult.savingsPercentage.toString(),
      costBreakdown: costResult.breakdown,
      isCompleted: true
    };

    return await saveEstimateMutation.mutateAsync(estimateData);
  }, [buildCalculationInput, estimationData, saveEstimateMutation]);

  return {
    // Data
    estimationData,
    workflows,
    agents,
    
    // Loading states
    workflowsLoading,
    agentsLoading,
    isCalculating: calculateCostsMutation.isPending,
    isSaving: saveEstimateMutation.isPending,
    
    // Actions
    updateStepData,
    calculateCosts,
    saveEstimation,
    buildCalculationInput,
    
    // Computed state
    canCalculate: buildCalculationInput() !== null,
    
    // Mutation objects for error handling
    calculateCostsMutation,
    saveEstimateMutation
  };
}