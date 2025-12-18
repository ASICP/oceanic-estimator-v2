import WizardNavigation from '../WizardNavigation';
import { useState } from 'react';

export default function WizardNavigationExample() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log(`Back to step ${currentStep - 1}`);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
        console.log(`Next to step ${currentStep + 1}`);
      }, 1000);
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Wizard completed!");
      alert("Cost estimation completed!");
    }, 2000);
  };

  return (
    <div className="p-6">
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={5}
        onBack={handleBack}
        onNext={handleNext}
        onComplete={handleComplete}
        canProceed={true}
        isLoading={isLoading}
      />
    </div>
  );
}