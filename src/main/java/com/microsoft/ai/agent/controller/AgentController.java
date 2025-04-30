
package com.microsoft.ai.agent.controller;

import com.microsoft.ai.agent.config.AgentConfig;
import com.microsoft.ai.agent.model.AgentMetrics;
import com.microsoft.ai.agent.model.Conversation;
import com.microsoft.ai.agent.model.Message;
import com.microsoft.ai.agent.service.AgentService;
import com.microsoft.ai.agent.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AgentController {
    
    private final AgentService agentService;
    private final MetricsService metricsService;
    private final AgentConfig agentConfig;
    
    @GetMapping("/config")
    public ResponseEntity<AgentConfig> getConfig() {
        return ResponseEntity.ok(agentConfig);
    }
    
    @PostMapping("/config")
    public ResponseEntity<AgentConfig> updateConfig(@RequestBody AgentConfig newConfig) {
        // In a real application, we would persist this configuration
        // This is simplified for demo purposes
        return ResponseEntity.ok(agentService.updateConfig(newConfig));
    }
    
    @GetMapping("/metrics")
    public ResponseEntity<AgentMetrics> getMetrics() {
        return ResponseEntity.ok(metricsService.getCurrentMetrics());
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations() {
        return ResponseEntity.ok(agentService.getConversationHistory());
    }
    
    @GetMapping("/conversations/{id}")
    public ResponseEntity<Conversation> getConversation(@PathVariable String id) {
        return ResponseEntity.ok(agentService.getConversation(id));
    }
    
    @PostMapping("/conversations")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(agentService.processMessage(message));
    }
    
    /**
     * This endpoint would connect to real Microsoft AI services in production
     * Currently returns demo data
     */
    @GetMapping("/azure/status")
    public ResponseEntity<Map<String, Object>> getAzureServicesStatus() {
        // In a production environment, this would check the status of Azure services
        // For now, we return dummy data
        return ResponseEntity.ok(Map.of(
            "openai", Map.of("status", "operational", "latency", 250),
            "cognitiveservices", Map.of("status", "operational", "latency", 180),
            "storage", Map.of("status", "operational", "latency", 90)
        ));
    }
    
    /**
     * This endpoint would validate Azure credentials in production
     * Currently simulates credential validation
     */
    @PostMapping("/azure/validate")
    public ResponseEntity<Map<String, Object>> validateAzureCredentials(@RequestBody Map<String, String> credentials) {
        // In production, this would validate the provided Azure credentials
        boolean valid = credentials.containsKey("apiKey") && 
                        credentials.containsKey("endpoint") &&
                        credentials.get("apiKey").length() > 10;
        
        return ResponseEntity.ok(Map.of(
            "valid", valid,
            "message", valid ? "Credentials validated successfully" : "Invalid credentials"
        ));
    }
}
