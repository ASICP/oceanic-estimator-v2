import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";

interface Step3Props {
  onDataChange: (data: any) => void;
  agentCount: number;
}

export default function Step3ResourceNeeds({ onDataChange, agentCount = 3 }: Step3Props) {
  const [apiCalls, setApiCalls] = useState([250]);
  const [dataTransfer, setDataTransfer] = useState([50]);
  const [errorRate, setErrorRate] = useState([5]);
  const [batchSize, setBatchSize] = useState([10]);
  const [autoScale, setAutoScale] = useState(true);
  const [multiModel, setMultiModel] = useState(true);
  const [modelProvider, setModelProvider] = useState("openai");

  // Calculate estimated costs based on inputs
  const estimatedApiCost = Math.floor(apiCalls[0] * agentCount * 0.02);
  const estimatedDataCost = Math.floor(dataTransfer[0] * 0.1);
  const retryMultiplier = 1 + (errorRate[0] / 100);
  const totalEstimate = Math.floor((estimatedApiCost + estimatedDataCost) * retryMultiplier);

  const handleChange = () => {
    const data = {
      apiCalls: apiCalls[0],
      dataTransfer: dataTransfer[0], 
      errorRate: errorRate[0],
      batchSize: batchSize[0],
      autoScale,
      multiModel,
      modelProvider,
      estimatedCost: totalEstimate
    };
    onDataChange(data);
  };

  // Call handleChange whenever values change
  useEffect(() => {
    handleChange();
  }, [apiCalls, dataTransfer, errorRate, batchSize, autoScale, multiModel, modelProvider, agentCount]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Estimate Resource Needs</h2>
        <p className="text-muted-foreground">
          Configure resource consumption and performance parameters for your workflow
        </p>
      </div>

      {/* Resource Consumption */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Consumption</CardTitle>
          <CardDescription>
            Estimated resource usage based on your selected agents and workflow complexity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                API Calls per Agent
                <Badge variant="secondary">{apiCalls[0]} calls</Badge>
              </Label>
              <Slider
                value={apiCalls}
                onValueChange={setApiCalls}
                max={1000}
                step={10}
                className="mt-2"
                data-testid="slider-api-calls"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total: {apiCalls[0] * agentCount} calls across {agentCount} agents
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                Data Transfer (MB)
                <Badge variant="secondary">{dataTransfer[0]} MB</Badge>
              </Label>
              <Slider
                value={dataTransfer}
                onValueChange={setDataTransfer}
                max={500}
                step={5}
                className="mt-2"
                data-testid="slider-data-transfer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Includes documents, API responses, and inter-agent communication
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                Batch Processing Size
                <Badge variant="secondary">{batchSize[0]} items</Badge>
              </Label>
              <Slider
                value={batchSize}
                onValueChange={setBatchSize}
                max={100}
                step={5}
                className="mt-2"
                data-testid="slider-batch-size"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher batch sizes improve efficiency but may increase memory usage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Efficiency</CardTitle>
          <CardDescription>
            Fine-tune performance characteristics and error handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                Expected Error Rate
                <Badge variant={errorRate[0] > 10 ? "destructive" : "secondary"}>
                  {errorRate[0]}%
                </Badge>
              </Label>
              <Slider
                value={errorRate}
                onValueChange={setErrorRate}
                max={25}
                step={1}
                className="mt-2"
                data-testid="slider-error-rate"
              />
              <div className="flex items-center gap-2 mt-1">
                {errorRate[0] > 15 ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <Info className="h-4 w-4 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground">
                  {errorRate[0] > 15 
                    ? "High error rate will significantly increase retry costs"
                    : "Error rate affects retry operations and total cost"
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Model Provider</Label>
              <Select value={modelProvider} onValueChange={setModelProvider}>
                <SelectTrigger data-testid="select-model-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT-4 (Premium)</SelectItem>
                  <SelectItem value="claude">Anthropic Claude (Balanced)</SelectItem>
                  <SelectItem value="groq">Groq (High Speed)</SelectItem>
                  <SelectItem value="multi">Multi-Model Routing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auto-scaling</Label>
                <Switch 
                  checked={autoScale} 
                  onCheckedChange={setAutoScale}
                  data-testid="switch-auto-scale"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Multi-model Optimization</Label>
                <Switch 
                  checked={multiModel} 
                  onCheckedChange={setMultiModel}
                  data-testid="switch-multi-model"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Preview */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-3" />
            Resource Cost Preview
          </CardTitle>
          <CardDescription>
            Estimated costs based on your current configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">${estimatedApiCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">API Costs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">${estimatedDataCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Data Transfer</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">${totalEstimate.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total (incl. retries)</div>
            </div>
          </div>
          
          {errorRate[0] > 10 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  High error rate detected - consider optimizing your workflow
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}