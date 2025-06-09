'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/projectStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, BarChart2, Flower, ListTodo, Zap } from 'lucide-react';
import { GenerateBlueprintDialog } from '@/components/GenerateBlueprintDialog';
import { ViewBlueprintDialog } from '@/components/ViewBlueprintDialog';
import type { BlueprintData } from '@/types/blueprint';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { projects, fetchProjects } = useProjectStore();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  
  useEffect(() => { fetchProjects() }, [fetchProjects]);

  const handleViewBlueprint = (project: any) => {
    if (project?.blueprint?.content) {
        setActiveBlueprint(project.blueprint.content);
        setIsLoading(false);
        setViewOpen(true);
    } else {
        alert("No blueprint data available for this project.");
    }
  };

  const handleFormSubmit = async (data: any) => {
    setCreateOpen(false);
    setViewOpen(true);
    setIsLoading(true);
    setActiveBlueprint(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      
      setActiveBlueprint(result.data.blueprint.content);
      fetchProjects();

    } catch (error) {
      console.error("Failed to generate blueprint", error);
      setViewOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (project: any) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const id = projectToDelete._id || projectToDelete.id;
    if (!id) {
      alert("Project ID is missing.");
      return;
    }

    setIsDeleting(true);
    setDeletingProjectId(id);

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();

      setTimeout(() => {
        if (data.success) {
          fetchProjects();
        } else {
          alert(data.error || 'Failed to delete project from server.');
          setDeletingProjectId(null);
        }
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        if (data.success) {
          setDeletingProjectId(null);
        }
      }, 500);

    } catch (err) {
      setTimeout(() => {
        alert('An error occurred while trying to delete the project.');
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        setDeletingProjectId(null);
      }, 500);
    }
  };

  const handleGoToOverview = (project: any) => {
    const id = project._id || project.id;
    router.push(`/studio/${id}?tab=overview`);
  };

  const handleGoToUserFlow = (project: any) => {
    const id = project._id || project.id;
    router.push(`/studio/${id}?tab=userflow`);
  };

  const handleGoToKanban = (project: any) => {
    const id = project._id || project.id;
    router.push(`/studio/${id}?tab=kanban`);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.firstName || 'Creator'}!
          </h1>
          <p className="text-muted-foreground mt-1">Manage and create your AI projects here</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Generate SaaS Blueprint
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project: any) => {
          const currentProjectId = project._id || project.id;
          return (
            <div
              key={currentProjectId}
              onClick={() => handleViewBlueprint(project)}
              className="cursor-pointer group flex flex-col gap-4 rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="h-24 w-full bg-gradient-to-tr from-red-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-4xl">😎</span>
              </div>
              <h2 className="text-lg font-bold text-card-foreground group-hover:text-primary">
                {project.name}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              <div className="flex gap-4 mt-auto">
                <button type="button" onClick={e => { e.stopPropagation(); handleGoToOverview(project); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
                  <BarChart2 className="w-4 h-4" /> Analytics
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); handleGoToUserFlow(project); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
                  <Flower className="w-4 h-4" /> Flow
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); handleGoToKanban(project); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
                  <ListTodo className="w-4 h-4" /> Tasks
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); handleDeleteClick(project); }} disabled={isDeleting && deletingProjectId === currentProjectId} className="flex items-center gap-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 text-xs font-medium ml-auto">
                  <Zap className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <GenerateBlueprintDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        onFormSubmit={handleFormSubmit}
      />
      <ViewBlueprintDialog
        open={isViewOpen}
        onOpenChange={setViewOpen}
        isLoading={isLoading}
        blueprint={activeBlueprint}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={open => {
          setDeleteDialogOpen(open);
          if (!open && !isDeleting) {
            setProjectToDelete(null);
          }
        }}
        projectName={projectToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}