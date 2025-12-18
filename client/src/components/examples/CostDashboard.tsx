import CostDashboard from '../CostDashboard';

export default function CostDashboardExample() {
  const costBreakdown = [
    { category: "AI Agents", cost: 25000, color: "hsl(var(--chart-1))" },
    { category: "API Calls", cost: 15000, color: "hsl(var(--chart-2))" },
    { category: "Infrastructure", cost: 8000, color: "hsl(var(--chart-3))" },
    { category: "Support", cost: 5000, color: "hsl(var(--chart-4))" }
  ];

  const handleExport = () => {
    console.log("Exporting cost report...");
    // Mock export functionality
    alert("Report exported successfully!");
  };

  return (
    <div className="p-6">
      <CostDashboard
        totalCost={53000}
        traditionalCost={150000}
        savings={97000}
        costBreakdown={costBreakdown}
        agents={5}
        duration="6-8 hrs"
        onExport={handleExport}
      />
    </div>
  );
}