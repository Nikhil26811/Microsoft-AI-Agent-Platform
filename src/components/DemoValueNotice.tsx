
const DemoValueNotice = () => (
  <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 shadow flex flex-col gap-1 animate-fade-in">
    <div className="text-lg font-semibold">
      <span role="img" aria-label="lightbulb">💡</span> Enterprise Value & Hackathon Winning Features
    </div>
    <ul className="list-disc ml-4 text-[15px] space-y-1 pt-1">
      <li>
        <b>Purpose-built for Java AI Agent Monitoring:</b> Real-time visibility into <b>heap usage, CPU, memory, garbage collection, and thread activity</b> for Java agents.
      </li>
      <li>
        <b>Deep Integration with Microsoft Azure AI:</b> Out-of-the-box metrics for agents using <b>Azure OpenAI</b>, <b>Azure Cognitive Search</b>, and <b>Azure Blob Storage</b>—enterprise-grade monitoring without custom code.
      </li>
      <li>
        <b>Zero-setup Demo Mode:</b> All metrics update in real time <b>without any backend or API keys</b>, enabling risk-free demos and rapid prototyping.
      </li>
      <li>
        <b>Enterprise Readiness:</b> Supports multi-agent, cloud-scale Java deployments; actionable insights for fast troubleshooting and SLA adherence.
      </li>
      <li>
        <b>Unique Value for Java Teams:</b> Specifically designed for observability needs of <b>enterprise Java on Azure</b>—a crucial gap not covered by generic metrics platforms.
      </li>
    </ul>
  </div>
);

export default DemoValueNotice;
