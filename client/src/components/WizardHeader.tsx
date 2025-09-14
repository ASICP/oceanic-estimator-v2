import { Progress } from "@/components/ui/progress";

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function WizardHeader({ currentStep, totalSteps, stepTitles }: WizardHeaderProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-card border-b border-card-border px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-primary">EV</div>
            <div className="text-sm text-muted-foreground">Agent Calculator</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground">{stepTitles[currentStep - 1]}</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index < currentStep - 1 ? "text-primary" : 
                index === currentStep - 1 ? "text-foreground font-medium" : ""
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}