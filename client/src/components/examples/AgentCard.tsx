import AgentCard from '../AgentCard';
import { useState } from 'react';
import clayAvatar from '@assets/generated_images/Professional_Clay_agent_avatar_12ae85f9.png';
import finleyAvatar from '@assets/generated_images/Professional_Finley_agent_avatar_b19d0057.png';

export default function AgentCardExample() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const handleSelect = (agentName: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentName) 
        ? prev.filter(name => name !== agentName)
        : [...prev, agentName]
    );
    console.log(`Toggled agent: ${agentName}`);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AgentCard
        name="Clay"
        role="Project Manager"
        description="Manages projects, sourcing, pipeline management, and diligence checklists with Harvard-level capabilities."
        capabilities={["Project Management", "Pipeline Mgmt", "Diligence", "Sourcing"]}
        avatarUrl={clayAvatar}
        isSelected={selectedAgents.includes("Clay")}
        isRecommended={true}
        onSelect={() => handleSelect("Clay")}
      />
      
      <AgentCard
        name="Finley"
        role="Financial Modeling"
        description="Deal qualification, financial modeling, and EBITDA analysis with advanced Harvard Business School graduate capabilities."
        capabilities={["Financial Modeling", "Deal Analysis", "EBITDA", "Valuation"]}
        avatarUrl={finleyAvatar}
        isSelected={selectedAgents.includes("Finley")}
        onSelect={() => handleSelect("Finley")}
      />

      <AgentCard
        name="Lex"
        role="Legal Specialist"
        description="Legal review, dataroom preparation, term sheet automation, and compliance management."
        capabilities={["Legal Review", "Compliance", "Term Sheets", "Due Diligence"]}
        isSelected={selectedAgents.includes("Lex")}
        onSelect={() => handleSelect("Lex")}
      />
    </div>
  );
}