import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, X } from "lucide-react"; // Import X for the close icon
import React from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Add a helper type for the blueprintResult structure based on your JSON
interface BlueprintData {
  platform: {
    name: string;
    tagline: string;
    description: string;
  };
  market_feasibility_analysis: {
    overall_score: number;
    metrics: Array<{ label: string; score: number; description?: string }>;
  };
  suggested_improvements: string[];
  core_features: Array<{ name: string; description: string }>;
  technical_requirements: {
    recommended_expertise_level: string;
    development_timeline: string;
    team_size: string;
    suggested_tech_stack: {
      frontend: Record<string, string>;
      backend: Record<string, string>;
      infrastructure: Record<string, string>;
    };
  };
  revenue_model: {
    primary_streams: string[];
    pricing_structure: string;
  };
  recommended_pricing_plans: Array<{
    name: string;
    price: string;
    target: string;
    features: string[];
    limitations?: string[];
    additional_benefits?: string[];
    premium_features?: string[];
    tag?: string; // For "Recommended"
    highlight?: boolean; // For visual emphasis
  }>;
  competitive_advantages: string[];
  potential_challenges: string[];
  success_metrics: string[];
  // user_flow_diagram and kanban_tickets might be large,
  // we'll assume they're present but won't parse them in detail for display.
}

interface BlueprintReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGenerating: boolean;
  blueprintResult: BlueprintData | null; // Make it nullable and use the specific type
  currentStep: number;
  generationSteps: string[];
  handleCloseDialog: () => void;
  onFormSubmit: (data: any) => void; // Consider refining 'any' if possible
  errors: any; // Consider refining 'any' if possible (e.g., use FieldErrors from react-hook-form)
  charCount: number;
  MAX_CHARS: number;
  register: any; // Use UseFormRegister from react-hook-form
  handleSubmit: any; // Use UseFormHandleSubmit from react-hook-form
  formData: { projectTitle: string; projectDescription: string };
  setFormData: (data: { projectTitle: string; projectDescription: string }) => void; // Update if using react-hook-form's setValue
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
  // Handle form submission (kept for context, but ideally done in parent)
  const handleFormSubmitInternal = async (data: any) => {
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
      onFormSubmit(result); // Pass API result to parent handler
    } catch (error) {
      console.error('API error:', error);
      onFormSubmit({ error: 'Failed to generate blueprint.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl lg:w-[90vw]
          mx-auto bg-zinc-950/80 backdrop-blur-3xl rounded-3xl shadow-3xl border border-zinc-700
          p-4 sm:p-6 md:p-10 lg:p-16
          overflow-y-auto max-h-[95vh] min-h-[60vh] space-y-10
          custom-scrollbar
          animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-300
        "
      >
        <VisuallyHidden>
          <DialogTitle>AI Blueprint Dialog</DialogTitle>
        </VisuallyHidden>

        {/* Close Button */}
        <Button
          onClick={handleCloseDialog}
          className="absolute top-4 right-4 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all duration-200 group z-50"
          aria-label="Close"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </Button>

        {/* Lightning bolt icon in top right */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Project Details Form */}
        {!isGenerating && !blueprintResult && (
          <>
            <div className="text-center sm:text-left pt-10">
              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">Project Details</h2>
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
                  className="bg-zinc-800/60 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-xl px-5 py-3 text-base shadow-sm transition-colors"
                />
                {errors.projectTitle && <span className="text-red-400 text-sm mt-2 block animate-fade-in">Project Title is required.</span>}
              </div>
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-semibold text-zinc-300 mb-3">Project Description</label>
                <Textarea
                  id="projectDescription"
                  {...register('projectDescription', { required: true, maxLength: MAX_CHARS })}
                  rows={6}
                  className="bg-zinc-800/60 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 resize-none rounded-xl px-5 py-3 text-base shadow-sm transition-colors"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-orange-400' : 'text-zinc-400'} transition-colors`}>{charCount}/{MAX_CHARS} characters</span>
                  {errors.projectDescription && errors.projectDescription.type === 'required' && <span className="text-red-400 text-sm animate-fade-in">Project Description is required.</span>}
                  {errors.projectDescription && errors.projectDescription.type === 'maxLength' && <span className="text-red-400 text-sm animate-fade-in">Description exceeds maximum length.</span>}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-full px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 text-lg">
                  Generate Blueprint
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide animate-pulse">Crafting your AI SaaS blueprint...</h2>
            {/* Progress Bar */}
            <div className="w-full max-w-xl mb-10">
              <div className="w-full bg-zinc-800/60 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(currentStep / generationSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-sm text-zinc-400 font-medium">
                <span>Progress</span>
                <span className="font-semibold text-white">{Math.round((currentStep / generationSteps.length) * 100)}%</span>
              </div>
            </div>
            {/* Steps List */}
            <ul className="w-full max-w-md mx-auto space-y-5">
              {generationSteps.map((step, idx) => (
                <li key={step} className="flex items-center gap-4">
                  {idx < currentStep - 1 ? (
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white shadow-md">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                      </svg>
                    </span>
                  ) : idx === currentStep - 1 ? (
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white shadow-lg animate-spin-slow">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                        <path d='M12 6v6l4 2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-zinc-400 shadow-sm">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                      </svg>
                    </span>
                  )}
                  <span className={`text-lg transition-all duration-300 ${
                    idx < currentStep - 1
                      ? 'text-green-400 font-semibold opacity-70'
                      : idx === currentStep - 1
                      ? 'text-indigo-300 font-bold'
                      : 'text-zinc-400'
                  }`}>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blueprint Review Result */}
        {blueprintResult && !isGenerating && (
          <div className="flex flex-col w-full">
            {/* Project Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700 shadow-xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-400 flex items-center justify-center text-5xl font-bold shadow-lg flex-shrink-0">
                🚀
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">Review Your AI Blueprint for <span className="text-indigo-400">{blueprintResult.platform.name}</span></h2>
                <p className="text-zinc-300 text-base sm:text-lg max-w-xl">
                  Here's the comprehensive plan generated based on your input. Dive into the details and approve to create your project.
                </p>
              </div>
            </div>

            {/* Platform Description */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-4">Platform Overview</h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                <span className="font-semibold text-indigo-400">{blueprintResult.platform.tagline}</span>
                <br />
                {blueprintResult.platform.description}
              </p>
            </div>

            {/* Market Feasibility Analysis */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">📊</span>
                <h3 className="text-xl font-bold text-white">Market Feasibility Analysis</h3>
                <span className="ml-auto bg-zinc-700 text-white px-4 py-2 rounded-xl text-base font-bold shadow-inner">
                  Overall Score <span className="text-indigo-400">{blueprintResult.market_feasibility_analysis.overall_score.toFixed(1)}/10</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blueprintResult.market_feasibility_analysis.metrics.map((metric) => (
                  <div key={metric.label} className="bg-zinc-800/80 rounded-lg p-5 flex flex-col gap-3 border border-zinc-700 shadow-sm">
                    <div className="flex justify-between items-center text-base font-medium text-zinc-300">
                      <span className="font-bold text-white">{metric.label}</span>
                      <span className="font-extrabold text-indigo-400">{metric.score}/10</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-500 ease-out" style={{ width: `${metric.score * 10}%` }}></div>
                    </div>
                    {metric.description && <p className="text-zinc-400 text-sm mt-2">{metric.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Improvements */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl text-orange-400">💡</span>
                <h3 className="text-xl font-bold text-white">Suggested Improvements</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blueprintResult.suggested_improvements.map((improvement, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-zinc-800/80 rounded-lg px-5 py-3 text-zinc-200 border border-zinc-700 shadow-sm">
                    <span className="text-orange-400 text-xl flex-shrink-0">●</span>
                    <span className="text-sm sm:text-base leading-relaxed">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl text-green-400">✅</span>
                <h3 className="text-xl font-bold text-white">Core Features</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {blueprintResult.core_features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-green-400">
                    <span className="text-xl flex-shrink-0 mt-0.5">✔️</span>
                    <div>
                      <span className="text-zinc-200 font-semibold text-base">{feature.name}</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Requirements */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">💻</span>
                <h3 className="text-xl font-bold text-white">Technical Requirements</h3>
              </div>
              <div className="mb-4 text-zinc-300 text-base">
                **Recommended Expertise Level:** <span className="font-bold text-indigo-300">{blueprintResult.technical_requirements.recommended_expertise_level}</span>
              </div>
              <div className="mb-4 text-zinc-300 text-base">
                **Development Timeline (MVP):** <span className="font-bold text-indigo-300">{blueprintResult.technical_requirements.development_timeline}</span>
              </div>
              <div className="mb-4 text-zinc-300 text-base">
                **Team Size:** <span className="font-bold text-indigo-300">{blueprintResult.technical_requirements.team_size}</span>
              </div>
              <div className="mb-4 text-zinc-300 text-base">**Suggested Tech Stack:**</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(blueprintResult.technical_requirements.suggested_tech_stack).map(([category, stack]) => (
                  <div key={category} className="bg-zinc-800/80 rounded-lg p-4 border border-zinc-700 shadow-sm">
                    <h4 className="text-sm font-bold text-zinc-300 mb-3 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(stack).map((tech) => (
                        <span key={tech} className="bg-zinc-700/70 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:bg-zinc-600 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Model */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">💰</span>
                <h3 className="text-xl font-bold text-white">Revenue Model</h3>
              </div>
              <div className="mb-4 text-zinc-300 text-base">
                **Primary Streams:**
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1 text-zinc-400">
                  {blueprintResult.revenue_model.primary_streams.map((stream, idx) => (
                    <li key={idx}><span className="text-white">{stream}</span></li>
                  ))}
                </ul>
              </div>
              <div className="text-zinc-300 text-base">
                **Pricing Structure:** <span className="font-bold text-indigo-300">{blueprintResult.revenue_model.pricing_structure}</span>
              </div>
            </div>

            {/* Recommended Pricing Plans */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">💲</span>
                <h3 className="text-xl font-bold text-white">Recommended Pricing Plans</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blueprintResult.recommended_pricing_plans.map((plan) => (
                  <div key={plan.name} className={`rounded-2xl p-6 flex flex-col gap-3 border ${plan.tag === 'Recommended' ? 'border-indigo-500 bg-indigo-900/30 shadow-xl' : 'border-zinc-700 bg-zinc-800/80'} transition-all duration-300 transform hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-white">{plan.name}</span>
                      {plan.tag === 'Recommended' && <span className="ml-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded-full font-semibold shadow-md">Recommended</span>}
                    </div>
                    <div className="text-4xl font-extrabold text-indigo-400">{plan.price}</div>
                    <div className="text-zinc-300 text-sm mb-3">{plan.target}</div>
                    <ul className="text-zinc-200 text-sm space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-indigo-400">★</span> <span className="text-zinc-300">{f}</span>
                        </li>
                      ))}
                      {plan.additional_benefits && plan.additional_benefits.length > 0 && (
                        <>
                          <li className="text-zinc-400 text-xs font-semibold mt-2">Additional Benefits:</li>
                          {plan.additional_benefits.map((f, i) => (
                            <li key={`add-${i}`} className="flex items-center gap-2">
                              <span className="text-indigo-300">✦</span> <span className="text-zinc-400 text-xs">{f}</span>
                            </li>
                          ))}
                        </>
                      )}
                      {plan.premium_features && plan.premium_features.length > 0 && (
                        <>
                          <li className="text-zinc-400 text-xs font-semibold mt-2">Premium Features:</li>
                          {plan.premium_features.map((f, i) => (
                            <li key={`prem-${i}`} className="flex items-center gap-2">
                              <span className="text-indigo-300">💎</span> <span className="text-zinc-400 text-xs">{f}</span>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Advantages */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">🏆</span>
                <h3 className="text-xl font-bold text-white">Competitive Advantages</h3>
              </div>
              <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
                {blueprintResult.competitive_advantages.map((advantage, idx) => (
                  <li key={idx}><span className="text-white font-semibold">{advantage}</span></li>
                ))}
              </ul>
            </div>

            {/* Potential Challenges */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl text-red-400">⚠️</span>
                <h3 className="text-xl font-bold text-white">Potential Challenges</h3>
              </div>
              <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
                {blueprintResult.potential_challenges.map((challenge, idx) => (
                  <li key={idx}><span className="text-white font-semibold">{challenge}</span></li>
                ))}
              </ul>
            </div>

            {/* Success Metrics */}
            <div className="mb-10 p-6 bg-zinc-800/40 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">📈</span>
                <h3 className="text-xl font-bold text-white">Success Metrics</h3>
              </div>
              <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
                {blueprintResult.success_metrics.map((metric, idx) => (
                  <li key={idx}><span className="text-white font-semibold">{metric}</span></li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-zinc-950/90 backdrop-blur-md -mx-16 p-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-zinc-800 z-40">
              <Button type="button" onClick={onStartOver} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold rounded-full px-6 py-3 transition-all duration-200 text-base shadow-lg">
                Start Over
              </Button>
              <Button type="button" onClick={onEditDetails} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold rounded-full px-6 py-3 transition-all duration-200 text-base shadow-lg">
                Edit Details
              </Button>
              <Button type="button" onClick={onApprovePlan} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-full px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 text-lg">
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