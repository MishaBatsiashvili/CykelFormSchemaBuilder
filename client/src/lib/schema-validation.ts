import { z } from "zod";

// Option Configuration
export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Output Configuration
export const outputConfigSchema = z.object({
  dataTitle: z.string().optional(),
  tip: z.string().optional(),
});

// Input Configuration
export const inputSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum([
    "dropdown",
    "slider",
    "textarea",
    "toggle",
    "action",
    "output",
    "initialInput"
  ]),
  order: z.number().optional(),
  required: z.boolean(),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
  options: z.array(optionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  mark: z.string().optional(),
  actionType: z.string().optional(),
  outputKey: z.string().optional(),
  initialInputKey: z.string().optional(),
  calculationSource: z.object({
    inputName: z.string(),
    transform: z.enum(["none", "multiply", "add", "subtract"]),
    value: z.number().optional(),
  }).optional(),
});

// Runnable Configuration
export const runnableSchema = z.object({
  type: z.enum(["initial", "secondary"]),
  path: z.string(),
  inputs: z.array(inputSchema),
  output: outputConfigSchema.optional(),
});

// Schema Structure
export const schemaSchema = z.object({
  runnables: z.array(runnableSchema).refine(
    (runnables) => {
      const paths = runnables.map(r => r.path);
      return new Set(paths).size === paths.length;
    },
    {
      message: "Runnable paths must be unique",
      path: ["runnables"]
    }
  ),
});

// Function to validate schema
export const validateSchema = (schema: unknown) => {
  return schemaSchema.safeParse(schema);
};
