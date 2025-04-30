
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentDashboard from "@/components/AgentDashboard";
import AgentConfiguration from "@/components/AgentConfiguration";
import ConversationHistory from "@/components/ConversationHistory";
import Header from "@/components/Header";
import { toast } from "sonner";

// Initial configuration for demo purposes
const demoConfig = {
  agent: {
    name: "Enterprise Java Assistant",
    id: "java-agent-001",
    description: "Enterprise-grade Java AI assistant for development teams",
    version: "1.0.0",
    role: "assistant"
  },
  capabilities: {
    codeGeneration: true,
    debugging: true,
    documentation: true,
    testing: true,
    apiDesign: true
  },
  jvm: {
    memory: 4,
    version: "java17",
    gc: "g1",
    jvmOpts: "-XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=4"
  },
  azure: {
    endpoint: "",
    apiKey: "",
    deploymentName: "",
    model: "gpt4"
  }
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState(demoConfig);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Connected to Java Agent platform", {
        description: "All metrics and agent data loaded successfully"
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    
    if (value !== selectedTab) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (value === "configuration") {
          toast.success("Agent configuration loaded", {
            description: "Ready to modify Java agent settings"
          });
        } else if (value === "conversations") {
          toast.success("Conversation history retrieved", {
            description: "Showing recent Java agent interactions"
          });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  };

  const handleConfigurationSave = (newConfig: typeof demoConfig) => {
    setConfig(newConfig);
    toast.success("Configuration saved successfully", {
      description: "Java agent settings have been updated"
    });

    // Simulate agent restart/reload
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Agent restarted with new configuration", {
        description: "Changes are now live"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Microsoft AI Agent Platform</CardTitle>
            <CardDescription className="text-blue-100">
              Java-based Enterprise AI Agent Management
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-slate-100">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-white rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="configuration" className="data-[state=active]:bg-white rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Configure Agents
                </TabsTrigger>
                <TabsTrigger value="conversations" className="data-[state=active]:bg-white rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Conversation History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="m-0 p-6 min-h-[500px]">
                {isLoading && selectedTab === "dashboard" ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-slate-600">Loading Java agent metrics...</p>
                    </div>
                  </div>
                ) : (
                  <AgentDashboard config={config} />
                )}
              </TabsContent>
              
              <TabsContent value="configuration" className="m-0 p-6 min-h-[500px]">
                {isLoading && selectedTab === "configuration" ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-slate-600">Loading agent configuration options...</p>
                    </div>
                  </div>
                ) : (
                  <AgentConfiguration config={config} onSave={handleConfigurationSave} />
                )}
              </TabsContent>
              
              <TabsContent value="conversations" className="m-0 p-6 min-h-[500px]">
                {isLoading && selectedTab === "conversations" ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-slate-600">Retrieving conversation history...</p>
                    </div>
                  </div>
                ) : (
                  <ConversationHistory config={config} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t py-3 text-xs text-slate-500">
            Microsoft AI Agent Platform v1.0.0 - Java Enterprise Edition - &copy; 2025 Microsoft
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Index;
