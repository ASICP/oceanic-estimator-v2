import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CostDashboard from "./CostDashboard";
import { FileText, Download, Share2 } from "lucide-react";

interface Step5Props {
  wizardData: any;
  onComplete: () => void;
}

export default function Step5FinalizeSimulate({ wizardData, onComplete }: Step5Props) {
  // Mock calculation based on wizard data
  const calculateCosts = () => {
    const baseAgentCost = (wizardData.step2?.agentCount || 3) * 15000;
    const complexityMultiplier = wizardData.step1?.complexity === "High" ? 1.5 : 
                                wizardData.step1?.complexity === "Medium" ? 1.2 : 1.0;
    const apiCosts = Math.floor(baseAgentCost * 0.3);
    const infrastructureCosts = Math.floor(baseAgentCost * 0.2);
    const supportCosts = Math.floor(baseAgentCost * 0.1);
    
    const totalCost = Math.floor((baseAgentCost + apiCosts + infrastructureCosts + supportCosts) * complexityMultiplier);
    const traditionalCost = totalCost * 2.8; // 65-70% savings
    
    return {
      totalCost,
      traditionalCost,
      breakdown: [
        { category: "AI Agents", cost: Math.floor(baseAgentCost * complexityMultiplier), color: "hsl(var(--chart-1))" },
        { category: "API Calls", cost: Math.floor(apiCosts * complexityMultiplier), color: "hsl(var(--chart-2))" },
        { category: "Infrastructure", cost: Math.floor(infrastructureCosts * complexityMultiplier), color: "hsl(var(--chart-3))" },
        { category: "Support", cost: Math.floor(supportCosts * complexityMultiplier), color: "hsl(var(--chart-4))" }
      ]
    };
  };

  const costData = calculateCosts();
  const savings = costData.traditionalCost - costData.totalCost;

  const handleExportReport = () => {
    console.log("Exporting detailed cost report...");
    // Mock export functionality
    const reportData = {
      summary: costData,
      wizardData,
      timestamp: new Date().toISOString()
    };
    console.log("Report data:", reportData);
    alert("Cost estimation report exported successfully!");
  };

  const handleShareResults = () => {
    console.log("Sharing results...");
    alert("Share link copied to clipboard!");
  };

  const handleGenerateContract = () => {
    console.log("Generating service contract...");
    alert("Service contract generated and ready for download!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Finalize & Simulate</h2>
        <p className="text-muted-foreground">
          Review your complete cost estimation and projected savings
        </p>
      </div>

      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Executive Summary</span>
            <Badge className="bg-chart-3 text-white">Ready for Review</Badge>
          </CardTitle>
          <CardDescription>
            Your AI-powered workflow configuration is complete and optimized for maximum efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${costData.totalCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Project Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">${savings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{wizardData.step2?.agentCount || 3}</div>
              <div className="text-sm text-muted-foreground">AI Agents</div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-2">Selected Configuration:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Workflow: </span>
                <span className="font-medium">
                  {wizardData.step1?.selectedPreset?.title || "Custom Workflow"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Complexity: </span>
                <span className="font-medium">{wizardData.step1?.complexity || "Medium"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <span className="font-medium">{wizardData.step1?.duration || "4-8 hours"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Billing: </span>
                <span className="font-medium">{wizardData.step4?.billingModel || "Hybrid"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Cost Dashboard */}
      <CostDashboard
        totalCost={costData.totalCost}
        traditionalCost={costData.traditionalCost}
        savings={savings}
        costBreakdown={costData.breakdown}
        agents={wizardData.step2?.agentCount || 3}
        duration={wizardData.step1?.duration || "4-8 hrs"}
        onExport={handleExportReport}
      />

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Take action on your cost estimation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleExportReport}
              className="flex items-center gap-2"
              data-testid="button-export-detailed-report"
            >
              <FileText className="h-4 w-4" />
              Export Detailed Report
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleShareResults}
              className="flex items-center gap-2"
              data-testid="button-share-results"
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGenerateContract}
              className="flex items-center gap-2"
              data-testid="button-generate-contract"
            >
              <Download className="h-4 w-4" />
              Generate Contract
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* IRR Projection for Credit Tasks */}
      {wizardData.step1?.selectedPreset?.domain?.includes("Credit") && (
        <Card className="bg-chart-3/10 border-chart-3/20">
          <CardHeader>
            <CardTitle className="text-chart-3">Credit Fund Projection</CardTitle>
            <CardDescription>
              Based on your configuration, projected returns for credit operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-bold text-chart-3">12-18% IRR</div>
                <div className="text-sm text-muted-foreground">Projected Annual Return</div>
              </div>
              <div>
                <div className="text-lg font-bold text-chart-3">1.5-2x</div>
                <div className="text-sm text-muted-foreground">Downside Protection</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Actions */}
      <div className="flex justify-center pt-6">
        <Button 
          size="lg"
          onClick={onComplete}
          className="px-8"
          data-testid="button-complete-estimation"
        >
          Complete Cost Estimation
        </Button>
      </div>
    </div>
  );
}