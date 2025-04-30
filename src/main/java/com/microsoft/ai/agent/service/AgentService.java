
package com.microsoft.ai.agent.service;

import com.microsoft.ai.agent.config.AgentConfig;
import com.microsoft.ai.agent.model.Conversation;
import com.microsoft.ai.agent.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentConfig agentConfig;
    private final Map<String, Conversation> conversations = new HashMap<>();

    // Demo data initialization - in a real app this would be loaded from a database
    {
        createDemoConversations();
    }
    
    public AgentConfig updateConfig(AgentConfig newConfig) {
        // In a real app, we would persist this configuration
        // This is a simplified implementation
        agentConfig.setName(newConfig.getName());
        agentConfig.setDescription(newConfig.getDescription());
        agentConfig.setVersion(newConfig.getVersion());
        agentConfig.setRole(newConfig.getRole());
        agentConfig.setCapabilities(newConfig.getCapabilities());
        agentConfig.setJvm(newConfig.getJvm());
        agentConfig.setAzure(newConfig.getAzure());
        
        return agentConfig;
    }
    
    public List<Conversation> getConversationHistory() {
        return new ArrayList<>(conversations.values());
    }
    
    public Conversation getConversation(String id) {
        Conversation conversation = conversations.get(id);
        if (conversation == null) {
            throw new RuntimeException("Conversation not found: " + id);
        }
        return conversation;
    }
    
    public Message processMessage(Message userMessage) {
        // In a real application, this would call Azure OpenAI or another LLM service
        userMessage.setTimestamp(LocalDateTime.now());
        
        if (userMessage.getConversationId() == null) {
            // Create a new conversation
            Conversation conversation = new Conversation();
            conversation.setId(UUID.randomUUID().toString());
            conversation.setTitle("Conversation " + conversation.getId());
            conversation.setCreatedAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            userMessage.setConversationId(conversation.getId());
            conversation.addMessage(userMessage);
            conversations.put(conversation.getId(), conversation);
        } else {
            // Add to existing conversation
            Conversation conversation = conversations.get(userMessage.getConversationId());
            if (conversation == null) {
                throw new RuntimeException("Conversation not found: " + userMessage.getConversationId());
            }
            conversation.addMessage(userMessage);
        }
        
        // Generate response (in a real app, this would be from an LLM)
        Message response = new Message();
        response.setId(UUID.randomUUID().toString());
        response.setConversationId(userMessage.getConversationId());
        response.setSender("agent");
        response.setType(Message.MessageType.TEXT);
        response.setTimestamp(LocalDateTime.now());
        
        // Create AI metadata that would be populated with real data in production
        Message.AiMetadata aiMetadata = new Message.AiMetadata();
        aiMetadata.setModelId(agentConfig.getAzure().getModel());
        aiMetadata.setDeploymentName(agentConfig.getAzure().getDeploymentName());
        aiMetadata.setTemperature(0.7);
        aiMetadata.setTokensUsed(calculateEstimatedTokens(userMessage.getContent()));
        aiMetadata.setProcessingTime(simulateProcessingTime());
        aiMetadata.setAdditionalData(new HashMap<>());
        response.setAiMetadata(aiMetadata);
        
        // Demo response based on user input
        if (userMessage.getContent().toLowerCase().contains("spring")) {
            response.setContent("Spring Boot is an excellent framework for building Java applications. " +
                    "You can configure your application using either properties files or YAML. Here's an example:\n\n" +
                    "```java\n" +
                    "@SpringBootApplication\n" +
                    "public class Application {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        SpringApplication.run(Application.class, args);\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n\n" +
                    "Would you like me to provide a more specific example of configuration?");
        } else if (userMessage.getContent().toLowerCase().contains("hibernate")) {
            response.setContent("Hibernate is a powerful ORM solution for Java. Here's how to define an entity:\n\n" +
                    "```java\n" +
                    "@Entity\n" +
                    "@Table(name = \"users\")\n" +
                    "public class User {\n" +
                    "    @Id\n" +
                    "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n" +
                    "    private Long id;\n" +
                    "    \n" +
                    "    @Column(nullable = false)\n" +
                    "    private String username;\n" +
                    "    \n" +
                    "    @Column(nullable = false)\n" +
                    "    private String email;\n" +
                    "}\n" +
                    "```\n\n" +
                    "Do you need help with specific Hibernate mappings or configurations?");
        } else if (userMessage.getContent().toLowerCase().contains("microservice")) {
            response.setContent("Spring Cloud provides excellent support for microservices. Here's a basic setup for a service registry using Eureka:\n\n" +
                    "```java\n" +
                    "@SpringBootApplication\n" +
                    "@EnableEurekaServer\n" +
                    "public class ServiceRegistryApplication {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        SpringApplication.run(ServiceRegistryApplication.class, args);\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n\n" +
                    "And for your microservice:\n\n" +
                    "```java\n" +
                    "@SpringBootApplication\n" +
                    "@EnableDiscoveryClient\n" +
                    "public class MicroserviceApplication {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        SpringApplication.run(MicroserviceApplication.class, args);\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n\n" +
                    "Would you like me to explain how to implement inter-service communication?");
        } else if (userMessage.getContent().toLowerCase().contains("azure")) {
            response.setContent("Azure provides many services that integrate well with Java applications. For example, you can use Azure Cosmos DB with the Spring Data Azure Cosmos DB starter:\n\n" +
                    "```xml\n" +
                    "<dependency>\n" +
                    "    <groupId>com.azure.spring</groupId>\n" +
                    "    <artifactId>azure-spring-data-cosmos</artifactId>\n" +
                    "    <version>3.19.0</version>\n" +
                    "</dependency>\n" +
                    "```\n\n" +
                    "Then configure it in your application.yml:\n\n" +
                    "```yaml\n" +
                    "azure:\n" +
                    "  cosmos:\n" +
                    "    uri: ${AZURE_COSMOS_URI}\n" +
                    "    key: ${AZURE_COSMOS_KEY}\n" +
                    "    database: ${AZURE_COSMOS_DATABASE}\n" +
                    "    populate-query-metrics: true\n" +
                    "```\n\n" +
                    "Would you like to learn about other Azure services that work well with Java?");
        } else {
            response.setContent("I'm your Java Enterprise Assistant. I can help with Spring Boot, " +
                    "Hibernate, Jakarta EE, microservices, and Azure integration for Java applications. " +
                    "What specific Java problem are you trying to solve?");
        }
        
        // Add the response to the conversation
        Conversation conversation = conversations.get(userMessage.getConversationId());
        conversation.addMessage(response);
        
        return response;
    }
    
    /**
     * In a real system, this would use the actual Azure OpenAI API response
     * For demo purposes, we estimate token usage based on content length
     */
    private Integer calculateEstimatedTokens(String content) {
        // Rough estimate: ~1 token per 4 characters
        return content.length() / 4 + 10;
    }
    
    /**
     * Simulate processing time that would come from the real Azure OpenAI API
     */
    private Double simulateProcessingTime() {
        // Return a reasonable processing time between 0.2 and 1.5 seconds
        return 0.2 + Math.random() * 1.3;
    }
    
    private void createDemoConversations() {
        // Create first demo conversation
        Conversation conversation1 = new Conversation();
        conversation1.setId("conv-1");
        conversation1.setTitle("Spring Boot Configuration Help");
        conversation1.setCreatedAt(LocalDateTime.now().minusDays(2));
        conversation1.setUpdatedAt(LocalDateTime.now().minusDays(2));
        
        Message message1 = new Message();
        message1.setId("msg-1");
        message1.setConversationId("conv-1");
        message1.setSender("user");
        message1.setContent("I'm having trouble with my Spring Boot configuration. My application isn't picking up properties from application.yml");
        message1.setTimestamp(LocalDateTime.now().minusDays(2));
        message1.setType(Message.MessageType.TEXT);
        conversation1.addMessage(message1);
        
        Message response1 = new Message();
        response1.setId("msg-2");
        response1.setConversationId("conv-1");
        response1.setSender("agent");
        response1.setContent("Spring Boot looks for application.yml in several locations. Make sure it's in the right path. Here are the locations Spring checks, in order:\n\n" +
                "1. File in the current directory: `./config/application.yml`\n" +
                "2. File in the current directory: `./application.yml`\n" +
                "3. File in the classpath: `/config/application.yml`\n" +
                "4. File in the classpath: `/application.yml`\n\n" +
                "Also check that your YAML syntax is valid. Here's an example:\n\n" +
                "```yaml\n" +
                "server:\n" +
                "  port: 8080\n\n" +
                "spring:\n" +
                "  datasource:\n" +
                "    url: jdbc:postgresql://localhost:5432/mydb\n" +
                "    username: postgres\n" +
                "    password: secret\n" +
                "```\n\n" +
                "Is your file in one of these locations?");
        response1.setTimestamp(LocalDateTime.now().minusDays(2).plusMinutes(1));
        response1.setType(Message.MessageType.TEXT);
        
        // Add AI metadata for the response
        Message.AiMetadata metadata1 = new Message.AiMetadata();
        metadata1.setModelId("gpt4");
        metadata1.setDeploymentName("java-agent");
        metadata1.setTemperature(0.7);
        metadata1.setTokensUsed(145);
        metadata1.setProcessingTime(0.8);
        metadata1.setAdditionalData(new HashMap<>());
        response1.setAiMetadata(metadata1);
        
        conversation1.addMessage(response1);
        
        Message message2 = new Message();
        message2.setId("msg-3");
        message2.setConversationId("conv-1");
        message2.setSender("user");
        message2.setContent("Yes, it's in src/main/resources/application.yml, but I think the issue might be with profile-specific properties. How do I set up different profiles?");
        message2.setTimestamp(LocalDateTime.now().minusDays(2).plusMinutes(5));
        message2.setType(Message.MessageType.TEXT);
        conversation1.addMessage(message2);
        
        Message response2 = new Message();
        response2.setId("msg-4");
        response2.setConversationId("conv-1");
        response2.setSender("agent");
        response2.setContent("For profile-specific properties in YAML, you can use the `---` separator. Here's how to define properties for different profiles:\n\n" +
                "```yaml\n" +
                "# Common properties for all profiles\n" +
                "spring:\n" +
                "  application:\n" +
                "    name: myapp\n\n" +
                "---\n" +
                "# Development profile\n" +
                "spring:\n" +
                "  config:\n" +
                "    activate:\n" +
                "      on-profile: dev\n" +
                "  datasource:\n" +
                "    url: jdbc:h2:mem:devdb\n\n" +
                "---\n" +
                "# Production profile\n" +
                "spring:\n" +
                "  config:\n" +
                "    activate:\n" +
                "      on-profile: prod\n" +
                "  datasource:\n" +
                "    url: jdbc:postgresql://prod-server:5432/proddb\n" +
                "```\n\n" +
                "Then activate a profile using:\n" +
                "- Command line: `java -jar myapp.jar --spring.profiles.active=dev`\n" +
                "- Environment variable: `export SPRING_PROFILES_ACTIVE=dev`\n" +
                "- In your application: `SpringApplication.setAdditionalProfiles(\"dev\")`\n\n" +
                "Does this solve your issue?");
        response2.setTimestamp(LocalDateTime.now().minusDays(2).plusMinutes(6));
        response2.setType(Message.MessageType.TEXT);
        
        // Add AI metadata for the second response
        Message.AiMetadata metadata2 = new Message.AiMetadata();
        metadata2.setModelId("gpt4");
        metadata2.setDeploymentName("java-agent");
        metadata2.setTemperature(0.7);
        metadata2.setTokensUsed(210);
        metadata2.setProcessingTime(1.2);
        metadata2.setAdditionalData(new HashMap<>());
        response2.setAiMetadata(metadata2);
        
        conversation1.addMessage(response2);
        
        conversations.put(conversation1.getId(), conversation1);
        
        // Create second demo conversation
        Conversation conversation2 = new Conversation();
        conversation2.setId("conv-2");
        conversation2.setTitle("JPA Entity Relationships");
        conversation2.setCreatedAt(LocalDateTime.now().minusDays(1));
        conversation2.setUpdatedAt(LocalDateTime.now().minusDays(1));
        
        Message message3 = new Message();
        message3.setId("msg-5");
        message3.setConversationId("conv-2");
        message3.setSender("user");
        message3.setContent("What's the best way to model a many-to-many relationship in JPA?");
        message3.setTimestamp(LocalDateTime.now().minusDays(1));
        message3.setType(Message.MessageType.TEXT);
        conversation2.addMessage(message3);
        
        Message response3 = new Message();
        response3.setId("msg-6");
        response3.setConversationId("conv-2");
        response3.setSender("agent");
        response3.setContent("In JPA, you can model many-to-many relationships using the `@ManyToMany` annotation. Here's a complete example with two entities: Student and Course:\n\n" +
                "```java\n" +
                "@Entity\n" +
                "public class Student {\n" +
                "    @Id\n" +
                "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n" +
                "    private Long id;\n" +
                "    \n" +
                "    private String name;\n" +
                "    \n" +
                "    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })\n" +
                "    @JoinTable(\n" +
                "        name = \"student_course\",\n" +
                "        joinColumns = @JoinColumn(name = \"student_id\"),\n" +
                "        inverseJoinColumns = @JoinColumn(name = \"course_id\")\n" +
                "    )\n" +
                "    private Set<Course> courses = new HashSet<>();\n" +
                "    \n" +
                "    // getters, setters, etc.\n" +
                "}\n" +
                "\n" +
                "@Entity\n" +
                "public class Course {\n" +
                "    @Id\n" +
                "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n" +
                "    private Long id;\n" +
                "    \n" +
                "    private String title;\n" +
                "    \n" +
                "    @ManyToMany(mappedBy = \"courses\")\n" +
                "    private Set<Student> students = new HashSet<>();\n" +
                "    \n" +
                "    // getters, setters, etc.\n" +
                "}\n" +
                "```\n\n" +
                "This creates a join table called `student_course` with foreign keys to both entities. The owning side (Student in this case) defines the `@JoinTable`, and the inverse side references the relationship field with `mappedBy`.\n\n" +
                "For more complex scenarios, you might want to create an explicit entity for the join table if you need additional columns beyond the relationship.");
        response3.setTimestamp(LocalDateTime.now().minusDays(1).plusMinutes(2));
        response3.setType(Message.MessageType.TEXT);
        
        // Add AI metadata for the third response
        Message.AiMetadata metadata3 = new Message.AiMetadata();
        metadata3.setModelId("gpt4");
        metadata3.setDeploymentName("java-agent");
        metadata3.setTemperature(0.7);
        metadata3.setTokensUsed(300);
        metadata3.setProcessingTime(1.5);
        metadata3.setAdditionalData(new HashMap<>());
        response3.setAiMetadata(metadata3);
        
        conversation3.addMessage(response3);
        
        conversations.put(conversation2.getId(), conversation2);
        
        // Create a third demo conversation focused on Azure integration
        Conversation conversation3 = new Conversation();
        conversation3.setId("conv-3");
        conversation3.setTitle("Azure Services Integration");
        conversation3.setCreatedAt(LocalDateTime.now().minusHours(5));
        conversation3.setUpdatedAt(LocalDateTime.now().minusHours(5));
        
        Message message4 = new Message();
        message4.setId("msg-7");
        message4.setConversationId("conv-3");
        message4.setSender("user");
        message4.setContent("How do I integrate Azure Cognitive Services with my Spring Boot application?");
        message4.setTimestamp(LocalDateTime.now().minusHours(5));
        message4.setType(Message.MessageType.TEXT);
        conversation3.addMessage(message4);
        
        Message response4 = new Message();
        response4.setId("msg-8");
        response4.setConversationId("conv-3");
        response4.setSender("agent");
        response4.setContent("You can integrate Azure Cognitive Services with Spring Boot using the Azure SDK for Java. Here's how to set up a text analytics client for sentiment analysis:\n\n" +
                "```java\n" +
                "@Service\n" +
                "public class TextAnalyticsService {\n" +
                "    private final TextAnalyticsClient textAnalyticsClient;\n" +
                "    \n" +
                "    public TextAnalyticsService(@Value(\"${azure.cognitive.key}\") String apiKey,\n" +
                "                               @Value(\"${azure.cognitive.endpoint}\") String endpoint) {\n" +
                "        TextAnalyticsClientBuilder builder = new TextAnalyticsClientBuilder()\n" +
                "            .credential(new AzureKeyCredential(apiKey))\n" +
                "            .endpoint(endpoint);\n" +
                "            \n" +
                "        this.textAnalyticsClient = builder.buildClient();\n" +
                "    }\n" +
                "    \n" +
                "    public DocumentSentiment analyzeSentiment(String text) {\n" +
                "        return textAnalyticsClient.analyzeSentiment(text);\n" +
                "    }\n" +
                "    \n" +
                "    public List<CategorizedEntity> recognizeEntities(String text) {\n" +
                "        return textAnalyticsClient.recognizeEntities(text)\n" +
                "            .stream()\n" +
                "            .collect(Collectors.toList());\n" +
                "    }\n" +
                "}\n" +
                "```\n\n" +
                "Don't forget to add these dependencies to your pom.xml:\n\n" +
                "```xml\n" +
                "<dependency>\n" +
                "    <groupId>com.azure</groupId>\n" +
                "    <artifactId>azure-ai-textanalytics</artifactId>\n" +
                "    <version>5.2.0</version>\n" +
                "</dependency>\n" +
                "```\n\n" +
                "And add these properties to your application.yml:\n\n" +
                "```yaml\n" +
                "azure:\n" +
                "  cognitive:\n" +
                "    key: ${AZURE_COGNITIVE_KEY}\n" +
                "    endpoint: ${AZURE_COGNITIVE_ENDPOINT}\n" +
                "```\n\n" +
                "Would you like me to show you how to create a REST controller to expose this service?");
        response4.setTimestamp(LocalDateTime.now().minusHours(5).plusMinutes(2));
        response4.setType(Message.MessageType.TEXT);
        
        // Add AI metadata for the fourth response
        Message.AiMetadata metadata4 = new Message.AiMetadata();
        metadata4.setModelId("gpt4");
        metadata4.setDeploymentName("java-agent");
        metadata4.setTemperature(0.7);
        metadata4.setTokensUsed(350);
        metadata4.setProcessingTime(1.7);
        metadata4.setAdditionalData(new HashMap<>());
        response4.setAiMetadata(metadata4);
        
        conversation3.addMessage(response4);
        
        conversations.put(conversation3.getId(), conversation3);
    }
}
