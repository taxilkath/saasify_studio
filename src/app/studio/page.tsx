'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/projectStore';
import { Button } from '@/components/ui/button';
import { PlusCircle, DraftingCompass } from 'lucide-react';

export default function StudioHubPage() {
  const router = useRouter();
  const { projects, fetchProjects } = useProjectStore();
  
  // Fetch projects when the component mounts
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/studio/${projectId}`);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Studio Hub
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          This is your creative workspace. Select a project below to manage its blueprint, user flow, and development tasks.
        </p>
      </div>

      {projects.length === 0 ? (
        // A beautiful "empty state" when no projects exist
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl p-12 min-h-[400px] bg-muted/20">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <DraftingCompass className="w-8 h-8 text-primary"/>
           </div>
           <h3 className="text-xl font-semibold text-foreground">Your Studio is Ready</h3>
           <p className="text-muted-foreground mt-2 max-w-md">
             You haven't generated any projects yet. Head back to the dashboard to create your first SaaS blueprint.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="mt-6">
                <PlusCircle className="w-4 h-4 mr-2"/>
                Generate First Project
            </Button>
        </div>
      ) : (
        // The grid of projects if they exist
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => {
            const projectId = project.id || project._id;
            if (!projectId) return null; // Skip if no valid ID exists
            
            return (
              <div
                key={projectId}
                onClick={() => handleProjectClick(projectId)}
                className="cursor-pointer group flex flex-col gap-4 rounded-xl border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary">
                    {project.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="w-full mt-4 text-sm font-semibold text-primary flex items-center justify-end">
                  Open Workspace →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}