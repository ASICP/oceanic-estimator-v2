import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Download, DollarSign, TrendingUp, Users, Clock } from "lucide-react";

interface CostBreakdown {
  category: string;
  cost: number;
  color: string;
}

interface CostDashboardProps {
  totalCost: number;
  traditionalCost: number;
  savings: number;
  costBreakdown: CostBreakdown[];
  agents: number;
  duration: string;
  onExport: () => void;
}

export default function CostDashboard({
  totalCost,
  traditionalCost,
  savings,
  costBreakdown,
  agents,
  duration,
  onExport
}: CostDashboardProps) {
  const savingsPercentage = ((traditionalCost - totalCost) / traditionalCost * 100).toFixed(1);

  const comparisonData = [
    { name: "Traditional", cost: traditionalCost, fill: "hsl(var(--muted))" },
    { name: "AI-Powered", cost: totalCost, fill: "hsl(var(--primary))" }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-lg font-bold text-foreground">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-chart-3" />
              <div>
                <p className="text-xs text-muted-foreground">Savings</p>
                <p className="text-lg font-bold text-chart-3">{savingsPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Agents</p>
                <p className="text-lg font-bold text-foreground">{agents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-lg font-bold text-foreground">{duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            <CardDescription>Distribution by agent type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="cost"
                    label={({ category, cost }) => `${category}: $${cost.toLocaleString()}`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Comparison</CardTitle>
            <CardDescription>Traditional vs AI-powered approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Cost"]} />
                  <Bar dataKey="cost" fill="currentColor" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Highlight */}
      <Card className="bg-gradient-to-r from-chart-3/10 to-chart-3/5 border-chart-3/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">OpEx Savings vs Traditional PE</h3>
              <p className="text-sm text-muted-foreground">
                Your AI-powered approach saves ${(traditionalCost - totalCost).toLocaleString()} compared to traditional methods
              </p>
              <Badge className="bg-chart-3 text-white">
                {savingsPercentage}% cost reduction
              </Badge>
            </div>
            <Button onClick={onExport} data-testid="button-export-report">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
          <CardDescription>Adjust parameters to see cost impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Error Rate Impact</label>
            <Slider
              defaultValue={[5]}
              max={20}
              step={1}
              className="w-full"
              data-testid="slider-error-rate"
            />
            <p className="text-xs text-muted-foreground">Current: 5% (adds ~$2,000 in retry costs)</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Count</label>
            <Slider
              defaultValue={[agents]}
              max={10}
              step={1}
              className="w-full"
              data-testid="slider-agent-count"
            />
            <p className="text-xs text-muted-foreground">Current: {agents} agents (+1 agent = +$8,000)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}