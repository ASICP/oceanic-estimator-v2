import Step1DefineWorkflow from '../Step1DefineWorkflow';

export default function Step1DefineWorkflowExample() {
  const handleDataChange = (data: any) => {
    console.log('Step 1 data changed:', data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Step1DefineWorkflow onDataChange={handleDataChange} />
    </div>
  );
}