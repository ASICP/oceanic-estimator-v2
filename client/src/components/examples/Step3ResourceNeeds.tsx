import Step3ResourceNeeds from '../Step3ResourceNeeds';

export default function Step3ResourceNeedsExample() {
  const handleDataChange = (data: any) => {
    console.log('Step 3 data changed:', data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Step3ResourceNeeds onDataChange={handleDataChange} agentCount={5} />
    </div>
  );
}