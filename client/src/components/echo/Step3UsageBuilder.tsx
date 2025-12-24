import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { EchoConfig } from "@/lib/echoPricingEngine";
import { Database, HardDrive, Plug, Mic, Image as ImageIcon } from "lucide-react";

interface Step3Props {
    data: Partial<EchoConfig>;
    updateData: (data: Partial<EchoConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step3UsageBuilder({ data, updateData, onNext, onBack }: Step3Props) {
    const addons = data.addons || { advancedAnalytics: false, dedicatedCSM: false };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Usage & Connectors
                </h2>
                <p className="text-muted-foreground">Configure data sources and storage requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plug className="h-5 w-5 text-green-500" /> Data Connectors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Standard Connectors</span>
                                <span className="text-2xl font-bold font-mono text-green-600">{data.connectors || 5}</span>
                            </div>
                            <Slider
                                value={[data.connectors || 5]}
                                min={1}
                                max={100}
                                step={1}
                                onValueChange={(v) => updateData({ connectors: v[0] })}
                                className="py-4"
                            />
                            <p className="text-xs text-muted-foreground">Includes Google Drive, Slack, Jira, Confluence, etc.</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-700">Custom Connectors</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-16 p-1 border rounded text-center"
                                    value={data.customConnectorsCount || 0}
                                    onChange={(e) => updateData({ customConnectorsCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">For proprietary internal tools ($15k one-time dev fee).</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-blue-500" /> Storage Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Indexed Data</span>
                            <span className="text-2xl font-bold font-mono text-blue-600">{data.storageGB || 100} GB</span>
                        </div>
                        <Slider
                            value={[data.storageGB || 100]}
                            min={10}
                            max={5000}
                            step={10}
                            onValueChange={(v) => updateData({ storageGB: v[0] })}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>10 GB</span>
                            <span>1 TB</span>
                            <span>5 TB</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-500" /> Query Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label className="flex items-center gap-2 mb-2">
                                <Mic className="h-4 w-4" /> Voice Queries (%)
                            </Label>
                            <Slider
                                value={[data.voicePercentage || 0]}
                                max={100}
                                onValueChange={(v) => updateData({ voicePercentage: v[0] })}
                            />
                            <div className="text-right text-xs text-muted-foreground mt-1">{data.voicePercentage}%</div>
                        </div>
                        <div>
                            <Label className="flex items-center gap-2 mb-2">
                                <ImageIcon className="h-4 w-4" /> Visual Search (%)
                            </Label>
                            <Slider
                                value={[data.visualPercentage || 0]}
                                max={100}
                                onValueChange={(v) => updateData({ visualPercentage: v[0] })}
                            />
                            <div className="text-right text-xs text-muted-foreground mt-1">{data.visualPercentage}%</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Premium Add-ons</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                            <Checkbox
                                id="analytics"
                                checked={addons.advancedAnalytics}
                                onCheckedChange={(c) => updateData({ addons: { ...addons, advancedAnalytics: c as boolean } })}
                                className="border-white/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="analytics" className="text-white cursor-pointer font-bold">Advanced Analytics (+$2k/mo)</Label>
                                <p className="text-xs text-slate-300">Deep insights into search patterns and content gaps.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                            <Checkbox
                                id="csm"
                                checked={addons.dedicatedCSM}
                                onCheckedChange={(c) => updateData({ addons: { ...addons, dedicatedCSM: c as boolean } })}
                                className="border-white/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="csm" className="text-white cursor-pointer font-bold">Dedicated CSM (+$5k/mo)</Label>
                                <p className="text-xs text-slate-300">Priority support and quarterly business reviews.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} size="lg"> &larr; Back </Button>
                <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Analyze Pricing &rarr;
                </Button>
            </div>
        </div>
    );
}
