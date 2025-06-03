"use client"; // Add this if animations/interactions require it, though for now, keyframes can be global.
// If all interactions are CSS-based (hover) and data is from props, "use client" might not be strictly needed
// for this component itself, but the animation setup is cleaner with global CSS.
// For the staggered animation `style={{ animation: ... }}`, it's generally fine in RSCs as it's declarative.
// However, if this component is part of a page that heavily uses client-side interactivity,
// or if you encounter further RSC-related issues, you might consider making it a Client Component.
// For now, let's assume the primary issue was styled-jsx in RSC.

import React from 'react';

const overviewMock = {
  metrics: [
    { label: "Total Tickets", value: 24, icon: "🎫", color: "text-purple-400" },
    { label: "Total Features", value: 12, icon: "🧩", color: "text-sky-400" },
    { label: "In Progress Features", value: 3, icon: "⚙️", color: "text-amber-400" },
    { label: "Velocity", value: "16+", icon: "🚀", color: "text-emerald-400" },
  ],
  details: {
    info: "Prodigies University",
    lastUpdated: "October 27, 2023",
    created: "October 14, 2023",
    owner: "Team Marketing",
  },
  ticketsByStatus: [
    { label: "Completed", value: 12, color: "bg-green-500", textColor: "text-green-100" },
    { label: "In Progress", value: 3, color: "bg-yellow-500", textColor: "text-yellow-100" },
    { label: "To Do", value: 6, color: "bg-blue-500", textColor: "text-blue-100" },
    { label: "Backlog", value: 3, color: "bg-gray-500", textColor: "text-gray-100" },
  ],
  features: [
    { name: "Authentication System", status: "In Progress" },
    { name: "Dashboard Widgets", status: "Completed" },
    { name: "User Profile Management", status: "Completed" },
    { name: "Kanban Board Integration", status: "To Do" },
    { name: "Reporting & Analytics", status: "Backlog" },
  ],
  analysis: "Prodigies University is a comprehensive, AI-powered platform designed to help developers build high-quality projects efficiently. Our focus on intuitive design and robust functionality ensures a seamless development experience."
};

const totalTickets = overviewMock.ticketsByStatus.reduce((sum, t) => sum + t.value, 0);

function OverviewSection() {
  return (
    <div className="min-h-screen from-slate-900 to-black text-gray-100 p-6 md:p-10">
      <div className="space-y-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewMock.metrics.map((m) => (
            <div
              key={m.label}
              className="group bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl backdrop-blur-lg
                         hover:bg-slate-700/90 hover:shadow-purple-500/20 hover:shadow-2xl hover:border-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <span className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 ${m.color}`}>{m.icon}</span>
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                {m.value}
              </span>
              <span className="text-slate-400 text-sm mt-2 tracking-wide">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Project Details & Tickets by Status */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              Project Details
            </h3>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-lg space-y-4 h-full
                            hover:border-slate-600 transition-colors duration-300">
              {[
                { label: "Project", value: overviewMock.details.info },
                { label: "Owner", value: overviewMock.details.owner },
                { label: "Created", value: overviewMock.details.created },
                { label: "Last Updated", value: overviewMock.details.lastUpdated },
              ].map(detail => (
                <div key={detail.label} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-400">{detail.label}:</span>
                  <span className="text-slate-200">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
              Tickets by Status
            </h3>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-lg space-y-5 h-full
                            hover:border-slate-600 transition-colors duration-300">
              {overviewMock.ticketsByStatus.map((t) => (
                <div key={t.label} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${t.textColor ? t.textColor.replace('100', '300') : 'text-slate-300'}`}>{t.label}</span>
                    <span className={`text-xs font-semibold ${t.textColor ? t.textColor.replace('100', '400') : 'text-slate-400'}`}>{t.value} tickets</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3.5 overflow-hidden">
                    <div
                      className={`${t.color} h-3.5 rounded-full transition-all duration-500 ease-out group-hover:brightness-125`}
                      style={{ width: totalTickets > 0 ? `${(t.value / totalTickets) * 100}%` : '0%' }}
                      title={`${t.label}: ${t.value} (${totalTickets > 0 ? ((t.value / totalTickets) * 100).toFixed(1) : '0'}%)`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Progress */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
            Feature Progress
          </h3>
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl backdrop-blur-md shadow-lg
                          hover:border-slate-600 transition-colors duration-300 overflow-hidden">
            <div className="divide-y divide-slate-700/50">
              {overviewMock.features.map((f, index) => (
                <div
                  key={f.name}
                  className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/50 transition-colors duration-200 feature-item" // Added a class for animation
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }} // Initial state for animation
                >
                  <span className="text-slate-200 font-medium">{f.name}</span>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${
                      f.status === "Completed"
                        ? "bg-green-500/30 text-green-300 border border-green-500/50"
                        : f.status === "In Progress"
                        ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 animate-pulse" // Tailwind animate-pulse
                        : f.status === "To Do"
                        ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                        : "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Analysis */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
            Project Analysis
          </h3>
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-lg
                          hover:border-slate-600 transition-colors duration-300">
            <p className="text-slate-300 leading-relaxed text-opacity-90">
              {overviewMock.analysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;