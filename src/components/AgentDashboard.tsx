
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Cpu, MemoryStick, Activity, Cloud, Database, Zap } from "lucide-react";
import JavaIcon from "@/components/icons/JavaIcon";
import JavaMetricsChart from "./JavaMetricsChart";

// Simulated real-time data functions for demo mode
const randomInRange = (min: number, max: number, dec: number = 0) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

// "Real-time" Java metrics simulation
function useSimulatedMetrics() {
  const [metrics, setMetrics] = useState({
    agentsDeployed: 12,
    activeAgents: 8,
    responseRate: 98.7,
    java: {
      cpu: 22,
      memory: 70,
      heap: 800,
      gc: 1,
      threads: 62,
    },
    azure: {
      openai: randomInRange(93, 98, 1),
      search: randomInRange(85, 92, 1),
      blob: randomInRange(90, 99, 1),
    },
    perfHistory: [
      { name: "Jan", Copilot: 400, Java: 240, Azure: 320 },
      { name: "Feb", Copilot: 430, Java: 280, Azure: 350 },
      { name: "Mar", Copilot: 450, Java: 310, Azure: 370 },
      { name: "Apr", Copilot: 470, Java: 350, Azure: 390 },
      { name: "May", Copilot: 540, Java: 400, Azure: 410 },
      { name: "Jun", Copilot: 580, Java: 450, Azure: 440 },
    ],
    javaChart: [
      { name: "00:00", heap: 600, gc: 2, cpu: 22, threads: 60 },
      { name: "00:05", heap: 700, gc: 1, cpu: 25, threads: 63 },
      { name: "00:10", heap: 800, gc: 1, cpu: 29, threads: 65 },
      { name: "00:15", heap: 780, gc: 2, cpu: 28, threads: 64 },
      { name: "00:20", heap: 750, gc: 1, cpu: 24, threads: 62 },
    ],
  });

  // Simulate metric updates (every 3s)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        responseRate: randomInRange(97.5, 99.3, 1),
        java: {
          cpu: randomInRange(17, 35),
          memory: randomInRange(60, 95),
          heap: randomInRange(600, 950),
          gc: randomInRange(0, 3),
          threads: randomInRange(58, 70),
        },
        azure: {
          openai: randomInRange(93, 98, 1),
          search: randomInRange(85, 92, 1),
          blob: randomInRange(90, 99, 1),
        },
        perfHistory: prev.perfHistory.map((row) => ({
          ...row,
          Java: Math.max(220, Math.floor(row.Java + randomInRange(-10, 10))),
        })),
        javaChart: [
          ...prev.javaChart.slice(1),
          {
            name: new Date().toLocaleTimeString().slice(0, 5),
            heap: randomInRange(620, 980),
            gc: randomInRange(0, 3),
            cpu: randomInRange(10, 38),
            threads: randomInRange(55, 74),
          },
        ],
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// Types for the component props
interface AgentDashboardProps {
  config: {
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
  };
}

// ---- MAIN COMPONENT ----

const AgentDashboard = ({ config }: AgentDashboardProps) => {
  const metrics = useSimulatedMetrics();

  return (
    <div className="space-y-6">
      {/* Removed DemoValueNotice here */}

      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard 
          icon={<JavaIcon className="h-7 w-7 text-blue-600" />}
          title="Java Agents Deployed" 
          value={metrics.agentsDeployed}
          description="Total agents running (Java Spring)"
          color="blue"
        />
        <DashboardCard 
          icon={<Cpu className="h-7 w-7 text-lime-700" />}
          title="CPU Usage" 
          value={`${metrics.java.cpu}%`}
          description="Avg Java agent CPU"
          color="green"
        />
        <DashboardCard 
          icon={<MemoryStick className="h-7 w-7 text-purple-600" />}
          title="Memory Usage" 
          value={`${metrics.java.memory}%`}
          description="JVM memory allocated"
          color="purple"
        />
        <DashboardCard 
          icon={<Activity className="h-7 w-7 text-orange-500" />}
          title="Threads"
          value={metrics.java.threads}
          description="Java threads in use"
          color="amber"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard 
          icon={<Cloud className="h-7 w-7 text-blue-600" />}
          title="Azure OpenAI" 
          value={`${metrics.azure.openai}%`}
          description="API Uptime (text/completions)"
          color="blue"
        />
        <DashboardCard 
          icon={<Database className="h-7 w-7 text-sky-900" />}
          title="Azure Cognitive Search"
          value={`${metrics.azure.search}%`}
          description="Search Index Avail."
          color="sky"
        />
        <DashboardCard 
          icon={<Zap className="h-7 w-7 text-amber-600" />}
          title="Azure Blob Storage"
          value={`${metrics.azure.blob}%`}
          description="Object storage status"
          color="amber"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Monthly agent activity metrics (simulated)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics.perfHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Copilot" 
                  stroke="#0078d4" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Copilot Usage"
                />
                <Line 
                  type="monotone" 
                  dataKey="Java" 
                  stroke="#7fba00" 
                  strokeWidth={2}
                  name="Java Agent Usage"
                />
                <Line 
                  type="monotone" 
                  dataKey="Azure" 
                  stroke="#ffb900" 
                  strokeWidth={2}
                  name="Azure API Usage"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Java Runtime Live Metrics
          </CardTitle>
          <CardDescription>
            Real-time JVM heap, CPU, GC, and thread stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JavaMetricsChart data={metrics.javaChart} />
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AgentStatusCard java={metrics.java} />
        <AgentEfficiencyCard java={metrics.java} />
      </div>
    </div>
  );
};

const DashboardCard = ({ 
  icon,
  title, 
  value, 
  description, 
  color 
}: { 
  icon?: React.ReactNode;
  title: string; 
  value: number | string; 
  description: string; 
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-indigo-500 to-purple-700",
    amber: "from-amber-400 to-amber-600",
    sky: "from-sky-500 to-sky-700"
  };
  
  return (
    <Card>
      <CardHeader className={`bg-gradient-to-r ${colorClasses[color] || ""} text-white rounded-t-lg py-4 flex flex-row items-center gap-3`}>
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
};

const AgentStatusCard = ({ java }: { java: {cpu: number, memory: number, heap: number, gc: number, threads: number} }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Java Agent Status</CardTitle>
        <CardDescription>
          Live health for Java Spring AI agents (runtime metrics)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusRow label="CPU Usage" value={`${java.cpu}%`} progress={java.cpu} icon={<Cpu className="w-4 h-4" />} />
          <StatusRow label="Memory (JVM)" value={`${java.memory}%`} progress={java.memory} icon={<MemoryStick className="w-4 h-4" />} />
          <StatusRow label="Heap Used" value={`${java.heap} MB`} progress={Math.round((java.heap / 1024) * 100)} icon={<MemoryStick className="w-4 h-4" />} />
          <StatusRow label="Thread Count" value={java.threads} progress={java.threads > 80 ? 80 : java.threads} icon={<Activity className="w-4 h-4"/>} />
          <StatusRow label="GC Events" value={java.gc} progress={java.gc * 33} icon={<Zap className="w-4 h-4" />} />
        </div>
      </CardContent>
    </Card>
  );
};

const StatusRow = ({ label, value, progress, icon }: { label: string, value: any, progress: number, icon: React.ReactNode }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm flex items-center gap-1">{icon}{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
    <Progress value={typeof progress === 'number' ? progress : 0} className="h-2" />
  </div>
);

const AgentEfficiencyCard = ({ java }: { java: {cpu: number, memory: number, heap: number, gc: number, threads: number} }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agent Efficiency</CardTitle>
        <CardDescription>
          JVM performance breakdown (simulated)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Avg. Response Time</p>
              <p className="text-xs text-slate-500">230ms (Java agent)</p>
            </div>
            <div className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
              -12% vs last week
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Heap Size Used</p>
              <p className="text-xs text-slate-500">{java.heap} MB used</p>
            </div>
            <div className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
              +5% vs last week
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">GC Cycles</p>
              <p className="text-xs text-slate-500">{java.gc} cycles/min</p>
            </div>
            <div className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
              -1% vs last week
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Thread Management</p>
              <p className="text-xs text-slate-500">{java.threads} active threads</p>
            </div>
            <div className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
              +2% vs last week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDashboard;
