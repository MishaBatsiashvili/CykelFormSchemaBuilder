import { describe, it, expect } from "vitest";
import { createValidationSchema, getDefaultValues } from "./utils";
import { Runnable } from "@/lib/schema";

describe("createValidationSchema", () => {
  it("creates validation schema for required textarea", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true
        }
      ]
    };

    const schema = createValidationSchema(runnable);
    const result = schema.safeParse({ description: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Description is required");
    }
  });

  it("creates validation schema for required slider", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "rating",
          label: "Rating",
          type: "slider",
          required: true,
          min: 1,
          max: 5
        }
      ]
    };

    const schema = createValidationSchema(runnable);
    const result = schema.safeParse({ rating: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Rating is required");
    }
  });

  it("creates validation schema for optional fields", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "notes",
          label: "Notes",
          type: "textarea",
          required: false
        }
      ]
    };

    const schema = createValidationSchema(runnable);
    const result = schema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("getDefaultValues", () => {
  it("returns empty string for textarea without default value", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "description",
          label: "Description",
          type: "textarea"
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({ description: "" });
  });

  it("returns null for dropdown without default value", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "category",
          label: "Category",
          type: "dropdown",
          options: [{ label: "A", value: "a" }]
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({ category: null });
  });

  it("returns min value for slider without default value", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "rating",
          label: "Rating",
          type: "slider",
          min: 1,
          max: 5
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({ rating: 1 });
  });

  it("returns false for toggle without default value", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "active",
          label: "Active",
          type: "toggle"
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({ active: false });
  });

  it("returns calculation source for output field", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "total",
          label: "Total",
          type: "output",
          calculationSource: {
            inputName: "price",
            transform: "multiply",
            value: 2
          }
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({
      total: {
        calculationSource: {
          inputName: "price",
          transform: "multiply",
          value: 2
        }
      }
    });
  });

  it("uses provided default values when available", () => {
    const runnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [
        {
          name: "description",
          label: "Description",
          type: "textarea",
          defaultValue: "Default text"
        },
        {
          name: "category",
          label: "Category",
          type: "dropdown",
          defaultValue: "a",
          options: [{ label: "A", value: "a" }]
        },
        {
          name: "rating",
          label: "Rating",
          type: "slider",
          min: 1,
          max: 5,
          defaultValue: 3
        },
        {
          name: "active",
          label: "Active",
          type: "toggle",
          defaultValue: true
        }
      ]
    };

    const defaults = getDefaultValues(runnable);
    expect(defaults).toEqual({
      description: "Default text",
      category: "a",
      rating: 3,
      active: true
    });
  });
}); 