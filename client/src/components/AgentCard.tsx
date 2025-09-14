import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  isSelected?: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

export default function AgentCard({
  name,
  role,
  description,
  capabilities,
  avatarUrl,
  isSelected = false,
  isRecommended = false,
  onSelect
}: AgentCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover-elevate relative ${
        isSelected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={onSelect}
      data-testid={`card-agent-${name.toLowerCase()}`}
    >
      {isRecommended && (
        <Badge className="absolute -top-2 -right-2 bg-chart-3 text-white z-10">
          Recommended
        </Badge>
      )}
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{name}</h3>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Capabilities:</div>
          <div className="flex flex-wrap gap-1">
            {capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {capabilities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{capabilities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}