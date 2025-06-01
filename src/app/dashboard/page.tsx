'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, BarChart2, Flower, ListTodo, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import BlueprintReviewDialog from '@/components/BlueprintReviewDialog';
import { useProjectStore } from '@/lib/projectStore';

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

  export default function DashboardPage() {
    const {
      projects,
      isDialogOpen,
      isGenerating,
      currentStep,
      blueprintResult,
      formData,
      editMode,
      setProjects,
      addProject,
      setIsDialogOpen,
      setIsGenerating,
      setCurrentStep,
      setBlueprintResult,
      setFormData,
      setEditMode,
      fetchProjects,
    } = useProjectStore();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
      defaultValues: formData
    });
    const router = useRouter();

    const description = watch('projectDescription', '');
    const charCount = description.length;
    const MAX_CHARS = 700;

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
      setIsGenerating(false);
      setCurrentStep(0);
      setBlueprintResult(null);
      setEditMode(false);
      reset(formData);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setIsGenerating(false);
      setCurrentStep(0);
      setBlueprintResult(null);
      setEditMode(false);
    };

    const handleStartOver = () => {
      setFormData({ projectTitle: '', projectDescription: '' });
      setBlueprintResult(null);
      setIsGenerating(false);
      setCurrentStep(0);
      setEditMode(false);
      reset({ projectTitle: '', projectDescription: '' });
    };

    const handleEditDetails = () => {
      setEditMode(true);
      setIsGenerating(false);
      setCurrentStep(0);
      setBlueprintResult(null);
      reset(formData);
    };

    const handleApprovePlan = async () => {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            name: formData.projectTitle,
            description: formData.projectDescription,
          },
          blueprint: {
            title: formData.projectTitle,
            content: blueprintResult,
          },
        }),
      });
      addProject({
        id: (projects.length + 1).toString(),
        name: formData.projectTitle,
        description: formData.projectDescription,
        image: '/placeholder.svg',
      });
      handleCloseDialog();
    };

    const simulateGeneration = async (data: FormData) => {
      setIsGenerating(true);
      setCurrentStep(0);
      setBlueprintResult(null);
      setFormData(data);
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(i + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const mockResult = {
        sixCorePillars: ['Pillar 1', 'Pillar 2', 'Pillar 3', 'Pillar 4', 'Pillar 5', 'Pillar 6'],
        coreFeatures: ['Feature A', 'Feature B', 'Feature C'],
        entireTechStack: ['React', 'Next.js', 'MongoDB', 'Node.js'],
        pricingModels: ['Free Tier', 'Pro Plan', 'Enterprise'],
      };
      setBlueprintResult(mockResult);
      setIsGenerating(false);
    };

    const onSubmit = (data: FormData) => {
      setFormData(data);
      simulateGeneration(data);
    };

    useEffect(() => {
      fetchProjects();
    }, [fetchProjects]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-100 p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1">AI Studio</h1>
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
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl p-7 flex flex-col gap-4 max-w-xs border border-zinc-800 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer group"
              onClick={() => router.push(`/studio/${project._id}`)}
            >
              <div className="h-24 w-full bg-gradient-to-tr from-red-500 to-yellow-300 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="text-4xl">😎</span>
              </div>
              <h2 className="text-lg font-bold mb-1 text-white group-hover:text-indigo-400 transition-colors">{project.name}</h2>
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex gap-4 mt-auto">
                <button className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium">
                  <BarChart2 className="w-4 h-4" /> Analytics
                </button>
                <button className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium">
                  <Flower className="w-4 h-4" /> Flow
                </button>
                <button className="flex items-center gap-1 text-zinc-300 hover:text-indigo-400 text-xs font-medium">
                  <ListTodo className="w-4 h-4" /> Tasks
                </button>
              </div>
            </div>
          ))}
        </div>

        <BlueprintReviewDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isGenerating={isGenerating}
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
      </div>
    );
  } 