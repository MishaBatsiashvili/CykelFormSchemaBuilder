import { Runnable, Input as SchemaInput, Schema } from "@/lib/schema";

export type TransformType = "none" | "multiply" | "add" | "subtract";

export interface Option {
  label: string;
  value: string;
}

export interface CalculationSource {
  inputName: string;
  transform: TransformType;
  value?: number;
}

export interface FormValues {
  name: string;
  type: InputType;
  label: string;
  description?: string;
  required: boolean;
  options?: Option[];
  calculationSource?: CalculationSource;
  min?: number;
  max?: number;
  step?: number;
  mark?: string;
  actionType?: string;
  outputKey?: string;
  initialInputKey?: string;
  defaultValue?: string | number | boolean;
}

export interface Props {
  runnable: Runnable;
  existingInput?: SchemaInput;
  schema: Schema;
}

export type InputType = "dropdown" | "slider" | "textarea" | "toggle" | "action" | "output" | "initialInput"; 