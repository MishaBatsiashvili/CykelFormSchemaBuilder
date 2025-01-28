export interface Schema {
  runnables: Runnable[];
}

export interface Runnable {
  type: "initial" | "secondary";  // Type of runnable
  path: string;                   // Path for the runnable
  inputs: Input[];               // Array of input configurations
  output?: OutputConfig;         // Optional output configuration
}

export interface Input {
  name: string;                  // Unique identifier for the input
  label: string;                 // Display label
  type: InputType;              // Type of input
  order?: number;               // Order in the form (optional)
  required: boolean;            // Whether input is required
  description?: string;         // Optional description
  defaultValue?: any;           // Default value if any
  options?: Option[];          // For dropdown type
  min?: number;               // For slider type
  max?: number;               // For slider type
  step?: number;              // For slider type
  mark?: string;              // For slider type
  actionType?: string;        // For action type
  outputKey?: string;         // For output type
  initialInputKey?: string;   // For initialInput type
  calculationSource?: {      // For output type calculations
    inputName: string;       // Name of the input to use as source
    transform?: string;      // Optional transformation to apply (e.g., "multiply", "add")
    value?: number;         // Value to use in transformation
  };
}

export type InputType =
  | "dropdown"
  | "slider"
  | "textarea"
  | "toggle"
  | "action"
  | "output"
  | "initialInput";

export interface Option {
  label: string;              // Display label
  value: string;             // Value when selected
}

export interface OutputConfig {
  dataTitle?: string;        // Title for the output data
  tip?: string;              // Tooltip or helper text
}

export function validateSchema(schema: Schema): boolean {
  // Validate at least one runnable exists
  if (schema.runnables.length === 0) {
    return false;
  }

  // Validate at least one initial runnable exists
  const hasInitialRunnable = schema.runnables.some(r => r.type === "initial");
  if (!hasInitialRunnable) {
    return false;
  }

  // Validate secondary runnables have valid initialInputKey references
  const secondaryRunnables = schema.runnables.filter(r => r.type === "secondary");
  const initialRunnableOutputs = schema.runnables
    .filter(r => r.type === "initial")
    .flatMap(r => r.inputs)
    .map(i => i.outputKey)
    .filter(Boolean) as string[];

  const validSecondaryRunnables = secondaryRunnables.every(r =>
    r.inputs
      .filter(i => i.type === "initialInput")
      .every(i => initialRunnableOutputs.includes(i.initialInputKey || ""))
  );

  if (!validSecondaryRunnables) {
    return false;
  }

  // Validate each runnable
  return schema.runnables.every(validateRunnable);
}

export function validateRunnable(runnable: Runnable): boolean {
  // Validate path
  if (!runnable.path || typeof runnable.path !== "string") {
    return false;
  }

  // Validate inputs
  if (!runnable.inputs || runnable.inputs.length === 0) {
    return false;
  }

  if (runnable.inputs.length > 20) {
    return false;
  }

  // Check for unique input names
  const inputNames = new Set();
  for (const input of runnable.inputs) {
    if (inputNames.has(input.name)) {
      return false;
    }
    inputNames.add(input.name);
  }

  // Validate each input
  return runnable.inputs.every(validateInput);
}

export function validateInput(input: Input): boolean {
  // Validate required fields
  if (!input.name || !input.label || !input.type) {
    return false;
  }

  // Validate type-specific requirements
  switch (input.type) {
    case "slider":
      if (typeof input.min !== "number" || typeof input.max !== "number" || typeof input.step !== "number") {
        return false;
      }
      break;
    case "dropdown":
      if (!input.options || input.options.length === 0) {
        return false;
      }
      break;
    case "action":
      if (!input.actionType) {
        return false;
      }
      break;
    case "initialInput":
      if (!input.initialInputKey) {
        return false;
      }
      break;
    case "output":
      if (input.calculationSource && !input.calculationSource.inputName) {
        return false;
      }
      break;
  }

  return true;
}