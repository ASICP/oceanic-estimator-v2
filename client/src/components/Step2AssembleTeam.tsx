import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentCard from "./AgentCard";
import clayAvatar from '@assets/generated_images/Professional_Clay_agent_avatar_12ae85f9.png';
import finleyAvatar from '@assets/generated_images/Professional_Finley_agent_avatar_b19d0057.png';
import lexAvatar from '@assets/generated_images/Professional_Lex_agent_avatar_bcd47740.png';
import breeAvatar from '@assets/generated_images/Professional_Bree_agent_avatar_c0a3af89.png';

interface Agent {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  isRecommended?: boolean;
}

const AGENTS: Agent[] = [
  {
    id: "clay",
    name: "Clay",
    role: "Project Manager",
    domain: "Investment Ops",
    description: "Manages projects, sourcing, pipeline management, and diligence checklists with Harvard-level capabilities.",
    capabilities: ["Project Management", "Pipeline Mgmt", "Diligence", "Sourcing"],
    avatarUrl: clayAvatar,
    isRecommended: true
  },
  {
    id: "finley", 
    name: "Finley",
    role: "Financial Modeling",
    domain: "Investment Ops",
    description: "Deal qualification, financial modeling, and EBITDA analysis with advanced Harvard Business School graduate capabilities.",
    capabilities: ["Financial Modeling", "Deal Analysis", "EBITDA", "Valuation"],
    avatarUrl: finleyAvatar,
    isRecommended: true
  },
  {
    id: "lex",
    name: "Lex", 
    role: "Legal Specialist",
    domain: "Deal Execution",
    description: "Legal review, dataroom preparation, term sheet automation, and compliance management.",
    capabilities: ["Legal Review", "Compliance", "Term Sheets", "Due Diligence"],
    avatarUrl: lexAvatar,
    isRecommended: true
  },
  {
    id: "bree",
    name: "Bree",
    role: "Investor Relations", 
    domain: "Fund Admin & IR",
    description: "LP communications, reporting, subscription document processing, and investor relations management.",
    capabilities: ["LP Comms", "Reporting", "IR", "Documentation"],
    avatarUrl: breeAvatar
  },
  {
    id: "ava",
    name: "Ava",
    role: "AI Operations",
    domain: "Post-Close Value Creation", 
    description: "Implements Go-To-Market playbooks, platform integrations, and AI toolkits for portfolio optimization.",
    capabilities: ["AI Ops", "GTM", "Platform Integration", "Optimization"]
  },
  {
    id: "jax",
    name: "Jax",
    role: "Product Operations",
    domain: "Post-Close Value Creation",
    description: "Supports product operations and platform integrations for value creation initiatives.",
    capabilities: ["Product Ops", "Integration", "Value Creation", "Platform Dev"]
  },
  {
    id: "lyla",
    name: "Lyla", 
    role: "Outreach Specialist",
    domain: "Marketing & Origination",
    description: "Focuses on marketing and origination campaigns for LPs and founder leads.",
    capabilities: ["Outreach", "Marketing", "Lead Gen", "Campaign Mgmt"]
  },
  {
    id: "mia",
    name: "Mia",
    role: "MarTech Specialist",
    domain: "Marketing & Origination",
    description: "Manages marketing technology and event follow-up workflows.",
    capabilities: ["MarTech", "Event Mgmt", "Automation", "Analytics"]
  },
  {
    id: "kai",
    name: "Kai",
    role: "DevOps Engineer", 
    domain: "Back Office",
    description: "Handles DevOps tasks for implementing GTM playbooks and platform integrations.",
    capabilities: ["DevOps", "Infrastructure", "CI/CD", "Platform Mgmt"]
  },
  {
    id: "ivy",
    name: "Ivy",
    role: "Compliance Specialist",
    domain: "Deal Execution", 
    description: "Ensures compliance in deal execution and other operational activities.",
    capabilities: ["Compliance", "Risk Mgmt", "Regulatory", "Audit"]
  }
];

interface Step2Props {
  onDataChange: (data: any) => void;
  presetData?: any;
}

export default function Step2AssembleTeam({ onDataChange, presetData }: Step2Props) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  const domains = ["all", "Investment Ops", "Deal Execution", "Fund Admin & IR", "Post-Close Value Creation", "Marketing & Origination", "Back Office"];

  const filteredAgents = AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = selectedDomain === "all" || agent.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const handleAgentToggle = (agentId: string) => {
    const newSelection = selectedAgents.includes(agentId)
      ? selectedAgents.filter(id => id !== agentId)
      : [...selectedAgents, agentId];
    
    setSelectedAgents(newSelection);
    
    const selectedAgentData = AGENTS.filter(agent => newSelection.includes(agent.id));
    onDataChange({
      selectedAgents: selectedAgentData,
      agentCount: newSelection.length
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Assemble Your Agent Team</h2>
        <p className="text-muted-foreground">
          Select the AI agents best suited for your workflow requirements
        </p>
      </div>

      {/* Selection Summary */}
      {selectedAgents.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Selected Agents ({selectedAgents.length})</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAgents.map(agentId => {
                    const agent = AGENTS.find(a => a.id === agentId);
                    return agent ? (
                      <Badge key={agentId} variant="secondary">
                        {agent.name} - {agent.role}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Team Ready
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="agent-search">Search Agents</Label>
              <Input
                id="agent-search"
                placeholder="Search by name, role, or capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-agent-search"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Agent Selection by Domain */}
      <Card>
        <CardHeader>
          <CardTitle>Available Agents</CardTitle>
          <CardDescription>
            Choose from our specialized autonomous agents, each trained with capabilities comparable to top-tier business graduates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDomain} onValueChange={setSelectedDomain}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {domains.map(domain => (
                <TabsTrigger key={domain} value={domain} className="text-xs">
                  {domain === "all" ? "All" : domain.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedDomain} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    name={agent.name}
                    role={agent.role}
                    description={agent.description}
                    capabilities={agent.capabilities}
                    avatarUrl={agent.avatarUrl}
                    isSelected={selectedAgents.includes(agent.id)}
                    isRecommended={agent.isRecommended}
                    onSelect={() => handleAgentToggle(agent.id)}
                  />
                ))}
              </div>
              
              {filteredAgents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No agents found matching your criteria
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}