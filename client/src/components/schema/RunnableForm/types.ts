import { Runnable, Schema } from "@/lib/schema";

export interface RunnableFormProps {
  runnable: Runnable;
  schema: Schema;
}

export interface OutputSettingsFormData {
  dataTitle: string;
  tip: string;
}

export interface RunnableHeaderProps {
  runnable: Runnable;
  onDelete: () => void;
  onUpdateOutput: (data: OutputSettingsFormData) => void;
}

export interface OutputSettingsDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  defaultValues: OutputSettingsFormData;
  onSubmit: (data: OutputSettingsFormData) => void;
} 