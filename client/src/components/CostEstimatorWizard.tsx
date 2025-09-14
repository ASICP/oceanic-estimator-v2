import { useState } from "react";
import WizardHeader from "./WizardHeader";
import WizardNavigation from "./WizardNavigation";
import Step1DefineWorkflow from "./Step1DefineWorkflow";
import Step2AssembleTeam from "./Step2AssembleTeam";
import Step3ResourceNeeds from "./Step3ResourceNeeds";
import Step4PricingBilling from "./Step4PricingBilling";
import Step5FinalizeSimulate from "./Step5FinalizeSimulate";

const STEP_TITLES = [
  "Define Workflow",
  "Assemble Team", 
  "Resource Needs",
  "Pricing & Billing",
  "Finalize & Simulate"
];

interface WizardData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
}

export default function CostEstimatorWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStepData = (step: number, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    console.log("Wizard completed with data:", wizardData);
    // TODO: Send data to backend for processing
    alert("🎉 Cost estimation completed! Your detailed report is being generated.");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.step1?.selectedPreset || wizardData.step1?.category;
      case 2:
        return wizardData.step2?.selectedAgents?.length > 0;
      case 3:
        return wizardData.step3?.estimatedCost !== undefined;
      case 4:
        return wizardData.step4?.billingModel;
      case 5:
        return true;
      default:
        return false;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <WizardHeader 
          currentStep={5} 
          totalSteps={5} 
          stepTitles={STEP_TITLES}
        />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-foreground">
              Cost Estimation Complete!
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive cost analysis for the Esteemed Ventures AI agent platform has been generated. 
              You should receive a detailed report shortly with actionable insights and next steps.
            </p>
            <div className="pt-6">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Start New Estimation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WizardHeader 
        currentStep={currentStep} 
        totalSteps={5} 
        stepTitles={STEP_TITLES}
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border border-card-border p-8">
          {currentStep === 1 && (
            <Step1DefineWorkflow 
              onDataChange={(data) => handleStepData(1, data)}
            />
          )}
          
          {currentStep === 2 && (
            <Step2AssembleTeam 
              onDataChange={(data) => handleStepData(2, data)}
              presetData={wizardData.step1}
            />
          )}
          
          {currentStep === 3 && (
            <Step3ResourceNeeds 
              onDataChange={(data) => handleStepData(3, data)}
              agentCount={wizardData.step2?.agentCount || 3}
            />
          )}
          
          {currentStep === 4 && (
            <Step4PricingBilling 
              onDataChange={(data) => handleStepData(4, data)}
              agentCount={wizardData.step2?.agentCount || 3}
              resourceCost={wizardData.step3?.estimatedCost || 15000}
            />
          )}
          
          {currentStep === 5 && (
            <Step5FinalizeSimulate 
              wizardData={wizardData}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          )}

          {currentStep < 5 && (
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={5}
              onBack={handleBack}
              onNext={handleNext}
              canProceed={canProceed()}
            />
          )}
        </div>
      </div>
    </div>
  );
}