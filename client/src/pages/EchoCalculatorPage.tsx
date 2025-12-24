import { useState } from "react";
import { useLocation } from "wouter";
import { EchoConfig } from "@/lib/echoPricingEngine";
import Step1ProductSelection from "@/components/echo/Step1ProductSelection";
import Step2TeamConfiguration from "@/components/echo/Step2TeamConfiguration";
import Step3UsageBuilder from "@/components/echo/Step3UsageBuilder";
import Step4Analysis from "@/components/echo/Step4Analysis";
import Step5Simulate from "@/components/echo/Step5Simulate";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EchoCalculatorPage() {
    const [_, setLocation] = useLocation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<EchoConfig>>({
        deploymentType: 'managed_saas',
        industry: '',
        useCases: [],
        users: 250,
        connectors: 5,
        storageGB: 100,
        voicePercentage: 0,
        visualPercentage: 0,
        powerUserPercent: 20,
        addons: {
            advancedAnalytics: false,
            dedicatedCSM: false
        }
    });

    const updateData = (newData: Partial<EchoConfig>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1ProductSelection data={formData} updateData={updateData} onNext={() => setStep(2)} />;
            case 2:
                return <Step2TeamConfiguration data={formData} updateData={updateData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
            case 3:
                return <Step3UsageBuilder data={formData} updateData={updateData} onNext={() => setStep(4)} onBack={() => setStep(2)} />;
            case 4:
                return <Step4Analysis data={formData as EchoConfig} onNext={() => setStep(5)} onBack={() => setStep(3)} />;
            case 5:
                return <Step5Simulate data={formData as EchoConfig} onBack={() => setStep(4)} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
                        <Zap className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-xl">Echo Estimator</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Step {step} of 5</span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {renderStep()}
            </main>
        </div>
    );
}
