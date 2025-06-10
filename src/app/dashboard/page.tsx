'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/projectStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// Added DraftingCompass and PlusCircle for the new empty state
import { Plus, BarChart2, Flower, ListTodo, Zap, DraftingCompass, PlusCircle } from 'lucide-react';
import { GenerateBlueprintDialog } from '@/components/GenerateBlueprintDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useUser } from '@clerk/nextjs';
// Added Framer Motion for animations
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { projects, fetchProjects } = useProjectStore();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const DELETE_ANIMATION_DURATION = 500;

  useEffect(() => { fetchProjects() }, [fetchProjects]);

  const handleGoToPage = (projectId: string, tab?: string) => {
    let url = `/studio/${projectId}`;
    if (tab) {
      url += `?tab=${tab}`;
    }
    router.push(url);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }
      
      const newProjectId = result.data.project._id;
      setCreateOpen(false);
      fetchProjects();
      router.push(`/studio/${newProjectId}`);

    } catch (error) {
      console.error("Failed to generate blueprint", error);
      alert('Failed to generate blueprint. Please try again.');
      setCreateOpen(false);
    }
  };

  const handleDeleteClick = (project: any) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete._id || projectToDelete.id;
    setDeletingProjectId(id);

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();

      setTimeout(() => {
        if (data.success) {
          fetchProjects();
        } else {
          alert(data.error || 'Failed to delete project.');
          setDeletingProjectId(null);
        }
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      }, DELETE_ANIMATION_DURATION);
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

      {/* --- CONDITIONAL RENDERING FOR EMPTY STATE --- */}
      {projects.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl p-12 min-h-[400px] bg-muted/20"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
            <DraftingCompass className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Your Dashboard is Ready</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            You haven't generated any blueprints yet. Click the button below to bring your first idea to life.
          </p>
          <Button onClick={() => setCreateOpen(true)} className="mt-6" size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate Your First Blueprint
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project: any) => {
            const currentProjectId = project._id || project.id;
            return (
              <div
                key={currentProjectId}
                className={`
                  cursor-pointer group flex flex-col gap-4 rounded-lg border text-card-foreground p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1
                  bg-zinc-900/80
                  ${deletingProjectId === currentProjectId ? 'animate-fadeOutShrink' : 'opacity-100'}
                `}
                onClick={() => handleGoToPage(currentProjectId, 'blueprint')}
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
                  <button type="button" onClick={e => { e.stopPropagation(); handleGoToPage(currentProjectId, 'overview'); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
                    <BarChart2 className="w-4 h-4" /> Analytics
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); handleGoToPage(currentProjectId, 'user-flow'); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
                    <Flower className="w-4 h-4" /> Flow
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); handleGoToPage(currentProjectId, 'tickets-board'); }} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium">
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
      )}

      <GenerateBlueprintDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        onFormSubmit={handleFormSubmit}
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