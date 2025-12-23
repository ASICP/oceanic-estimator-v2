import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlueWhaleFormData } from "@/pages/BlueWhaleCalculatorPage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingDown, ShieldCheck, Zap, X, ChevronRight, Printer } from "lucide-react";

interface Props {
    formData: BlueWhaleFormData;
}

export default function Step3CostComparison({ formData }: Props) {
    const { monthlyTokens, deploymentType } = formData;
    const [activeDrillDown, setActiveDrillDown] = useState<string | null>(null);

    // Pricing Constants (per 1M tokens)
    // Apply 10% discount if annual
    const DISCOUNT_MULTIPLIER = formData.billingFrequency === 'annual' ? 0.9 : 1.0;

    const RATES = {
        openai: 30.00,    // GPT-4o blend
        anthropic: 15.00, // Sonnet 3.5 blend
        google: 7.00,     // Gemini Pro 1.5
        bw_cloud: 0.50 * DISCOUNT_MULTIPLIER,   // Blue Whale Managed
        bw_self: 0.10 * DISCOUNT_MULTIPLIER     // Blue Whale Self-Hosted (Unit cost)
    };

    // Calculate Monthly Costs
    const costs = {
        openai: monthlyTokens * RATES.openai,
        anthropic: monthlyTokens * RATES.anthropic,
        google: monthlyTokens * RATES.google,
        blueWhale: monthlyTokens * (deploymentType === 'cloud' ? RATES.bw_cloud : RATES.bw_self)
    };

    if (deploymentType === 'self-hosted') {
        costs.blueWhale += 500;
    }

    const savings = {
        vsOpenAI: costs.openai - costs.blueWhale,
        vsAnthropic: costs.anthropic - costs.blueWhale
    };

    const chartData = [
        { name: 'OpenAI (GPT-4o)', cost: costs.openai, color: '#10a37f' },
        { name: 'Anthropic (Claude)', cost: costs.anthropic, color: '#d97757' },
        { name: 'Google (Gemini)', cost: costs.google, color: '#4285f4' },
        { name: 'Blue Whale', cost: costs.blueWhale, color: '#3b82f6', active: true }
    ];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="text-center space-y-2 relative">
                <div className="absolute right-0 top-0 hidden md:block print:hidden">
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print Estimate
                    </Button>
                </div>
                <h2 className="text-2xl font-bold">Estimated Cost Analysis</h2>
                <p className="text-muted-foreground">
                    Monthly cost comparison based on {monthlyTokens}M tokens ({deploymentType}).
                </p>
                <p className="text-xs text-blue-500 font-medium print:hidden">Click on any card to see detailed breakdown</p>
            </div>

            {/* Drill Down Overlay */}
            {activeDrillDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveDrillDown(null)}>
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setActiveDrillDown(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            {activeDrillDown === 'savings' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                                            <TrendingDown className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">ROI Breakdown</h3>
                                            <p className="text-muted-foreground">Detailed financial impact analysis</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                                            <div className="text-sm font-medium text-muted-foreground">Annual Savings (vs OpenAI)</div>
                                            <div className="text-3xl font-bold text-green-600">{formatCurrency(savings.vsOpenAI * 12)}</div>
                                            <div className="text-xs text-muted-foreground">Equivalent to {(savings.vsOpenAI * 12 / 120000).toFixed(1)} full-time senior engineers</div>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                                            <div className="text-sm font-medium text-muted-foreground">Cost reduction</div>
                                            <div className="text-3xl font-bold text-blue-600">{((1 - costs.blueWhale / costs.openai) * 100).toFixed(1)}%</div>
                                            <div className="text-xs text-muted-foreground">Reduction in operational expenses</div>
                                        </div>
                                    </div>

                                    <div className="border rounded-xl p-4">
                                        <h4 className="font-semibold mb-4">5-Year TCO Projection</h4>
                                        <div className="h-[250px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={[
                                                    { year: 'Y1', legacy: costs.openai * 12, bw: costs.blueWhale * 12 },
                                                    { year: 'Y2', legacy: costs.openai * 12 * 1.1, bw: costs.blueWhale * 12 },
                                                    { year: 'Y3', legacy: costs.openai * 12 * 1.2, bw: costs.blueWhale * 12 },
                                                    { year: 'Y4', legacy: costs.openai * 12 * 1.3, bw: costs.blueWhale * 12 },
                                                    { year: 'Y5', legacy: costs.openai * 12 * 1.4, bw: costs.blueWhale * 12 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                                    <XAxis dataKey="year" />
                                                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                                                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="legacy" name="General LLM (Growth)" stroke="#d97757" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="bw" name="Blue Whale (Fixed)" stroke="#3b82f6" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeDrillDown === 'cost' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                                            <BadgeDollarSign className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Cost Per Token Comparison</h3>
                                            <p className="text-muted-foreground">Unit economics breakdown</p>
                                        </div>
                                    </div>

                                    <div className="border rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted text-muted-foreground">
                                                <tr>
                                                    <th className="p-3">Model</th>
                                                    <th className="p-3">Cost / 1M Tokens</th>
                                                    <th className="p-3">Cost / 1B Tokens</th>
                                                    <th className="p-3">Relative Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                <tr className="bg-card">
                                                    <td className="p-3 font-medium">OpenAI GPT-4o</td>
                                                    <td className="p-3">$30.00</td>
                                                    <td className="p-3">$30,000</td>
                                                    <td className="p-3">60x</td>
                                                </tr>
                                                <tr className="bg-card">
                                                    <td className="p-3 font-medium">Anthropic Sonnet 3.5</td>
                                                    <td className="p-3">$15.00</td>
                                                    <td className="p-3">$15,000</td>
                                                    <td className="p-3">30x</td>
                                                </tr>
                                                <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                                                    <td className="p-3 font-bold text-blue-600">Blue Whale (Managed)</td>
                                                    <td className="p-3 text-blue-600 font-bold">$0.50</td>
                                                    <td className="p-3">$500</td>
                                                    <td className="p-3 font-bold">1x</td>
                                                </tr>
                                                <tr className="bg-purple-50/50 dark:bg-purple-900/10">
                                                    <td className="p-3 font-bold text-purple-600">Blue Whale (Self-Hosted)</td>
                                                    <td className="p-3 text-purple-600 font-bold">$0.10</td>
                                                    <td className="p-3">$100</td>
                                                    <td className="p-3 font-bold">0.2x</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
                                        <strong>Note:</strong> Self-hosted costs excludes infrastructure. Managed Cloud includes all serving infrastructure.
                                    </div>
                                </div>
                            )}

                            {activeDrillDown === 'latency' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Latency Benchmark</h3>
                                            <p className="text-muted-foreground">Time to First Token (TTFT) Comparison</p>
                                        </div>
                                    </div>

                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'GPT-4o', ms: 550, fill: '#10a37f' },
                                                { name: 'Claude 3.5', ms: 480, fill: '#d97757' },
                                                { name: 'Blue Whale', ms: 45, fill: '#eab308' }, // Yellow for speed
                                            ]} layout="vertical" margin={{ left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                                <XAxis type="number" unit="ms" />
                                                <YAxis dataKey="name" type="category" width={100} />
                                                <Tooltip cursor={{ fill: 'transparent' }} />
                                                <Bar dataKey="ms" radius={[0, 4, 4, 0]} barSize={40}>

                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-2xl font-bold">~45ms</div>
                                            <div className="text-xs text-muted-foreground">Blue Whale P95</div>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-2xl font-bold">~500ms</div>
                                            <div className="text-xs text-muted-foreground">GPT-4 Avg</div>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">11x</div>
                                            <div className="text-xs text-muted-foreground">Faster</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeDrillDown === 'expert' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                                            <ShieldCheck className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Domain Expertise</h3>
                                            <p className="text-muted-foreground">Accuracy on Specific Benchmarks</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border rounded-xl p-4 space-y-4">
                                            <h4 className="font-semibold text-center">Legal Contract Review (CUAD)</h4>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>SaulLM-7B (Blue Whale)</span>
                                                        <span className="font-bold">82%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600" style={{ width: '82%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>GPT-4 (Zero shot)</span>
                                                        <span className="font-bold">76%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full bg-gray-400" style={{ width: '76%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border rounded-xl p-4 space-y-4">
                                            <h4 className="font-semibold text-center">Medical QA (PubMedQA)</h4>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>MedAlpaca (Blue Whale)</span>
                                                        <span className="font-bold">71%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600" style={{ width: '71%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Llama 2 70B (Base)</span>
                                                        <span className="font-bold">62%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full bg-gray-400" style={{ width: '62%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-muted/30 rounded-xl text-sm italic text-center">
                                        "Domain Specific SLMs outperform generalist models by being trained on expected industry vocabularies and document structures."
                                    </div>
                                </div>
                            )}

                            {activeDrillDown === 'margin' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                            <TrendingDown className="w-8 h-8 rotate-180" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Deal Margin Analysis</h3>
                                            <p className="text-muted-foreground">Profitability Estimator for MSPs & Resellers</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Cost of Goods (COGS)</div>
                                            <div className="text-3xl font-bold text-red-500">${(deploymentType === 'cloud' ? 0.50 : 0.10).toFixed(2)}</div>
                                            <div className="text-xs text-muted-foreground">Per 1M Tokens</div>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Rec. Resale Price</div>
                                            <div className="text-3xl font-bold text-blue-500">$2.50</div>
                                            <div className="text-xs text-muted-foreground">Per 1M Tokens (Still 10x cheaper than OpenAI)</div>
                                        </div>
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl space-y-2 text-center border-2 border-indigo-100 dark:border-indigo-900">
                                            <div className="text-sm font-bold text-indigo-600">Net Margin</div>
                                            <div className="text-3xl font-bold text-indigo-700">
                                                {deploymentType === 'cloud' ? '80%' : '96%'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Profit Retained</div>
                                        </div>
                                    </div>

                                    <div className="border rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted text-muted-foreground">
                                                <tr>
                                                    <th className="p-3">Component</th>
                                                    <th className="p-3">Scenario A (Reselling GPT-4)</th>
                                                    <th className="p-3">Scenario B (Reselling Blue Whale)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                <tr className="bg-card">
                                                    <td className="p-3 font-medium">Your Cost (COGS)</td>
                                                    <td className="p-3">$30.00 / 1M</td>
                                                    <td className="p-3 font-bold text-green-600">${deploymentType === 'cloud' ? '0.50' : '0.10'} / 1M</td>
                                                </tr>
                                                <tr className="bg-card">
                                                    <td className="p-3 font-medium">Sales Price to Client</td>
                                                    <td className="p-3">$35.00 (15% Markup)</td>
                                                    <td className="p-3">$5.00 (900% Markup)</td>
                                                </tr>
                                                <tr className="bg-card">
                                                    <td className="p-3 font-medium">Client Savings</td>
                                                    <td className="p-3 text-red-500">None (More Expensive)</td>
                                                    <td className="p-3 text-green-600">83% Cheaper vs GPT-4</td>
                                                </tr>
                                                <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
                                                    <td className="p-3 font-bold">Your Profit</td>
                                                    <td className="p-3">$5.00</td>
                                                    <td className="p-3 font-bold text-indigo-600">${deploymentType === 'cloud' ? '4.50' : '4.90'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm">
                                        <strong>Sales Insight:</strong> You can undercut generic LLM market rates by 80% while retaining a 90% profit margin due to the extreme efficiency of the Blue Whale SLMs.
                                    </div>
                                </div>
                            )}

                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Savings Card */}
                <Card
                    className="bg-gradient-to-br from-green-500 to-emerald-700 text-white border-none shadow-xl col-span-1 md:col-span-3 lg:col-span-1 cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setActiveDrillDown('savings')}
                >
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium opacity-90">Potential Monthly Savings</CardTitle>
                            <ChevronRight className="w-5 h-5 opacity-70" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">
                            {formatCurrency(savings.vsOpenAI)}
                        </div>
                        <p className="text-sm opacity-80 mb-4">
                            vs. General Purpose LLMs
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-white/20 pb-1">
                                <span>Annual Savings:</span>
                                <span className="font-semibold">{formatCurrency(savings.vsOpenAI * 12)}</span>
                            </div>
                            <div className="flex justify-between border-white/20 pb-1">
                                <span>ROI Multiplier:</span>
                                <span className="font-semibold">{(costs.openai / costs.blueWhale).toFixed(1)}x</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart */}
                <Card className="col-span-1 md:col-span-3 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Cost Comparison (Monthly)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={entry.active ? 1 : 0.6} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="flex flex-col items-center p-4 bg-muted/40 rounded-xl text-center cursor-pointer hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-blue-500/20"
                    onClick={() => setActiveDrillDown('cost')}
                >
                    <BadgeDollarSign className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-foreground">Lower Cost</h3>
                    <p className="text-sm text-muted-foreground mt-1">90-95% cheaper per token than generic frontier models.</p>
                </div>
                <div
                    className="flex flex-col items-center p-4 bg-muted/40 rounded-xl text-center cursor-pointer hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-blue-500/20"
                    onClick={() => setActiveDrillDown('latency')}
                >
                    <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-foreground">Low Latency</h3>
                    <p className="text-sm text-muted-foreground mt-1">{"<"}50ms inference vs 500ms+ for large models.</p>
                </div>
                <div
                    className="flex flex-col items-center p-4 bg-muted/40 rounded-xl text-center cursor-pointer hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-blue-500/20"
                    onClick={() => setActiveDrillDown('expert')}
                >
                    <ShieldCheck className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-foreground">Domain Expert</h3>
                    <p className="text-sm text-muted-foreground mt-1">Higher accuracy (85%+) on specific domain tasks.</p>
                </div>

                {/* Margin Box - New Requirement */}
                <div
                    className="flex flex-col items-center p-4 bg-muted/40 rounded-xl text-center cursor-pointer hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-blue-500/20 md:col-span-3 lg:col-span-3"
                    onClick={() => setActiveDrillDown('margin')}
                >
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                        <TrendingDown className="w-8 h-8 text-indigo-600 rotate-180" />
                    </div>

                    <h3 className="font-semibold text-foreground text-lg">Projected Margin: ~70-80%</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        Estimated profit margin for service providers reselling Blue Whale compared to reselling generic APIs.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Icon helper
function BadgeDollarSign({ className }: { className?: string }) {
    return <DollarSign className={className} />
}
