import { describe, it, expect } from "vitest";
import {
  optionSchema,
  outputConfigSchema,
  inputSchema,
  runnableSchema,
  schemaSchema,
  validateSchema,
} from "./schema-validation";

describe("Schema Validation", () => {
  describe("optionSchema", () => {
    it("validates correct option data", () => {
      const validOption = {
        label: "Option 1",
        value: "opt1",
      };
      expect(optionSchema.safeParse(validOption).success).toBe(true);
    });

    it("fails on missing required fields", () => {
      const invalidOption = {
        label: "Option 1",
      };
      const result = optionSchema.safeParse(invalidOption);
      expect(result.success).toBe(false);
    });
  });

  describe("outputConfigSchema", () => {
    it("validates with optional fields", () => {
      const validConfig = {
        dataTitle: "Test Data",
        tip: "Test Tip",
      };
      expect(outputConfigSchema.safeParse(validConfig).success).toBe(true);
    });

    it("validates with no fields", () => {
      const emptyConfig = {};
      expect(outputConfigSchema.safeParse(emptyConfig).success).toBe(true);
    });
  });

  describe("inputSchema", () => {
    it("validates dropdown input", () => {
      const dropdownInput = {
        name: "test-dropdown",
        label: "Test Dropdown",
        type: "dropdown" as const,
        required: true,
        options: [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ],
      };
      expect(inputSchema.safeParse(dropdownInput).success).toBe(true);
    });

    it("validates slider input", () => {
      const sliderInput = {
        name: "test-slider",
        label: "Test Slider",
        type: "slider" as const,
        required: true,
        min: 0,
        max: 100,
        step: 1,
        mark: "%",
      };
      expect(inputSchema.safeParse(sliderInput).success).toBe(true);
    });

    it("validates output input", () => {
      const outputInput = {
        name: "test-output",
        label: "Test Output",
        type: "output" as const,
        required: true,
        outputKey: "testKey",
      };
      expect(inputSchema.safeParse(outputInput).success).toBe(true);
    });

    it("validates input with calculation source", () => {
      const calculatedInput = {
        name: "calculated-field",
        label: "Calculated Field",
        type: "output" as const,
        required: true,
        calculationSource: {
          inputName: "source-field",
          transform: "multiply" as const,
          value: 2,
        },
      };
      expect(inputSchema.safeParse(calculatedInput).success).toBe(true);
    });

    it("fails on invalid input type", () => {
      const invalidInput = {
        name: "test",
        label: "Test",
        type: "invalid-type",
        required: true,
      };
      const result = inputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("runnableSchema", () => {
    it("validates initial runnable", () => {
      const initialRunnable = {
        type: "initial" as const,
        path: "/test/path",
        inputs: [
          {
            name: "test-input",
            label: "Test Input",
            type: "textarea" as const,
            required: true,
          },
        ],
      };
      expect(runnableSchema.safeParse(initialRunnable).success).toBe(true);
    });

    it("validates secondary runnable with output", () => {
      const secondaryRunnable = {
        type: "secondary" as const,
        path: "/test/path",
        inputs: [
          {
            name: "test-input",
            label: "Test Input",
            type: "textarea" as const,
            required: true,
          },
        ],
        output: {
          dataTitle: "Test Output",
          tip: "Test Tip",
        },
      };
      expect(runnableSchema.safeParse(secondaryRunnable).success).toBe(true);
    });
  });

  describe("schemaSchema", () => {
    it("validates complete schema", () => {
      const validSchema = {
        runnables: [
          {
            type: "initial" as const,
            path: "/path1",
            inputs: [
              {
                name: "input1",
                label: "Input 1",
                type: "textarea" as const,
                required: true,
              },
            ],
          },
          {
            type: "secondary" as const,
            path: "/path2",
            inputs: [
              {
                name: "input2",
                label: "Input 2",
                type: "dropdown" as const,
                required: true,
                options: [
                  { label: "Option 1", value: "opt1" },
                ],
              },
            ],
            output: {
              dataTitle: "Output",
            },
          },
        ],
      };
      expect(schemaSchema.safeParse(validSchema).success).toBe(true);
    });

    it("fails on duplicate runnable paths", () => {
      const invalidSchema = {
        runnables: [
          {
            type: "initial" as const,
            path: "/same/path",
            inputs: [],
          },
          {
            type: "secondary" as const,
            path: "/same/path",
            inputs: [],
          },
        ],
      };
      const result = schemaSchema.safeParse(invalidSchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Runnable paths must be unique");
      }
    });
  });

  describe("validateSchema", () => {
    it("returns success for valid schema", () => {
      const validSchema = {
        runnables: [
          {
            type: "initial" as const,
            path: "/test",
            inputs: [],
          },
        ],
      };
      const result = validateSchema(validSchema);
      expect(result.success).toBe(true);
    });

    it("returns error details for invalid schema", () => {
      const invalidSchema = {
        runnables: "not-an-array",
      };
      const result = validateSchema(invalidSchema);
      expect(result.success).toBe(false);
    });
  });
}); 