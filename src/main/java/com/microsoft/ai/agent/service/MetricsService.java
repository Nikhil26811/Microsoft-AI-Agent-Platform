
package com.microsoft.ai.agent.service;

import com.microsoft.ai.agent.model.AgentMetrics;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadMXBean;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class MetricsService {
    
    private AgentMetrics currentMetrics;
    private final Random random = new Random();
    
    public MetricsService() {
        initializeMetrics();
    }
    
    public AgentMetrics getCurrentMetrics() {
        return currentMetrics;
    }
    
    @Scheduled(fixedRate = 5000) // Update metrics every 5 seconds
    public void updateMetrics() {
        // Update metrics with some real data from JVM and some simulated data
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        
        // Update Java metrics with real JVM data
        long maxMemory = memoryBean.getHeapMemoryUsage().getMax() / (1024 * 1024);
        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed() / (1024 * 1024);
        int memoryPercent = (int)(((double) usedMemory / maxMemory) * 100);
        
        AgentMetrics.JavaMetrics javaMetrics = currentMetrics.getJava();
        javaMetrics.setMemory(memoryPercent);
        javaMetrics.setHeap((int)usedMemory);
        javaMetrics.setThreads(threadBean.getThreadCount());
        
        // Get CPU via JMX (simplified, real implementation might use CPU MXBean)
        double systemLoad = ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();
        systemLoad = systemLoad < 0 ? random.nextInt(20) + 10 : systemLoad * 10; // fallback if not available
        javaMetrics.setCpu((int)systemLoad);
        
        // Simulate GC events (real implementation would use GarbageCollectorMXBean)
        javaMetrics.setGc(random.nextInt(3));
        
        // Simulate Azure metrics
        AgentMetrics.AzureMetrics azureMetrics = currentMetrics.getAzure();
        azureMetrics.setOpenai(90 + random.nextDouble() * 8);
        azureMetrics.setSearch(85 + random.nextDouble() * 7);
        azureMetrics.setBlob(90 + random.nextDouble() * 9);
        
        // Update performance history (rotate values for demo)
        List<AgentMetrics.PerformanceHistory> history = currentMetrics.getPerfHistory();
        for (AgentMetrics.PerformanceHistory point : history) {
            point.setJava(Math.max(220, point.getJava() + random.nextInt(21) - 10));
        }
        
        // Update Java chart data (shift left and add new point)
        List<AgentMetrics.JavaChart> chart = currentMetrics.getJavaChart();
        chart.remove(0);
        
        AgentMetrics.JavaChart newPoint = new AgentMetrics.JavaChart();
        newPoint.setName(LocalDateTime.now().toLocalTime().toString().substring(0, 5));
        newPoint.setHeap((int)usedMemory);
        newPoint.setGc(javaMetrics.getGc());
        newPoint.setCpu(javaMetrics.getCpu());
        newPoint.setThreads(javaMetrics.getThreads());
        chart.add(newPoint);
        
        // Update timestamp
        currentMetrics.setTimestamp(LocalDateTime.now());
    }
    
    private void initializeMetrics() {
        currentMetrics = new AgentMetrics();
        currentMetrics.setAgentsDeployed(12);
        currentMetrics.setActiveAgents(8);
        currentMetrics.setResponseRate(98.7);
        
        // Initialize Java metrics
        AgentMetrics.JavaMetrics javaMetrics = new AgentMetrics.JavaMetrics();
        javaMetrics.setCpu(22);
        javaMetrics.setMemory(70);
        javaMetrics.setHeap(800);
        javaMetrics.setGc(1);
        javaMetrics.setThreads(62);
        currentMetrics.setJava(javaMetrics);
        
        // Initialize Azure metrics
        AgentMetrics.AzureMetrics azureMetrics = new AgentMetrics.AzureMetrics();
        azureMetrics.setOpenai(95.5);
        azureMetrics.setSearch(90.2);
        azureMetrics.setBlob(97.8);
        currentMetrics.setAzure(azureMetrics);
        
        // Initialize performance history
        List<AgentMetrics.PerformanceHistory> perfHistory = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        int copilot = 400;
        int java = 240;
        int azure = 320;
        
        for (String month : months) {
            AgentMetrics.PerformanceHistory point = new AgentMetrics.PerformanceHistory();
            point.setName(month);
            point.setCopilot(copilot);
            point.setJava(java);
            point.setAzure(azure);
            perfHistory.add(point);
            
            // Increment for next month
            copilot += random.nextInt(51) + 10;
            java += random.nextInt(51) + 10;
            azure += random.nextInt(31) + 10;
        }
        currentMetrics.setPerfHistory(perfHistory);
        
        // Initialize Java chart data
        List<AgentMetrics.JavaChart> javaChart = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            AgentMetrics.JavaChart point = new AgentMetrics.JavaChart();
            point.setName("00:0" + i);
            point.setHeap(600 + i * 50);
            point.setGc(random.nextInt(3));
            point.setCpu(22 + i);
            point.setThreads(60 + i);
            javaChart.add(point);
        }
        currentMetrics.setJavaChart(javaChart);
        
        currentMetrics.setTimestamp(LocalDateTime.now());
    }
}
