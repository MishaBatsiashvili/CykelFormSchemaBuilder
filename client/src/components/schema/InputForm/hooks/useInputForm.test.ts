import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInputForm } from "./useInputForm";
import { useSchemaStore } from "@/store/schema";
import { useToast } from "@/hooks/use-toast";
import { renderHook, act } from "@testing-library/react";
import { FormValues } from "../types";

// Mock dependencies
vi.mock("@/store/schema", () => ({
  useSchemaStore: vi.fn()
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn()
}));

describe("useInputForm", () => {
  const mockToast = vi.fn();
  const mockAddInput = vi.fn();
  const mockUpdateInput = vi.fn();
  
  const mockProps = {
    runnable: { path: "test/path", inputs: [] },
    schema: { runnables: [] }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockImplementation(() => ({
      toast: mockToast
    }));
    (useSchemaStore as any).mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector({ addInput: mockAddInput, updateInput: mockUpdateInput });
      }
      return selector === "addInput" ? mockAddInput : mockUpdateInput;
    });
  });

  it("initializes with empty values when no existing input", () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    expect(result.current.form.getValues()).toEqual({
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

  it("initializes with existing input values", () => {
    const existingInput = {
      name: "test",
      label: "Test Input",
      type: "dropdown" as const,
      required: true,
      options: [{ label: "Option 1", value: "1" }],
      description: "Test description"
    };

    const { result } = renderHook(() => useInputForm({
      ...mockProps,
      existingInput
    }));
    
    expect(result.current.form.getValues()).toMatchObject(existingInput);
  });

  it("handles open state changes", () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    act(() => {
      result.current.handleOpenChange({ open: true });
    });
    
    expect(result.current.open).toBe(true);
  });

  it("updates form on action type change", () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    act(() => {
      result.current.handleActionTypeChange("submit");
    });
    
    expect(result.current.form.getValues("actionType")).toBe("submit");
    expect(result.current.form.getValues("name")).toBe("SubmitAction");
    expect(result.current.form.getValues("label")).toBe("Submit");
  });

  it("updates form on input type change", () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    act(() => {
      result.current.form.setValue("name", "testName");
      result.current.form.setValue("label", "Test Label");
      result.current.handleTypeChange("slider");
    });
    
    const values = result.current.form.getValues();
    expect(values).toMatchObject({
      name: "testName",
      label: "Test Label",
      type: "slider",
      min: 0,
      max: 10,
      step: 1
    });
  });

  it("handles successful form submission for new input", async () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    const formData: FormValues = {
      name: "test",
      label: "Test",
      type: "dropdown",
      required: false,
      options: [{ label: "Option 1", value: "1" }]
    };
    
    await act(async () => {
      await result.current.onSubmit(formData);
    });
    
    expect(mockAddInput).toHaveBeenCalledWith("test/path", expect.objectContaining(formData));
    expect(mockToast).toHaveBeenCalledWith({
      title: "Input Added",
      description: "The input has been successfully added.",
      type: "success"
    });
    expect(result.current.open).toBe(false);
  });

  it("handles successful form submission for existing input", async () => {
    const existingInput = {
      name: "existing",
      label: "Existing",
      type: "dropdown" as const,
      required: false,
      options: []
    };

    const { result } = renderHook(() => useInputForm({
      ...mockProps,
      existingInput
    }));
    
    const formData: FormValues = {
      ...existingInput,
      label: "Updated Label"
    };
    
    act(() => {
      result.current.setOldName("existing");
    });
    
    await act(async () => {
      await result.current.onSubmit(formData);
    });
    
    expect(mockUpdateInput).toHaveBeenCalledWith(
      "test/path",
      formData,
      "existing"
    );
    expect(mockToast).toHaveBeenCalledWith({
      title: "Input Updated",
      description: "The input has been successfully updated.",
      type: "success"
    });
  });

  it("handles form submission error", async () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    // Set initial open state
    act(() => {
      result.current.handleOpenChange({ open: true });
    });
    
    // Mock the addInput to throw synchronously
    mockAddInput.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    
    const formData: FormValues = {
      name: "test",
      label: "Test",
      type: "dropdown",
      required: false,
      options: []
    };
    
    await act(async () => {
      try {
        await result.current.onSubmit(formData);
      } catch (error) {
        // Error is expected
      }
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to save input. Please try again.",
      type: "error"
    });
    expect(result.current.open).toBe(true);
  });

  it("handles calculation source for output type", () => {
    const { result } = renderHook(() => useInputForm(mockProps));
    
    act(() => {
      result.current.handleTypeChange("output");
    });
    
    expect(result.current.form.getValues("calculationSource")).toEqual({
      inputName: "",
      transform: "none"
    });
  });
}); 