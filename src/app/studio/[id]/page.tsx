"use client";

import { useState } from "react";
import UserFlowDiagram from "./components/UserFlowDiagram";
import KanbanBoardDnd from "./components/KanbanBoardDnd";
import MemoryBankSection from "./components/MemoryBankSection";
import OverviewSection from "./components/OverviewSection";

const mockProject = {
  name: "Prodigies University",
  description: "AI-powered web app that helps developers build high-quality projects",
};

const memoryBankContent = `# AI Chat Assistant - Memory Bank

## Project Overview
AI Chat Assistant is an intelligent conversational interface that helps users get answers to their questions using advanced AI technology. The assistant enables seamless chat experiences with natural language understanding and contextual responses.

- Seamless onboarding
- Managing tickets using information
- Training assistant knowledge via memory bank
- Accessing features through smart capabilities

## Core Features
- Natural Language Chat Interface
- Ticket Management: Creating, updating, understanding user queries
- Memory Bank: Storing, retrieving, and contextual answers/annotations
- Knowledge Base Integration: Real-time Text/Doc/URL ingestion
- Analytics: Usage tracking, feature success
- User Authentication & Roles

## Example Memory Bank
- How to reset password
- How to connect to Slack
- How to escalate a ticket
- ...and more
`;

const tabs = ["User Flow", "Tickets Board", "Overview", "Memory Bank"];

export default function ProjectDetailPage() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="p-8 min-h-screen bg-zinc-950 text-zinc-100">
      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">{mockProject.name}</h1>
        <p className="text-zinc-400 mt-2">{mockProject.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-2 text-lg font-medium transition-colors ${selectedTab === tab
              ? "border-b-2 border-indigo-500 text-white"
              : "text-zinc-400 hover:text-white"
              }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div>
        {selectedTab === "User Flow" && (
          <div>
            <h2 className="text-xl font-bold mb-2">User Flow</h2>
            <UserFlowDiagram />
          </div>
        )}
        {selectedTab === "Tickets Board" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Tickets Board</h2>
            <KanbanBoardDnd />
          </div>
        )}
        {selectedTab === "Overview" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <OverviewSection />
          </div>
        )}
        {selectedTab === "Memory Bank" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Memory Bank</h2>
            <MemoryBankSection memoryBankContent={memoryBankContent} />
          </div>
        )}
      </div>
    </div>
  );
} 