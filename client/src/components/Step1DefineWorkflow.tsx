import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TaskPresetCard from "./TaskPresetCard";

interface TaskPreset {
  id: string;
  title: string;
  domain: string;
  description: string;
  duration: string;
  complexity: "Low" | "Medium" | "High";
  defaultAgents: string[];
  costModel: string;
  savings: string;
}

const TASK_PRESETS: TaskPreset[] = [
  {
    id: "deal-sourcing",
    title: "Deal Sourcing",
    domain: "Investment Ops",
    description: "Autonomous sourcing & pipeline mgmt for roll-ups/SaaS targets.",
    duration: "4-8 hrs",
    complexity: "Medium",
    defaultAgents: ["Clay (PM)", "Lyla (Outreach)", "Gemma (CTO)"],
    costModel: "Token + seat ($49/month + $0.01/1K)",
    savings: "65%"
  },
  {
    id: "financial-modeling",
    title: "Financial Modeling", 
    domain: "Investment Ops",
    description: "Qualify deals, build models for EBITDA analysis.",
    duration: "6-12 hrs",
    complexity: "High",
    defaultAgents: ["Finley (Modeling)", "Clay (PM)", "FinanceBot"],
    costModel: "Hybrid ($149/dept + tokens)",
    savings: "70%"
  },
  {
    id: "legal-review",
    title: "Legal Review",
    domain: "Deal Execution", 
    description: "Dataroom prep, term sheets, redlines.",
    duration: "3-6 hrs",
    complexity: "Medium",
    defaultAgents: ["Lex (Legal)", "Ivy (Compliance)", "Bree (IR)"],
    costModel: "Pay-per-use ($0.005/1K via Groq)",
    savings: "60%"
  },
  {
    id: "investor-relations",
    title: "Investor Relations",
    domain: "Fund Admin & IR",
    description: "LP comms, reporting, subscription docs.",
    duration: "2-4 hrs", 
    complexity: "Low",
    defaultAgents: ["Bree (IR)", "Pax (FundOps)", "Mia (MarTech)"],
    costModel: "Subscription ($29/seat)",
    savings: "75%"
  },
  {
    id: "gtm-implementation",
    title: "GTM Playbook Implementation",
    domain: "Post-Close Value Creation",
    description: "Post-acq. GTM, integrations for staffing/SaaS.",
    duration: "8-16 hrs",
    complexity: "High", 
    defaultAgents: ["Ava (AI Ops)", "Jax (Product)", "Kai (DevOps)"],
    costModel: "Enterprise ($999 + unlimited)",
    savings: "68%"
  },
  {
    id: "portfolio-optimization",
    title: "Portfolio Optimization",
    domain: "Post-Close Value Creation",
    description: "Real-time monitoring, synergy ID across holdings.",
    duration: "4-10 hrs",
    complexity: "Medium",
    defaultAgents: ["Ava (AI Ops)", "Finley (Modeling)", "Chibs (DevOps)"],
    costModel: "Token pool ($299/dept)",
    savings: "70%"
  },
  {
    id: "marketing-campaign",
    title: "Marketing Campaign", 
    domain: "Marketing & Origination",
    description: "LP/founder outreach, event follow-up.",
    duration: "2-5 hrs",
    complexity: "Low",
    defaultAgents: ["Lyla (Outreach)", "Mia (MarTech)", "Happy (QA)"],
    costModel: "Pay-per-use + 10% discount",
    savings: "62%"
  },
  {
    id: "back-office-ops",
    title: "Back Office Ops",
    domain: "Back Office",
    description: "Infrastructure monitoring, financial ops, QA.",
    duration: "1-3 hrs",
    complexity: "Low", 
    defaultAgents: ["Chibs (DevOps)", "Happy (QA)", "FinanceBot"],
    costModel: "Flat ($99/month)",
    savings: "80%"
  }
];

interface Step1Props {
  onDataChange: (data: any) => void;
}

export default function Step1DefineWorkflow({ onDataChange }: Step1Props) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customComplexity, setCustomComplexity] = useState([5]);
  const [customDuration, setCustomDuration] = useState("");
  const [taskCategory, setTaskCategory] = useState("");

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = TASK_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onDataChange({
        selectedPreset: preset,
        complexity: preset.complexity,
        duration: preset.duration,
        category: preset.domain
      });
    }
  };

  const handleCustomChange = () => {
    onDataChange({
      selectedPreset: null,
      complexity: customComplexity[0],
      duration: customDuration,
      category: taskCategory
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Define Your Workflow</h2>
        <p className="text-muted-foreground">
          Choose a preset workflow or customize your own task requirements
        </p>
      </div>

      {/* Preset Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Workflows</CardTitle>
          <CardDescription>
            Select from our predefined workflows covering 80% of investment operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASK_PRESETS.map((preset) => (
              <TaskPresetCard
                key={preset.id}
                title={preset.title}
                domain={preset.domain}
                description={preset.description}
                duration={preset.duration}
                complexity={preset.complexity}
                defaultAgents={preset.defaultAgents}
                costModel={preset.costModel}
                savings={preset.savings}
                isSelected={selectedPreset === preset.id}
                onSelect={() => handlePresetSelect(preset.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Workflow</CardTitle>
          <CardDescription>
            Configure a custom workflow if none of the presets match your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="task-category">Task Category</Label>
              <Select value={taskCategory} onValueChange={setTaskCategory}>
                <SelectTrigger data-testid="select-task-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment-ops">Investment Ops</SelectItem>
                  <SelectItem value="deal-execution">Deal Execution</SelectItem>
                  <SelectItem value="fund-admin">Fund Admin & IR</SelectItem>
                  <SelectItem value="value-creation">Post-Close Value Creation</SelectItem>
                  <SelectItem value="marketing">Marketing & Origination</SelectItem>
                  <SelectItem value="back-office">Back Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Expected Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 4-8 hours, 2-3 days"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                data-testid="input-duration"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Task Complexity (1-10)</Label>
            <Slider
              value={customComplexity}
              onValueChange={setCustomComplexity}
              max={10}
              step={1}
              className="w-full"
              data-testid="slider-complexity"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Simple</span>
              <span className="font-medium">Current: {customComplexity[0]}</span>
              <span>Complex</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}