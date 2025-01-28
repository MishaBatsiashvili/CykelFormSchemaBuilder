import { Schema, Runnable } from "@/lib/schema";

export interface FormPreviewProps {
  schema: Schema;
}

export interface RunnablePreviewFormProps {
  runnable: Runnable;
  sharedValues: Record<string, any>;
  onUpdateSharedValues: (values: Record<string, any>) => void;
}

export interface FormInputFieldProps {
  input: any;
  errors: any;
  register: any;
  control: any;
  watch: any;
  setValue: any;
  sharedValues: Record<string, any>;
  onReset: () => void;
} 