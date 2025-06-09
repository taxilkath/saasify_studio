'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, BarChart2, Flower, ListTodo, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'; // Import useUser hook

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import BlueprintReviewDialog from '@/components/BlueprintReviewDialog';
import { useProjectStore } from '@/lib/projectStore';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import type { BlueprintData } from '@/types/blueprint';

interface FormData {
  projectTitle: string;
  projectDescription: string;
}

const generationSteps = [
  'Analysing project description',
  'Generating project name',
  'Evaluating market feasibility',
  'Identifying core features',
  'Determining technical requirements',
  'Creating development roadmap',
  'Generating improvement suggestions',
];

// Define animation duration (make sure it matches CSS)
const DELETE_ANIMATION_DURATION = 500; // in milliseconds

// Helper to map/validate blueprint content to BlueprintData
function mapToBlueprintData(raw: any): BlueprintData {
  return {
    platform: {
      name: raw?.platform?.name || '',
      tagline: raw?.platform?.tagline || '',
      description: raw?.platform?.description || '',
    },
    market_feasibility_analysis: {
      overall_score: raw?.market_feasibility_analysis?.overall_score ?? 0,
      metrics: Array.isArray(raw?.market_feasibility_analysis?.metrics) ? raw.market_feasibility_analysis.metrics.map((m: any) => ({
        label: m.label || '',
        score: m.score ?? 0,
        description: m.description || '',
      })) : [],
    },
    suggested_improvements: Array.isArray(raw?.suggested_improvements) ? raw.suggested_improvements : [],
    core_features: Array.isArray(raw?.core_features) ? raw.core_features.map((f: any) => ({
      name: f.name || '',
      description: f.description || '',
    })) : [],
    technical_requirements: {
      recommended_expertise_level: raw?.technical_requirements?.recommended_expertise_level || '',
      development_timeline: raw?.technical_requirements?.development_timeline || '',
      team_size: raw?.technical_requirements?.team_size || '',
      suggested_tech_stack: {
        frontend: raw?.technical_requirements?.suggested_tech_stack?.frontend || {},
        backend: raw?.technical_requirements?.suggested_tech_stack?.backend || {},
        infrastructure: raw?.technical_requirements?.suggested_tech_stack?.infrastructure || {},
      },
    },
    revenue_model: {
      primary_streams: Array.isArray(raw?.revenue_model?.primary_streams) ? raw.revenue_model.primary_streams : [],
      pricing_structure: raw?.revenue_model?.pricing_structure || '',
    },
    recommended_pricing_plans: Array.isArray(raw?.recommended_pricing_plans) ? raw.recommended_pricing_plans.map((p: any) => ({
      name: p.name || '',
      price: p.price || '',
      target: p.target || '',
      features: Array.isArray(p.features) ? p.features : [],
      limitations: Array.isArray(p.limitations) ? p.limitations : undefined,
      additional_benefits: Array.isArray(p.additional_benefits) ? p.additional_benefits : undefined,
      premium_features: Array.isArray(p.premium_features) ? p.premium_features : undefined,
      tag: p.tag,
      highlight: p.highlight,
    })) : [],
    competitive_advantages: Array.isArray(raw?.competitive_advantages) ? raw.competitive_advantages : [],
    potential_challenges: Array.isArray(raw?.potential_challenges) ? raw.potential_challenges : [],
    success_metrics: Array.isArray(raw?.success_metrics) ? raw.success_metrics : [],
  };
}

export default function DashboardPage() {
  const { user } = useUser(); // Get the user object from Clerk

  const {
    projects,
    isDialogOpen,
    isGenerating,
    currentStep,
    blueprintResult,
    formData,
    // editMode, // editMode from store doesn't seem to be used directly for form reset logic here
    setProjects,
    addProject,
    setIsDialogOpen,
    setIsGenerating,
    setCurrentStep,
    setBlueprintResult,
    setFormData,
    setEditMode, // Keep if used elsewhere or for consistency
    fetchProjects,
  } = useProjectStore();

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: formData
  });
  const router = useRouter();

  const description = watch('projectDescription', '');
  const charCount = description.length;
  const MAX_CHARS = 700;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null); // New state for animation
  const [isProjectLoading, setIsProjectLoading] = useState(false); // For dialog loading
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setIsGenerating(false);
    setCurrentStep(0);
    setBlueprintResult(null);
    setEditMode(false); // Assuming setEditMode from store is intended here
    reset(useProjectStore.getState().formData); // Reset with initial/current store formData
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsGenerating(false);
    setCurrentStep(0);
    setBlueprintResult(null);
    setEditMode(false);
  };

  const handleStartOver = () => {
    const initialFormData = { projectTitle: '', projectDescription: '' };
    setFormData(initialFormData);
    setBlueprintResult(null);
    setIsGenerating(false);
    setCurrentStep(0);
    setEditMode(false);
    reset(initialFormData);
  };

  const handleEditDetails = () => {
    setEditMode(true); // Set edit mode in store
    setIsGenerating(false);
    setCurrentStep(0);
    setBlueprintResult(null); // Clear blueprint to show form
    reset(useProjectStore.getState().formData); // Reset form with current data from store
  };

  const handleApprovePlan = async () => {
    // Ensure current form data from the store is used, especially if edited
    const currentFormData = useProjectStore.getState().formData;
    const currentBlueprintResult = useProjectStore.getState().blueprintResult;

    if (!currentBlueprintResult) {
      alert("Blueprint result is not available to save.");
      return;
    }

    const payload = {
      project: {
        name: currentFormData.projectTitle,
        description: currentFormData.projectDescription,
      },
      blueprint: {
        title: currentFormData.projectTitle, // Or derive from blueprintResult if it has a specific title
        content: currentBlueprintResult,
      },
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const newProjectData = await response.json();

      if (response.ok && newProjectData.success) {
        // Add the persisted project (which includes _id from DB) to the store
        // Instead of addProject, it might be better to call fetchProjects() or update store carefully
        fetchProjects(); // Re-fetch projects to get the latest list including the new one with DB ID
        handleCloseDialog();
      } else {
        alert(`Failed to save project: ${newProjectData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error approving plan:", error);
      alert("An error occurred while saving the project.");
    }
  };


  const simulateGeneration = async (data: FormData) => {
    setIsGenerating(true);
    setCurrentStep(0);
    setBlueprintResult(null);
    setFormData(data); // Update store's formData
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // This mockResult structure needs to match what BlueprintReviewDialog expects
    // Based on your BlueprintReviewDialog, it expects a more complex structure.
    // For now, I'll keep it simple as in your original code, but this is a key area for data consistency.
    const mockResult: BlueprintData = {
      platform: {
        name: data.projectTitle,
        tagline: "AI-Powered Solution for Modern Problems",
        description: "A detailed description of this amazing new platform generated by AI."
      },
      market_feasibility_analysis: {
        overall_score: 8.5,
        metrics: [
          { label: "Market Demand", score: 9, description: "Strong market need identified." },
          { label: "Competition", score: 7, description: "Moderate competition with differentiation opportunities." }
        ]
      },
      suggested_improvements: ["Consider gamification", "Explore B2B partnerships"],
      core_features: [
        { name: "AI Analysis Engine", description: "Core engine for processing data." },
        { name: "User Dashboard", description: "Personalized user control panel." }
      ],
      technical_requirements: {
        recommended_expertise_level: "Intermediate to Advanced",
        development_timeline: "3-6 Months (MVP)",
        team_size: "3-5 Engineers",
        suggested_tech_stack: {
          frontend: { react: "React", nextjs: "Next.js" },
          backend: { nodejs: "Node.js", express: "Express.js" },
          infrastructure: { docker: "Docker", aws: "AWS S3/EC2" }
        }
      },
      revenue_model: {
        primary_streams: ["Subscription Fees", "Premium Features"],
        pricing_structure: "Tiered Subscription (Basic, Pro, Enterprise)"
      },
      recommended_pricing_plans: [
        { name: "Basic", price: "$10/mo", target: "Individuals", features: ["Core AI Analysis", "Dashboard Access"], tag: "Popular" },
        { name: "Pro", price: "$30/mo", target: "Professionals", features: ["All Basic Features", "Advanced Analytics", "API Access"], highlight: true, tag: "Recommended" }
      ],
      competitive_advantages: ["Proprietary AI algorithms", "User-friendly interface"],
      potential_challenges: ["User adoption curve", "Data privacy regulations"],
      success_metrics: ["Monthly Active Users (MAU)", "Customer Lifetime Value (CLV)"]
    };
    setBlueprintResult(mockResult);
    setIsGenerating(false);
  };

  const onSubmit = (data: FormData) => {
    setFormData(data); // Update store's formData
    simulateGeneration(data);
  };

  const handleProjectClick = async (project: any) => {
    if (!project || deletingProjectId === (project._id || project.id)) return;
    setIsDialogOpen(true);
    setIsProjectLoading(true);
    setProjectLoadError(null);
    try {
      const id = project._id || project.id;
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Failed to fetch project details');
      }
      const fullProject = data.data;
      setFormData({
        projectTitle: fullProject.name || '',
        projectDescription: fullProject.description || ''
      });
      if (fullProject.blueprint && fullProject.blueprint.content) {
        console.log(fullProject.blueprint.content);
        setBlueprintResult(mapToBlueprintData(fullProject.blueprint.content));
      } else {
        setBlueprintResult(null);
      }
      setEditMode(false);
    } catch (err: any) {
      setProjectLoadError(err.message || 'Failed to load project.');
      setFormData({ projectTitle: '', projectDescription: '' });
      setBlueprintResult(null);
    } finally {
      setIsProjectLoading(false);
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

    setIsDeleting(true); // For global overlay, could be optional if card animation is enough
    setDeletingProjectId(id); // Trigger animation on the card

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();

      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        if (data.success) {
          setProjects(projects.filter((p: any) => (p._id || p.id) !== id));
        } else {
          alert(data.error || 'Failed to delete project from server.');
          setDeletingProjectId(null); // Reset animation if server delete failed
        }
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        if (data.success) { // Only clear deletingProjectId if deletion was fully processed
          setDeletingProjectId(null);
        }
      }, DELETE_ANIMATION_DURATION);

    } catch (err) {
      // Handle network or unexpected errors
      setTimeout(() => {
        alert('An error occurred while trying to delete the project.');
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        setDeletingProjectId(null); // Reset animation state on error
      }, DELETE_ANIMATION_DURATION); // Still wait if animation started
    }
    // Note: The `finally` block was removed to allow setTimeout to control these resets
  };

  // Helper to get project id
  const getProjectId = (project: any) => project._id || project.id;

  // Navigation handlers for project actions
  const handleGoToOverview = (project: any) => {
    const id = getProjectId(project);
    router.push(`/studio/${id}?tab=overview`);
  };
  const handleGoToUserFlow = (project: any) => {
    const id = getProjectId(project);
    router.push(`/studio/${id}?tab=userflow`);
  };
  const handleGoToKanban = (project: any) => {
    const id = getProjectId(project);
    router.push(`/studio/${id}?tab=kanban`);
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-100 p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          {/* Greet the user! */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1">
            Welcome back, {user?.firstName || 'Creator'}!
          </h1>
          <p className="text-zinc-400 text-base mt-1">Manage and create your AI projects here</p>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-base"
        >
          <Plus className="w-5 h-5" />
          Generate SaaS Blueprint
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {projects.map((project) => {
          const currentProjectId = project._id || project.id;
          return (
            <div
              key={currentProjectId}
              className={`
                bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl p-7 flex flex-col gap-4 max-w-xs border border-zinc-800 
                hover:scale-105 hover:shadow-2xl transition-all duration-200 group
                ${deletingProjectId === currentProjectId ? 'animate-fadeOutShrink' : 'opacity-100'}
              `}
              style={{ transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}
              onClick={() => handleProjectClick(project)}
            >
              <div className="h-24 w-full bg-gradient-to-tr from-red-500 to-yellow-300 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="text-4xl">😎</span>
              </div>
              <h2 className="text-lg font-bold mb-1 text-white group-hover:text-indigo-400 transition-colors">{project.name}</h2>
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex gap-4 mt-auto">
                <button
                  className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium"
                  type="button"
                  onClick={e => { e.stopPropagation(); handleGoToOverview(project); }}
                >
                  <BarChart2 className="w-4 h-4" /> Analytics
                </button>
                <button
                  className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium"
                  type="button"
                  onClick={e => { e.stopPropagation(); handleGoToUserFlow(project); }}
                >
                  <Flower className="w-4 h-4" /> Flow
                </button>
                <button
                  className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium"
                  type="button"
                  onClick={e => { e.stopPropagation(); handleGoToKanban(project); }}
                >
                  <ListTodo className="w-4 h-4" /> Tasks
                </button>
                <button
                  className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium ml-auto"
                  type="button"
                  onClick={e => { e.stopPropagation(); handleDeleteClick(project); }}
                  disabled={isDeleting && deletingProjectId === currentProjectId}
                >
                  <Zap className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BlueprintReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isGenerating={isGenerating || isProjectLoading}
        blueprintResult={blueprintResult}
        currentStep={currentStep}
        generationSteps={generationSteps}
        handleCloseDialog={handleCloseDialog}
        onFormSubmit={onSubmit}
        errors={errors}
        charCount={charCount}
        MAX_CHARS={MAX_CHARS}
        register={register}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        onStartOver={handleStartOver}
        onEditDetails={handleEditDetails}
        onApprovePlan={handleApprovePlan}
      />
      {isDialogOpen && projectLoadError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-900 text-white px-6 py-4 rounded-xl shadow-lg">{projectLoadError}</div>
        </div>
      )}
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