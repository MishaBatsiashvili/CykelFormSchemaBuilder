import { describe, it, expect, vi } from "vitest";
import { getEmptyValues, inputTypesCollection, actionTypesCollection, transformTypesCollection, createFormSchema } from "./utils";
import { createListCollection } from "@chakra-ui/react";

// Mock createListCollection
vi.mock("@chakra-ui/react", () => ({
  createListCollection: ({ items }: { items: any[] }) => ({
    items,
    getItem: (value: string) => items.find(item => item.value === value),
    getDisplayValue: (value: string) => items.find(item => item.value === value)?.label
  })
}));

describe("getEmptyValues", () => {
  it("returns an object with default empty values", () => {
    const emptyValues = getEmptyValues();
    
    expect(emptyValues).toEqual({
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
      outputKey: undefined,
      initialInputKey: undefined,
      defaultValue: undefined,
      calculationSource: undefined
    });
  });
});

describe("inputTypesCollection", () => {
  it("contains all input types", () => {
    expect(inputTypesCollection.items).toEqual([
      { label: "Dropdown", value: "dropdown" },
      { label: "Slider", value: "slider" },
      { label: "Textarea", value: "textarea" },
      { label: "Toggle", value: "toggle" },
      { label: "Action", value: "action" },
      { label: "Output (Display Only)", value: "output" }
    ]);
  });

  it("gets item by value", () => {
    const item = inputTypesCollection.getItem("dropdown");
    expect(item).toEqual({ label: "Dropdown", value: "dropdown" });
  });

  it("gets display value", () => {
    const label = inputTypesCollection.getDisplayValue("dropdown");
    expect(label).toBe("Dropdown");
  });
});

describe("actionTypesCollection", () => {
  it("contains all action types", () => {
    expect(actionTypesCollection.items).toEqual([
      { label: "Submit Form", value: "submit" },
      { label: "Reset Form", value: "reset" }
    ]);
  });

  it("gets item by value", () => {
    const item = actionTypesCollection.getItem("submit");
    expect(item).toEqual({ label: "Submit Form", value: "submit" });
  });

  it("gets display value", () => {
    const label = actionTypesCollection.getDisplayValue("submit");
    expect(label).toBe("Submit Form");
  });
});

describe("transformTypesCollection", () => {
  it("contains all transform types", () => {
    expect(transformTypesCollection.items).toEqual([
      { label: "No Transform", value: "none" },
      { label: "Multiply", value: "multiply" },
      { label: "Add", value: "add" },
      { label: "Subtract", value: "subtract" }
    ]);
  });

  it("gets item by value", () => {
    const item = transformTypesCollection.getItem("multiply");
    expect(item).toEqual({ label: "Multiply", value: "multiply" });
  });

  it("gets display value", () => {
    const label = transformTypesCollection.getDisplayValue("multiply");
    expect(label).toBe("Multiply");
  });
});

describe("createFormSchema", () => {
  const mockRunnable = { path: "test", inputs: [] };
  const mockSchema = { runnables: [] };

  it("validates required fields", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "",
      label: "",
      type: "dropdown",
      required: false,
      options: []
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Name is required"
        })
      );
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Label is required"
        })
      );
    }
  });

  it("validates dropdown options", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "dropdown",
      required: false,
      options: []
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Dropdown inputs must have at least one option"
        })
      );
    }
  });

  it("accepts valid input data", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "dropdown",
      required: false,
      options: [{ value: "1", label: "One" }],
      description: "Test description"
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid slider data", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "slider",
      required: false,
      min: 0,
      max: 100,
      step: 1
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid action data", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "action",
      required: false,
      actionType: "submit"
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid output data", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "output",
      required: false,
      outputKey: "result"
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid calculation source", () => {
    const schema = createFormSchema(mockRunnable, mockSchema);
    const result = schema.safeParse({
      name: "test",
      label: "Test",
      type: "output",
      required: false,
      calculationSource: {
        inputName: "input1",
        transform: "multiply",
        value: 2
      }
    });

    expect(result.success).toBe(true);
  });
}); 