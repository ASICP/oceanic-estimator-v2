import { useQuery } from '@tanstack/react-query';

export interface Agent {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  capabilities: string[] | null;
  avatarUrl: string | null;
  isRecommended: boolean;
  baseCostPerHour: string | null;
  createdAt: string;
}

export function useAgents(domain?: string) {
  const { data: agents, isLoading, error } = useQuery<Agent[]>({
    queryKey: domain ? ['/api/agents', { domain }] : ['/api/agents'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Group agents by domain
  const agentsByDomain = agents?.reduce((acc, agent) => {
    if (!acc[agent.domain]) {
      acc[agent.domain] = [];
    }
    acc[agent.domain].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>) || {};

  // Get recommended agents
  const recommendedAgents = agents?.filter(agent => agent.isRecommended) || [];

  // Get unique domains
  const domains = Array.from(new Set(agents?.map(agent => agent.domain) || []));

  return {
    agents: agents || [],
    agentsByDomain,
    recommendedAgents,
    domains,
    isLoading,
    error
  };
}