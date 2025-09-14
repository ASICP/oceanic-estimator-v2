import WizardHeader from '../WizardHeader';

export default function WizardHeaderExample() {
  const stepTitles = [
    "Define Workflow",
    "Assemble Team", 
    "Resource Needs",
    "Pricing & Billing",
    "Finalize & Simulate"
  ];

  return (
    <WizardHeader 
      currentStep={2} 
      totalSteps={5} 
      stepTitles={stepTitles}
    />
  );
}