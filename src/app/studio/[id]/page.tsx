"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/lib/projectStore';
import UserFlowDiagram from "./components/UserFlowDiagram";
import KanbanBoardDnd from "./components/KanbanBoardDnd";
import MemoryBankSection from "./components/MemoryBankSection";
import OverviewSection from "./components/OverviewSection";
import BlueprintDisplay from "./components/BlueprintDisplay";
import { Loader2 } from 'lucide-react';

const TABS: { [key: string]: string } = {
  "blueprint": "Blueprint",
  "overview": "Overview",
  "user-flow": "User Flow",
  "tickets-board": "Tickets Board",
  "memory-bank": "Memory Bank",
};

function StudioPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = params?.id as string;
  const projectName = params?.name as string;
  
  const initialTab = searchParams.get('tab') || Object.keys(TABS)[0];
  const [selectedTab, setSelectedTab] = useState(
    TABS[initialTab] ? initialTab : Object.keys(TABS)[0]
  );

  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/studio/${projectId}`);
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold text-foreground">Loading Projects...</h3>
        <p className="text-muted-foreground mt-1">
          Please select a project from your dashboard.
        </p>
      </div>
    );
  }

  const currentProject = projects.find(p => p._id === projectId);

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Project Studio</h1>
        <p className="text-muted-foreground mt-2">
          {currentProject ? `Workspace for: ${currentProject.name}` : `Loading project...`}
        </p>
      </div>

      <div className="flex gap-4 sm:gap-6 border-b border-border mb-8 overflow-x-auto">
        {Object.entries(TABS).map(([key, title]) => (
          <button
            key={key}
            className={`py-3 px-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap focus:outline-none ${
              selectedTab === key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
            }`}
            onClick={() => setSelectedTab(key)}
          >
            {title}
          </button>
        ))}
      </div>

      <div>
        {selectedTab === "blueprint" && <BlueprintDisplay projectId={projectId} />}
        {selectedTab === "overview" && <OverviewSection />}
        {selectedTab === "user-flow" && <UserFlowDiagram />}
        {selectedTab === "tickets-board" && <KanbanBoardDnd />}
        {selectedTab === "memory-bank" && <MemoryBankSection memoryBankContent={""} />}
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin"/></div>}>
      <StudioPageContent />
    </Suspense>
  )
} 