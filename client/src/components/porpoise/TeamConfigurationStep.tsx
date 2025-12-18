import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Cpu, HardDrive, Zap, Video } from "lucide-react";
import type { PorpoiseFormData } from "@/pages/PorpoiseCalculatorPage";

interface TeamConfigurationStepProps {
  formData: PorpoiseFormData;
  updateFormData: (updates: Partial<PorpoiseFormData>) => void;
}

export default function TeamConfigurationStep({ formData, updateFormData }: TeamConfigurationStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team & Resource Configuration</h2>
        <p className="text-muted-foreground">Configure your team size and resource requirements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Number of Users</CardTitle>
            </div>
            <CardDescription>Active users in your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                max={1000}
                value={formData.numUsers}
                onChange={(e) => updateFormData({ numUsers: parseInt(e.target.value) || 1 })}
                className="w-24"
                data-testid="input-num-users"
              />
              <Slider
                value={[formData.numUsers]}
                onValueChange={([value]) => updateFormData({ numUsers: value })}
                min={1}
                max={1000}
                step={1}
                className="flex-1"
                data-testid="slider-num-users"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.numUsers} users</span>
            </p>
          </CardContent>
        </Card>
        
        {/* Concurrent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Concurrent Jobs</CardTitle>
            </div>
            <CardDescription>Parallel training/inference jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={50}
                value={formData.concurrentJobs}
                onChange={(e) => updateFormData({ concurrentJobs: parseInt(e.target.value) || 0 })}
                className="w-24"
                data-testid="input-concurrent-jobs"
              />
              <Slider
                value={[formData.concurrentJobs]}
                onValueChange={([value]) => updateFormData({ concurrentJobs: value })}
                min={0}
                max={50}
                step={1}
                className="flex-1"
                data-testid="slider-concurrent-jobs"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.concurrentJobs} jobs</span>
            </p>
          </CardContent>
        </Card>
        
        {/* GPU Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">GPU Hours per Month</CardTitle>
            </div>
            <CardDescription>Estimated monthly GPU compute usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={1000}
                value={formData.gpuHoursMonthly}
                onChange={(e) => updateFormData({ gpuHoursMonthly: parseInt(e.target.value) || 0 })}
                className="w-24"
                data-testid="input-gpu-hours"
              />
              <Slider
                value={[formData.gpuHoursMonthly]}
                onValueChange={([value]) => updateFormData({ gpuHoursMonthly: value })}
                min={0}
                max={1000}
                step={5}
                className="flex-1"
                data-testid="slider-gpu-hours"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.gpuHoursMonthly} hours/mo</span>
            </p>
          </CardContent>
        </Card>
        
        {/* Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Storage (GB)</CardTitle>
            </div>
            <CardDescription>Data storage requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={10000}
                value={formData.storageGb}
                onChange={(e) => updateFormData({ storageGb: parseInt(e.target.value) || 0 })}
                className="w-24"
                data-testid="input-storage"
              />
              <Slider
                value={[formData.storageGb]}
                onValueChange={([value]) => updateFormData({ storageGb: value })}
                min={0}
                max={10000}
                step={10}
                className="flex-1"
                data-testid="slider-storage"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.storageGb} GB</span>
            </p>
          </CardContent>
        </Card>
        
        {/* API Calls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">API Calls per Month</CardTitle>
            </div>
            <CardDescription>Estimated monthly API usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={10000000}
                value={formData.apiCallsMonthly}
                onChange={(e) => updateFormData({ apiCallsMonthly: parseInt(e.target.value) || 0 })}
                className="w-32"
                data-testid="input-api-calls"
              />
              <Slider
                value={[Math.min(formData.apiCallsMonthly, 100000)]}
                onValueChange={([value]) => updateFormData({ apiCallsMonthly: value })}
                min={0}
                max={100000}
                step={1000}
                className="flex-1"
                data-testid="slider-api-calls"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.apiCallsMonthly.toLocaleString()} calls/mo</span>
            </p>
          </CardContent>
        </Card>
        
        {/* Avatars */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Number of Avatars</CardTitle>
            </div>
            <CardDescription>AI-powered video avatars (HeyGen)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.numAvatars}
                onChange={(e) => updateFormData({ numAvatars: parseInt(e.target.value) || 0 })}
                className="w-24"
                data-testid="input-avatars"
              />
              <Slider
                value={[formData.numAvatars]}
                onValueChange={([value]) => updateFormData({ numAvatars: value })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
                data-testid="slider-avatars"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{formData.numAvatars} avatars</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
