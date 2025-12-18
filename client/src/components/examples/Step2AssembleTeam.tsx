import Step2AssembleTeam from '../Step2AssembleTeam';

export default function Step2AssembleTeamExample() {
  const handleDataChange = (data: any) => {
    console.log('Step 2 data changed:', data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Step2AssembleTeam onDataChange={handleDataChange} />
    </div>
  );
}