import { Runnable, Schema } from "@/lib/schema";
import { FormValues, TransformType } from "./types";
import * as z from "zod";
import { createListCollection } from "@chakra-ui/react";

export const getEmptyValues = (): FormValues => ({
  name: "",
  label: "",
  type: "dropdown",
  required: false,
  options: [],
  description: "",
  actionType: "",
  min: undefined,
  max: undefined,
  step: undefined,
  mark: undefined,
  outputKey: undefined,
  initialInputKey: undefined,
  defaultValue: undefined,
  calculationSource: undefined,
});

// Add collections for select options
export const inputTypes = [
  { label: "Dropdown", value: "dropdown" },
  { label: "Slider", value: "slider" },
  { label: "Textarea", value: "textarea" },
  { label: "Toggle", value: "toggle" },
  { label: "Action", value: "action" },
  { label: "Output (Display Only)", value: "output" },
];

export const actionTypes = [
  { label: "Submit Form", value: "submit" },
  { label: "Reset Form", value: "reset" }
];

export const transformTypes = [
  { label: "No Transform", value: "none" },
  { label: "Multiply", value: "multiply" },
  { label: "Add", value: "add" },
  { label: "Subtract", value: "subtract" },
] as const;

export const inputTypesCollection = createListCollection({
  items: inputTypes,
});

export const actionTypesCollection = createListCollection({
  items: actionTypes,
});

export const transformTypesCollection = createListCollection({
  items: transformTypes,
});

// Simple validation schema for input creation/editing
export const createFormSchema = (runnable: Runnable, schema: Schema, oldName?: string) => {
  return z.object({
    name: z.string()
      .min(1, "Name is required")
      .refine(
        name => {
          // When editing, allow the same name or check if new name is unique
          if (oldName) {
            return name === oldName || !runnable.inputs.some(input => input.name === name);
          }
          // For new inputs, just check if name is unique
          return !runnable.inputs.some(input => input.name === name);
        },
        "An input with this name already exists"
      ),
    type: z.string(),
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    required: z.boolean(),
    options: z.array(
      z.object({
        value: z.string().min(1, "Value is required"),
        label: z.string().min(1, "Label is required")
      })
    ).optional(),
    calculationSource: z.object({
      inputName: z.string(),
      transform: z.enum(["none", "multiply", "add", "subtract"]),
      value: z.number().optional()
    }).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    mark: z.string().optional(),
    actionType: z.string().optional(),
    outputKey: z.string().optional(),
    initialInputKey: z.string().optional(),
    defaultValue: z.union([
      z.string(),
      z.number(),
      z.boolean()
    ]).optional()
  }).superRefine((data, ctx) => {
    if (data.type === "dropdown" && (!data.options || data.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dropdown inputs must have at least one option",
        path: ["options"]
      });
    }

    if(data.type === "slider" && !!data.max && !!data.step && data.step > data.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Step must be less than max",
        path: ["step"]
      });
    }

    // Validate default value based on input type
    if (data.defaultValue !== undefined) {
      switch (data.type) {
        case "dropdown":
          if (typeof data.defaultValue !== "string") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Default value for dropdown must be a string",
              path: ["defaultValue"]
            });
          } else if (data.options && !data.options.some(opt => opt.value === data.defaultValue)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Default value must be one of the dropdown options",
              path: ["defaultValue"]
            });
          }
          break;
        case "slider":
          if (typeof data.defaultValue !== "number") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Default value for slider must be a number",
              path: ["defaultValue"]
            });
          } else {
            const min = data.min ?? 0;
            const max = data.max ?? 10;
            if (data.defaultValue < min || data.defaultValue > max) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Default value must be between ${min} and ${max}`,
                path: ["defaultValue"]
              });
            }
          }
          break;
        case "textarea":
          if (typeof data.defaultValue !== "string") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Default value for textarea must be a string",
              path: ["defaultValue"]
            });
          }
          break;
        case "toggle":
          if (typeof data.defaultValue !== "boolean") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Default value for toggle must be a boolean",
              path: ["defaultValue"]
            });
          }
          break;
      }
    }
  });
}; 