import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Percent, Calculator, TrendingDown } from "lucide-react";

interface Step4Props {
  onDataChange: (data: any) => void;
  agentCount: number;
  resourceCost: number;
}

export default function Step4PricingBilling({ onDataChange, agentCount = 3, resourceCost = 15000 }: Step4Props) {
  const [billingModel, setBillingModel] = useState("hybrid");
  const [tier, setTier] = useState("department");
  const [customTokenRate, setCustomTokenRate] = useState("0.01");
  const [customSeatPrice, setCustomSeatPrice] = useState("49");
  const [volumeDiscount, setVolumeDiscount] = useState(true);
  const [byoApiKeys, setByoApiKeys] = useState(false);
  const [taxRate, setTaxRate] = useState("8.5");
  const [margin, setMargin] = useState("20");

  // Pricing tiers
  const pricingTiers = {
    individual: { 
      name: "Individual", 
      seatPrice: 29, 
      tokenRate: 0.015, 
      description: "For small teams and individual users" 
    },
    department: { 
      name: "Department", 
      seatPrice: 49, 
      tokenRate: 0.01, 
      description: "For department-level operations" 
    },
    enterprise: { 
      name: "Enterprise", 
      seatPrice: 149, 
      tokenRate: 0.005, 
      description: "For large-scale enterprise deployments" 
    }
  };

  // Calculate costs based on billing model and settings
  const calculateCosts = () => {
    const currentTier = pricingTiers[tier as keyof typeof pricingTiers];
    let baseCost = 0;

    switch (billingModel) {
      case "pay-per-use":
        baseCost = resourceCost * (byoApiKeys ? 0.7 : 1.0);
        break;
      case "subscription":
        baseCost = currentTier.seatPrice * agentCount * 12; // Annual
        break;
      case "hybrid":
        const seatCosts = currentTier.seatPrice * agentCount * 12;
        const tokenCosts = resourceCost * currentTier.tokenRate;
        baseCost = seatCosts + tokenCosts;
        break;
      case "custom":
        const customSeatCosts = parseFloat(customSeatPrice) * agentCount * 12;
        const customTokenCosts = resourceCost * parseFloat(customTokenRate);
        baseCost = customSeatCosts + customTokenCosts;
        break;
    }

    // Apply volume discount
    if (volumeDiscount && agentCount >= 5) {
      baseCost *= 0.9; // 10% discount
    }

    // Apply taxes and margin
    const taxAmount = baseCost * (parseFloat(taxRate) / 100);
    const marginAmount = baseCost * (parseFloat(margin) / 100);
    const totalCost = baseCost + taxAmount + marginAmount;

    return {
      baseCost: Math.floor(baseCost),
      taxAmount: Math.floor(taxAmount),
      marginAmount: Math.floor(marginAmount),
      totalCost: Math.floor(totalCost),
      savings: byoApiKeys ? Math.floor(baseCost * 0.3) : 0
    };
  };

  const costs = calculateCosts();

  useEffect(() => {
    const data = {
      billingModel,
      tier,
      agentCount,
      costs,
      volumeDiscount,
      byoApiKeys,
      taxRate: parseFloat(taxRate),
      margin: parseFloat(margin)
    };
    onDataChange(data);
  }, [billingModel, tier, agentCount, customTokenRate, customSeatPrice, volumeDiscount, byoApiKeys, taxRate, margin, costs, onDataChange]);

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
                <div className="text-lg font-bold text-primary">
                  ${(resourceCost * (byoApiKeys ? 0.7 : 1.0)).toLocaleString()} total
                </div>
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
                    {Object.entries(pricingTiers).map(([key, tierData]) => (
                      <SelectItem key={key} value={key}>
                        {tierData.name} - ${tierData.seatPrice}/seat/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {pricingTiers[tier as keyof typeof pricingTiers].name} Plan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pricingTiers[tier as keyof typeof pricingTiers].description}
                  </p>
                  <div className="text-lg font-bold text-primary">
                    ${(pricingTiers[tier as keyof typeof pricingTiers].seatPrice * agentCount * 12).toLocaleString()} annually
                  </div>
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
                    {Object.entries(pricingTiers).map(([key, tierData]) => (
                      <SelectItem key={key} value={key}>
                        {tierData.name} - ${tierData.seatPrice}/seat + ${tierData.tokenRate}/1K tokens
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Hybrid Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Seat costs ({agentCount} agents):</span>
                      <span>${(pricingTiers[tier as keyof typeof pricingTiers].seatPrice * agentCount * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Token usage:</span>
                      <span>${(resourceCost * pricingTiers[tier as keyof typeof pricingTiers].tokenRate).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 font-bold text-primary">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>${costs.baseCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
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
            Cost Summary
          </CardTitle>
          <CardDescription>
            Final pricing breakdown with all adjustments applied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Base Cost:</span>
              <span>${costs.baseCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>${costs.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Margin ({margin}%):</span>
              <span>${costs.marginAmount.toLocaleString()}</span>
            </div>
            {costs.savings > 0 && (
              <div className="flex justify-between text-sm text-chart-3">
                <span>BYO Keys Savings:</span>
                <span>-${costs.savings.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total Cost:</span>
                <span>${costs.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}