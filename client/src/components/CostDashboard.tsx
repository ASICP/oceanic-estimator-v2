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
                    outerRadius={60}
                    innerRadius={20}
                    dataKey="cost"
                    label={({ category, cost, percent, x, y }) => {
                      // Only show labels for slices larger than 5% to avoid overcrowding
                      if (percent < 0.05) return '';
                      return `${category}: $${cost.toLocaleString()}`;
                    }}
                    labelLine={false}
                    fill="#8884d8"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const categoryName = props.payload?.category || name;
                      return [`$${Number(value).toLocaleString()}`, categoryName];
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Complete Cost Breakdown List */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">All Cost Components</h4>
              <div className="grid grid-cols-1 gap-2">
                {costBreakdown
                  .slice()
                  .sort((a, b) => b.cost - a.cost)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1" data-testid={`row-cost-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: item.color }}
                          data-testid={`dot-cost-${item.category.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <span className="text-xs text-foreground" data-testid={`text-cost-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>{item.category}</span>
                        {item.cost < 700 && (
                          <Badge variant="outline" className="text-xs px-1 py-0" data-testid={`badge-under-700-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                            &lt;$700
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-medium text-foreground" data-testid={`amount-cost-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        ${item.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
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