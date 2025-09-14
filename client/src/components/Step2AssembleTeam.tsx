import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentCard from "./AgentCard";
import { useAgents } from "@/hooks/useAgents";

// Using real agents from the API instead of hardcoded data

interface Step2Props {
  onDataChange: (data: any) => void;
  presetData?: any;
}

export default function Step2AssembleTeam({ onDataChange, presetData }: Step2Props) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  // Load agents from API
  const { agents, domains, isLoading } = useAgents();
  
  const domainsWithAll = ["all", ...domains];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.capabilities && agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesDomain = selectedDomain === "all" || agent.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const handleAgentToggle = (agentId: string) => {
    const newSelection = selectedAgents.includes(agentId)
      ? selectedAgents.filter(id => id !== agentId)
      : [...selectedAgents, agentId];
    
    setSelectedAgents(newSelection);
    
    const selectedAgentData = agents.filter(agent => newSelection.includes(agent.id));
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
                    const agent = agents.find(a => a.id === agentId);
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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading agents...
            </div>
          ) : (
            <Tabs value={selectedDomain} onValueChange={setSelectedDomain}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {domainsWithAll.slice(0, 6).map(domain => (
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
                      capabilities={agent.capabilities || []}
                      avatarUrl={agent.avatarUrl || undefined}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}