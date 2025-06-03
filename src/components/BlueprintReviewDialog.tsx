import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import React from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlueprintReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGenerating: boolean;
  blueprintResult: any;
  currentStep: number;
  generationSteps: string[];
  handleCloseDialog: () => void;
  onFormSubmit: (data: any) => void;
  errors: any;
  charCount: number;
  MAX_CHARS: number;
  register: any;
  handleSubmit: any;
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
  // Handle form submission
   const handleFormSubmit = async (data: any) => {
    // Make API call with projectTitle and projectDescription
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
      // Optionally handle error
      console.error('API error:', error);
      onFormSubmit({ error: 'Failed to generate blueprint.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl lg:w-[90vw] mx-auto bg-zinc-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-zinc-700 p-2 sm:p-4 md:p-8 lg:p-16 overflow-y-auto max-h-[90vh] min-h-[60vh] space-y-8">
        <VisuallyHidden>
          <DialogTitle>AI Blueprint Dialog</DialogTitle>
        </VisuallyHidden>
        {/* Lightning bolt icon in top right */}
        <div className="absolute top-4 right-4">
          <div className="bg-zinc-800/80 p-2 rounded-lg shadow">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Project Details Form */}
        {!isGenerating && !blueprintResult && (
          <>
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Project Details</h2>
              <p className="text-zinc-400 text-base mb-4">Describe your AI SaaS project briefly and let us do all the heavy lifting for you!</p>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 mt-2">
              <div>
                <label htmlFor="projectTitle" className="block text-sm font-semibold text-zinc-300 mb-2">Project Title</label>
                <Input
                  id="projectTitle"
                  type="text"
                  {...register('projectTitle', { required: true })}
                  className="bg-zinc-800/80 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus-visible:ring-indigo-500 rounded-lg px-4 py-2 text-base"
                />
                {errors.projectTitle && <span className="text-red-500 text-xs mt-1">Project Title is required</span>}
              </div>
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-semibold text-zinc-300 mb-2">Project Description</label>
                <Textarea
                  id="projectDescription"
                  {...register('projectDescription', { required: true, maxLength: MAX_CHARS })}
                  rows={4}
                  className="bg-zinc-800/80 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus-visible:ring-indigo-500 resize-none rounded-lg px-4 py-2 text-base"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-zinc-400">{charCount}/{MAX_CHARS} characters</span>
                  {errors.projectDescription && errors.projectDescription.type === 'required' && <span className="text-red-500 text-xs">Project Description is required</span>}
                  {errors.projectDescription && errors.projectDescription.type === 'maxLength' && <span className="text-red-500 text-xs">Project Description exceeds maximum length</span>}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 py-2 shadow-lg transition-all text-base">
                  Generate Blueprint
                </Button>
              </div>
            </form>
          </>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <h2 className="text-2xl font-extrabold text-white mb-6 tracking-wide text-center">Generating your SaaS blueprint</h2>
            {/* Progress Bar */}
            <div className="w-full mb-8">
              <div className="w-full bg-zinc-800/60 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / generationSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-400 font-medium">
                <span>Progress</span>
                <span>{Math.round((currentStep / generationSteps.length) * 100)}%</span>
              </div>
            </div>
            {/* Steps List */}
            <ul className="w-full max-w-md mx-auto space-y-4">
              {generationSteps.map((step, idx) => (
                <li key={step} className="flex items-center gap-3">
                  {idx < currentStep - 1 ? (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                      </svg>
                    </span>
                  ) : idx === currentStep - 1 ? (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white animate-pulse">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                        <path d='M12 6v6l4 2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-zinc-400">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
                      </svg>
                    </span>
                  )}
                  <span className={
                    idx < currentStep - 1
                      ? 'text-green-400 font-semibold'
                      : idx === currentStep - 1
                      ? 'text-indigo-300 font-bold'
                      : 'text-zinc-400'
                  }>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {blueprintResult && !isGenerating && (
          <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
            <div className="w-full">
              {/* Project Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-tr from-red-500 to-yellow-300 flex items-center justify-center text-4xl font-bold shadow-lg">
                  😎
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-1">Review Your AI Blueprint</h2>
                  <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-md">Here's the plan generated based on your input. Review the details and approve to create your project.</p>
                </div>
              </div>
              {/* Project Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs font-semibold">UGC</span>
                </div>
                <p className="text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed">UDG Central is the ultimate platform for connecting brands with talented UGC (User-Generated Content) creators through fun, competitive content contests. We make it easy for sponsors to launch creative campaigns and for creators to showcase their skills, win prizes, and land paid opportunities. At UGC Central, brands post content contests describing what they're looking for—whether it's product reviews, lifestyle videos, tutorials, unboxings, or creative ads. Creators can browse contests, submit their best work, and compete to win rewards, recognition, and future collaborations.</p>
              </div>
              {/* Market Feasibility Analysis */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📊</span>
                  <h3 className="text-lg font-bold text-white">Market Feasibility Analysis</h3>
                  <span className="ml-auto bg-zinc-800 text-white px-3 py-1 rounded-lg text-sm font-bold">Overall Score <span className="text-indigo-400">8.2/10</span></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Uniqueness', score: 8 },
                    { label: 'Stickiness', score: 7 },
                    { label: 'Growth Trend', score: 8 },
                    { label: 'Pricing Potential', score: 9 },
                    { label: 'Upsell Potential', score: 9 },
                    { label: 'Customer Purchasing Power', score: 8 },
                  ].map(({ label, score }) => (
                    <div key={label} className="bg-zinc-800/80 rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm font-medium text-zinc-300">
                        <span>{label}</span>
                        <span className="font-bold text-white">{score}/10</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${score * 10}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Suggested Improvements */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg text-orange-400">⚡</span>
                  <h3 className="text-lg font-bold text-white">Suggested Improvements</h3>
                </div>
                <div className="space-y-2">
                  {[
                    'Consider adding AI-driven competitive analysis...',
                    'Implement interactive roadmap planning...',
                    'Add financial modeling tools...'
                  ].map((improvement, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-zinc-800/80 rounded-lg px-4 py-2 text-zinc-200">
                      <span className="text-orange-400 text-base">●</span>
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Core Features */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg text-green-400">✔️</span>
                  <h3 className="text-lg font-bold text-white">Core Features</h3>
                </div>
                <ul className="space-y-1 ml-2">
                  {[
                    'SaaS idea validation and scoring system',
                    'Interactive project planning with AI recommendations',
                    'Market fit analysis with actionable insights',
                    'Technical stack recommendations',
                    'Development resource planning',
                    'Feature prioritization framework',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-green-400">
                      <span>✔️</span>
                      <span className="text-zinc-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Technical Requirements */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚡</span>
                  <h3 className="text-lg font-bold text-white">Technical Requirements</h3>
                </div>
                <div className="mb-2 text-zinc-300">Recommended Expertise Level: <span className="font-bold text-white">Mid Developer</span></div>
                <div className="mb-2 text-zinc-300">Suggested Tech Stack:</div>
                <div className="flex flex-wrap gap-2">
                  {['Next.js 15', 'React', 'Tailwind CSS', 'Prisma', 'Neon Postgres', 'Uploadcare', 'TypeScript', 'Framer Motion'].map((tech) => (
                    <span key={tech} className="bg-zinc-800 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold shadow">{tech}</span>
                  ))}
                </div>
              </div>
              {/* Pricing Plans */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💸</span>
                  <h3 className="text-lg font-bold text-white">Recommended Pricing Plans</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Starter', price: '$29/mo', desc: 'Perfect for solo...', features: ['Basic validation'], highlight: false },
                    { name: 'Pro', price: '$79/mo', desc: 'For growing teams...', features: ['Advanced validation'], highlight: true },
                    { name: 'Enterprise', price: '$199/mo', desc: 'For established companies...', features: ['All Pro features'], highlight: false },
                  ].map((plan) => (
                    <div key={plan.name} className={`rounded-xl p-5 flex flex-col gap-2 border ${plan.highlight ? 'border-indigo-500 bg-indigo-900/30 shadow-lg scale-105' : 'border-zinc-700 bg-zinc-800/80'} transition-all`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-white">{plan.name}</span>
                        {plan.highlight && <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full font-semibold">Recommended</span>}
                      </div>
                      <div className="text-2xl font-extrabold text-indigo-400">{plan.price}</div>
                      <div className="text-zinc-300 text-xs mb-2">{plan.desc}</div>
                      <ul className="text-zinc-200 text-xs space-y-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1"><span>•</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={onStartOver} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold rounded-lg px-5 py-2 transition-all">Start Over</button>
                <button type="button" onClick={onEditDetails} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold rounded-lg px-5 py-2 transition-all">Edit Details</button>
                <button type="button" onClick={onApprovePlan} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2 shadow transition-all">Approve Plan</button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlueprintReviewDialog; 