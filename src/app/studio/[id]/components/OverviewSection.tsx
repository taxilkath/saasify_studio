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
    <div className="space-y-10">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {overviewMock.metrics.map((m) => (
          <div
            key={m.label}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center shadow-lg backdrop-blur-md"
          >
            <span className="text-4xl mb-3">{m.icon}</span>
            <span className="text-3xl font-extrabold text-white">{m.value}</span>
            <span className="text-zinc-400 text-sm mt-1">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Project Details & Tickets by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3 text-white">Project Details</h3>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md shadow-md space-y-3">
            <div><span className="font-semibold text-zinc-300">Project:</span> {overviewMock.details.info}</div>
            <div><span className="font-semibold text-zinc-300">Owner:</span> {overviewMock.details.owner}</div>
            <div><span className="font-semibold text-zinc-300">Created:</span> {overviewMock.details.created}</div>
            <div><span className="font-semibold text-zinc-300">Last Updated:</span> {overviewMock.details.lastUpdated}</div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3 text-white">Tickets by Status</h3>
          <div className="flex gap-4 flex-wrap">
            {overviewMock.ticketsByStatus.map((t) => (
              <div
                key={t.label}
                className={`rounded-xl px-5 py-4 flex flex-col items-center ${t.color} text-white min-w-[110px] shadow-md`}
              >
                <span className="text-2xl font-bold">{t.value}</span>
                <span className="text-xs mt-1">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Progress */}
      <div>
        <h3 className="text-xl font-bold mb-3 text-white">Feature Progress</h3>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md shadow-md divide-y divide-zinc-800">
          {overviewMock.features.map((f) => (
            <div
              key={f.name}
              className="flex justify-between items-center py-3"
            >
              <span className="text-zinc-200">{f.name}</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  f.status === "Completed"
                    ? "bg-green-600 text-white"
                    : f.status === "In Progress"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-600 text-white"
                }`}
              >
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Analysis */}
      <div>
        <h3 className="text-xl font-bold mb-3 text-white">Project Analysis</h3>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md shadow-md text-zinc-300">
          {overviewMock.analysis}
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
