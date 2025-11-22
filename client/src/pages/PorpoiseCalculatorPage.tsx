import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calculator, Eye, EyeOff } from "lucide-react";
import ProductSelectionStep from "@/components/porpoise/ProductSelectionStep";
import TeamConfigurationStep from "@/components/porpoise/TeamConfigurationStep";
import ResultsStep from "@/components/porpoise/ResultsStep";

export interface PorpoiseFormData {
  // Step 1: Product Selection
  tierId: 'starter' | 'professional' | 'team' | 'enterprise';
  billingPeriod: 'monthly' | 'annual';
  deploymentType: 'cloud' | 'byoc' | 'air_gap';
  ssoRequired: boolean;
  whiteLabelAvatars: boolean;
  
  // Step 2: Team & Resource Configuration
  numUsers: number;
  concurrentJobs: number;
  storageGb: number;
  gpuHoursMonthly: number;
  apiCallsMonthly: number;
  numAvatars: number;
}

const INITIAL_FORM_DATA: PorpoiseFormData = {
  tierId: 'starter',
  billingPeriod: 'annual',
  deploymentType: 'cloud',
  ssoRequired: false,
  whiteLabelAvatars: false,
  numUsers: 10,
  concurrentJobs: 3,
  storageGb: 10,
  gpuHoursMonthly: 20,
  apiCallsMonthly: 5000,
  numAvatars: 0
};

export default function PorpoiseCalculatorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PorpoiseFormData>(INITIAL_FORM_DATA);
  const [viewMode, setViewMode] = useState<'client' | 'internal'>('client');
  
  const updateFormData = (updates: Partial<PorpoiseFormData>) => {
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
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'client' ? 'internal' : 'client');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Porpoise v2</h1>
                <p className="text-sm text-muted-foreground">Pricing Calculator</p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <Button
              variant="outline"
              onClick={toggleViewMode}
              className="gap-2"
              data-testid="button-toggle-view-mode"
            >
              {viewMode === 'client' ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Client View
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Internal View
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentStep === step
                          ? 'bg-primary text-primary-foreground'
                          : currentStep > step
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      data-testid={`step-indicator-${step}`}
                    >
                      {step}
                    </div>
                    <span className={`text-sm font-medium ${
                      currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step === 1 && 'Product Selection'}
                      {step === 2 && 'Configuration'}
                      {step === 3 && 'Results'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <ProductSelectionStep
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              
              {currentStep === 2 && (
                <TeamConfigurationStep
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              
              {currentStep === 3 && (
                <ResultsStep
                  formData={formData}
                  viewMode={viewMode}
                />
              )}
            </CardContent>
          </Card>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
              data-testid="button-back"
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
                className="gap-2"
                data-testid="button-next"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                data-testid="button-start-over"
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
