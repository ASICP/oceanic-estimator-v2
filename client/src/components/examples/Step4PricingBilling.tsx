import Step4PricingBilling from '../Step4PricingBilling';

export default function Step4PricingBillingExample() {
  const handleDataChange = (data: any) => {
    console.log('Step 4 data changed:', data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Step4PricingBilling 
        onDataChange={handleDataChange}
        agentCount={5}
        resourceCost={25000}
      />
    </div>
  );
}