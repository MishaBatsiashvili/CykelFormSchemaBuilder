import { Runnable } from "@/lib/schema";
import { z } from "zod";
import { validateUniquePath } from "./utils";

export interface RunnableItemProps {
  runnable: Runnable;
  isSelected: boolean;
  onSelect: (runnable: Runnable) => void;
}

export interface AddRunnableDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  onSubmit: (data: RunnableFormData) => void;
}

export const runnableSchema = z.object({
  path: z.string()
    .min(1, "Path is required")
    .refine(path => validateUniquePath(path), {
      message: "A runnable with this path already exists"
    }),
  type: z.enum(["initial", "secondary"], {
    required_error: "Please select a type",
    invalid_type_error: "Type must be either initial or secondary",
  }),
});

export type RunnableFormData = z.infer<typeof runnableSchema>; 