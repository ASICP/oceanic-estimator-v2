import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pdf } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { PorpoisePDFDocument } from "./PorpoisePDFDocument";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  FileText, 
  Share2, 
  TrendingUp, 
  ArrowRight,
  Download,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { PorpoiseFormData } from "@/pages/PorpoiseCalculatorPage";

interface ScenarioSimulationStepProps {
  formData: PorpoiseFormData;
  viewMode: 'client' | 'internal';
  savedMigrationData?: any;
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
    targetMarginRange: {
      min: number;
      max: number;
    };
    marginStatus: string;
  };
  competitors: Array<{
    competitorKey: string;
    competitorName: string;
    annualCost: number;
    savings: number;
    savingsPercent: number;
  }>;
}

export default function ScenarioSimulationStep({ formData, viewMode, savedMigrationData }: ScenarioSimulationStepProps) {
  const [scalingMultiplier, setScalingMultiplier] = useState<number>(1);
  const [migrationSource, setMigrationSource] = useState<string>(savedMigrationData?.selectedCompetitor || "");
  
  // Get current calculation
  const formDataKey = JSON.stringify(formData);
  const { data: result, isLoading: isCalculating } = useQuery<CalculationResult>({
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
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  
  // Don't early return - let the UI render with disabled buttons while loading
  
  // Generate 12-month projection data
  const generateProjectionData = () => {
    // Guard against missing data
    if (!result?.customerCosts || !result?.competitors) return [];
    
    const months = [];
    const baseMonthly = result.customerCosts.effectiveMonthlyCost;
    
    for (let i = 1; i <= 12; i++) {
      months.push({
        month: `Month ${i}`,
        cost: parseFloat((baseMonthly * scalingMultiplier).toFixed(2)),
        savings: result.competitors[0] 
          ? parseFloat(((result.competitors[0].annualCost / 12 - baseMonthly * scalingMultiplier)).toFixed(2))
          : 0
      });
    }
    
    return months;
  };
  
  // Generate scaling comparison data
  const generateScalingData = () => {
    // Guard against missing data
    if (!result?.customerCosts || !result?.competitors) return [];
    
    const baseAnnual = result.customerCosts.annualCost;
    
    return [
      {
        scenario: 'Current',
        multiplier: '1x',
        annualCost: baseAnnual,
        users: formData.numUsers,
        gpuHours: formData.gpuHoursMonthly,
        savings: result.competitors[0]?.savings || 0
      },
      {
        scenario: '2x Growth',
        multiplier: '2x',
        annualCost: baseAnnual * 2,
        users: formData.numUsers * 2,
        gpuHours: formData.gpuHoursMonthly * 2,
        savings: (result.competitors[0]?.savings || 0) * 2
      },
      {
        scenario: '5x Growth',
        multiplier: '5x',
        annualCost: baseAnnual * 5,
        users: formData.numUsers * 5,
        gpuHours: formData.gpuHoursMonthly * 5,
        savings: (result.competitors[0]?.savings || 0) * 5
      },
      {
        scenario: '10x Growth',
        multiplier: '10x',
        annualCost: baseAnnual * 10,
        users: formData.numUsers * 10,
        gpuHours: formData.gpuHoursMonthly * 10,
        savings: (result.competitors[0]?.savings || 0) * 10
      }
    ];
  };
  
  // Calculate migration costs
  const calculateMigrationCost = () => {
    // Guard against missing data
    if (!migrationSource || !result?.competitors) return null;
    
    const competitor = result.competitors.find(c => c.competitorKey === migrationSource);
    if (!competitor) return null;
    
    // Estimate data egress costs based on storage
    const estimatedDataSize = formData.storageGb * 2; // Assume 2x storage for models + datasets
    let egressCostPerGB = 0;
    
    switch (migrationSource) {
      case 'aws_sagemaker':
        egressCostPerGB = 0.09;
        break;
      case 'google_vertex':
        egressCostPerGB = 0.12;
        break;
      case 'azure_ml':
        egressCostPerGB = 0.087;
        break;
      case 'oracle_oci':
        egressCostPerGB = 0.05;
        break;
      default:
        egressCostPerGB = 0; // Salesforce, HuggingFace, Predibase, Replicate - API-based
    }
    
    const egressCost = estimatedDataSize * egressCostPerGB;
    const setupFee = 0; // No setup fee for Porpoise
    const trainingTime = 16; // hours to re-train models
    const totalMigrationCost = egressCost + setupFee;
    const breakEvenMonths = totalMigrationCost > 0 
      ? Math.ceil(totalMigrationCost / (competitor.savings / 12))
      : 0;
    
    return {
      competitorName: competitor.competitorName,
      selectedCompetitor: migrationSource,
      dataSize: estimatedDataSize,
      dataExportCost: egressCost,
      setupFee,
      trainingTime,
      totalMigrationCost,
      monthlySavings: competitor.savings / 12,
      paybackMonths: breakEvenMonths,
      annualSavings: competitor.savings - totalMigrationCost,
      threeYearSavings: (competitor.savings * 3) - totalMigrationCost
    };
  };
  
  // Only calculate derived data when result is available
  const projectionData = result ? generateProjectionData() : [];
  const scalingData = result ? generateScalingData() : [];
  
  // Prioritize saved migration data for share-link hydration, otherwise calculate fresh
  const migrationCost = savedMigrationData 
    ? {
        competitorName: savedMigrationData.competitorName,
        selectedCompetitor: savedMigrationData.selectedCompetitor,
        dataSize: 0,
        dataExportCost: savedMigrationData.dataExportCost || 0,
        setupFee: 0,
        trainingTime: 16,
        totalMigrationCost: savedMigrationData.totalMigrationCost || 0,
        monthlySavings: savedMigrationData.monthlySavings || 0,
        paybackMonths: savedMigrationData.paybackMonths || 0,
        annualSavings: savedMigrationData.annualSavings || 0,
        threeYearSavings: savedMigrationData.threeYearSavings || 0
      }
    : (result && migrationSource ? calculateMigrationCost() : null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  
  const handleExportPDF = async () => {
    // Guard against missing result
    if (!result || !result.tierPricing) {
      console.error('Cannot export PDF: calculation data not available');
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Generate PDF using @react-pdf/renderer with all Step 4 data
      const blob = await pdf(
        <PorpoisePDFDocument 
          formData={formData} 
          result={result}
          scalingMultiplier={scalingMultiplier}
          migrationData={migrationCost}
        />
      ).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `porpoise-quote-${result.tierPricing.tierName}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleShareLink = async () => {
    try {
      setIsSaving(true);
      
      // Include migration data if available - map field names correctly
      const migrationData = migrationCost ? {
        selectedCompetitor: migrationCost.selectedCompetitor || migrationSource,
        competitorName: migrationCost.competitorName,
        dataExportCost: migrationCost.dataExportCost,
        totalMigrationCost: migrationCost.totalMigrationCost,
        annualSavings: migrationCost.annualSavings,
        monthlySavings: migrationCost.monthlySavings,
        paybackMonths: migrationCost.paybackMonths,
        threeYearSavings: migrationCost.threeYearSavings
      } : null;
      
      const response = await fetch('/api/porpoise/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${result?.tierPricing.tierName} - ${formData.numUsers} users`,
          description: `${formData.gpuHoursMonthly} GPU hours/mo, ${formData.storageGb}GB storage`,
          formData,
          calculationResult: result,
          migrationData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save scenario');
      }
      
      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.shareUrl}`;
      setShareUrl(fullUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
      alert(`✅ Share link copied to clipboard!\n\n${fullUrl}`);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportExcel = () => {
    // Guard against missing result
    if (!result || !result.tierPricing) {
      console.error('Cannot export Excel: calculation data not available');
      return;
    }

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Summary
      const summaryData = [
        ['Porpoise Pricing Quote'],
        [''],
        ['Tier', result.tierPricing.tierName],
        ['Billing Period', formData.billingPeriod === 'annual' ? 'Annual' : 'Monthly'],
        ['Number of Users', formData.numUsers],
        ['GPU Hours/Month', formData.gpuHoursMonthly],
        ['Storage (GB)', formData.storageGb],
        ['API Calls/Month', formData.apiCallsMonthly],
        [''],
        ['Monthly Cost', `$${result.customerCosts.effectiveMonthlyCost.toFixed(2)}`],
        ['Annual Cost', `$${result.customerCosts.annualCost.toFixed(2)}`],
        ['Gross Margin', `${result.margins.grossMarginPercent.toFixed(1)}%`]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Sheet 2: Cost Breakdown
      const costData = [
        ['Cost Breakdown'],
        [''],
        ['Category', 'Monthly Cost', 'Annual Cost'],
        ['Base Tier Price', `$${result.tierPricing.baseMonthlyCost.toFixed(2)}`, `$${result.tierPricing.baseAnnualCost.toFixed(2)}`],
        ['GPU Hours', `$${result.usageCosts.gpuCost.toFixed(2)}`, `$${(result.usageCosts.gpuCost * 12).toFixed(2)}`],
        ['Storage', `$${result.usageCosts.storageCost.toFixed(2)}`, `$${(result.usageCosts.storageCost * 12).toFixed(2)}`],
        ['API Calls', `$${result.usageCosts.apiCallsCost.toFixed(2)}`, `$${(result.usageCosts.apiCallsCost * 12).toFixed(2)}`],
        ['Avatars', `$${result.usageCosts.avatarCost.toFixed(2)}`, `$${(result.usageCosts.avatarCost * 12).toFixed(2)}`],
        [''],
        ['Total', `$${result.customerCosts.monthlyCost.toFixed(2)}`, `$${result.customerCosts.annualCost.toFixed(2)}`]
      ];
      const wsCost = XLSX.utils.aoa_to_sheet(costData);
      XLSX.utils.book_append_sheet(wb, wsCost, 'Cost Breakdown');

      // Sheet 3: 12-Month Projection
      const projectionHeaders = [['Month', 'Monthly Cost', 'Competitor Savings']];
      const projectionRows = projectionData.map(item => [
        item.month,
        `$${item.cost.toFixed(2)}`,
        `$${item.savings.toFixed(2)}`
      ]);
      const wsProjection = XLSX.utils.aoa_to_sheet([...projectionHeaders, ...projectionRows]);
      XLSX.utils.book_append_sheet(wb, wsProjection, '12-Month Projection');

      // Sheet 4: Growth Scaling
      const scalingHeaders = [['Scenario', 'Annual Cost', 'Users', 'GPU Hours', 'Savings']];
      const scalingRows = scalingData.map(item => [
        item.scenario,
        `$${item.annualCost.toFixed(2)}`,
        item.users,
        item.gpuHours,
        `$${item.savings.toFixed(2)}`
      ]);
      const wsScaling = XLSX.utils.aoa_to_sheet([...scalingHeaders, ...scalingRows]);
      XLSX.utils.book_append_sheet(wb, wsScaling, 'Growth Scaling');

      // Sheet 5: Competitor Comparison
      if (result.competitors && result.competitors.length > 0) {
        const competitorHeaders = [['Competitor', 'Annual Cost', 'Savings', 'Savings %']];
        const competitorRows = result.competitors.map(comp => [
          comp.competitorName,
          `$${comp.annualCost.toFixed(2)}`,
          `$${comp.savings.toFixed(2)}`,
          `${comp.savingsPercent.toFixed(1)}%`
        ]);
        const wsCompetitors = XLSX.utils.aoa_to_sheet([...competitorHeaders, ...competitorRows]);
        XLSX.utils.book_append_sheet(wb, wsCompetitors, 'Competitor Comparison');
      }

      // Sheet 6: Migration Analysis (if available)
      if (migrationCost) {
        const migrationData = [
          ['Migration Analysis'],
          [''],
          ['From', migrationCost.competitorName || 'Unknown'],
          ['Data Export Cost', `$${migrationCost.dataExportCost.toFixed(2)}`],
          ['Total Migration Cost', `$${migrationCost.totalMigrationCost.toFixed(2)}`],
          ['Monthly Savings', `$${migrationCost.monthlySavings.toFixed(2)}`],
          ['Annual Savings', `$${migrationCost.annualSavings.toFixed(2)}`],
          ['Payback Period', `${migrationCost.paybackMonths.toFixed(1)} months`],
          ['3-Year Savings', `$${migrationCost.threeYearSavings.toFixed(2)}`]
        ];
        const wsMigration = XLSX.utils.aoa_to_sheet(migrationData);
        XLSX.utils.book_append_sheet(wb, wsMigration, 'Migration Analysis');
      }

      // Generate and download file
      const fileName = `porpoise-quote-${result.tierPricing.tierName}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Scenario Simulation & Export</h2>
        <p className="text-muted-foreground">
          Project costs over time, explore growth scenarios, and calculate migration costs
        </p>
      </div>
      
      {isCalculating || !result ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              Loading calculations...
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
      <Tabs defaultValue="projection" className="w-full" data-testid="tabs-scenarios">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projection" data-testid="tab-projection">
            12-Month Projection
          </TabsTrigger>
          <TabsTrigger value="scaling" data-testid="tab-scaling">
            Growth Scenarios
          </TabsTrigger>
          <TabsTrigger value="migration" data-testid="tab-migration">
            Migration Calculator
          </TabsTrigger>
        </TabsList>
        
        {/* 12-Month Projection Tab */}
        <TabsContent value="projection" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>12-Month Cost Projection</CardTitle>
                  <CardDescription>
                    Monthly costs and savings vs {result.competitors[0]?.competitorName || 'competitors'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Scale:</Label>
                  <Select
                    value={scalingMultiplier.toString()}
                    onValueChange={(value) => setScalingMultiplier(parseFloat(value))}
                  >
                    <SelectTrigger className="w-24" data-testid="select-projection-scale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="5">5x</SelectItem>
                      <SelectItem value="10">10x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Porpoise Cost"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Monthly Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card data-testid="card-total-cost">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Year 1 Cost</div>
                    <div className="text-2xl font-bold">
                      ${(result.customerCosts.annualCost * scalingMultiplier).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-total-savings">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Year 1 Savings</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${((result.competitors[0]?.savings || 0) * scalingMultiplier).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-roi">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">ROI</div>
                    <div className="text-2xl font-bold">
                      {result.competitors[0]?.savingsPercent.toFixed(1) || 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Growth Scenarios Tab */}
        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Scaling Scenarios</CardTitle>
              <CardDescription>
                See how costs scale as your team grows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scalingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="annualCost" fill="hsl(var(--primary))" name="Annual Cost" />
                  <Bar dataKey="savings" fill="hsl(var(--chart-2))" name="Savings vs Competition" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-4">
                {scalingData.map((scenario, index) => (
                  <Card key={index} data-testid={`card-scaling-${scenario.multiplier}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{scenario.scenario}</h3>
                          <p className="text-sm text-muted-foreground">{scenario.multiplier} current usage</p>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0 ? "Current" : "Projection"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <Users className="w-3 h-3" />
                            <span>Users</span>
                          </div>
                          <div className="font-semibold">{scenario.users}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <Zap className="w-3 h-3" />
                            <span>GPU Hours/mo</span>
                          </div>
                          <div className="font-semibold">{scenario.gpuHours}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Annual Cost</span>
                          </div>
                          <div className="font-semibold">${scenario.annualCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Savings</span>
                          </div>
                          <div className="font-semibold text-green-600">${scenario.savings.toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Migration Calculator Tab */}
        <TabsContent value="migration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Migration Cost Calculator</CardTitle>
              <CardDescription>
                Calculate costs to migrate from your current platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="migration-source">Select Current Platform</Label>
                <Select
                  value={migrationSource}
                  onValueChange={setMigrationSource}
                >
                  <SelectTrigger id="migration-source" data-testid="select-migration-source">
                    <SelectValue placeholder="Choose your current platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {result.competitors.map((comp) => (
                      <SelectItem key={comp.competitorKey} value={comp.competitorKey}>
                        {comp.competitorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {migrationCost && (
                <div className="space-y-4">
                  <Card className="bg-muted/50" data-testid="card-migration-analysis">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Migration Analysis: {migrationCost.competitorName}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Estimated Data Size</span>
                          <span className="font-semibold">{migrationCost.dataSize} GB</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Data Egress Cost</span>
                          <span className="font-semibold">${migrationCost.dataExportCost.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Setup Fees</span>
                          <span className="font-semibold">${migrationCost.setupFee.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Estimated Re-training Time</span>
                          <span className="font-semibold">{migrationCost.trainingTime} hours</span>
                        </div>
                        
                        <div className="h-px bg-border my-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">Total Migration Cost</span>
                          <span className="font-bold text-lg">${migrationCost.totalMigrationCost.toFixed(2)}</span>
                        </div>
                        
                        <div className="h-px bg-border my-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Savings</span>
                          <span className="font-semibold text-green-600">${migrationCost.monthlySavings.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Break-even Period</span>
                          <span className="font-semibold">
                            {migrationCost.paybackMonths === 0 ? 'Immediate' : `${migrationCost.paybackMonths} months`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">First Year Net Savings</span>
                          <span className="font-bold text-green-600 text-lg">
                            ${migrationCost.annualSavings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">Migration Timeline (6 Phases)</h4>
                      <div className="space-y-2">
                        {[
                          { phase: 'Phase 1', title: 'Assessment & Planning', duration: '1-2 weeks' },
                          { phase: 'Phase 2', title: 'Data Export & Transfer', duration: '1 week' },
                          { phase: 'Phase 3', title: 'Environment Setup', duration: '3-5 days' },
                          { phase: 'Phase 4', title: 'Model Migration & Re-training', duration: '1-2 weeks' },
                          { phase: 'Phase 5', title: 'Testing & Validation', duration: '1 week' },
                          { phase: 'Phase 6', title: 'Go-Live & Monitoring', duration: '3-5 days' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Badge variant="outline" className="min-w-20">
                              {item.phase}
                            </Badge>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.duration}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {!migrationSource && (
                <div className="text-center py-12 text-muted-foreground">
                  Select a platform above to calculate migration costs
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Share</CardTitle>
          <CardDescription>
            Download a complete quote or generate a shareable link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting || isCalculating || !result}
              className="gap-2"
              data-testid="button-export-pdf"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? 'Generating PDF...' : isCalculating ? 'Calculating...' : 'Export PDF Quote'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareLink}
              disabled={isSaving}
              className="gap-2"
              data-testid="button-share-link"
            >
              <Share2 className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Generate Share Link'}
            </Button>
            
            {shareUrl && (
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground truncate">{shareUrl}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={handleExportExcel}
              disabled={isCalculating || !result}
              className="gap-2"
              data-testid="button-download-data"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
