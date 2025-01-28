import { Schema } from "@/lib/schema";

export const getUnfulfilledConstraints = (schema: Schema): string[] => {
  const constraints = [];

  if (schema.runnables.length === 0) {
    constraints.push("At least one runnable is required");
  }

  schema.runnables.forEach((runnable) => {
    if (runnable.inputs.length === 0) {
      constraints.push(`Runnable "${runnable.path}" has no inputs`);
    }
    if (runnable.inputs.length > 20) {
      constraints.push(
        `Runnable "${runnable.path}" exceeds maximum of 20 inputs`,
      );
    }
  });

  return constraints;
};

export const downloadSchema = (schema: Schema) => {
  const jsonString = JSON.stringify(schema, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "schema.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 