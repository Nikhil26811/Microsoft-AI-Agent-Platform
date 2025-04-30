
import { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Cpu, MemoryStick, Activity } from "lucide-react";

const defaultData = [
  { name: "00:00", heap: 600, gc: 2, cpu: 22, threads: 60 },
  { name: "00:05", heap: 700, gc: 1, cpu: 25, threads: 63 },
  { name: "00:10", heap: 800, gc: 1, cpu: 29, threads: 65 },
  { name: "00:15", heap: 780, gc: 2, cpu: 28, threads: 64 },
  { name: "00:20", heap: 750, gc: 1, cpu: 24, threads: 62 },
];

type Props = {
  data: typeof defaultData;
};

const JavaMetricsChart = ({ data }: Props) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" domain={[0, 1000]} tickFormatter={v => `${v}MB`} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 200]} />
          <Tooltip />
          <Legend />
          {/* Heap usage */}
          <Line 
            yAxisId="left"
            type="monotone"
            dataKey="heap"
            name="Heap Used"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={false}
            legendType="circle"
          />
          {/* GC events */}
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="gc"
            name="GC Cycles"
            stroke="#f59e42"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={false}
            legendType="circle"
          />
          {/* CPU Usage */}
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="cpu"
            name="CPU (%)"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={false}
            legendType="circle"
          />
          {/* Thread Count */}
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="threads"
            name="Threads"
            stroke="#6366f1"
            strokeDasharray="2 4"
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={false}
            legendType="circle"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JavaMetricsChart;
