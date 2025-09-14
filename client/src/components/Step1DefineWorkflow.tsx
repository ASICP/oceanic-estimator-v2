import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TaskPresetCard from "./TaskPresetCard";
import { useWorkflows } from "@/hooks/useWorkflows";

// Use real workflows from the API instead of hardcoded data

interface Step1Props {
  onDataChange: (data: any) => void;
}

export default function Step1DefineWorkflow({ onDataChange }: Step1Props) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customComplexity, setCustomComplexity] = useState([5]);
  const [customDuration, setCustomDuration] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  
  // Load workflows from API
  const { presetWorkflows, isLoading } = useWorkflows();

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presetWorkflows.find(p => p.id === presetId);
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
    if (taskCategory && customDuration) {
      onDataChange({
        selectedPreset: null,
        customComplexity: customComplexity[0],
        customDuration: customDuration,
        customCategory: taskCategory
      });
    }
  };

  // Call handleCustomChange when custom fields change, but only if no preset is selected
  useEffect(() => {
    if (!selectedPreset && (taskCategory || customDuration)) {
      handleCustomChange();
    }
  }, [customComplexity, customDuration, taskCategory, selectedPreset]);

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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading workflows...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetWorkflows.map((preset) => (
                <TaskPresetCard
                  key={preset.id}
                  title={preset.title}
                  domain={preset.domain}
                  description={preset.description}
                  duration={preset.duration}
                  complexity={preset.complexity}
                  defaultAgents={preset.defaultAgentIds || []}
                  costModel={preset.costModel}
                  savings={`${preset.savingsPercentage}%`}
                  isSelected={selectedPreset === preset.id}
                  onSelect={() => handlePresetSelect(preset.id)}
                />
              ))}
            </div>
          )}
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