import { Runnable } from "@/lib/schema";
import * as z from "zod";

export const createValidationSchema = (runnable: Runnable) => {
  const shape: Record<string, z.ZodType> = {};

  runnable.inputs.forEach((input) => {
    if (input.required) {
      switch (input.type) {
        case "textarea":
          shape[input.name] = z.string().min(1, `${input.label} is required`);
          break;
        case "dropdown":
          shape[input.name] = z
            .string()
            .nullable()
            .refine((val) => val !== null, `Please select a ${input.label}`);
          break;
        case "slider":
          shape[input.name] = z
            .number()
            .min(input.min || 0, `${input.label} is required`);
          break;
        case "toggle":
          shape[input.name] = z.boolean();
          break;
        default:
          shape[input.name] = z.any();
      }
    } else {
      shape[input.name] = z.any().optional();
    }
  });

  return z.object(shape);
};

export const getDefaultValues = (runnable: Runnable) => {
  return Object.fromEntries(
    runnable.inputs.map((input) => {
      const defaultValue = input.defaultValue !== undefined
        ? input.defaultValue
        : input.type === "toggle"
          ? false
          : input.type === "slider"
            ? input.min || 0
            : input.type === "output" && input.calculationSource
              ? {
                  calculationSource: {
                    inputName: input.calculationSource.inputName,
                    transform: input.calculationSource.transform || "none",
                    value: input.calculationSource.value
                  }
                }
              : "";
      
      if (input.type === "dropdown") {
        return [input.name, defaultValue || null];
      }
      
      return [input.name, defaultValue];
    }),
  );
}; 