import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EchoConfig, calculateTotalMonthlyCost, calculateMargin, calculateROI, ROI_ASSUMPTIONS } from "@/lib/echoPricingEngine";
import { DollarSign, PieChart, TrendingUp, Download, Eye, EyeOff } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Step4Props {
    data: EchoConfig;
    onNext: () => void;
    onBack: () => void;
}

export default function Step4Analysis({ data, onNext, onBack }: Step4Props) {
    const [showInternal, setShowInternal] = useState(false);

    // Calculations
    const pricing = calculateTotalMonthlyCost(data);
    const annualCost = pricing.billingPeriod === 'annual' ? pricing.totalMonthly * 12 : pricing.totalMonthly * 12; // Simplified for display
    const margin = calculateMargin(data, pricing.totalMonthly);
    const roi = calculateROI(data, annualCost);

    // Chart Data
    const costBreakdownData = {
        labels: ['Subscription', 'Connectors', 'Storage', 'Add-ons'],
        datasets: [
            {
                data: [pricing.subscription, pricing.connectorOverage, pricing.storageOverage, pricing.addons],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
                borderWidth: 0,
            },
        ],
    };

    const marginData = {
        labels: ['Net Profit', 'COGS'],
        datasets: [
            {
                data: [margin.grossProfit, margin.totalCOGS],
                backgroundColor: [margin.marginPercent > 82 ? '#10b981' : '#f59e0b', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Cost & ROI Analysis
                    </h2>
                    <p className="text-muted-foreground">Detailed breakdown of your investment and expected returns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowInternal(!showInternal)}>
                        {showInternal ? <><EyeOff className="w-4 h-4 mr-2" /> Hide Internal</> : <><Eye className="w-4 h-4 mr-2" /> View Internal</>}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* High Level Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Monthly Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">${Math.round(pricing.totalMonthly).toLocaleString()}</div>
                        <p className="text-xs text-blue-600/80">Tier: {pricing.tier}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">First Year ROI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{Math.round(roi.roiPercent)}%</div>
                        <p className="text-xs text-green-600/80">Payback: {roi.paybackMonths.toFixed(1)} months</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Annual Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${Math.round(annualCost).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Recurring only</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">One-Time Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${pricing.oneTimeCosts.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Custom dev fees</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="pricing" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pricing"><DollarSign className="w-4 h-4 mr-2" /> Pricing Breakdown</TabsTrigger>
                    <TabsTrigger value="roi"><TrendingUp className="w-4 h-4 mr-2" /> Value Analysis (ROI)</TabsTrigger>
                    <TabsTrigger value="internal" disabled={!showInternal} className={!showInternal ? "opacity-50" : ""}>
                        <PieChart className="w-4 h-4 mr-2" /> Margin Analysis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Component Cost Detail</CardTitle></CardHeader>
                                <CardContent>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left font-medium py-2">Component</th>
                                                <th className="text-right font-medium py-2">Monthly</th>
                                                <th className="text-right font-medium py-2">Annual</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="py-3">Base Subscription ({pricing.tier})</td>
                                                <td className="text-right">${Math.round(pricing.subscription).toLocaleString()}</td>
                                                <td className="text-right">${Math.round(pricing.subscription * 12).toLocaleString()}</td>
                                            </tr>
                                            {pricing.connectorOverage > 0 && (
                                                <tr>
                                                    <td className="py-3">Connector Overages</td>
                                                    <td className="text-right">${Math.round(pricing.connectorOverage).toLocaleString()}</td>
                                                    <td className="text-right">${Math.round(pricing.connectorOverage * 12).toLocaleString()}</td>
                                                </tr>
                                            )}
                                            {pricing.storageOverage > 0 && (
                                                <tr>
                                                    <td className="py-3">Storage Overages</td>
                                                    <td className="text-right">${Math.round(pricing.storageOverage).toLocaleString()}</td>
                                                    <td className="text-right">${Math.round(pricing.storageOverage * 12).toLocaleString()}</td>
                                                </tr>
                                            )}
                                            {Object.entries(pricing.addonsBreakdown).map(([key, val]) => (
                                                <tr key={key}>
                                                    <td className="py-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                    <td className="text-right">${Math.round(val).toLocaleString()}</td>
                                                    <td className="text-right">${Math.round(val * 12).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-bold bg-slate-50">
                                                <td className="py-3 pl-2">Total Recurring</td>
                                                <td className="text-right pr-2">${Math.round(pricing.totalMonthly).toLocaleString()}</td>
                                                <td className="text-right pr-2">${Math.round(pricing.totalMonthly * 12).toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="h-[250px] w-full flex justify-center">
                                        <Doughnut data={costBreakdownData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="roi" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projected Value Generation (Year 1)</CardTitle>
                            <CardDescription>Based on {data.users} users saving {ROI_ASSUMPTIONS.hoursSavedPerUserPerMonth} hours/month</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 border rounded-xl">
                                <div className="text-muted-foreground text-sm mb-1">Total Value Creation</div>
                                <div className="text-3xl font-bold text-green-600">${Math.round(roi.totalValue).toLocaleString()}</div>
                            </div>
                            <div className="text-center p-4 border rounded-xl">
                                <div className="text-muted-foreground text-sm mb-1">Total Investment</div>
                                <div className="text-3xl font-bold text-red-600">-${Math.round(roi.investment).toLocaleString()}</div>
                            </div>
                            <div className="text-center p-4 border rounded-xl bg-green-50 border-green-200">
                                <div className="text-muted-foreground text-sm mb-1">Net ROI</div>
                                <div className="text-3xl font-bold text-green-800">${Math.round(roi.netValue).toLocaleString()}</div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="internal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-yellow-200 bg-yellow-50/20">
                            <CardHeader>
                                <CardTitle>Margin Analysis (Finance View)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] w-full flex justify-center mb-6">
                                    <Doughnut data={marginData} options={{ maintainAspectRatio: false }} />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Revenue:</span> <span className="font-bold">${Math.round(pricing.totalMonthly).toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>COGS:</span> <span className="font-bold text-red-600">-${Math.round(margin.totalCOGS).toLocaleString()}</span></div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <span>Gross Margin:</span>
                                        <span className={`font-bold ${margin.marginPercent >= 82 ? 'text-green-600' : 'text-amber-600'}`}>
                                            {margin.marginPercent.toFixed(1)}% {margin.marginPercent < 82 && '(Below 82% target)'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>COGS Breakdown</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {Object.entries(margin.breakdown).map(([key, val]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="capitalize">{key}:</span>
                                        <span>${Math.round(val).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="text-xs text-muted-foreground mt-4 p-2 bg-slate-100 rounded">
                                    Infrastructure includes Vector DB nodes, Search nodes, API servers, and Load Balancers.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} size="lg"> &larr; Back </Button>
                <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Simulate Growth &rarr;
                </Button>
            </div>
        </div>
    );
}
