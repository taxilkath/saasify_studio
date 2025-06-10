'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";
import { useState, useEffect, useRef } from 'react';

// Schema for form validation remains the same
const formSchema = z.object({
  projectTitle: z.string().min(3, "Title must be at least 3 characters."),
  projectDescription: z.string().min(10, "Description must be at least 10 characters.").max(700),
  aiModel: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface GenerateBlueprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: FormData) => Promise<void>; 
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

export function GenerateBlueprintDialog({ open, onOpenChange, onFormSubmit }: GenerateBlueprintDialogProps) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { projectTitle: '', projectDescription: '', aiModel: 'deepseek' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localStep, setLocalStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const charCount = watch('projectDescription')?.length || 0;

  useEffect(() => {
    if (isSubmitting) {
      setLocalStep(1); 
      intervalRef.current = setInterval(() => {
        setLocalStep((prev) => (prev >= generationSteps.length ? 1 : prev + 1));
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSubmitting]);

  const handleInternalSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onFormSubmit(data); 
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      // Don't set isSubmitting to false here. The parent component will close this dialog on success.
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) { 
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground">
        
        {!isSubmitting ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted border">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Generate SaaS Blueprint</DialogTitle>
                  <p className="text-sm text-muted-foreground">Describe your idea to get started.</p>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleInternalSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Title</label>
                <Input {...register('projectTitle')} placeholder="e.g., AI-Powered Task Manager" className="mt-2" />
                {errors.projectTitle && <p className="text-sm text-destructive mt-1">{errors.projectTitle.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea {...register('projectDescription')} placeholder="Describe your idea in detail..." rows={5} className="mt-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">{charCount} / 700</p>
              </div>
              <div>
                <label className="text-sm font-medium">AI Model</label>
                <Controller name="aiModel" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="deepseek">⚡️ DeepSeek (Free)</SelectItem></SelectContent>
                  </Select>
                )} />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">✨ Generate Blueprint</Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-center p-8">
              {/* --- THIS IS THE FIX --- */}
              {/* Add a visually hidden title for screen readers */}
              <DialogTitle className="sr-only">Generating Your SaaS Blueprint</DialogTitle>
              
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border-4 border-zinc-700">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Generating Your SaaS Blueprint</h2>
              <p className="text-lg text-indigo-300 mb-8 font-medium">
                  {generationSteps[localStep -1] || 'Getting ready...'}
              </p>
              
              <div className="w-full max-w-xl mb-10">
                  <div className="w-full bg-zinc-800 rounded-full h-3.5 overflow-hidden">
                      <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3.5 rounded-full transition-all duration-1000 ease-linear"
                          style={{ width: `${generationSteps.length > 0 ? (localStep / generationSteps.length) * 100 : 0}%` }}
                      ></div>
                  </div>
                  <div className="text-right mt-2 text-sm text-zinc-400 font-medium">Step {localStep} of {generationSteps.length}</div>
              </div>

              <ul className="w-full max-w-md mx-auto space-y-4 text-left">
                  {generationSteps.map((step, idx) => {
                      const isCompleted = idx < localStep -1;
                      const isInProgress = idx === localStep - 1;

                      return (
                          <li key={step} className="flex items-center gap-4 group">
                              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                                  {isCompleted ? (
                                      <span className="text-green-400 font-bold">✓</span>
                                  ) : (
                                      <span className={`w-2 h-2 rounded-full transition-colors ${isInProgress ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                                  )}
                              </div>
                              <span className={`transition-colors text-lg ${
                                  isCompleted ? 'text-zinc-500 line-through' : 
                                  isInProgress ? 'text-white font-semibold' : 'text-zinc-400'
                              }`}>
                                  {step}
                              </span>
                          </li>
                      );
                  })}
              </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}