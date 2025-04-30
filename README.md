![architecture](https://github.com/user-attachments/assets/503ed7c8-db68-4b2b-9ab0-56ac6c31a466)
# 📘 Microsoft AI Agent Platform 

This is a full-stack project that delivers an **AI-powered enterprise Java assistant** using a **Spring Boot backend** and a **Vite + React + TypeScript frontend**. It aims to streamline Java development through intelligent assistance, real-time JVM monitoring, and seamless integration with **Azure OpenAI**.

---

## 🚀 Features

- 🧠 **Enterprise Java Agent**: Conversational AI assistant for developers.
- 📈 **JVM Metrics Monitoring**: Visualizes performance metrics of the Java Virtual Machine in real-time.
- 🔗 **Azure OpenAI Integration**: Uses Azure-hosted LLMs to provide code suggestions, explanations, and more.
- 💬 **Conversation History Management**: Stores and manages developer interactions with the agent.
- ⚙️ **Customizable Agents**: Modify and configure agents as per your enterprise use case.
- 🌐 **Modern Frontend**: Built using Vite, React, TailwindCSS, and shadcn UI for a sleek UI/UX.

---


## 🧠 AI Agent Design Diagram
This design diagram showcases the user interaction flow, including developer input, web interface, AI agent processing, and supporting systems like monitoring and data loss prevention.
 ![Diagram](https://github.com/user-attachments/assets/d10f589f-3b21-4823-b317-42ed051d9a15)
  
## 🔧 AI Agent Architecture Diagram
This diagram provides a high-level view of how core components like the frontend, backend, Azure OpenAI integration, and storage systems interact.
  ![architecture](https://github.com/user-attachments/assets/1c6ca366-dbb1-41b3-a09c-b8d0e0d689e2)

  
## 🛠️ Tech Stack

### Backend:
- Java 17+
- Spring Boot 3.x
- Maven
- Azure OpenAI API

### Frontend:
- Vite + React
- TypeScript
- TailwindCSS
- shadcn/ui components
- ESLint + PostCSS + Bun (alternative JS runtime)

---

## 🏁 Getting Started

### Prerequisites:
- Java 17 or newer
- Node.js or Bun (if using Bun)
- Maven
- Azure OpenAI credentials
- (Optional) Docker for containerization

---

### 🔧 Backend Setup

```bash
# Navigate to the project root
cd ai-agent-java-genesis

# Build the Spring Boot backend
mvn clean install

# Run the Spring Boot server
mvn spring-boot:run
```

> The server will start on `http://localhost:8080` by default.

---

### 💻 Frontend Setup

#### Using Node:
```bash
cd ai-agent-java-genesis
npm install
npm run dev
```

#### Or using Bun (faster alternative):
```bash
bun install
bun run dev
```

> The React app will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```
ai-agent-java-genesis/
├── src/                 # Java backend source (Spring Boot)
├── public/              # Static files for frontend
├── .gitignore
├── package.json         # Frontend dependencies & scripts
├── pom.xml              # Backend dependencies & config
├── vite.config.ts       # Frontend Vite configuration
└── README.md            # Project documentation
```

---

## 🔐 Environment Configuration

Ensure you have a `.env` or `application.properties` file in your backend that includes:

```properties
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
```

Frontend may need to access similar keys via Vite's `.env`:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

---

## ✅ Use Cases

- Help developers debug and get insights into their Java codebase.
- Offer AI-driven coding suggestions and documentation help.
- Visual monitoring of JVM behavior and performance metrics.
- Easily extensible to plug into CI/CD pipelines or DevOps dashboards.

---

## 📌 Future Enhancements

- Agent training on custom enterprise codebases
- Fine-tuned LLM integration
- More analytics and logging dashboards
- Slack/MS Teams integration for agent access
