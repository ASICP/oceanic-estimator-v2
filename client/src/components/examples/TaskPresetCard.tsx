import TaskPresetCard from '../TaskPresetCard';
import { useState } from 'react';

export default function TaskPresetCardExample() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelect = (title: string) => {
    setSelectedPreset(title);
    console.log(`Selected preset: ${title}`);
  };

  return (
    <div className="p-6 space-y-4">
      <TaskPresetCard
        title="Deal Sourcing"
        domain="Investment Ops"
        description="Autonomous sourcing & pipeline mgmt for roll-ups/SaaS targets."
        duration="4-8 hrs"
        complexity="Medium"
        defaultAgents={["Clay (PM)", "Lyla (Outreach)", "Gemma (CTO)"]}
        costModel="Token + seat ($49/month + $0.01/1K)"
        savings="65%"
        isSelected={selectedPreset === "Deal Sourcing"}
        onSelect={() => handleSelect("Deal Sourcing")}
      />
      
      <TaskPresetCard
        title="Financial Modeling"
        domain="Investment Ops"
        description="Qualify deals, build models for EBITDA analysis."
        duration="6-12 hrs"
        complexity="High"
        defaultAgents={["Finley (Modeling)", "Clay (PM)", "FinanceBot"]}
        costModel="Hybrid ($149/dept + tokens)"
        savings="70%"
        isSelected={selectedPreset === "Financial Modeling"}
        onSelect={() => handleSelect("Financial Modeling")}
      />
    </div>
  );
}