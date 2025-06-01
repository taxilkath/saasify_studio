import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface BlueprintResult {
  sixCorePillars: string[];
  coreFeatures: string[];
  entireTechStack: string[];
  pricingModels: string[];
}

export interface FormData {
  projectTitle: string;
  projectDescription: string;
}

interface ProjectState {
  projects: Project[];
  isDialogOpen: boolean;
  isGenerating: boolean;
  currentStep: number;
  blueprintResult: BlueprintResult | null;
  formData: FormData;
  editMode: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  setIsDialogOpen: (open: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setCurrentStep: (step: number) => void;
  setBlueprintResult: (result: BlueprintResult | null) => void;
  setFormData: (data: FormData) => void;
  setEditMode: (edit: boolean) => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isDialogOpen: false,
  isGenerating: false,
  currentStep: 0,
  blueprintResult: null,
  formData: { projectTitle: '', projectDescription: '' },
  editMode: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  setIsDialogOpen: (open) => set({ isDialogOpen: open }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setBlueprintResult: (result) => set({ blueprintResult: result }),
  setFormData: (data) => set({ formData: data }),
  setEditMode: (edit) => set({ editMode: edit }),
  fetchProjects: async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (data.success) {
      set({ projects: data.data });
    }
  },
})); 