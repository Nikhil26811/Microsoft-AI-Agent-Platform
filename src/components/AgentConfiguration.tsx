import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AgentConfig {
  agent: {
    name: string;
    id: string;
    description: string;
    version: string;
    role: string;
  };
  capabilities: {
    codeGeneration: boolean;
    debugging: boolean;
    documentation: boolean;
    testing: boolean;
    apiDesign: boolean;
  };
  jvm: {
    memory: number;
    version: string;
    gc: string;
    jvmOpts: string;
  };
  azure: {
    endpoint: string;
    apiKey: string;
    deploymentName: string;
    model: string;
  };
}

interface Props {
  config: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

const AgentConfiguration = ({ config: initialConfig, onSave }: Props) => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [config, setConfig] = useState<AgentConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSave = () => {
    // Validate Azure configuration
    if (selectedTab === "azure") {
      if (!config.azure.endpoint || !config.azure.apiKey || !config.azure.deploymentName) {
        toast.error("Please fill in all required Azure fields");
        return;
      }
    }

    onSave(config);
    setIsDirty(false);
  };

  const updateConfig = (path: string[], value: any) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      let current = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
    setIsDirty(true);
  };

  return (
    <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="jvm">JVM Settings</TabsTrigger>
          <TabsTrigger value="azure">Azure Integration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <Button 
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save Configuration
        </Button>
      </div>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Information</CardTitle>
            <CardDescription>Configure your Java-based AI agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input 
                  id="agent-name" 
                  value={config.agent.name}
                  onChange={(e) => updateConfig(['agent', 'name'], e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-id">Agent ID</Label>
                <Input 
                  id="agent-id" 
                  value={config.agent.id}
                  onChange={(e) => updateConfig(['agent', 'id'], e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agent-description">Description</Label>
              <Input 
                id="agent-description" 
                value={config.agent.description}
                onChange={(e) => updateConfig(['agent', 'description'], e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-version">Version</Label>
                <Input 
                  id="agent-version" 
                  value={config.agent.version}
                  onChange={(e) => updateConfig(['agent', 'version'], e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-role">Agent Role</Label>
                <Select 
                  value={config.agent.role}
                  onValueChange={(value) => updateConfig(['agent', 'role'], value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistant">Java Assistant</SelectItem>
                    <SelectItem value="developer">Java Developer</SelectItem>
                    <SelectItem value="architect">System Architect</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Capabilities</CardTitle>
            <CardDescription>Configure the capabilities of your Java agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="code-generation" className="flex flex-col">
                <span>Java Code Generation</span>
                <span className="font-normal text-xs text-slate-500">Allow agent to write and suggest Java code</span>
              </Label>
              <Switch 
                id="code-generation" 
                checked={config.capabilities.codeGeneration}
                onCheckedChange={(checked) => updateConfig(['capabilities', 'codeGeneration'], checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="debugging" className="flex flex-col">
                <span>Java Debugging</span>
                <span className="font-normal text-xs text-slate-500">Enable debugging capabilities</span>
              </Label>
              <Switch 
                id="debugging" 
                checked={config.capabilities.debugging}
                onCheckedChange={(checked) => updateConfig(['capabilities', 'debugging'], checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="documentation" className="flex flex-col">
                <span>Documentation Generation</span>
                <span className="font-normal text-xs text-slate-500">Create Javadoc and README files</span>
              </Label>
              <Switch 
                id="documentation" 
                checked={config.capabilities.documentation}
                onCheckedChange={(checked) => updateConfig(['capabilities', 'documentation'], checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="testing" className="flex flex-col">
                <span>Unit Test Generation</span>
                <span className="font-normal text-xs text-slate-500">Create JUnit tests for Java code</span>
              </Label>
              <Switch 
                id="testing" 
                checked={config.capabilities.testing}
                onCheckedChange={(checked) => updateConfig(['capabilities', 'testing'], checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="api-design" className="flex flex-col">
                <span>API Design</span>
                <span className="font-normal text-xs text-slate-500">Design REST APIs and microservices</span>
              </Label>
              <Switch 
                id="api-design" 
                checked={config.capabilities.apiDesign}
                onCheckedChange={(checked) => updateConfig(['capabilities', 'apiDesign'], checked)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="jvm" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Java Virtual Machine Configuration</CardTitle>
            <CardDescription>Tune JVM parameters for optimal AI agent performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Memory Allocation (GB)</Label>
                  <span className="text-sm font-medium">{config.jvm.memory} GB</span>
                </div>
                <Slider
                  value={[config.jvm.memory]}
                  min={1}
                  max={16}
                  step={1}
                  onValueChange={(value) => updateConfig(['jvm', 'memory'], value[0])}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jvm-version">JVM Version</Label>
                  <Select 
                    value={config.jvm.version}
                    onValueChange={(value) => updateConfig(['jvm', 'version'], value)}
                  >
                    <SelectTrigger id="jvm-version">
                      <SelectValue placeholder="Select JVM version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="java8">Java 8</SelectItem>
                      <SelectItem value="java11">Java 11 LTS</SelectItem>
                      <SelectItem value="java17">Java 17 LTS</SelectItem>
                      <SelectItem value="java21">Java 21 LTS</SelectItem>
                      <SelectItem value="java25">Java 25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gc-type">Garbage Collection</Label>
                  <Select 
                    value={config.jvm.gc}
                    onValueChange={(value) => updateConfig(['jvm', 'gc'], value)}
                  >
                    <SelectTrigger id="gc-type">
                      <SelectValue placeholder="Select GC type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serial">Serial GC</SelectItem>
                      <SelectItem value="parallel">Parallel GC</SelectItem>
                      <SelectItem value="g1">G1 GC</SelectItem>
                      <SelectItem value="zgc">Z Garbage Collector</SelectItem>
                      <SelectItem value="shenandoah">Shenandoah GC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="java-opts">Additional JVM Parameters</Label>
                <Input 
                  id="java-opts" 
                  value={config.jvm.jvmOpts}
                  onChange={(e) => updateConfig(['jvm', 'jvmOpts'], e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="azure" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Microsoft Azure Integration</CardTitle>
            <CardDescription>Connect your Java agent to Azure AI services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="azure-endpoint">Azure Endpoint</Label>
              <Input 
                id="azure-endpoint" 
                value={config.azure.endpoint}
                onChange={(e) => updateConfig(['azure', 'endpoint'], e.target.value)}
                placeholder="https://*.cognitiveservices.azure.com/"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azure-key">API Key</Label>
              <Input 
                id="azure-key" 
                type="password" 
                value={config.azure.apiKey}
                onChange={(e) => updateConfig(['azure', 'apiKey'], e.target.value)}
                placeholder="Enter API Key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deployment-name">Deployment Name</Label>
              <Input 
                id="deployment-name" 
                value={config.azure.deploymentName}
                onChange={(e) => updateConfig(['azure', 'deploymentName'], e.target.value)}
                placeholder="java-agent-deployment"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select 
                value={config.azure.model}
                onValueChange={(value) => updateConfig(['azure', 'model'], value)}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5</SelectItem>
                  <SelectItem value="codegen">Microsoft CodeGen</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Configuration</CardTitle>
            <CardDescription>Fine-tune Java agent behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thread-pool">Thread Pool Size</Label>
              <Input id="thread-pool" type="number" defaultValue={16} />
              <p className="text-xs text-slate-500 mt-1">Number of concurrent threads for processing requests</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeout">Request Timeout (ms)</Label>
              <Input id="timeout" type="number" defaultValue={30000} />
              <p className="text-xs text-slate-500 mt-1">Maximum time to wait for agent response</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context-window">Context Window Size</Label>
              <Input id="context-window" type="number" defaultValue={16384} />
              <p className="text-xs text-slate-500 mt-1">Maximum tokens to consider for context</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logging-level">Logging Level</Label>
              <Select defaultValue="info">
                <SelectTrigger id="logging-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trace">TRACE</SelectItem>
                  <SelectItem value="debug">DEBUG</SelectItem>
                  <SelectItem value="info">INFO</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache" className="flex flex-col">
                    <span>Enable Response Caching</span>
                    <span className="font-normal text-xs text-slate-500">Cache common responses to improve performance</span>
                  </Label>
                  <Switch id="cache" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="telemetry" className="flex flex-col">
                    <span>Enable Telemetry</span>
                    <span className="font-normal text-xs text-slate-500">Collect performance metrics</span>
                  </Label>
                  <Switch id="telemetry" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-scaling" className="flex flex-col">
                    <span>Auto-Scaling</span>
                    <span className="font-normal text-xs text-slate-500">Dynamic resource allocation</span>
                  </Label>
                  <Switch id="auto-scaling" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AgentConfiguration;
