'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, X, Workflow, LayoutGrid, CheckCircle2, CircleDashed } from "lucide-react"; // Added Workflow, LayoutGrid, CheckCircle2, CircleDashed
import React, { useRef, useEffect } from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlueprintData } from '../types/blueprint'; // Ensure this path and type are correct
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from 'react-hook-form';

interface BlueprintReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGenerating: boolean; // Prop from parent, if parent wants to show loading
  blueprintResult: BlueprintData | null; // Use shared type
  currentStep: number; // This prop seems unused for the internal animation but kept for API consistency
  generationSteps: string[];
  handleCloseDialog: () => void;
  onFormSubmit: (data: any) => void; // Receives API result or error
  errors: any; // From react-hook-form
  charCount: number;
  MAX_CHARS: number;
  register: any; // From react-hook-form
  handleSubmit: any; // From react-hook-form
  control: any;
  formData: { projectTitle: string; projectDescription: string };
  setFormData: (data: any) => void;
  onStartOver: () => void;
  onEditDetails: () => void;
  onApprovePlan: () => void;
}

const BlueprintReviewDialog: React.FC<BlueprintReviewDialogProps> = ({
  open,
  onOpenChange,
  isGenerating,
  blueprintResult,
  currentStep,
  generationSteps,
  handleCloseDialog,
  onFormSubmit,
  errors,
  charCount,
  MAX_CHARS,
  register,
  control,
  handleSubmit,
  formData,
  setFormData,
  onStartOver,
  onEditDetails,
  onApprovePlan,
}) => {
  // Progress animation state (internal to this dialog)
  const [localStep, setLocalStep] = React.useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProgressActive, setIsProgressActive] = React.useState(false); // Tracks internal API call state
  const [apiResult, setApiResult] = React.useState<BlueprintData | null>(null); // Stores successful API response
  const [apiError, setApiError] = React.useState<string | null>(null); // Stores API error message

  // Progress bar/steps animation: loop through steps while isProgressActive is true
  useEffect(() => {
    if (isProgressActive) {
      setLocalStep(1); // Start from the first step
      intervalRef.current = setInterval(() => {
        setLocalStep((prev) => {
          if (prev >= generationSteps.length) return 1; // Loop, or use `generationSteps.length` to stay at 100%
          return prev + 1;
        });
      }, 1000); // 1s per step
    } else {
      setLocalStep(0); // Reset step when not active
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isProgressActive, generationSteps.length]);

  // When API call finishes (isProgressActive becomes false) and we have a result, notify parent.
  useEffect(() => {
    if (!isProgressActive && apiResult) {
      onFormSubmit(apiResult); // Send successful data to parent
      setApiResult(null); // Clear local apiResult after sending
    }
  }, [isProgressActive, apiResult, onFormSubmit]);

  // Form submit handler for the internal form
  const handleFormSubmitInternal = async (data: { projectTitle: string; projectDescription: string }) => {
    setIsProgressActive(true); // <<< Key: Start internal loading state, triggers loading UI and animation
    setApiError(null);        // Clear previous errors
    setApiResult(null);       // Clear previous results

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: data.projectTitle,
          projectDescription: data.projectDescription,
        }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setApiResult(result.data as BlueprintData); // Store successful data for useEffect to pick up
      } else {
        const errorMsg = result.error || 'Failed to generate blueprint.';
        setApiError(errorMsg);
        onFormSubmit({ error: errorMsg }); // Notify parent of error immediately
      }
    } catch (error) {
      const errorMsg = 'Failed to generate blueprint due to a network or server error.';
      setApiError(errorMsg);
      onFormSubmit({ error: errorMsg }); // Notify parent of error immediately
    } finally {
      setIsProgressActive(false); // <<< Key: Stop internal loading state when API call is done
    }
  };

  // Define sections for displaying blueprint results (original logic)
  const sections = blueprintResult ? [
    {
      title: "Platform Overview",
      icon: <span className="text-3xl">🌌</span>,
      content: (
        <p className="text-zinc-600 dark:text-zinc-300">
          <strong className="block mb-1 text-indigo-600 dark:text-indigo-400">{blueprintResult.platform.tagline}</strong>
          {blueprintResult.platform.description}
        </p>
      )
    },
    {
      title: "Market Feasibility Analysis",
      icon: <span className="text-3xl text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-200">📊</span>,
      customHeader: (
        <span className="ml-auto bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-xl text-base font-bold shadow-inner transition-colors">
          Overall Score <span className="text-indigo-400">{blueprintResult.market_feasibility_analysis.overall_score.toFixed(1)}/10</span>
        </span>
      ),
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          {blueprintResult.market_feasibility_analysis.metrics.map((metric) => (
            <div key={metric.label} className="bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg p-5 flex flex-col gap-3 border border-zinc-700 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex justify-between items-center text-base font-medium text-zinc-300">
                <span className="font-bold text-white">{metric.label}</span>
                <span className="font-extrabold text-indigo-400">{metric.score}/10</span>
              </div>
              <div className="w-full h-3 bg-zinc-700/80 rounded-full overflow-hidden shadow-inner">
                <div className="h-3 rounded-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${metric.score * 10}%` }}></div>
              </div>
              {metric.description && <p className="text-zinc-400 hover:text-zinc-300 transition-colors text-sm mt-2">{metric.description}</p>}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Suggested Improvements",
      icon: <span className="text-3xl text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-200">💡</span>,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blueprintResult.suggested_improvements.map((improvement, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg px-5 py-3 text-zinc-200 border border-zinc-700 hover:border-orange-500/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
              <span className="text-orange-400 text-xl flex-shrink-0 mt-1">●</span>
              <span className="text-sm sm:text-base leading-relaxed hover:text-white transition-colors">{improvement}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Core Features",
      icon: <span className="text-3xl text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-200">✅</span>,
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {blueprintResult.core_features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-green-400 group/feature p-2 hover:bg-zinc-700/60 rounded-md transition-all duration-200 transform hover:scale-[1.02]">
              <span className="text-xl flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform">✔️</span>
              <div>
                <strong className="text-zinc-200 group-hover/feature:text-white font-semibold text-base transition-colors">{feature.name}</strong>
                <p className="text-zinc-400 group-hover/feature:text-zinc-300 text-sm leading-relaxed mt-1">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "Technical Requirements",
      icon: <span className="text-3xl text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-200">💻</span>,
      content: (
        <>
          <div className="mb-3 text-zinc-300 text-base">
            <strong>Recommended Expertise Level:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprintResult.technical_requirements.recommended_expertise_level}</span>
          </div>
          <div className="mb-3 text-zinc-300 text-base">
            <strong>Development Timeline (MVP):</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprintResult.technical_requirements.development_timeline}</span>
          </div>
          <div className="mb-4 text-zinc-300 text-base">
            <strong>Team Size:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprintResult.technical_requirements.team_size}</span>
          </div>
          <div className="mb-3 text-zinc-200 text-base font-semibold">Suggested Tech Stack:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(blueprintResult.technical_requirements.suggested_tech_stack).map(([category, stackDetails]) => (
              <div key={category} className="bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                <h4 className="text-md font-bold text-zinc-100 mb-3 capitalize">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stackDetails).map(([key, techName]) => (
                      <span key={`${category}-${key}`} className="bg-zinc-700/70 text-indigo-300 hover:bg-indigo-500/60 hover:text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 transform hover:scale-105" title={`${key.charAt(0).toUpperCase() + key.slice(1)}`}>
                        {techName as string}
                      </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      title: "Revenue Model",
      icon: <span className="text-3xl text-lime-400 group-hover:text-lime-300 group-hover:scale-110 transition-all duration-200">💰</span>,
      content: (
        <>
          <div className="mb-4 text-zinc-300 text-base">
            <strong className="text-zinc-100 block mb-2">Primary Streams:</strong>
            <ul className="list-disc list-inside ml-2 space-y-1 text-zinc-400">
              {blueprintResult.revenue_model.primary_streams.map((stream, idx) => (
                <li key={idx} className="hover:text-indigo-300 transition-colors"><span className="text-zinc-200">{stream}</span></li>
              ))}
            </ul>
          </div>
          <div className="text-zinc-300 text-base">
            <strong className="text-zinc-100">Pricing Structure:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprintResult.revenue_model.pricing_structure}</span>
          </div>
        </>
      )
    },
    {
      title: "Recommended Pricing Plans",
      icon: <span className="text-3xl">💲</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {blueprintResult.recommended_pricing_plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`group flex flex-col rounded-lg border p-6 transition-all duration-300
                ${plan.highlight ? 'bg-primary/5 border-primary shadow-lg' : 'bg-card border-border'}`
              }
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xl font-bold text-foreground">{plan.name}</span>
                {plan.tag && 
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {plan.tag}
                  </span>
                }
              </div>
              <div className="text-4xl font-extrabold text-primary">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-3">{plan.target}</p>
              
              <strong className="text-sm text-foreground mt-2">Features:</strong>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground flex-grow">
                {plan.features.map((f, i) => ( <li key={i}>{f}</li> ))}
              </ul>

              {plan.limitations && plan.limitations.length > 0 && (
                <>
                  <strong className="text-xs font-semibold mt-4 pt-3 border-t border-border text-destructive/80">Limitations:</strong>
                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                    {plan.limitations.map((l, i) => ( <li key={`lim-${i}`}>{l}</li>))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Competitive Advantages",
      icon: <span className="text-3xl text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-200">🏆</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprintResult.competitive_advantages.map((advantage, idx) => (
            <li key={idx} className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{advantage}</span></li>
          ))}
        </ul>
      )
    },
    {
      title: "Potential Challenges",
      icon: <span className="text-3xl text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-all duration-200">⚠️</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprintResult.potential_challenges.map((challenge, idx) => (
            <li key={idx} className="hover:text-red-400 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{challenge}</span></li>
          ))}
        </ul>
      )
    },
    {
      title: "Success Metrics",
      icon: <span className="text-3xl text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-200">📈</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprintResult.success_metrics.map((metric, idx) => (
            <li key={idx} className="hover:text-emerald-300 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{metric}</span></li>
          ))}
        </ul>
      )
    }
  ] : [];

  // This logic correctly determines which UI to show based on props from the parent
  const showLoadingUI = isGenerating;
  const showResultsUI = !isGenerating && blueprintResult;
  const showFormUI = !isGenerating && !blueprintResult;

  // Modernized stepper/progress UI logic
  const generationStepsActual = [
    'Analysing project description',
    'Generating project name',
    'Evaluating market feasibility',
    'Identifying core features',
    'Determining technical requirements',
    'Creating development roadmap',
    'Generating improvement suggestions',
  ];
  const currentStepText = generationStepsActual[currentStep - 1] || 'Initializing...';
  const progressPercentage = generationStepsActual.length > 0 ? (currentStep / generationStepsActual.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] flex flex-col bg-card text-card-foreground p-0 rounded-lg">
        <VisuallyHidden><DialogTitle>AI Blueprint</DialogTitle></VisuallyHidden>
        <Button onClick={handleCloseDialog} variant="ghost" size="icon" className="absolute top-3 right-3 z-50 h-8 w-8 rounded-full">
          <X className="w-4 h-4" />
        </Button>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          {showFormUI && (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-muted border rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Generate SaaS Blueprint</h2>
                  <p className="text-muted-foreground mt-1">Describe your idea to get started.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="projectTitle" className="text-sm font-medium">Project Title</label>
                  <Input id="projectTitle" {...register('projectTitle')} placeholder="e.g., Task Management SaaS" />
                  {errors.projectTitle && <p className="text-sm text-destructive mt-1">{errors.projectTitle.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectDescription" className="text-sm font-medium">Description</label>
                  <Textarea id="projectDescription" {...register('projectDescription', { maxLength: MAX_CHARS })} placeholder="Describe your SaaS idea in detail..." rows={5} />
                  <div className="text-xs text-muted-foreground text-right">{charCount} / {MAX_CHARS}</div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="aiModel" className="text-sm font-medium">AI Model</label>
                  <Controller name="aiModel" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'deepseek'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepseek">⚡️ DeepSeek (Free)</SelectItem>
                        <SelectItem value="gpt4">🤖 GPT-4 (Requires API Key)</SelectItem>
                        <SelectItem value="claude">☁️ Claude (Requires API Key)</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">✨ Generate Blueprint</Button>
                </div>
              </form>
            </>
          )}

          {showLoadingUI && (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 min-h-[500px]">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 border">
                <span className="text-3xl animate-pulse">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your SaaS Blueprint</h2>
              <p className="text-muted-foreground mb-8">{currentStepText}</p>

              <div className="w-full max-w-sm mb-8">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-right">Step {currentStep} of {generationStepsActual.length}</div>
              </div>

              <ul className="space-y-4 text-left w-full max-w-sm">
                {generationStepsActual.map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0">
                      {index < currentStep - 1 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <CircleDashed className={`w-5 h-5 transition-all ${index === currentStep - 1 ? 'text-primary animate-spin' : 'text-muted-foreground/30'}`} />
                      )}
                    </div>
                    <span className={`transition-colors ${index < currentStep - 1 ? 'text-muted-foreground line-through' : index === currentStep - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showResultsUI && (
            <div className="text-zinc-900 dark:text-zinc-100">
              <div className="p-6 mb-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-3xl font-bold">Review for <span className="text-indigo-600 dark:text-indigo-400">{blueprintResult.platform.name}</span></h2>
              </div>
              {sections.map(section => (
                <div key={section.title} className="mb-6 p-6 rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-4">
                    {section.icon}
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    {section.customHeader}
                  </div>
                  {section.content}
                </div>
              ))}
            </div>
          )}
        </div>
        {showResultsUI && (
          <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-sm p-4 flex justify-end gap-3 sticky">
            <Button variant="ghost" onClick={onStartOver}>Start Over</Button>
            <Button variant="secondary" onClick={onEditDetails}>Edit Details</Button>
            <Button onClick={onApprovePlan}>Approve Plan</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlueprintReviewDialog;