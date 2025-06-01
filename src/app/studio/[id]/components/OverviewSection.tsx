const overviewMock = {
  metrics: [
    { label: "Total Tickets", value: 24, icon: "🎫" },
    { label: "Total Features", value: 12, icon: "🧩" },
    { label: "In Progress Features", value: 3, icon: "⚙️" },
    { label: "Velocity", value: "16+", icon: "🚀" },
  ],
  details: {
    info: "Prodigies University",
    lastUpdated: "October 27, 2023",
    created: "October 14, 2023",
    owner: "Team Marketing",
  },
  ticketsByStatus: [
    { label: "Completed", value: 12, color: "bg-green-500" },
    { label: "In Progress", value: 3, color: "bg-yellow-500" },
    { label: "To Do", value: 6, color: "bg-blue-500" },
    { label: "Backlog", value: 3, color: "bg-gray-500" },
  ],
  features: [
    { name: "Authentication System", status: "In Progress" },
    { name: "Dashboard Widgets", status: "Completed" },
    { name: "Kanban Board", status: "To Do" },
  ],
  analysis: "Prodigies University is a comprehensive, AI-powered platform designed to help developers build high-quality projects efficiently."
};

function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {overviewMock.metrics.map((m) => (
          <div key={m.label} className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center shadow border border-zinc-800">
            <span className="text-3xl mb-2">{m.icon}</span>
            <span className="text-2xl font-bold text-white">{m.value}</span>
            <span className="text-zinc-400 text-sm mt-1">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Project Details & Tickets by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Project Details</h3>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="mb-2"><span className="font-semibold">Project:</span> {overviewMock.details.info}</div>
            <div className="mb-2"><span className="font-semibold">Owner:</span> {overviewMock.details.owner}</div>
            <div className="mb-2"><span className="font-semibold">Created:</span> {overviewMock.details.created}</div>
            <div><span className="font-semibold">Last Updated:</span> {overviewMock.details.lastUpdated}</div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Tickets by Status</h3>
          <div className="flex gap-3 flex-wrap">
            {overviewMock.ticketsByStatus.map((t) => (
              <div key={t.label} className={`rounded-lg px-4 py-3 flex flex-col items-center ${t.color} text-white min-w-[100px]`}>
                <span className="text-xl font-bold">{t.value}</span>
                <span className="text-xs">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Progress */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-white">Feature Progress</h3>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          {overviewMock.features.map((f) => (
            <div key={f.name} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-b-0">
              <span>{f.name}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                f.status === "Completed" ? "bg-green-600 text-white" :
                f.status === "In Progress" ? "bg-yellow-500 text-black" :
                "bg-blue-600 text-white"
              }`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Analysis */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-white">Project Analysis</h3>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-zinc-300">
          {overviewMock.analysis}
        </div>
      </div>
    </div>
  );
}

export default OverviewSection; 