"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/projectStore';
import UserFlowDiagram from "./components/UserFlowDiagram";
import KanbanBoardDnd from "./components/KanbanBoardDnd";
import MemoryBankSection from "./components/MemoryBankSection";
import OverviewSection from "./components/OverviewSection";
import BlueprintDisplay from "./components/BlueprintDisplay";
import { Loader2 } from 'lucide-react';

const tabs = ["Blueprint", "Overview", "User Flow", "Tickets Board", "Memory Bank"];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const projectName = params?.name as string;
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/studio/${projectId}`);
  };

  if (!projectId) {
    return (
      <div className="p-4 sm:p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Project Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a project to open its workspace and view the blueprint, tickets, and user flow.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl p-12 min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4"/>
            <h3 className="text-xl font-semibold text-foreground">Loading Projects...</h3>
            <p className="text-muted-foreground mt-1">
              If you have no projects, go to the dashboard to generate one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project: any) => (
              <div
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
                className="cursor-pointer group flex flex-col gap-4 rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary"
              >
                <div className="h-32 w-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-5xl transition-transform duration-300 group-hover:scale-110">🚀</span>
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary">
                    {project.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                    {project.description}
                  </p>
                </div>
                <button className="w-full mt-2 text-sm font-semibold text-primary hover:underline">
                  Open Studio
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Project Studio</h1>
        <p className="text-muted-foreground mt-2">Viewing details for project ID: {projectName}</p>
      </div>

      <div className="flex gap-4 sm:gap-6 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-3 px-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap focus:outline-none ${
              selectedTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {selectedTab === "Blueprint" && projectId && <BlueprintDisplay projectId={projectId} />}
        {selectedTab === "User Flow" && <UserFlowDiagram />}
        {selectedTab === "Tickets Board" && <KanbanBoardDnd />}
        {selectedTab === "Overview" && <OverviewSection />}
        {selectedTab === "Memory Bank" && <MemoryBankSection memoryBankContent={""} />}
      </div>
    </div>
  );
} 