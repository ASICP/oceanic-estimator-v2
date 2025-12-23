import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Scale, HeartPulse, BadgeDollarSign, Truck, Factory, Code, Building, CheckCircle2 } from "lucide-react";
import { BlueWhaleFormData } from "@/pages/BlueWhaleCalculatorPage";

interface Props {
    formData: BlueWhaleFormData;
    updateFormData: (updates: Partial<BlueWhaleFormData>) => void;
}

const DOMAINS = [
    {
        id: 'legal',
        name: 'Legal',
        description: 'Contract analysis, case law, compliance',
        icon: Scale,
        models: ['SaulLM-7B', 'Phi-3 Legal']
    },
    {
        id: 'medical',
        name: 'Medical',
        description: 'Clinical notes, diagnosis coding, research',
        icon: HeartPulse,
        models: ['MedAlpaca-7B', 'ClinicalGPT']
    },
    {
        id: 'finance',
        name: 'Finance',
        description: 'Sentiment analysis, risk assessment, earnings',
        icon: BadgeDollarSign,
        models: ['FinGPT-7B', 'Mistral-Finance']
    },
    {
        id: 'logistics',
        name: 'Logistics',
        description: 'Route optimization, supply chain analysis',
        icon: Truck,
        models: ['Logistics Llama-7B']
    },
    {
        id: 'manufacturing',
        name: 'Manufacturing',
        description: 'Quality control, predictive maintenance',
        icon: Factory,
        models: ['Manufacturing GPT-7B']
    },
    {
        id: 'technical',
        name: 'Technical',
        description: 'Code generation, infrastructure ops',
        icon: Code,
        models: ['CodeLlama-7B', 'SQLCoder']
    },
    {
        id: 'real-estate',
        name: 'Real Estate',
        description: 'Property valuation, market analysis',
        icon: Building,
        models: ['RealEstate Llama-7B']
    },
];

export default function Step1DomainSelection({ formData, updateFormData }: Props) {
    const toggleDomain = (id: string) => {
        const current = formData.selectedDomains;
        if (current.includes(id)) {
            updateFormData({ selectedDomains: current.filter(d => d !== id) });
        } else {
            updateFormData({ selectedDomains: [...current, id] });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Select Your Domains</h2>
                <p className="text-muted-foreground">
                    Choose the specialized knowledge domains for your Blue Whale application.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOMAINS.map((domain) => {
                    const isSelected = formData.selectedDomains.includes(domain.id);
                    const Icon = domain.icon;

                    return (
                        <div
                            key={domain.id}
                            onClick={() => toggleDomain(domain.id)}
                            className={`
                relative cursor-pointer group rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${isSelected
                                    ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-900/10'
                                    : 'border-border bg-card hover:border-blue-200 dark:hover:border-blue-800'
                                }
              `}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 text-blue-500">
                                    <CheckCircle2 className="w-5 h-5 fill-current text-background" />
                                </div>
                            )}

                            <div className="p-5 space-y-3">
                                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'}
                `}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg">{domain.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-snug mt-1">
                                        {domain.description}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        {domain.models.map(model => (
                                            <span
                                                key={model}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                                            >
                                                {model}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground text-center">
                <p>
                    Can't find your domain? Blue Whale supports custom fine-tuning via{' '}
                    <Link href="/">
                        <a className="font-bold text-blue-500 hover:underline">
                            Porpoise
                        </a>
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
