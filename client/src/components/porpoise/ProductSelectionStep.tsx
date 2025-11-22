import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { PorpoiseFormData } from "@/pages/PorpoiseCalculatorPage";

interface ProductSelectionStepProps {
  formData: PorpoiseFormData;
  updateFormData: (updates: Partial<PorpoiseFormData>) => void;
}

const TIERS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    description: 'Perfect for small teams and individual developers',
    price: '$249/mo',
    features: ['10 users included', '20 GPU hours/mo', '10GB storage', '5,000 API calls/mo']
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    description: 'For growing teams with larger workloads',
    price: '$749/mo',
    features: ['50 users included', '100 GPU hours/mo', '100GB storage', '50,000 API calls/mo', '12 avatars included']
  },
  {
    id: 'team' as const,
    name: 'Team',
    description: 'Advanced features for established teams',
    price: '$1,999/mo',
    features: ['Unlimited users', '500 GPU hours/mo', '500GB storage', '500,000 API calls/mo', 'Unlimited avatars', 'Priority support']
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    features: ['Everything in Team', 'Dedicated infrastructure', 'SLA guarantees', 'White-label options', 'Custom integrations']
  }
];

export default function ProductSelectionStep({ formData, updateFormData }: ProductSelectionStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Selection & Scope</h2>
        <p className="text-muted-foreground">Choose your pricing tier and billing preferences</p>
      </div>
      
      {/* Tier Selection */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Select Pricing Tier</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all hover-elevate ${
                formData.tierId === tier.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => updateFormData({ tierId: tier.id })}
              data-testid={`card-tier-${tier.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription className="mt-1">{tier.description}</CardDescription>
                  </div>
                  {formData.tierId === tier.id && (
                    <Badge variant="default" data-testid={`badge-selected-${tier.id}`}>
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">{tier.price}</div>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Billing Period */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Billing Period</Label>
        <RadioGroup
          value={formData.billingPeriod}
          onValueChange={(value: 'monthly' | 'annual') => updateFormData({ billingPeriod: value })}
          data-testid="radio-group-billing-period"
        >
          <div className="flex items-center space-x-2 p-4 rounded-md border hover-elevate">
            <RadioGroupItem value="monthly" id="monthly" data-testid="radio-monthly" />
            <Label htmlFor="monthly" className="flex-1 cursor-pointer">
              <div className="font-medium">Monthly Billing</div>
              <div className="text-sm text-muted-foreground">Pay month-to-month with flexibility</div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 rounded-md border hover-elevate">
            <RadioGroupItem value="annual" id="annual" data-testid="radio-annual" />
            <Label htmlFor="annual" className="flex-1 cursor-pointer">
              <div className="font-medium">Annual Billing</div>
              <div className="text-sm text-muted-foreground">
                Save up to 20% with annual commitment
                <Badge variant="secondary" className="ml-2">Best Value</Badge>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Deployment Type */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Deployment Preferences</Label>
        <RadioGroup
          value={formData.deploymentType}
          onValueChange={(value: 'cloud' | 'byoc' | 'air_gap') => updateFormData({ deploymentType: value })}
          data-testid="radio-group-deployment-type"
        >
          <div className="flex items-center space-x-2 p-4 rounded-md border hover-elevate">
            <RadioGroupItem value="cloud" id="cloud" data-testid="radio-cloud" />
            <Label htmlFor="cloud" className="flex-1 cursor-pointer">
              <div className="font-medium">Cloud Hosted</div>
              <div className="text-sm text-muted-foreground">Fully managed by Porpoise</div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 rounded-md border hover-elevate">
            <RadioGroupItem value="byoc" id="byoc" data-testid="radio-byoc" />
            <Label htmlFor="byoc" className="flex-1 cursor-pointer">
              <div className="font-medium">BYOC (Bring Your Own Cloud)</div>
              <div className="text-sm text-muted-foreground">Deploy in your AWS/Azure/GCP account</div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 rounded-md border hover-elevate">
            <RadioGroupItem value="air_gap" id="air_gap" data-testid="radio-air-gap" />
            <Label htmlFor="air_gap" className="flex-1 cursor-pointer">
              <div className="font-medium">Air-Gapped</div>
              <div className="text-sm text-muted-foreground">On-premises deployment with no internet access</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Advanced Options */}
      <div className="space-y-4">
        <Label className="text-base font-semibold block">Advanced Options</Label>
        
        <div className="flex items-center justify-between p-4 rounded-md border">
          <div>
            <div className="font-medium">SSO / SAML Integration</div>
            <div className="text-sm text-muted-foreground">Enterprise identity provider integration</div>
          </div>
          <Switch
            checked={formData.ssoRequired}
            onCheckedChange={(checked) => updateFormData({ ssoRequired: checked })}
            data-testid="switch-sso"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-md border">
          <div>
            <div className="font-medium">White-Label Avatars</div>
            <div className="text-sm text-muted-foreground">Custom branding for avatar interfaces</div>
          </div>
          <Switch
            checked={formData.whiteLabelAvatars}
            onCheckedChange={(checked) => updateFormData({ whiteLabelAvatars: checked })}
            data-testid="switch-white-label"
          />
        </div>
      </div>
    </div>
  );
}
