"use client"; // Add this if animations/interactions require it, though for now, keyframes can be global.
// If all interactions are CSS-based (hover) and data is from props, "use client" might not be strictly needed
// for this component itself, but the animation setup is cleaner with global CSS.
// For the staggered animation `style={{ animation: ... }}`, it's generally fine in RSCs as it's declarative.
// However, if this component is part of a page that heavily uses client-side interactivity,
// or if you encounter further RSC-related issues, you might consider making it a Client Component.
// For now, let's assume the primary issue was styled-jsx in RSC.

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const overviewMock = {
  metrics: [
    { label: "Total Tickets", value: 24, icon: "🎫", color: "text-purple-500 dark:text-purple-400" },
    { label: "Total Features", value: 12, icon: "🧩", color: "text-sky-500 dark:text-sky-400" },
    { label: "In Progress Features", value: 3, icon: "⚙️", color: "text-amber-500 dark:text-amber-400" },
    { label: "Velocity", value: "16+", icon: "🚀", color: "text-emerald-500 dark:text-emerald-400" },
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
    { name: "User Profile Management", status: "Completed" },
    { name: "Kanban Board Integration", status: "To Do" },
  ],
  analysis: "Prodigies University is a comprehensive, AI-powered platform designed to help developers build high-quality projects efficiently."
};

const totalTickets = overviewMock.ticketsByStatus.reduce((sum, t) => sum + t.value, 0);

function OverviewSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 flex flex-col items-center justify-center h-[160px]">
              <div className="w-12 h-12 rounded-full bg-muted mb-4"></div>
              <div className="h-6 w-16 bg-muted rounded mb-2"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>

        {/* Project Details & Tickets Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 rounded-lg border bg-card p-6">
            <div className="h-6 w-32 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 rounded-lg border bg-card p-6">
            <div className="h-6 w-32 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded"></div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary"/>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMock.metrics.map((m) => (
          <div
            key={m.label}
            className="group rounded-lg border bg-card p-6 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <span className={`text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 ${m.color}`}>{m.icon}</span>
            <span className="text-4xl font-bold text-foreground">
              {m.value}
            </span>
            <span className="text-muted-foreground text-sm mt-1">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Project Details & Tickets by Status */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Project Details</h3>
          <div className="space-y-3">
            {[
              { label: "Project", value: overviewMock.details.info },
              { label: "Owner", value: overviewMock.details.owner },
              { label: "Created", value: overviewMock.details.created },
              { label: "Last Updated", value: overviewMock.details.lastUpdated },
            ].map(detail => (
              <div key={detail.label} className="flex justify-between items-center text-sm">
                <span className="font-medium text-muted-foreground">{detail.label}</span>
                <span className="text-foreground">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Tickets by Status</h3>
          <div className="space-y-4">
            {overviewMock.ticketsByStatus.map((t) => (
              <div key={t.label}>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-muted-foreground">{t.label}</span>
                  <span className="text-xs font-semibold text-foreground">{t.value} tickets</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${t.color} h-2.5 rounded-full`}
                    style={{ width: totalTickets > 0 ? `${(t.value / totalTickets) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Progress */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Feature Progress</h3>
        <div className="space-y-3">
          {overviewMock.features.map((feature) => (
            <div key={feature.name} className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">{feature.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                feature.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                feature.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}>
                {feature.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Analysis */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Project Analysis</h3>
        <p className="text-muted-foreground leading-relaxed">
          {overviewMock.analysis}
        </p>
      </div>
    </div>
  );
}

export default OverviewSection;