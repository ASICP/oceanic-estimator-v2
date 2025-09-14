import Step5FinalizeSimulate from '../Step5FinalizeSimulate';

export default function Step5FinalizeSimulateExample() {
  const mockWizardData = {
    step1: {
      selectedPreset: {
        title: "Deal Sourcing",
        domain: "Investment Ops"
      },
      complexity: "Medium",
      duration: "4-8 hrs"
    },
    step2: {
      agentCount: 5,
      selectedAgents: [
        { name: "Clay", role: "Project Manager" },
        { name: "Finley", role: "Financial Modeling" },
        { name: "Lex", role: "Legal Specialist" }
      ]
    },
    step4: {
      billingModel: "Hybrid"
    }
  };

  const handleComplete = () => {
    console.log("Cost estimation completed!");
    alert("Thank you! Your cost estimation is complete. You'll receive a detailed report shortly.");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Step5FinalizeSimulate 
        wizardData={mockWizardData}
        onComplete={handleComplete}
      />
    </div>
  );
}