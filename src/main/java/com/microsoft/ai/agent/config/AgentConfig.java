
package com.microsoft.ai.agent.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "agent")
@Data
public class AgentConfig {
    private String name = "Enterprise Java Assistant";
    private String id = "java-agent-001";
    private String description = "Enterprise-grade Java AI assistant for development teams";
    private String version = "1.0.0";
    private String role = "assistant";
    
    private Capabilities capabilities = new Capabilities();
    private JvmSettings jvm = new JvmSettings();
    private AzureSettings azure = new AzureSettings();
    
    @Data
    public static class Capabilities {
        private boolean codeGeneration = true;
        private boolean debugging = true;
        private boolean documentation = true;
        private boolean testing = true;
        private boolean apiDesign = true;
    }
    
    @Data
    public static class JvmSettings {
        private int memory = 4;
        private String version = "java17";
        private String gc = "g1";
        private String jvmOpts = "-XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=4";
    }
    
    @Data
    public static class AzureSettings {
        private String endpoint = "";
        private String apiKey = "";
        private String deploymentName = "";
        private String model = "gpt4";
    }
}
