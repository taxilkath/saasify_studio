import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950/80 backdrop-blur-3xl border border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Delete Project</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Are you sure you want to delete "{projectName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 