import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlueWhaleFormData } from "@/pages/BlueWhaleCalculatorPage";
import { Cloud, Server, CircuitBoard } from "lucide-react";

interface Props {
    formData: BlueWhaleFormData;
    updateFormData: (updates: Partial<BlueWhaleFormData>) => void;
}

export default function Step2UsageParameters({ formData, updateFormData }: Props) {
    const handleTokenChange = (value: number[]) => {
        updateFormData({ monthlyTokens: value[0] });
    };

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Usage & Deployment</h2>
                <p className="text-muted-foreground">
                    Estimate your scale and choose your deployment model.
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">

                {/* Token Volume */}
                <div className="space-y-4 p-6 border rounded-xl bg-card">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Monthly Token Volume</Label>
                        <span className="text-2xl font-bold text-blue-500">
                            {formatNumber(formData.monthlyTokens)} <span className="text-sm text-muted-foreground font-normal">Million Tokens</span>
                        </span>
                    </div>

                    <Slider
                        value={[formData.monthlyTokens]}
                        min={1}
                        max={500}
                        step={1}
                        onValueChange={handleTokenChange}
                        className="py-4"
                    />

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1M</span>
                        <span>100M</span>
                        <span>250M</span>
                        <span>500M+</span>
                    </div>

                    <p className="text-sm text-muted-foreground pt-2">
                        *Based on average interaction of 1k input / 500 output tokens per request.
                    </p>
                </div>

                {/* Deployment Type */}
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Deployment Model</Label>

                    <RadioGroup
                        value={formData.deploymentType}
                        onValueChange={(val) => updateFormData({ deploymentType: val as 'cloud' | 'self-hosted' })}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="cloud" id="cloud" className="peer sr-only" />
                            <Label
                                htmlFor="cloud"
                                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer transition-all"
                            >
                                <Cloud className="mb-3 h-8 w-8 text-blue-500" />
                                <div className="text-center space-y-1">
                                    <div className="font-bold text-lg">Managed Cloud</div>
                                    <div className="text-sm text-muted-foreground">Serverless API access</div>
                                </div>
                                <div className="mt-4 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                    Simplest to start
                                </div>
                            </Label>
                        </div>

                        <div>
                            <RadioGroupItem value="self-hosted" id="self-hosted" className="peer sr-only" />
                            <Label
                                htmlFor="self-hosted"
                                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer transition-all"
                            >
                                <Server className="mb-3 h-8 w-8 text-purple-500" />
                                <div className="text-center space-y-1">
                                    <div className="font-bold text-lg">Self-Hosted / On-Prem</div>
                                    <div className="text-sm text-muted-foreground">Private vLLM/Ollama clusters</div>
                                </div>
                                <div className="mt-4 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                    Max privacy & lowest unit cost
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Billing Frequency */}
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Billing Frequency</Label>
                    <div className="flex items-center space-x-4">
                        <div
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer w-full transition-all ${formData.billingFrequency === 'monthly'
                                    ? 'border-blue-500 bg-blue-50/10'
                                    : 'border-muted hover:border-blue-200'
                                }`}
                            onClick={() => updateFormData({ billingFrequency: 'monthly' })}
                        >
                            <span className="font-bold">Monthly</span>
                            <span className="text-xs text-muted-foreground">Standard pricing</span>
                        </div>

                        <div
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer w-full transition-all relative ${formData.billingFrequency === 'annual'
                                    ? 'border-blue-500 bg-blue-50/10'
                                    : 'border-muted hover:border-blue-200'
                                }`}
                            onClick={() => updateFormData({ billingFrequency: 'annual' })}
                        >
                            <div className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                SAVE 10%
                            </div>
                            <span className="font-bold">Annual</span>
                            <span className="text-xs text-muted-foreground">Prepaid annually</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
