import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Percent, Calculator, TrendingDown, Users } from "lucide-react";

interface Step4Props {
  onDataChange: (data: any) => void;
  wizardData: any; // Complete wizard data to build cost calculation input
}

export default function Step4PricingBilling({ onDataChange, wizardData }: Step4Props) {
  const [billingModel, setBillingModel] = useState("hybrid");
  const [tier, setTier] = useState("department");
  const [customTokenRate, setCustomTokenRate] = useState("0.01");
  const [customSeatPrice, setCustomSeatPrice] = useState("49");
  const [volumeDiscount, setVolumeDiscount] = useState(true);
  const [byoApiKeys, setByoApiKeys] = useState(false);
  const [taxRate, setTaxRate] = useState("8.5");
  const [margin, setMargin] = useState("20");

  // Extract data from wizard for calculations
  const agentCount = wizardData?.step2?.agentCount || 3;

  // Tier information (labels only - pricing comes from backend)
  const tierInfo = {
    individual: { 
      name: "Individual", 
      description: "For small teams and individual users" 
    },
    department: { 
      name: "Department", 
      description: "For department-level operations" 
    },
    enterprise: { 
      name: "Enterprise", 
      description: "For large-scale enterprise deployments" 
    }
  };

  // Transform wizard data into the format expected by the cost calculation API
  const getCostCalculationInput = () => {
    // Transform selected agents to ensure they have all required fields
    const selectedAgents = wizardData?.step2?.selectedAgents || [];
    const transformedAgents = selectedAgents.map((agent: any) => {
      // If agent is already a full object with required fields, use it as is
      if (agent && typeof agent === 'object' && agent.id && agent.name && agent.role && agent.domain) {
        const result: any = {
          id: agent.id,
          name: agent.name,
          role: agent.role,
          domain: agent.domain
        };
        // Only include baseCostPerHour if it exists - let backend use its default
        if (agent.baseCostPerHour) {
          result.baseCostPerHour = agent.baseCostPerHour;
        }
        return result;
      }
      
      // Fallback for string agents - create minimal object, let backend handle pricing
      return {
        id: typeof agent === 'string' ? agent : 'agent',
        name: typeof agent === 'string' ? agent : 'Agent',
        role: "General Agent",
        domain: "General"
      };
    });

    return {
      workflow: {
        complexity: wizardData?.step1?.complexity || "Medium",
        duration: wizardData?.step1?.selectedPreset?.estimatedTime || "4-8 hrs",
        domain: wizardData?.step1?.selectedPreset?.category || "General",
        presetId: wizardData?.step1?.selectedPreset?.id
      },
      agents: transformedAgents,
      resources: {
        apiCalls: wizardData?.step3?.apiCalls || 10000,
        dataTransfer: wizardData?.step3?.dataTransfer || 100,
        errorRate: wizardData?.step3?.errorRate || 2,
        batchSize: wizardData?.step3?.batchSize || 50,
        modelProvider: wizardData?.step3?.modelProvider || "openai",
        autoScale: wizardData?.step3?.autoScale || true,
        multiModel: wizardData?.step3?.multiModel || true
      },
      billing: {
        model: billingModel,
        tier: tier,
        volumeDiscount: volumeDiscount,
        byoApiKeys: byoApiKeys,
        taxRate: parseFloat(taxRate),
        margin: parseFloat(margin)
      }
    };
  };

  // Fetch real cost calculation from the API
  const { data: costCalculationResult, isLoading: isCalculating, error: calculationError } = useQuery({
    queryKey: ['cost-calculation-step4', billingModel, tier, volumeDiscount, byoApiKeys, taxRate, margin, wizardData],
    queryFn: async () => {
      const input = getCostCalculationInput();
      console.log('[Step4] Sending cost calculation request:', input);
      const response = await apiRequest('POST', '/api/calculate-costs', input);
      const result = await response.json();
      console.log('[Step4] Cost calculation result:', result);
      return result;
    },
    enabled: !!(wizardData?.step1 && wizardData?.step2),
    refetchOnWindowFocus: false
  });

  // Use the real calculation result or provide fallback
  const costData = costCalculationResult || {
    totalCost: 0,
    traditionalCost: 0,
    agentCost: 0,
    apiCost: 0,
    infrastructureCost: 0,
    dataCost: 0,
    baseCost: 0,
    taxAmount: 0,
    marginAmount: 0,
    breakdown: [],
    savings: 0,
    savingsPercentage: 0
  };

  useEffect(() => {
    const data = {
      billingModel,
      tier,
      agentCount,
      costs: costData,
      volumeDiscount,
      byoApiKeys,
      taxRate: parseFloat(taxRate),
      margin: parseFloat(margin)
    };
    onDataChange(data);
  }, [billingModel, tier, agentCount, customTokenRate, customSeatPrice, volumeDiscount, byoApiKeys, taxRate, margin, costData, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Set Pricing & Billing</h2>
        <p className="text-muted-foreground">
          Configure your billing preferences and review cost structure
        </p>
      </div>

      {/* Billing Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Model</CardTitle>
          <CardDescription>
            Choose the billing approach that best fits your usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={billingModel} onValueChange={setBillingModel}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pay-per-use">Pay-per-use</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pay-per-use" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Pay-per-use Pricing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Pay only for the resources you consume, ideal for sporadic or variable workloads.
                </p>
                {isCalculating ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Agent execution costs:</span>
                        <span>${costData.agentCost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API & resource costs:</span>
                        <span>${((costData.apiCost || 0) + (costData.dataCost || 0) + (costData.infrastructureCost || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary border-t pt-2">
                      Total: ${costData.totalCost?.toLocaleString() || '0'}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4">
              <div className="space-y-3">
                <Label>Subscription Tier</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger data-testid="select-subscription-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tierInfo).map(([key, tierData]) => (
                      <SelectItem key={key} value={key}>
                        {tierData.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {tierInfo[tier as keyof typeof tierInfo].name} Plan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tierInfo[tier as keyof typeof tierInfo].description}
                  </p>
                  {isCalculating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Base subscription ({agentCount} agents):</span>
                          <span>${(costData.baseCost || costData.agentCost || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Infrastructure & support:</span>
                          <span>${(costData.infrastructureCost || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary border-t pt-2">
                        Total: ${costData.totalCost?.toLocaleString() || '0'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hybrid" className="space-y-4">
              <div className="space-y-3">
                <Label>Hybrid Tier</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger data-testid="select-hybrid-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tierInfo).map(([key, tierData]) => (
                      <SelectItem key={key} value={key}>
                        {tierData.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Hybrid Pricing Breakdown</h4>
                  {isCalculating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Agent costs ({agentCount} agents):</span>
                        <span>${costData.agentCost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API & token usage:</span>
                        <span>${((costData.apiCost || 0) + (costData.dataCost || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Infrastructure:</span>
                        <span>${costData.infrastructureCost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="border-t pt-2 font-bold text-primary">
                        <div className="flex justify-between">
                          <span>Base Total:</span>
                          <span>${costData.baseCost?.toLocaleString() || costData.totalCost?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-seat-price">Custom Seat Price ($/month)</Label>
                  <Input
                    id="custom-seat-price"
                    type="number"
                    value={customSeatPrice}
                    onChange={(e) => setCustomSeatPrice(e.target.value)}
                    data-testid="input-custom-seat-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-token-rate">Token Rate ($/1K tokens)</Label>
                  <Input
                    id="custom-token-rate"
                    type="number"
                    step="0.001"
                    value={customTokenRate}
                    onChange={(e) => setCustomTokenRate(e.target.value)}
                    data-testid="input-custom-token-rate"
                  />
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Custom Pricing Estimate</h4>
                {isCalculating ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Backend calculated total:</span>
                        <span>${costData.totalCost?.toLocaleString() || '0'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Custom rates will be applied during finalization
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Discounts and Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle>Discounts & Adjustments</CardTitle>
          <CardDescription>
            Apply volume discounts and cost optimizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Volume Discount</Label>
              <p className="text-sm text-muted-foreground">10% off for 5+ agents</p>
            </div>
            <div className="flex items-center gap-2">
              {agentCount >= 5 && volumeDiscount && (
                <Badge className="bg-chart-3 text-white">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  10% Off
                </Badge>
              )}
              <Switch 
                checked={volumeDiscount} 
                onCheckedChange={setVolumeDiscount}
                disabled={agentCount < 5}
                data-testid="switch-volume-discount"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Bring Your Own API Keys</Label>
              <p className="text-sm text-muted-foreground">30% markup reduction</p>
            </div>
            <div className="flex items-center gap-2">
              {byoApiKeys && (
                <Badge className="bg-chart-3 text-white">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  30% Off
                </Badge>
              )}
              <Switch 
                checked={byoApiKeys} 
                onCheckedChange={setByoApiKeys}
                data-testid="switch-byo-keys"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                data-testid="input-tax-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Service Margin (%)</Label>
              <Input
                id="margin"
                type="number"
                step="0.1"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                data-testid="input-margin"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost for Agents
          </CardTitle>
          <CardDescription>
            Technical cost breakdown showing agent costs and implementation expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isCalculating ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Agent Costs ({agentCount} agents):
                  </span>
                  <span>${costData.agentCost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground ml-6">
                  <span>Per agent average:</span>
                  <span>${Math.floor((costData.agentCost || 0) / Math.max(agentCount, 1)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API & Data Costs:</span>
                  <span>${((costData.apiCost || 0) + (costData.dataCost || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Infrastructure Costs:</span>
                  <span>${costData.infrastructureCost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>${costData.taxAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Margin ({margin}%):</span>
                  <span>${costData.marginAmount?.toLocaleString() || '0'}</span>
                </div>
                {costData.savings > 0 && (
                  <div className="flex justify-between text-sm text-chart-3">
                    <span>Total Savings Applied:</span>
                    <span>-${costData.savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total Project Cost:</span>
                    <span>${costData.totalCost?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}