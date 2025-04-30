import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, MessageSquare, Download, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

const initialConversations = [
  {
    id: "conv-1",
    title: "Spring Boot Security Configuration",
    agent: "Java Developer",
    timestamp: "2025-04-20T14:32:00",
    messages: 8,
    status: "completed"
  },
  {
    id: "conv-2",
    title: "JPA Repository Setup",
    agent: "Java Developer",
    timestamp: "2025-04-19T11:15:00",
    messages: 6,
    status: "completed"
  },
  {
    id: "conv-3",
    title: "Azure Service Integration",
    agent: "System Architect",
    timestamp: "2025-04-18T09:45:00",
    messages: 12,
    status: "completed"
  }
];

const sampleConversationDetails = {
  id: "conv-1",
  title: "Spring Boot Security Configuration",
  agent: "Java Developer",
  timestamp: "2025-04-20T14:32:00",
  messages: [
    {
      role: "user",
      content: "I need help setting up Spring Security with JWT authentication in my Spring Boot application. Can you guide me through the configuration?",
      timestamp: "2025-04-20T14:32:00"
    },
    {
      role: "agent",
      content: "I'll help you set up JWT authentication with Spring Security. First, let's add the required dependencies to your pom.xml:\n\n```xml\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-security</artifactId>\n</dependency>\n<dependency>\n    <groupId>io.jsonwebtoken</groupId>\n    <artifactId>jjwt-api</artifactId>\n    <version>0.11.5</version>\n</dependency>\n```\n\nNow, let's create a basic security configuration class:\n\n```java\n@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        return http\n            .csrf(csrf -> csrf.disable())\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/auth/**\").permitAll()\n                .anyRequest().authenticated()\n            )\n            .sessionManagement(session -> session\n                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)\n            )\n            .build();\n    }\n\n    @Bean\n    public PasswordEncoder passwordEncoder() {\n        return new BCryptPasswordEncoder();\n    }\n}\n```\n\nWould you like me to explain how this configuration works or shall we move on to implementing the JWT service?",
      timestamp: "2025-04-20T14:32:30"
    },
    {
      role: "user",
      content: "Yes, please explain how the security configuration works, especially the filter chain setup.",
      timestamp: "2025-04-20T14:33:00"
    },
    {
      role: "agent",
      content: "Let me break down the security configuration:\n\n1. `@EnableWebSecurity` enables Spring Security's web security support.\n\n2. The `filterChain` method configures several important security aspects:\n\n   - `csrf().disable()`: Disables CSRF protection as it's typically not needed for stateless JWT authentication\n   \n   - `authorizeHttpRequests()`: Configures authorization rules:\n     * `/api/auth/**` endpoints are publicly accessible\n     * All other requests require authentication\n   \n   - `sessionManagement()`: Sets the session policy to STATELESS since JWT is stateless\n\n3. `PasswordEncoder` bean uses BCrypt for password hashing\n\nWould you like to see how to implement the JWT token generation and validation next?",
      timestamp: "2025-04-20T14:33:30"
    }
  ]
};

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

interface ConversationHistoryProps {
  config: AgentConfig;
}

const ConversationHistory = ({ config }: ConversationHistoryProps) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<typeof sampleConversationDetails | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (selectedId) {
      setIsLoading(true);
      setTimeout(() => {
        setSelectedConversation(sampleConversationDetails);
        setIsLoading(false);
      }, 700);
    } else {
      setSelectedConversation(null);
    }
  }, [selectedId]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
  };
  
  const handleStartNewConversation = () => {
    const newId = `conv-${conversations.length + 1}`;
    const newConversation = {
      id: newId,
      title: `New Conversation with ${config.agent.name}`,
      agent: config.agent.role.charAt(0).toUpperCase() + config.agent.role.slice(1),
      timestamp: new Date().toISOString(),
      messages: 0,
      status: "active"
    };
    
    setConversations([newConversation, ...conversations]);
    setSelectedId(newId);
    toast.success("New conversation started", {
      description: `Started conversation with ${config.agent.name}`
    });
    
    const newDetail = {
      ...sampleConversationDetails,
      id: newId,
      title: newConversation.title,
      agent: newConversation.agent,
      timestamp: newConversation.timestamp,
      messages: []
    };
    
    setSelectedConversation(newDetail);
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !selectedConversation) return;
    
    setIsLoading(true);
    
    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          role: "user",
          content: newMessageText,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    setSelectedConversation(updatedConversation);
    setNewMessageText("");
    
    setTimeout(() => {
      const javaResponses = [
        "Let me show you the Spring Boot configuration for that:\n\n```java\n@Configuration\n@EnableJpaRepositories\npublic class DatabaseConfig {\n    @Bean\n    public DataSource dataSource() {\n        return DataSourceBuilder.create()\n            .url(\"jdbc:postgresql://localhost:5432/mydb\")\n            .username(\"user\")\n            .password(\"password\")\n            .build();\n    }\n}\n```\n\nThis sets up a basic PostgreSQL datasource. Would you like me to explain each configuration option?",
        "Here's how to implement custom authentication in Spring Security:\n\n```java\n@Service\npublic class CustomAuthenticationProvider implements AuthenticationProvider {\n    @Override\n    public Authentication authenticate(Authentication auth) throws AuthenticationException {\n        // Authentication logic here\n    }\n}\n```\n\nWould you like me to show you how to integrate this with your security configuration?",
        "For your Azure integration, you'll need this Spring Cloud configuration:\n\n```yaml\nspring:\n  cloud:\n    azure:\n      credential:\n        client-id: ${AZURE_CLIENT_ID}\n        client-secret: ${AZURE_CLIENT_SECRET}\n```\n\nShall I explain how to set up the Azure connection properties?",
        "Here's a typical JPA entity setup for your domain:\n\n```java\n@Entity\n@Table(name = \"users\")\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    \n    @Column(nullable = false)\n    private String username;\n    \n    // Additional fields\n}\n```\n\nWould you like to see how to create the corresponding repository interface?"
      ];
      
      const randomResponse = javaResponses[Math.floor(Math.random() * javaResponses.length)];
      
      const finalConversation = {
        ...updatedConversation,
        messages: [
          ...updatedConversation.messages,
          {
            role: "agent",
            content: randomResponse,
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setSelectedConversation(finalConversation);
      setIsLoading(false);
      
      setConversations(prevConvs => 
        prevConvs.map(conv => 
          conv.id === selectedId 
            ? { ...conv, messages: (conv.messages as number) + 2 } 
            : conv
        )
      );
    }, 1500);
  };
  
  const handleExportHistory = () => {
    toast.success("Conversation history exported", {
      description: "The conversation has been exported to a JSON file"
    });
  };
  
  const filteredConversations = conversations.filter(conv => {
    if (searchQuery && !conv.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filter !== "all" && conv.agent.toLowerCase() !== filter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Button 
              onClick={handleStartNewConversation}
              size="sm" 
              className="h-8 px-2 text-xs"
            >
              <Plus className="h-4 w-4 mr-1" /> New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pb-0 flex-grow overflow-hidden">
          <div className="mb-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger id="agent-filter" className="text-xs h-8">
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="java developer">Java Developer</SelectItem>
                <SelectItem value="system architect">System Architect</SelectItem>
                <SelectItem value="devops engineer">DevOps Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[calc(100%-40px)] pr-4">
            {filteredConversations.length > 0 ? (
              <div className="space-y-3">
                {filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer border transition-colors ${
                      selectedId === conversation.id 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm line-clamp-1">{conversation.title}</h4>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {conversation.messages} msgs
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">{formatDate(conversation.timestamp)}</p>
                      <p className="text-xs text-slate-500">{conversation.agent}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No conversations match your search
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs" onClick={handleExportHistory}>
            <Download className="h-4 w-4 mr-1" /> Export History
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="md:col-span-2 h-[600px] flex flex-col">
        {selectedId ? (
          isLoading && !selectedConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600">Loading conversation history...</p>
              </div>
            </div>
          ) : selectedConversation ? (
            <ConversationDetail 
              conversation={selectedConversation} 
              isLoading={isLoading}
              newMessage={newMessageText}
              setNewMessage={setNewMessageText}
              onSendMessage={handleSendMessage}
            />
          ) : null
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6">
            <MessageSquare className="h-16 w-16 mb-4 text-slate-300" />
            <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
            <p className="text-center mb-6">Select a conversation from the list or start a new chat with your Java agent</p>
            <Button onClick={handleStartNewConversation}>
              <Plus className="h-4 w-4 mr-2" /> Start New Conversation
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

interface DetailProps {
  conversation: typeof sampleConversationDetails;
  isLoading: boolean;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSendMessage: () => void;
}

const ConversationDetail = ({ 
  conversation, 
  isLoading, 
  newMessage, 
  setNewMessage,
  onSendMessage
}: DetailProps) => {
  const [viewTab, setViewTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  const handleCopyCode = () => {
    toast.success("Code copied to clipboard");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };
  
  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{conversation.title}</CardTitle>
            <CardDescription>
              {conversation.agent} • {formatDate(conversation.timestamp)}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" /> Share
            </Button>
            <Button variant="default" size="sm">
              Continue
            </Button>
          </div>
        </div>
        <Tabs value={viewTab} onValueChange={setViewTab} className="mt-2">
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="chat">Chat History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
        <TabsContent value="chat" className="m-0 flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow px-6 pt-2">
            <div className="space-y-4 py-2">
              {conversation.messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="text-xs text-slate-500 mb-1">
                      {message.role === 'user' ? 'You' : conversation.agent} • {formatTime(message.timestamp)}
                    </div>
                    <div className="whitespace-pre-line">
                      {message.content.includes('```') ? (
                        <>
                          {message.content.split('```').map((part, i) => 
                            i % 2 === 0 ? (
                              <span key={i}>{part}</span>
                            ) : (
                              <div key={i} className="relative my-2">
                                <pre className="bg-slate-800 text-slate-100 p-3 rounded overflow-x-auto text-xs">
                                  <code>{part}</code>
                                </pre>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="absolute top-2 right-2 h-7 w-7 p-0" 
                                  onClick={handleCopyCode}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-24"
                disabled={isLoading}
              />
              <Button 
                className="absolute right-0 top-0 rounded-l-none" 
                size="sm"
                onClick={onSendMessage}
                disabled={!newMessage.trim() || isLoading}
              >
                {isLoading ? 
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : 
                  null
                }
                Send
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="m-0 h-full overflow-auto">
          <div className="p-6 h-full">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard title="Response Time" value="1.2s" trend="down" percent={15} />
              <MetricCard title="User Satisfaction" value="96%" trend="up" percent={4} />
              <MetricCard title="Code Blocks" value="7" trend="up" percent={40} />
              <MetricCard title="Technical Accuracy" value="98.5%" trend="up" percent={2} />
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Topic Distribution</h3>
              <div className="h-8 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-blue-500 h-full" style={{ width: "42%" }} />
                  <div className="bg-green-500 h-full" style={{ width: "30%" }} />
                  <div className="bg-amber-500 h-full" style={{ width: "15%" }} />
                  <div className="bg-purple-500 h-full" style={{ width: "13%" }} />
                </div>
              </div>
              <div className="flex text-xs mt-1 text-slate-500 justify-between">
                <span>Spring Boot (42%)</span>
                <span>JPA (30%)</span>
                <span>Security (15%)</span>
                <span>Azure (13%)</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Conversation Flow</h3>
              <div className="border rounded-md p-3 bg-slate-50">
                <div className="text-xs text-slate-600 mb-2">
                  <span className="font-medium">Total Duration:</span> 14 minutes
                </div>
                <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                  {[25, 40, 65, 90].map((pos, i) => (
                    <div key={i} className="absolute top-0 h-full w-0.5 bg-slate-400" style={{ left: `${pos}%` }} />
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex justify-between">
                  <span>Start</span>
                  <span>End</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  percent 
}: { 
  title: string; 
  value: string; 
  trend: 'up' | 'down'; 
  percent: number;
}) => {
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
      <div className={`text-xs mt-1 ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {percent}% vs previous
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default ConversationHistory;
