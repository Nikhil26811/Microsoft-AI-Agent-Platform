
package com.microsoft.ai.agent.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class Message {
    private String id;
    private String conversationId;
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    private MessageType type;
    private AiMetadata aiMetadata;
    
    // Represents different types of message content
    public enum MessageType {
        TEXT, CODE, IMAGE, SYSTEM
    }
    
    // Metadata for tracking AI processing information
    @Data
    public static class AiMetadata {
        private String modelId;           // The Microsoft AI model ID used for this message
        private String deploymentName;    // Azure OpenAI deployment name
        private Double temperature;       // Temperature setting used for generation
        private Integer tokensUsed;       // Token count for this interaction
        private Double processingTime;    // Time in seconds to process the request
        private Map<String, Object> additionalData; // Any additional metadata
    }
}
