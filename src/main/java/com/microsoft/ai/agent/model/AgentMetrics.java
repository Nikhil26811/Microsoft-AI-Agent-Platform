
package com.microsoft.ai.agent.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class AgentMetrics {
    private int agentsDeployed;
    private int activeAgents;
    private double responseRate;
    private JavaMetrics java;
    private AzureMetrics azure;
    private List<PerformanceHistory> perfHistory;
    private List<JavaChart> javaChart;
    private LocalDateTime timestamp;
    
    @Data
    public static class JavaMetrics {
        private int cpu;
        private int memory;
        private int heap;
        private int gc;
        private int threads;
    }
    
    @Data
    public static class AzureMetrics {
        private double openai;
        private double search;
        private double blob;
    }
    
    @Data
    public static class PerformanceHistory {
        private String name;
        private int copilot;
        private int java;
        private int azure;
    }
    
    @Data
    public static class JavaChart {
        private String name;
        private int heap;
        private int gc;
        private int cpu;
        private int threads;
    }
}
