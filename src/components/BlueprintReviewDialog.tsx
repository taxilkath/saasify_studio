import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, X, Workflow, LayoutGrid } from "lucide-react"; // Added Workflow, LayoutGrid
import React, { useRef, useEffect } from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlueprintData } from '../types/blueprint'; // Ensure this path and type are correct

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
  formData: { projectTitle: string; projectDescription: string };
  setFormData: (data: { projectTitle: string; projectDescription: string }) => void;
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
      icon: <span className="text-3xl text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-all duration-200">🌌</span>,
      content: (
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          <strong className="text-indigo-400 block mb-1">{blueprintResult.platform.tagline}</strong>
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
      icon: <span className="text-3xl text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-200">💲</span>,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprintResult.recommended_pricing_plans.map((plan) => (
            <div key={plan.name} className={`group/plan rounded-2xl p-6 flex flex-col gap-3 border ${plan.tag === 'Recommended' || plan.highlight ? 'border-indigo-500 bg-indigo-950/40 shadow-xl hover:shadow-[0_0_25px_theme("colors.indigo.500")] hover:border-indigo-400' : 'border-zinc-700 bg-zinc-800/80 hover:border-indigo-500/60 hover:bg-zinc-700/70'} transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xl font-bold text-white group-hover/plan:text-indigo-300 transition-colors">{plan.name}</span>
                {plan.tag && <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-md ${plan.tag === 'Recommended' ? 'bg-indigo-500 text-white' : 'bg-yellow-500 text-black'}`}>{plan.tag}</span>}
              </div>
              <div className="text-4xl font-extrabold text-indigo-400 group-hover/plan:text-purple-400 transition-colors">{plan.price}</div>
              <div className="text-zinc-300 group-hover/plan:text-zinc-200 text-sm mb-3 transition-colors">{plan.target}</div>
              <strong className="text-zinc-100 text-sm mt-2">Features:</strong>
              <ul className="text-zinc-200 text-sm space-y-1.5 list-disc list-inside ml-1">
                {plan.features.map((f, i) => ( <li key={i} className="text-zinc-300 hover:text-white transition-colors">{f}</li> ))}
              </ul>
              {plan.limitations && plan.limitations.length > 0 && (
                <>
                  <strong className="text-orange-400 text-xs font-semibold mt-3 pt-2 border-t border-zinc-700/50">Limitations:</strong>
                  <ul className="text-zinc-400 text-xs space-y-1 list-disc list-inside ml-1">
                    {plan.limitations.map((l, i) => ( <li key={`lim-${i}`} className="hover:text-orange-300 transition-colors">{l}</li>))}
                  </ul>
                </>
              )}
              {plan.additional_benefits && plan.additional_benefits.length > 0 && (
                <>
                  <strong className="text-green-400 text-xs font-semibold mt-3 pt-2 border-t border-zinc-700/50">Additional Benefits:</strong>
                  <ul className="text-zinc-400 text-xs space-y-1 list-disc list-inside ml-1">
                    {plan.additional_benefits.map((b, i) => (<li key={`ben-${i}`} className="hover:text-green-300 transition-colors">{b}</li>))}
                  </ul>
                </>
              )}
              {plan.premium_features && plan.premium_features.length > 0 && (
                <>
                  <strong className="text-sky-400 text-xs font-semibold mt-3 pt-2 border-t border-zinc-700/50">Premium Features:</strong>
                  <ul className="text-zinc-400 text-xs space-y-1 list-disc list-inside ml-1">
                    {plan.premium_features.map((p, i) => ( <li key={`prem-${i}`} className="hover:text-sky-300 transition-colors">{p}</li>))}
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

  // Conditional rendering logic:
  // 1. Show loading if internal API call is active (isProgressActive) OR if parent forces it (isGenerating) AND no result/error yet
  const showLoadingUI = isProgressActive || (isGenerating && !blueprintResult && !apiError);
  // 2. Show form if not loading and no blueprint result from parent yet
  const showFormUI = !showLoadingUI && !blueprintResult;
  // 3. Show results if blueprint result from parent is available and not currently loading
  const showResultsUI = blueprintResult && !showLoadingUI;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl lg:w-[90vw]
          mx-auto bg-zinc-950/80 backdrop-blur-3xl rounded-3xl shadow-3xl border border-zinc-700
          hover:border-zinc-600 transition-colors duration-300 
          p-4 sm:p-6 md:p-10 lg:p-16
          overflow-y-auto max-h-[95vh] min-h-[60vh] space-y-6
          custom-scrollbar
          animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-300
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-zinc-800/50
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-zinc-600
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:hover:bg-zinc-500
          [&::-webkit-scrollbar-thumb]:transition-colors
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-zinc-800/50
          [&::-webkit-scrollbar-thumb]:hover:border-zinc-700/50
        "
      >
        <VisuallyHidden>
          <DialogTitle>AI Blueprint Dialog</DialogTitle>
        </VisuallyHidden>

        <Button
          onClick={handleCloseDialog}
          className="absolute top-4 right-4 bg-zinc-800/80 hover:bg-rose-500/90 text-zinc-400 hover:text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all duration-200 group z-50 hover:scale-110 hover:shadow-lg hover:shadow-rose-500/30"
          aria-label="Close"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </Button>

        {/* SHOW FORM UI */}
        {showFormUI && (
          <>
            <div className="text-center sm:text-left pt-10">
              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight hover:text-indigo-300 transition-colors duration-300 cursor-default">Project Details</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto sm:mx-0">
                Describe your AI SaaS project idea. Be concise yet comprehensive to help us generate the best blueprint for you.
              </p>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmitInternal)} className="flex flex-col gap-8 mt-4">
              <div>
                <label htmlFor="projectTitle" className="block text-sm font-semibold text-zinc-300 mb-3">Project Title</label>
                <Input
                  id="projectTitle"
                  type="text"
                  {...register('projectTitle', { required: true })}
                  className="bg-zinc-800/60 hover:bg-zinc-800/90 border border-zinc-700 hover:border-indigo-500/70 text-zinc-100 placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-xl px-5 py-3 text-base shadow-sm hover:shadow-md transition-all duration-300"
                />
                {errors.projectTitle && <span className="text-red-400 hover:text-red-300 transition-colors text-sm mt-2 block animate-fade-in">Project Title is required.</span>}
              </div>
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-semibold text-zinc-300 mb-3">Project Description</label>
                <Textarea
                  id="projectDescription"
                  {...register('projectDescription', { required: true, maxLength: MAX_CHARS })}
                  rows={6}
                  className="bg-zinc-800/60 hover:bg-zinc-800/90 border border-zinc-700 hover:border-indigo-500/70 text-zinc-100 placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 resize-none rounded-xl px-5 py-3 text-base shadow-sm hover:shadow-md transition-all duration-300"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-orange-400 hover:text-orange-300' : 'text-zinc-400 hover:text-zinc-300'} transition-colors`}>{charCount}/{MAX_CHARS} characters</span>
                  {errors.projectDescription && errors.projectDescription.type === 'required' && <span className="text-red-400 hover:text-red-300 transition-colors text-sm animate-fade-in">Project Description is required.</span>}
                  {errors.projectDescription && errors.projectDescription.type === 'maxLength' && <span className="text-red-400 hover:text-red-300 transition-colors text-sm animate-fade-in">Description exceeds maximum length.</span>}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-full px-8 py-3 shadow-lg hover:shadow-[0_0_25px_theme('colors.purple.600')] transition-all duration-300 transform hover:scale-105 text-lg">
                  Generate Blueprint
                </Button>
              </div>
            </form>
          </>
        )}

        {/* SHOW LOADING UI (driven by isProgressActive or isGenerating prop) */}
        {showLoadingUI && (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide animate-pulse">Crafting your AI SaaS blueprint...</h2>
            {apiError && <p className="text-red-400 mb-4 text-base">{apiError}</p>}
            <div className="w-full max-w-xl mb-10">
              <div className="w-full bg-zinc-800/60 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${generationSteps.length > 0 ? (localStep / generationSteps.length) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-sm text-zinc-400 font-medium">
                <span>Progress</span>
                <span className="font-semibold text-white">{Math.min(100, Math.round(generationSteps.length > 0 ? (localStep / generationSteps.length) * 100 : 0))}%</span>
              </div>
            </div>
            <ul className="w-full max-w-md mx-auto space-y-5">
              {generationSteps.map((step, idx) => (
                <li key={step} className="flex items-center gap-4 group cursor-default p-1 hover:bg-zinc-800/50 rounded-lg transition-colors duration-200">
                  {idx < localStep - 1 ? ( // Step completed
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-600 group-hover:bg-green-500 text-white shadow-md transition-colors duration-300 transform group-hover:scale-105">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                      </svg>
                    </span>
                  ) : idx === localStep - 1 ? ( // Step in progress
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 group-hover:bg-indigo-400 text-white shadow-lg animate-spin-slow transition-colors duration-300 transform group-hover:scale-105">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                        <path d='M12 6v6l4 2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </span>
                  ) : ( // Step pending
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 group-hover:bg-zinc-600 text-zinc-400 shadow-sm transition-colors duration-300 transform group-hover:scale-105">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                      </svg>
                    </span>
                  )}
                  <span className={`text-lg transition-all duration-300 ${
                    idx < localStep - 1
                      ? 'text-green-400 group-hover:text-green-300 font-semibold opacity-70'
                      : idx === localStep - 1
                      ? 'text-indigo-300 group-hover:text-indigo-200 font-bold'
                      : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SHOW RESULTS UI */}
        {showResultsUI && blueprintResult && (
          <div className="flex flex-col w-full">
            <div className="group flex flex-col sm:flex-row items-center gap-6 mb-10 bg-zinc-800/40 hover:bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700 hover:border-indigo-500/70 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-500 flex items-center justify-center text-5xl font-bold shadow-lg group-hover:shadow-rose-400/40 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                🚀
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                  Review Your AI Blueprint for <span className="text-indigo-400 hover:text-purple-400 transition-colors duration-200">{blueprintResult.platform.name}</span>
                </h2>
                <p className="text-zinc-300 text-base sm:text-lg max-w-xl">
                  Here's the comprehensive plan generated based on your input. Dive into the details and approve to create your project.
                </p>
              </div>
            </div>
            
            {sections.map(section => (
              <div key={section.title} className="group mb-10 p-6 bg-zinc-800/40 hover:bg-zinc-800/60 rounded-xl border border-zinc-700 hover:border-zinc-600 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-5">
                  {section.icon}
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors cursor-default">{section.title}</h3>
                  {section.customHeader}
                </div>
                {section.content}
              </div>
            ))}

            <div className="sticky left-0 right-0 bg-zinc-950/90 backdrop-blur-md p-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-zinc-800 z-40 mt-auto">
              <Button type="button" onClick={onStartOver} className="bg-zinc-700/80 hover:bg-rose-600/90 hover:text-white text-zinc-300 font-semibold rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 text-base shadow-lg hover:shadow-rose-500/40">
                Start Over
              </Button>
              <Button type="button" onClick={onEditDetails} className="bg-zinc-700/80 hover:bg-amber-500/90 hover:text-white text-zinc-300 font-semibold rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 text-base shadow-lg hover:shadow-amber-500/40">
                Edit Details
              </Button>
              <Button type="button" onClick={onApprovePlan} className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-full px-8 py-3 shadow-lg hover:shadow-[0_0_30px_theme('colors.purple.600'),0_0_15px_theme('colors.indigo.500')] transition-all duration-300 transform hover:scale-105 text-lg">
                Approve Plan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlueprintReviewDialog;