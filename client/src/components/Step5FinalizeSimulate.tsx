import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import CostDashboard from "./CostDashboard";
import { FileText, Download, Share2, Twitter, Linkedin, Facebook, Mail, Copy, CreditCard, ArrowRight, CheckCircle, Clock, Users, Target, Calculator, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFGenerator } from "@/utils/pdfGenerator";
import { SocialSharing } from "@/utils/socialSharing";
import { apiRequest } from "@/lib/queryClient";
import { useAgents } from "@/hooks/useAgents";

interface Step5Props {
  wizardData: any;
  onComplete: () => void;
  onBack?: () => void;
}

export default function Step5FinalizeSimulate({ wizardData, onComplete, onBack }: Step5Props) {
  const { toast } = useToast();
  const { agents } = useAgents(); // Get all agents for proper data transformation
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [contractDialog, setContractDialog] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [contractInfo, setContractInfo] = useState({ clientName: '', clientEmail: '' });
  
  // Transform wizard data into the format expected by the cost calculation API
  const getCostCalculationInput = () => {
    // Transform selected agents to ensure they have all required fields
    const selectedAgents = wizardData.step2?.selectedAgents || [];
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
      
      // If agent is just a string (name), try to find the full agent object
      if (typeof agent === 'string' && agents) {
        const fullAgent = agents.find(a => a.name === agent || a.id === agent);
        if (fullAgent) {
          const result: any = {
            id: fullAgent.id,
            name: fullAgent.name,
            role: fullAgent.role,
            domain: fullAgent.domain
          };
          // Only include baseCostPerHour if it exists - let backend use its default
          if (fullAgent.baseCostPerHour) {
            result.baseCostPerHour = fullAgent.baseCostPerHour;
          }
          return result;
        }
        
        // Fallback for string agents - create minimal object, let backend handle pricing
        return {
          id: agent,
          name: agent,
          role: "General Agent",
          domain: "General"
        };
      }
      
      // Fallback for unexpected formats - let backend handle pricing
      return {
        id: "unknown",
        name: "Unknown Agent",
        role: "General Agent", 
        domain: "General"
      };
    });

    return {
      workflow: {
        complexity: wizardData.step1?.complexity || "Medium",
        duration: wizardData.step1?.selectedPreset?.estimatedTime || "4-8 hrs",
        domain: wizardData.step1?.selectedPreset?.category || "General",
        presetId: wizardData.step1?.selectedPreset?.id
      },
      agents: transformedAgents,
      resources: {
        apiCalls: wizardData.step3?.apiCalls || 10000,
        dataTransfer: wizardData.step3?.dataTransfer || 100,
        errorRate: wizardData.step3?.errorRate || 2,
        batchSize: wizardData.step3?.batchSize || 50,
        modelProvider: wizardData.step3?.modelProvider || "openai",
        autoScale: wizardData.step3?.autoScale || true,
        multiModel: wizardData.step3?.multiModel || true
      },
      billing: {
        model: wizardData.step4?.billingModel || "hybrid",
        tier: wizardData.step4?.tier || "department",
        volumeDiscount: wizardData.step4?.volumeDiscount || false,
        byoApiKeys: wizardData.step4?.byoApiKeys || false,
        taxRate: wizardData.step4?.taxRate || 8.25,
        margin: wizardData.step4?.margin || 15
      }
    };
  };

  // Use the cost calculation from Step4 if it has valid data, otherwise fetch from API
  const step4CostData = wizardData.step4?.costs;
  const hasValidStep4Data = step4CostData && step4CostData.totalCost > 0;
  
  const { data: costCalculationResult, isLoading: isCalculating, error: calculationError } = useQuery({
    queryKey: ['cost-calculation', wizardData],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/calculate-costs', getCostCalculationInput());
      return await response.json();
    },
    enabled: !hasValidStep4Data && !!(wizardData.step1 && wizardData.step2 && wizardData.step3 && wizardData.step4 && agents),
    refetchOnWindowFocus: false
  });

  // Use Step4 cost data if valid, otherwise use API result, then fallback
  const costData = (hasValidStep4Data ? step4CostData : costCalculationResult) || {
    totalCost: 0,
    traditionalCost: 0,
    breakdown: [],
    savings: 0,
    savingsPercentage: 0,
    agentCost: 0,
    apiCost: 0,
    infrastructureCost: 0,
    dataCost: 0,
    baseCost: 0,
    taxAmount: 0,
    marginAmount: 0
  };
  const savings = costData.savings || (costData.traditionalCost - costData.totalCost);

  const handleExportReport = async (type: 'summary' | 'detailed' = 'detailed') => {
    try {
      setIsExporting(true);
      
      // Create a mock cost estimate for PDF generation
      const mockEstimate = {
        id: `estimate_${Date.now()}`,
        title: wizardData.step1?.selectedPreset?.title || 'Custom Workflow',
        totalCost: costData.totalCost.toString(),
        traditionalCost: costData.traditionalCost.toString(),
        savingsAmount: savings.toString(),
        savingsPercentage: (((costData.traditionalCost - costData.totalCost) / costData.traditionalCost) * 100).toString(),
        agents: wizardData.step2?.selectedAgents || [],
        workflow: wizardData.step1?.selectedPreset,
        apiCalls: wizardData.step3?.apiCalls,
        dataTransfer: wizardData.step3?.dataTransfer,
        errorRate: wizardData.step3?.errorRate,
        batchSize: wizardData.step3?.batchSize,
        autoScale: wizardData.step3?.autoScale,
        multiModel: wizardData.step3?.multiModel,
        modelProvider: wizardData.step3?.modelProvider,
        billingModel: wizardData.step4?.billingModel,
        tier: wizardData.step4?.tier,
        volumeDiscount: wizardData.step4?.volumeDiscount,
        byoApiKeys: wizardData.step4?.byoApiKeys,
        taxRate: String(wizardData.step4?.taxRate || '8.25'),
        margin: String(wizardData.step4?.margin || '15'),
        costBreakdown: costData.breakdown,
        // Add required fields for CompleteCostEstimate type
        workflowId: wizardData.step1?.selectedPreset?.id || null,
        selectedWorkflow: wizardData.step1?.selectedPreset,
        customComplexity: null,
        customDuration: null,
        customCategory: null,
        selectedAgents: wizardData.step2?.selectedAgents,
        agentCount: wizardData.step2?.agentCount || 3,
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
      
      if (type === 'summary') {
        await PDFGenerator.generateSummaryPDF(mockEstimate);
        toast({
          title: "Success",
          description: "Summary report exported successfully!",
        });
      } else {
        await PDFGenerator.generateDetailedPDF(mockEstimate);
        toast({
          title: "Success",
          description: "Detailed report exported successfully!",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareResults = async () => {
    try {
      setIsSharing(true);
      
      // First create a cost estimate in the database
      const estimateData = {
        title: wizardData.step1?.selectedPreset?.title || 'Custom Workflow',
        workflowId: wizardData.step1?.selectedPreset?.id,
        selectedWorkflow: wizardData.step1?.selectedPreset,
        selectedAgents: wizardData.step2?.selectedAgents,
        agentCount: wizardData.step2?.agentCount || 3,
        apiCalls: wizardData.step3?.apiCalls || 10000,
        dataTransfer: wizardData.step3?.dataTransfer || 100,
        errorRate: wizardData.step3?.errorRate || 2,
        batchSize: wizardData.step3?.batchSize || 50,
        autoScale: wizardData.step3?.autoScale || true,
        multiModel: wizardData.step3?.multiModel || true,
        modelProvider: wizardData.step3?.modelProvider || 'openai',
        billingModel: wizardData.step4?.billingModel || 'hybrid',
        tier: wizardData.step4?.tier || 'department',
        volumeDiscount: wizardData.step4?.volumeDiscount || false,
        byoApiKeys: wizardData.step4?.byoApiKeys || false,
        taxRate: String(wizardData.step4?.taxRate || '8.25'),
        margin: String(wizardData.step4?.margin || '15'),
        totalCost: costData.totalCost.toString(),
        traditionalCost: costData.traditionalCost.toString(),
        savingsAmount: savings.toString(),
        savingsPercentage: (((costData.traditionalCost - costData.totalCost) / costData.traditionalCost) * 100).toString(),
        costBreakdown: costData.breakdown,
        isCompleted: true
      };
      
      // Create the cost estimate
      const estimateResponse = await apiRequest('POST', '/api/cost-estimates', estimateData);
      const estimate = await estimateResponse.json();
      // Create shareable link
      const shareData = {
        estimateId: estimate.id,
        title: `${wizardData.step1?.selectedPreset?.title || 'Custom Workflow'} - Cost Estimation`
      };
      
      const shareResponse = await apiRequest('POST', '/api/share-results', shareData);
      const response = await shareResponse.json();
      
      setSharedUrl(response.shareUrl);
      setSocialLinks(response.socialLinks);
      setShareDialog(true);
      
      toast({
        title: "Success",
        description: "Shareable link created successfully!",
      });
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Failed to create shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleGenerateContract = () => {
    setContractDialog(true);
  };

  const handleDownloadGenericContract = async () => {
    try {
      setIsGeneratingContract(true);
      
      // Create a mock cost estimate for contract generation
      const mockEstimate = {
        id: `contract_${Date.now()}`,
        title: wizardData.step1?.selectedPreset?.title || 'Custom Workflow',
        totalCost: costData.totalCost.toString(),
        traditionalCost: costData.traditionalCost.toString(),
        savingsAmount: savings.toString(),
        savingsPercentage: (((costData.traditionalCost - costData.totalCost) / costData.traditionalCost) * 100).toString(),
        agents: wizardData.step2?.selectedAgents || [],
        workflow: wizardData.step1?.selectedPreset,
        apiCalls: wizardData.step3?.apiCalls,
        dataTransfer: wizardData.step3?.dataTransfer,
        errorRate: wizardData.step3?.errorRate,
        batchSize: wizardData.step3?.batchSize,
        autoScale: wizardData.step3?.autoScale,
        multiModel: wizardData.step3?.multiModel,
        modelProvider: wizardData.step3?.modelProvider,
        billingModel: wizardData.step4?.billingModel,
        tier: wizardData.step4?.tier,
        volumeDiscount: wizardData.step4?.volumeDiscount,
        byoApiKeys: wizardData.step4?.byoApiKeys,
        taxRate: String(wizardData.step4?.taxRate || '8.25'),
        margin: String(wizardData.step4?.margin || '15'),
        costBreakdown: costData.breakdown,
        // Add required fields for CompleteCostEstimate type
        workflowId: wizardData.step1?.selectedPreset?.id || null,
        selectedWorkflow: wizardData.step1?.selectedPreset,
        customComplexity: null,
        customDuration: null,
        customCategory: null,
        selectedAgents: wizardData.step2?.selectedAgents,
        agentCount: wizardData.step2?.agentCount || 3,
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
      
      await PDFGenerator.generateGenericContract(mockEstimate);
      
      toast({
        title: "Success",
        description: "Generic contract downloaded successfully!",
      });
    } catch (error) {
      console.error('Contract download error:', error);
      toast({
        title: "Error",
        description: "Failed to download contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContract(false);
    }
  };
  
  const handleCreateContract = async () => {
    try {
      setIsGeneratingContract(true);
      
      // First create a cost estimate in the database
      const estimateData = {
        title: wizardData.step1?.selectedPreset?.title || 'Custom Workflow',
        workflowId: wizardData.step1?.selectedPreset?.id,
        selectedWorkflow: wizardData.step1?.selectedPreset,
        selectedAgents: wizardData.step2?.selectedAgents,
        agentCount: wizardData.step2?.agentCount || 3,
        apiCalls: wizardData.step3?.apiCalls || 10000,
        dataTransfer: wizardData.step3?.dataTransfer || 100,
        errorRate: wizardData.step3?.errorRate || 2,
        batchSize: wizardData.step3?.batchSize || 50,
        autoScale: wizardData.step3?.autoScale || true,
        multiModel: wizardData.step3?.multiModel || true,
        modelProvider: wizardData.step3?.modelProvider || 'openai',
        billingModel: wizardData.step4?.billingModel || 'hybrid',
        tier: wizardData.step4?.tier || 'department',
        volumeDiscount: wizardData.step4?.volumeDiscount || false,
        byoApiKeys: wizardData.step4?.byoApiKeys || false,
        taxRate: String(wizardData.step4?.taxRate || '8.25'),
        margin: String(wizardData.step4?.margin || '15'),
        totalCost: costData.totalCost.toString(),
        traditionalCost: costData.traditionalCost.toString(),
        savingsAmount: savings.toString(),
        savingsPercentage: (((costData.traditionalCost - costData.totalCost) / costData.traditionalCost) * 100).toString(),
        costBreakdown: costData.breakdown,
        isCompleted: true
      };
      
      // Create the cost estimate
      const estimateResponse = await apiRequest('POST', '/api/cost-estimates', estimateData);
      const estimate = await estimateResponse.json();
      
      // Generate contract
      const contractData = {
        estimateId: estimate.id,
        clientName: contractInfo.clientName,
        clientEmail: contractInfo.clientEmail
      };
      
      const contractResponse = await apiRequest('POST', '/api/generate-contract', contractData);
      const contract = await contractResponse.json();
      
      // Create Stripe checkout session
      const checkoutData = { contractId: contract.contract.id };
      const checkoutResponse = await apiRequest('POST', '/api/create-checkout-session', checkoutData);
      const checkout = await checkoutResponse.json();
      
      // Redirect to Stripe checkout
      if (checkout.checkoutUrl) {
        window.open(checkout.checkoutUrl, '_blank');
        
        toast({
          title: "Success",
          description: "Contract generated! Redirecting to secure payment...",
        });
        
        setContractDialog(false);
      }
    } catch (error) {
      console.error('Contract generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContract(false);
    }
  };
  
  const handleCopyUrl = async () => {
    const success = await SocialSharing.copyToClipboard(sharedUrl);
    if (success) {
      toast({
        title: "Copied!",
        description: "Share URL copied to clipboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  // Show loading state while calculating costs
  if (isCalculating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <div className="text-lg font-medium">Calculating Costs...</div>
              <div className="text-sm text-muted-foreground">Using advanced AI cost modeling</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if calculation failed
  if (calculationError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-lg font-medium text-destructive">Calculation Error</div>
              <div className="text-sm text-muted-foreground">Failed to calculate costs. Please try again.</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry Calculation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Finalize & Simulate</h2>
        <p className="text-muted-foreground">
          Review your complete cost estimation and projected savings
        </p>
      </div>

      {/* Back Navigation */}
      {onBack && (
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
            data-testid="button-back"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Previous Step
          </Button>
        </div>
      )}

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

          {/* Technical Cost Breakdown */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Technical Cost Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent Development:</span>
                  <span className="font-medium">${(costData.agentCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground ml-4">
                  <span>({wizardData.step2?.agentCount || 3} agents × $150/hr × {wizardData.step1?.duration || "4-8 hrs"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Integration:</span>
                  <span className="font-medium">${(costData.apiCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Infrastructure:</span>
                  <span className="font-medium">${(costData.infrastructureCost || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Processing:</span>
                  <span className="font-medium">${(costData.dataCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Operational:</span>
                  <span className="font-medium">${(costData.baseCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax & Margin:</span>
                  <span className="font-medium">${((costData.taxAmount || 0) + (costData.marginAmount || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Savings Justification */}
          <div className="pt-4 border-t border-border bg-chart-3/10 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2 text-chart-3">
              <TrendingDown className="h-4 w-4" />
              Cost Savings Justification
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Traditional Implementation Cost:</span>
                <span className="font-medium">${(costData.traditionalCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground ml-4">
                <span>(Manual processes, consultants at $300+/hr, longer timeline)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI-Powered Solution Cost:</span>
                <span className="font-medium">${costData.totalCost.toLocaleString()}</span>
              </div>
              {wizardData.step4?.byoApiKeys && (
                <div className="flex justify-between text-chart-3">
                  <span>BYO API Keys Discount:</span>
                  <span className="font-medium">-30% additional savings</span>
                </div>
              )}
              {wizardData.step4?.volumeDiscount && wizardData.step2?.agentCount >= 5 && (
                <div className="flex justify-between text-chart-3">
                  <span>Volume Discount (5+ agents):</span>
                  <span className="font-medium">-10% additional savings</span>
                </div>
              )}
              <div className="border-t pt-2 font-bold text-chart-3">
                <div className="flex justify-between">
                  <span>Total Savings ({costData.savingsPercentage || 0}%):</span>
                  <span>${savings.toLocaleString()}</span>
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => handleExportReport('summary')}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isExporting}
              data-testid="button-export-report"
            >
              <FileText className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
            
            <Button 
              onClick={() => handleExportReport('detailed')}
              className="flex items-center gap-2"
              disabled={isExporting}
              data-testid="button-export-detailed-report"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Detailed Report'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={handleShareResults}
                className="flex items-center gap-2"
                disabled={isSharing}
                data-testid="button-share-results"
              >
                <Share2 className="h-4 w-4" />
                {isSharing ? 'Creating Link...' : 'Share Results'}
              </Button>

              <Button 
                onClick={handleGenerateContract}
                className="flex items-center gap-2"
                data-testid="button-generate-contract"
              >
                <CreditCard className="h-4 w-4" />
                Proceed to Payment
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={handleDownloadGenericContract}
                className="flex items-center gap-2"
                disabled={isGeneratingContract}
                data-testid="button-download-contract"
              >
                <FileText className="h-4 w-4" />
                {isGeneratingContract ? 'Generating...' : 'Download Contract PDF'}
              </Button>
            </div>

            <Dialog open={shareDialog} onOpenChange={setShareDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Results</DialogTitle>
                  <DialogDescription>
                    Share your cost estimation with others via link or social media
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {sharedUrl && (
                    <>
                      <div className="space-y-2">
                        <Label>Share URL</Label>
                        <div className="flex items-center gap-2">
                          <Input value={sharedUrl} readOnly className="flex-1" />
                          <Button size="sm" onClick={handleCopyUrl}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Share on Social Media</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {socialLinks && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => SocialSharing.openShareWindow(socialLinks.twitter, 'twitter')}
                                className="flex items-center gap-2"
                              >
                                <Twitter className="h-4 w-4" />
                                Twitter
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => SocialSharing.openShareWindow(socialLinks.linkedin, 'linkedin')}
                                className="flex items-center gap-2"
                              >
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => SocialSharing.openShareWindow(socialLinks.facebook, 'facebook')}
                                className="flex items-center gap-2"
                              >
                                <Facebook className="h-4 w-4" />
                                Facebook
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => SocialSharing.openShareWindow(socialLinks.email, 'email')}
                                className="flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Email
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={contractDialog} onOpenChange={setContractDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Service Contract</DialogTitle>
                  <DialogDescription>
                    Create a contract and proceed to secure payment processing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={contractInfo.clientName}
                        onChange={(e) => setContractInfo(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Enter client or company name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email Address *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={contractInfo.clientEmail}
                        onChange={(e) => setContractInfo(prev => ({ ...prev, clientEmail: e.target.value }))}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="font-medium">Contract Summary</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Service: {wizardData.step1?.selectedPreset?.title || 'Custom Workflow'} Implementation</div>
                        <div>Total Amount: ${costData.totalCost.toLocaleString()}</div>
                        <div>Payment: Secure processing via Stripe</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCreateContract}
                    disabled={!contractInfo.clientName || !contractInfo.clientEmail || isGeneratingContract}
                    className="w-full flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {isGeneratingContract ? 'Processing...' : 'Proceed to Secure Payment'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Implementation Process Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Process</CardTitle>
          <CardDescription>
            Your next steps after contract signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                  1
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Setup & Configuration</div>
                  <div className="text-sm text-muted-foreground">
                    Configure your selected AI agents and integrate with your existing systems
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    1-2 weeks
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                  2
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Testing & Optimization</div>
                  <div className="text-sm text-muted-foreground">
                    Run pilot processes and optimize performance based on your specific workflows
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    2-3 weeks
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                  3
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Full Deployment</div>
                  <div className="text-sm text-muted-foreground">
                    Go live with your AI-powered workflow and start realizing cost savings
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    1 week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* User Follow-up Steps */}
      <Card className="bg-gradient-to-r from-chart-3/5 to-chart-3/10 border-chart-3/20">
        <CardHeader>
          <CardTitle className="text-chart-3">Your Follow-Up Action Items</CardTitle>
          <CardDescription>
            Maximize your investment with these recommended next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-3" />
                  Team Preparation
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Identify team members who will work with the AI agents
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Schedule training sessions for new workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Define success metrics and KPIs
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-3" />
                  Infrastructure
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Review API access and security requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Prepare data sources and integrations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-chart-3 mt-2 flex-shrink-0"></span>
                    Plan rollback procedures for risk management
                  </li>
                </ul>
              </div>
            </div>
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