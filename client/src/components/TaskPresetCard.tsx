import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, TrendingUp } from "lucide-react";

interface TaskPresetCardProps {
  title: string;
  domain: string;
  description: string;
  duration: string;
  complexity: "Low" | "Medium" | "High";
  defaultAgents: string[];
  costModel: string;
  savings: string;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function TaskPresetCard({
  title,
  domain,
  description,
  duration,
  complexity,
  defaultAgents,
  costModel,
  savings,
  isSelected = false,
  onSelect
}: TaskPresetCardProps) {
  const complexityColor = {
    Low: "bg-chart-3 text-white",
    Medium: "bg-chart-4 text-white", 
    High: "bg-chart-1 text-white"
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover-elevate ${
        isSelected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={onSelect}
      data-testid={`card-preset-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{domain}</CardDescription>
          </div>
          <Badge className={complexityColor[complexity]}>
            {complexity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-chart-3" />
            <span className="text-chart-3 font-medium">{savings} savings</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Default Agents:</div>
          <div className="flex flex-wrap gap-1">
            {defaultAgents.slice(0, 3).map((agent, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {agent}
              </Badge>
            ))}
            {defaultAgents.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{defaultAgents.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>{costModel}</span>
          </div>
          <Button 
            size="sm" 
            variant={isSelected ? "default" : "outline"}
            data-testid={`button-select-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}