import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calculator, Zap, Fish, Waves } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function CalculatorLandingPage() {
    const calculators = [
        {
            id: "porpoise",
            title: "Porpoise Calculator",
            description: "Estimate costs for focused Small Language Models (SLMs) and specialized deployment scenarios.",
            icon: <Fish className="h-8 w-8 text-primary" />,
            href: "/porpoise",
            badge: "SLM Specialized"
        },
        {
            id: "blue-whale",
            title: "Blue Whale Calculator",
            description: "Analyze Large Scale deep learning costs, token usage, and margin analysis for enterprise deployments.",
            icon: <Waves className="h-8 w-8 text-blue-600" />,
            href: "/blue-whale",
            badge: "Large Scale"
        },
        {
            id: "echo",
            title: "Echo RAG Calculator",
            description: "Pricing and ROI estimation for Enterprise RAG Knowledge Bases.",
            icon: <Zap className="h-8 w-8 text-yellow-500" />,
            href: "/echo",
            badge: "RAG & Knowledge"
        },
        {
            id: "dolphin",
            title: "Dolphin Estimator",
            description: "Agent Workforce Orchestration & Pricing for mid-sized scenarios.",
            icon: <Waves className="h-8 w-8 text-cyan-500" />,
            href: "/dolphin/index.html",
            badge: "Agent Workforce"
        },
        {
            id: "orca",
            title: "Orca Competitor",
            description: "Competitive analysis and pricing comparison against major AI providers.",
            icon: <Waves className="h-8 w-8 text-blue-800" />,
            href: "/orca/index.html",
            badge: "Competitor Analysis"
        },
        {
            id: "estimator",
            title: "Custom Estimator",
            description: "Build a bespoke estimation workflow for unique project requirements and team structures.",
            icon: <Calculator className="h-8 w-8 text-green-600" />,
            href: "/estimator-v1",
            badge: "Custom Workflow"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Oceanic Estimator Suite</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4">Choose Your Calculator</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Select the appropriate tool for your estimation needs, from specialized SLMs to massive scale enterprise deployments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {calculators.map((calc) => (
                        <Link key={calc.id} href={calc.href}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 group">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-secondary group-hover:bg-background transition-colors">
                                            {calc.icon}
                                        </div>
                                        {calc.badge && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                {calc.badge}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                                        {calc.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {calc.description}
                                    </CardDescription>
                                    <Button className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                                        Launch Calculator
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-auto py-8 bg-card">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Cetacean Labs. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
