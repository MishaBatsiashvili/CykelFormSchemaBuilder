import { describe, it, expect } from "vitest";
import {
  validateSchema,
  validateRunnable,
  validateInput,
  Schema,
  Runnable,
  Input
} from "./schema";

describe("Schema Validation", () => {
  describe("validateSchema", () => {
    it("validates a valid schema with initial and secondary runnables", () => {
      const validSchema: Schema = {
        runnables: [
          {
            type: "initial",
            path: "/initial",
            inputs: [
              {
                name: "output1",
                label: "Output 1",
                type: "output",
                required: true,
                outputKey: "key1"
              }
            ]
          },
          {
            type: "secondary",
            path: "/secondary",
            inputs: [
              {
                name: "input1",
                label: "Input 1",
                type: "initialInput",
                required: true,
                initialInputKey: "key1"
              }
            ]
          }
        ]
      };
      expect(validateSchema(validSchema)).toBe(true);
    });

    it("fails when schema has no runnables", () => {
      const emptySchema: Schema = {
        runnables: []
      };
      expect(validateSchema(emptySchema)).toBe(false);
    });

    it("fails when schema has no initial runnable", () => {
      const noInitialSchema: Schema = {
        runnables: [
          {
            type: "secondary",
            path: "/secondary",
            inputs: [
              {
                name: "input1",
                label: "Input 1",
                type: "textarea",
                required: true
              }
            ]
          }
        ]
      };
      expect(validateSchema(noInitialSchema)).toBe(false);
    });

    it("fails when secondary runnable references non-existent initial input", () => {
      const invalidReferenceSchema: Schema = {
        runnables: [
          {
            type: "initial",
            path: "/initial",
            inputs: [
              {
                name: "output1",
                label: "Output 1",
                type: "output",
                required: true,
                outputKey: "key1"
              }
            ]
          },
          {
            type: "secondary",
            path: "/secondary",
            inputs: [
              {
                name: "input1",
                label: "Input 1",
                type: "initialInput",
                required: true,
                initialInputKey: "non-existent-key"
              }
            ]
          }
        ]
      };
      expect(validateSchema(invalidReferenceSchema)).toBe(false);
    });
  });

  describe("validateRunnable", () => {
    const validRunnable: Runnable = {
      type: "initial",
      path: "/test",
      inputs: [
        {
          name: "input1",
          label: "Input 1",
          type: "textarea",
          required: true
        }
      ]
    };

    it("validates a valid runnable", () => {
      expect(validateRunnable(validRunnable)).toBe(true);
    });

    it("fails when path is missing", () => {
      const noPath = { ...validRunnable, path: "" };
      expect(validateRunnable(noPath)).toBe(false);
    });

    it("fails when inputs array is empty", () => {
      const noInputs = { ...validRunnable, inputs: [] };
      expect(validateRunnable(noInputs)).toBe(false);
    });

    it("fails when inputs exceed maximum limit", () => {
      const tooManyInputs = {
        ...validRunnable,
        inputs: Array(21).fill({
          name: "input",
          label: "Input",
          type: "textarea",
          required: true
        })
      };
      expect(validateRunnable(tooManyInputs)).toBe(false);
    });

    it("fails when input names are not unique", () => {
      const duplicateNames = {
        ...validRunnable,
        inputs: [
          {
            name: "same-name",
            label: "Input 1",
            type: "textarea",
            required: true
          },
          {
            name: "same-name",
            label: "Input 2",
            type: "textarea",
            required: true
          }
        ]
      };
      expect(validateRunnable(duplicateNames)).toBe(false);
    });
  });

  describe("validateInput", () => {
    it("validates a valid textarea input", () => {
      const textareaInput: Input = {
        name: "text1",
        label: "Text Input",
        type: "textarea",
        required: true
      };
      expect(validateInput(textareaInput)).toBe(true);
    });

    it("validates a valid slider input", () => {
      const sliderInput: Input = {
        name: "slider1",
        label: "Slider Input",
        type: "slider",
        required: true,
        min: 0,
        max: 100,
        step: 1
      };
      expect(validateInput(sliderInput)).toBe(true);
    });

    it("fails when slider input is missing required fields", () => {
      const invalidSlider: Input = {
        name: "slider1",
        label: "Slider Input",
        type: "slider",
        required: true,
        min: 0 // missing max and step
      };
      expect(validateInput(invalidSlider)).toBe(false);
    });

    it("validates a valid dropdown input", () => {
      const dropdownInput: Input = {
        name: "dropdown1",
        label: "Dropdown Input",
        type: "dropdown",
        required: true,
        options: [
          { label: "Option 1", value: "1" }
        ]
      };
      expect(validateInput(dropdownInput)).toBe(true);
    });

    it("fails when dropdown input has no options", () => {
      const invalidDropdown: Input = {
        name: "dropdown1",
        label: "Dropdown Input",
        type: "dropdown",
        required: true,
        options: []
      };
      expect(validateInput(invalidDropdown)).toBe(false);
    });

    it("validates a valid action input", () => {
      const actionInput: Input = {
        name: "action1",
        label: "Action Input",
        type: "action",
        required: true,
        actionType: "submit"
      };
      expect(validateInput(actionInput)).toBe(true);
    });

    it("fails when action input has no actionType", () => {
      const invalidAction: Input = {
        name: "action1",
        label: "Action Input",
        type: "action",
        required: true
      };
      expect(validateInput(invalidAction)).toBe(false);
    });

    it("validates a valid initialInput", () => {
      const initialInput: Input = {
        name: "initial1",
        label: "Initial Input",
        type: "initialInput",
        required: true,
        initialInputKey: "key1"
      };
      expect(validateInput(initialInput)).toBe(true);
    });

    it("fails when initialInput has no initialInputKey", () => {
      const invalidInitialInput: Input = {
        name: "initial1",
        label: "Initial Input",
        type: "initialInput",
        required: true
      };
      expect(validateInput(invalidInitialInput)).toBe(false);
    });

    it("validates a valid output with calculation source", () => {
      const outputInput: Input = {
        name: "output1",
        label: "Output Input",
        type: "output",
        required: true,
        calculationSource: {
          inputName: "source1",
          transform: "multiply",
          value: 2
        }
      };
      expect(validateInput(outputInput)).toBe(true);
    });

    it("fails when output with calculation source has no inputName", () => {
      const invalidOutput: Input = {
        name: "output1",
        label: "Output Input",
        type: "output",
        required: true,
        calculationSource: {
          transform: "multiply",
          value: 2
        }
      };
      expect(validateInput(invalidOutput)).toBe(false);
    });
  });
}); 