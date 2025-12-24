import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EchoConfig } from "@/lib/echoPricingEngine";
import { Building2, Cloud, Server, ShieldCheck } from "lucide-react";

interface Step1Props {
    data: Partial<EchoConfig>;
    updateData: (data: Partial<EchoConfig>) => void;
    onNext: () => void;
}

export default function Step1ProductSelection({ data, updateData, onNext }: Step1Props) {
    const industries = [
        "Financial Services", "Healthcare", "Legal", "Technology", "Manufacturing", "Retail", "Other"
    ];

    const companySizes = [
        { value: "startup", label: "Startup (<50 employees)" },
        { value: "small", label: "Small Business (50-200)" },
        { value: "mid", label: "Mid-Market (200-1,000)" },
        { value: "enterprise", label: "Enterprise (1,000+)" }
    ];

    const useCasesList = [
        "Internal knowledge search", "Customer support automation", "Research & due diligence", "Compliance & audit"
    ];

    const toggleUseCase = (uc: string) => {
        const current = data.useCases || [];
        if (current.includes(uc)) {
            updateData({ useCases: current.filter(c => c !== uc) });
        } else {
            updateData({ useCases: [...current, uc] });
        }
    };

    const isFormValid = data.deploymentType && data.industry && (data.useCases?.length || 0) > 0;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Product Selection & Scope
                </h2>
                <p className="text-muted-foreground">Define your deployment model and business context.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-blue-500" /> Deployment Model
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={data.deploymentType}
                        onValueChange={(v) => updateData({ deploymentType: v as any })}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className={`border-2 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-all ${data.deploymentType === 'managed_saas' ? 'border-blue-600 bg-blue-50/50' : 'border-border'}`}>
                            <RadioGroupItem value="managed_saas" id="saas" className="sr-only" />
                            <Label htmlFor="saas" className="cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg"><Cloud className="h-6 w-6 text-blue-600" /></div>
                                    <span className="font-bold text-lg">Echo Enterprise (SaaS)</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Fully managed, secure cloud deployment. Best for rapid scaling and zero maintenance.</p>
                            </Label>
                        </div>

                        <div className={`border-2 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-all ${data.deploymentType === 'self_hosted' ? 'border-blue-600 bg-blue-50/50' : 'border-border'}`}>
                            <RadioGroupItem value="self_hosted" id="self" className="sr-only" />
                            <Label htmlFor="self" className="cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-slate-100 rounded-lg"><Server className="h-6 w-6 text-slate-700" /></div>
                                    <span className="font-bold text-lg">Echo Advanced (Self-Hosted)</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Deploy in your VPC or on-premise. Total control over data and infrastructure.</p>
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-purple-500" /> Organization Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2 block">Industry</Label>
                            <Select value={data.industry} onValueChange={(v) => updateData({ industry: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-500" /> Primary Use Cases
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {useCasesList.map(uc => (
                            <div key={uc} className="flex items-center space-x-2">
                                <Checkbox
                                    id={uc}
                                    checked={data.useCases?.includes(uc)}
                                    onCheckedChange={() => toggleUseCase(uc)}
                                />
                                <Label htmlFor={uc}>{uc}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={onNext} disabled={!isFormValid} size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                    Continue to Team Configuration &rarr;
                </Button>
            </div>
        </div>
    );
}
