import Image from "next/image";

export default function ProjectDetailPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Prodigies University
        </h1>
        <p className="text-zinc-400 text-base mt-1 max-w-2xl">
          AI-powered web app that helps developers build high-quality projects
        </p>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-800 mb-8">
        <button className="px-4 py-2 text-zinc-300 hover:text-white border-b-2 border-transparent hover:border-indigo-500 font-mono">User Flow</button>
        <button className="px-4 py-2 text-zinc-300 hover:text-white border-b-2 border-transparent hover:border-indigo-500 font-mono">Tickets Board</button>
        <button className="px-4 py-2 text-zinc-300 hover:text-white border-b-2 border-transparent hover:border-indigo-500 font-mono">Overview</button>
        <button className="px-4 py-2 text-zinc-300 hover:text-white border-b-2 border-transparent hover:border-indigo-500 font-mono">Memory Bank</button>
      </div>
      {/* Kanban Board Placeholder */}
      <div className="bg-zinc-900/80 rounded-xl shadow-xl p-8 mb-8 min-h-[300px]">
        <h2 className="text-xl font-bold mb-4 font-mono text-white">Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-800 rounded-lg p-4 min-h-[200px]">
            <h3 className="font-bold text-zinc-200 mb-2">Backlog</h3>
            {/* Tickets go here */}
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 min-h-[200px]">
            <h3 className="font-bold text-zinc-200 mb-2">To Do</h3>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 min-h-[200px]">
            <h3 className="font-bold text-zinc-200 mb-2">In Progress</h3>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 min-h-[200px]">
            <h3 className="font-bold text-zinc-200 mb-2">Complete</h3>
          </div>
        </div>
      </div>
      {/* Flow Chart Placeholder */}
      <div className="bg-zinc-900/80 rounded-xl shadow-xl p-8 mb-8 min-h-[200px]">
        <h2 className="text-xl font-bold mb-4 font-mono text-white">User Flow / Architecture</h2>
        <div className="h-32 flex items-center justify-center text-zinc-500">[Flow chart goes here]</div>
      </div>
      {/* Metrics/Overview Placeholder */}
      <div className="bg-zinc-900/80 rounded-xl shadow-xl p-8 mb-8 min-h-[120px]">
        <h2 className="text-xl font-bold mb-4 font-mono text-white">Overview & Metrics</h2>
        <div className="h-16 flex items-center justify-center text-zinc-500">[Metrics and project details go here]</div>
      </div>
      {/* Memory Bank Placeholder */}
      <div className="bg-zinc-900/80 rounded-xl shadow-xl p-8 min-h-[120px]">
        <h2 className="text-xl font-bold mb-4 font-mono text-white">Memory Bank</h2>
        <div className="h-16 flex items-center justify-center text-zinc-500">[Memory bank markdown/text goes here]</div>
      </div>
    </div>
  );
}
