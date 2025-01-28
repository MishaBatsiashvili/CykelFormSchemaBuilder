import { Schema } from "@/lib/schema";

export interface ValidationStatusProps {
  constraints: string[];
}

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  onImport: (schema: Schema) => void;
}

export interface SchemaHeaderProps {
  schema: Schema;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onImport: (schema: Schema) => void;
  constraints: string[];
} 