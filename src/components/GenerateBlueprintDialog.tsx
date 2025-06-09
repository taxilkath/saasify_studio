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

// Schema for form validation
const formSchema = z.object({
  projectTitle: z.string().min(3, "Title must be at least 3 characters."),
  projectDescription: z.string().min(10, "Description must be at least 10 characters.").max(700),
  aiModel: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface GenerateBlueprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: FormData) => void;
}

export function GenerateBlueprintDialog({ open, onOpenChange, onFormSubmit }: GenerateBlueprintDialogProps) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { projectTitle: '', projectDescription: '', aiModel: 'deepseek' },
  });

  const charCount = watch('projectDescription')?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground">
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
      </DialogContent>
    </Dialog>
  );
}