import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { EchoConfig } from "@/lib/echoPricingEngine";
import { Users, TrendingUp, Zap } from "lucide-react";

interface Step2Props {
    data: Partial<EchoConfig>;
    updateData: (data: Partial<EchoConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2TeamConfiguration({ data, updateData, onNext, onBack }: Step2Props) {
    const users = data.users || 250;
    const powerUserPercent = data.powerUserPercent || 20;

    // Real-time calculation Preview
    const powerUsers = Math.floor(users * (powerUserPercent / 100));
    const regularUsers = Math.floor(users * 0.6); // Assumed 60%
    const occasionalUsers = Math.max(0, users - powerUsers - regularUsers);

    const estimatedQueries =
        (powerUsers * 50 * 30) +
        (regularUsers * 15 * 30) +
        (occasionalUsers * 3 * 30);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Team Configuration
                </h2>
                <p className="text-muted-foreground">Estimate your user base and usage intensity.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" /> Total Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Headcount</span>
                                    <span className="text-2xl font-bold font-mono text-blue-600">{users}</span>
                                </div>
                                <Slider
                                    value={[users]}
                                    min={10}
                                    max={5000}
                                    step={10}
                                    onValueChange={(v) => updateData({ users: v[0] })}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>10</span>
                                    <span>1,000</span>
                                    <span>5,000+</span>
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block flex justify-between">
                                    <span>Power Users (50+ queries/day)</span>
                                    <span className="font-bold text-amber-500">{powerUserPercent}%</span>
                                </Label>
                                <Slider
                                    value={[powerUserPercent]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(v) => updateData({ powerUserPercent: v[0] })}
                                    className="py-4"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Power users typically include researchers, support agents, and developers who rely heavily on search.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" /> Usage Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="text-2xl font-bold text-amber-600">{powerUsers}</div>
                                    <div className="text-xs font-medium text-amber-800 uppercase mt-1">Power Users</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-600">{regularUsers}</div>
                                    <div className="text-xs font-medium text-blue-800 uppercase mt-1">Regular</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-2xl font-bold text-slate-600">{occasionalUsers}</div>
                                    <div className="text-xs font-medium text-slate-800 uppercase mt-1">Occasional</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Preview */}
                <div>
                    <Card className="bg-slate-900 text-slate-100 border-slate-800 h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-white">
                                <Zap className="h-5 w-5 text-yellow-400" /> Estimated Load
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Monthly Queries</div>
                                <div className="text-3xl font-bold font-mono text-cyan-400">
                                    {estimatedQueries.toLocaleString()}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-slate-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Avg Queries/User</span>
                                    <span className="font-mono">{Math.round(estimatedQueries / users)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Daily Volume</span>
                                    <span className="font-mono">{Math.round(estimatedQueries / 30).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-blue-200">
                                Based on your user distribution, this workload fits comfortably within the <strong>Professional</strong> tier limits.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} size="lg"> &larr; Back </Button>
                <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Continue to Usage Builder &rarr;
                </Button>
            </div>
        </div>
    );
}
