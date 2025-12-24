import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { EchoConfig, calculateTotalMonthlyCost, calculateMargin, calculateROI } from "@/lib/echoPricingEngine";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Download, Share2, Mail } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Step5Props {
    data: EchoConfig;
    onBack: () => void;
}

export default function Step5Simulate({ data, onBack }: Step5Props) {
    // Simple 5-Year Projection logic (inline for brevity)
    const years = [1, 2, 3, 4, 5];
    const growthRate = 1.4; // 40% growth

    const projection = years.map(year => {
        const userFactor = Math.pow(growthRate, year - 1);
        const projectedUsers = Math.ceil(data.users * userFactor);
        const projectedConfig = { ...data, users: projectedUsers };

        const pricing = calculateTotalMonthlyCost(projectedConfig);
        const annualRevenue = pricing.totalMonthly * 12;
        const roi = calculateROI(projectedConfig, annualRevenue);

        return {
            year,
            users: projectedUsers,
            revenue: annualRevenue,
            value: roi.totalValue
        };
    });

    const chartData = {
        labels: years.map(y => `Year ${y}`),
        datasets: [
            {
                label: 'Cumulative Investment',
                data: projection.map(p => p.revenue), // Simplified
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
            },
            {
                label: 'Cumulative Value Generated',
                data: projection.map(p => p.value),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Simulation & Growth
                </h2>
                <p className="text-muted-foreground">Project the long-term impact of your deployment.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>5-Year Value Projection</CardTitle>
                    <CardDescription>assuming 40% YoY user growth</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Total Value Generated</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            ${Math.round(projection.reduce((acc, curr) => acc + curr.value, 0)).toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">over 5 years</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Total Investment</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-700 mb-2">
                            ${Math.round(projection.reduce((acc, curr) => acc + curr.revenue, 0)).toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">over 5 years</p>
                    </CardContent>
                </Card>
            </div>

            <div className="b-t pt-8 flex justify-center gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-5 w-5" /> Export Full Report
                </Button>
                <Button size="lg" variant="outline">
                    <Share2 className="mr-2 h-5 w-5" /> Share Simulation
                </Button>
                <Button size="lg" variant="outline">
                    <Mail className="mr-2 h-5 w-5" /> Email Quote
                </Button>
            </div>

            <div className="flex justify-start pt-4">
                <Button variant="ghost" onClick={onBack}> &larr; Back to Analysis </Button>
            </div>
        </div>
    );
}
