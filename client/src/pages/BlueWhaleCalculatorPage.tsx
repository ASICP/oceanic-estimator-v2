import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calculator, Check, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Step1DomainSelection from "@/components/blue-whale/Step1DomainSelection";
import Step2UsageParameters from "@/components/blue-whale/Step2UsageParameters";
import Step3CostComparison from "@/components/blue-whale/Step3CostComparison";

export interface BlueWhaleFormData {
    // Step 1: Domains
    selectedDomains: string[];

    // Step 2: Usage
    monthlyTokens: number; // in Millions
    deploymentType: 'cloud' | 'self-hosted';
    billingFrequency: 'monthly' | 'annual';

    // Step 3: Comparison (Derived, but maybe we store preferences)
    compareWith: string[]; // ['openai', 'anthropic', 'google']
}

const INITIAL_FORM_DATA: BlueWhaleFormData = {
    selectedDomains: [],
    monthlyTokens: 10, // 10M default
    deploymentType: 'cloud',
    billingFrequency: 'monthly',
    compareWith: ['openai', 'anthropic', 'google']
};

export default function BlueWhaleCalculatorPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BlueWhaleFormData>(INITIAL_FORM_DATA);

    const updateFormData = (updates: Partial<BlueWhaleFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </a>
                            </Link>
                            <div className="h-6 w-px bg-border mx-2" />
                            <svg
                                className="w-8 h-8 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M22.5 13.5C22.5 13.5 20.8 11.2 19 11.2C17.2 11.2 16.5 12.5 15.5 12.5C14.5 12.5 13.5 11 11.5 11C9.5 11 8.5 12.5 7.5 12.5C6.5 12.5 5.5 11.2 4.5 11.2C3.5 11.2 2 12 2 13.5C2 15 4 16 7 16C10 16 11.5 15 13 15C14.5 15 16 16 18 16C20 16 22.5 15 22.5 13.5Z" opacity="0.5" />
                                <path d="M18.8 8.5C18 7.5 16.5 7 15 7C12 7 10 9 10 9C10 9 9 8.5 8 8.5C7 8.5 6 9 6 9L5.5 8.5C5.5 8.5 7 7.5 8 7.5C9 7.5 10.5 8 10.5 8C10.5 8 13 5 17 5C19 5 21 7 21 7L18.8 8.5Z" />
                                <path d="M21.5 14C20 14 18.5 13.5 17.5 13.5C16.5 13.5 15.5 14.2 14.5 14.2C13.5 14.2 12.5 13.5 11.5 13.5C10.5 13.5 9.5 14.2 8.5 14.2C7.5 14.2 6.5 13.5 5.5 13.5C4.5 13.5 3 14 2.5 15C2.5 15 5 17 9 17C13 17 15 16.2 16.5 16.2C18 16.2 20 17 22 17C22 17 22.5 15.5 21.5 14Z" />
                                <circle cx="15.5" cy="9.5" r="1" fill="white" />
                            </svg>
                            <div>
                                <h1 className="text-2xl font-bold">Oceanic Estimator</h1>
                                <p className="text-sm font-bold text-blue-500">Blue Whale Calculator</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            {/* Connecting Line */}
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted -z-10" />

                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${currentStep === step
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : currentStep > step
                                                ? 'border-blue-500 bg-background text-blue-500'
                                                : 'border-muted bg-muted/50 text-muted-foreground'
                                            }`}
                                    >
                                        {currentStep > step ? <Check className="w-6 h-6" /> : step}
                                    </div>
                                    <span className={`text-sm font-medium ${currentStep === step ? 'text-blue-500' : 'text-muted-foreground'
                                        }`}>
                                        {step === 1 && 'Domains'}
                                        {step === 2 && 'Usage'}
                                        {step === 3 && 'Analysis'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[400px]">
                        {currentStep === 1 && (
                            <Step1DomainSelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}

                        {currentStep === 2 && (
                            <Step2UsageParameters
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}

                        {currentStep === 3 && (
                            <Step3CostComparison
                                formData={formData}
                            />
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-8 border-t">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            Step {currentStep} of 3
                        </div>

                        {currentStep < 3 ? (
                            <Button
                                onClick={handleNext}
                                className="gap-2 bg-blue-600 hover:bg-blue-700"
                                disabled={currentStep === 1 && formData.selectedDomains.length === 0}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                            >
                                Start Over
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
