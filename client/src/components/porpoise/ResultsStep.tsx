import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Building2
} from "lucide-react";
import type { PorpoiseFormData } from "@/pages/PorpoiseCalculatorPage";

interface ResultsStepProps {
  formData: PorpoiseFormData;
  viewMode: 'client' | 'internal';
}

interface CalculationResult {
  tierPricing: {
    tierId: string;
    tierName: string;
    baseMonthlyCost: number;
    baseAnnualCost: number;
    billingPeriod: string;
    discount: number;
  };
  usageCosts: {
    gpuCost: number;
    storageCost: number;
    apiCallsCost: number;
    avatarCost: number;
    totalUsageCost: number;
  };
  customerCosts: {
    monthlyCost: number;
    annualCost: number;
    effectiveMonthlyCost: number;
  };
  cogs: {
    infrastructureCost: number;
    avatarCost: number;
    twilioCost: number;
    supportCost: number;
    totalMonthlyCogs: number;
    totalAnnualCogs: number;
  };
  margins: {
    grossMarginPercent: number;
    monthlyGrossProfit: number;
    annualGrossProfit: number;
    targetMarginRange: { min: number; max: number };
    marginStatus: 'below_target' | 'in_target' | 'above_target';
  };
  competitors: Array<{
    competitorKey: string;
    competitorName: string;
    annualCost: number;
    savings: number;
    savingsPercent: number;
  }>;
}

export default function ResultsStep({ formData, viewMode }: ResultsStepProps) {
  // Create stable queryKey by serializing formData
  const formDataKey = JSON.stringify(formData);
  
  const { data: result, isLoading, error } = useQuery<CalculationResult>({
    queryKey: ['porpoise-calculate', formDataKey],
    queryFn: async () => {
      const response = await fetch('/api/porpoise/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate pricing');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  if (error || !result) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Calculation Error</AlertTitle>
        <AlertDescription>
          Failed to calculate pricing. Please try again or contact support.
        </AlertDescription>
      </Alert>
    );
  }
  
  const marginStatusConfig = {
    below_target: {
      color: 'destructive' as const,
      icon: TrendingDown,
      label: 'Below Target'
    },
    in_target: {
      color: 'default' as const,
      icon: CheckCircle2,
      label: 'In Target Range'
    },
    above_target: {
      color: 'secondary' as const,
      icon: TrendingUp,
      label: 'Above Target'
    }
  };
  
  const marginStatus = marginStatusConfig[result.margins.marginStatus];
  const MarginIcon = marginStatus.icon;
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pricing Estimate & Comparison</h2>
        <p className="text-muted-foreground">Your customized Porpoise pricing breakdown</p>
      </div>
      
      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-monthly-cost">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-monthly-cost">
              ${result.customerCosts.monthlyCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Includes usage overages
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="card-annual-cost">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-annual-cost">
              ${result.customerCosts.annualCost.toFixed(2)}
            </div>
            {result.tierPricing.discount > 0 && (
              <p className="text-xs text-muted-foreground mt-1" data-testid="text-discount">
                {result.tierPricing.discount}% annual discount applied
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card data-testid="card-selected-tier">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Selected Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-tier-name">{result.tierPricing.tierName}</div>
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-billing-period">
              {result.tierPricing.billingPeriod === 'annual' ? 'Annual' : 'Monthly'} billing
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Cost Breakdown */}
      <Card data-testid="card-cost-breakdown">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cost Breakdown
          </CardTitle>
          <CardDescription>Detailed pricing components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Base {result.tierPricing.tierName} Tier</span>
            <span className="font-semibold">
              ${result.tierPricing.billingPeriod === 'annual' 
                ? (result.tierPricing.baseAnnualCost / 12).toFixed(2) 
                : result.tierPricing.baseMonthlyCost.toFixed(2)}/mo
            </span>
          </div>
          
          {result.usageCosts.gpuCost > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">GPU Hours Overage</span>
              <span className="font-semibold">${result.usageCosts.gpuCost.toFixed(2)}/mo</span>
            </div>
          )}
          
          {result.usageCosts.storageCost > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Storage Overage</span>
              <span className="font-semibold">${result.usageCosts.storageCost.toFixed(2)}/mo</span>
            </div>
          )}
          
          {result.usageCosts.apiCallsCost > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">API Calls Overage</span>
              <span className="font-semibold">${result.usageCosts.apiCallsCost.toFixed(2)}/mo</span>
            </div>
          )}
          
          {result.usageCosts.avatarCost > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Avatar Add-ons</span>
              <span className="font-semibold">${result.usageCosts.avatarCost.toFixed(2)}/mo</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">Total Monthly Cost</span>
            <span className="text-xl font-bold text-primary">
              ${result.customerCosts.monthlyCost.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Internal View: COGS and Margins */}
      {viewMode === 'internal' && (
        <>
          <Card className="border-primary/50" data-testid="card-internal-analysis">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Internal Cost Analysis
                  </CardTitle>
                  <CardDescription>COGS and margin analysis (Internal Only)</CardDescription>
                </div>
                <Badge variant={marginStatus.color} className="gap-1" data-testid="badge-margin-status">
                  <MarginIcon className="w-3 h-3" />
                  {marginStatus.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* COGS Breakdown */}
              <div>
                <h4 className="font-semibold mb-3">Cost of Goods Sold (COGS)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Infrastructure</span>
                    <span>${result.cogs.infrastructureCost.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avatars (HeyGen)</span>
                    <span>${result.cogs.avatarCost.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Twilio</span>
                    <span>${result.cogs.twilioCost.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Support</span>
                    <span>${result.cogs.supportCost.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t font-semibold">
                    <span>Total Monthly COGS</span>
                    <span data-testid="text-total-cogs">${result.cogs.totalMonthlyCogs.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Margin Analysis */}
              <div>
                <h4 className="font-semibold mb-3">Margin Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span>${result.customerCosts.monthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly COGS</span>
                    <span>${result.cogs.totalMonthlyCogs.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Gross Profit</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      ${result.margins.monthlyGrossProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold">Gross Margin</span>
                    <span className="text-xl font-bold" data-testid="text-gross-margin">
                      {result.margins.grossMarginPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid="text-margin-target">
                    Target range: {result.margins.targetMarginRange.min}% - {result.margins.targetMarginRange.max}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Competitor Comparison */}
      <Card data-testid="card-competitor-comparison">
        <CardHeader>
          <CardTitle>Competitor Comparison</CardTitle>
          <CardDescription>See how Porpoise compares to alternatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.competitors.slice(0, 5).map((comp, index) => (
              <div
                key={comp.competitorKey}
                className="flex items-center justify-between p-4 rounded-md border hover-elevate"
                data-testid={`competitor-${comp.competitorKey}`}
              >
                <div className="flex-1">
                  <div className="font-medium">{comp.competitorName}</div>
                  <div className="text-sm text-muted-foreground">
                    Annual cost: ${comp.annualCost.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${comp.savings.toLocaleString()} saved
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {comp.savingsPercent.toFixed(1)}% less
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
