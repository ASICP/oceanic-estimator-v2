import { useQuery } from '@tanstack/react-query';

export interface Workflow {
  id: string;
  title: string;
  domain: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  duration: string;
  isPreset: boolean;
  defaultAgentIds: string[] | null;
  costModel: string;
  savingsPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export function useWorkflows() {
  const { data: workflows, isLoading, error } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter preset workflows
  const presetWorkflows = workflows?.filter(workflow => workflow.isPreset) || [];
  
  // Group workflows by domain
  const workflowsByDomain = workflows?.reduce((acc, workflow) => {
    if (!acc[workflow.domain]) {
      acc[workflow.domain] = [];
    }
    acc[workflow.domain].push(workflow);
    return acc;
  }, {} as Record<string, Workflow[]>) || {};

  return {
    workflows: workflows || [],
    presetWorkflows,
    workflowsByDomain,
    isLoading,
    error
  };
}