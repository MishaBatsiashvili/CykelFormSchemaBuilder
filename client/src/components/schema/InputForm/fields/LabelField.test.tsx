import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabelField } from "./LabelField";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

// Mock Chakra components
vi.mock("@chakra-ui/react", () => ({
  Input: React.forwardRef(({ ...props }: any, ref) => (
    <input data-testid="label-input" ref={ref} {...props} />
  ))
}));

// Mock Field component
vi.mock("@/components/chakra/field", () => ({
  Field: ({ label, invalid, errorText, helperText, children }: any) => (
    <div data-testid="field-wrapper">
      <label>{label}</label>
      {children}
      {helperText && <span data-testid="helper-text">{helperText}</span>}
      {invalid && errorText && <span data-testid="error-text">{errorText}</span>}
    </div>
  )
}));

describe("LabelField", () => {
  const mockForm = {
    register: vi.fn().mockReturnValue({}),
    formState: {
      errors: {}
    }
  } as unknown as UseFormReturn<FormValues>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with label and helper text", () => {
    render(<LabelField form={mockForm} />);
    
    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByTestId("helper-text")).toHaveTextContent(
      "The label shown to users"
    );
  });

  it("registers label field with form", () => {
    render(<LabelField form={mockForm} />);
    
    expect(mockForm.register).toHaveBeenCalledWith("label");
    expect(screen.getByTestId("label-input")).toBeInTheDocument();
  });

  it("displays error message when label is invalid", () => {
    const formWithError = {
      ...mockForm,
      formState: {
        errors: {
          label: {
            message: "Label is required"
          }
        }
      }
    } as unknown as UseFormReturn<FormValues>;

    render(<LabelField form={formWithError} />);
    
    expect(screen.getByTestId("error-text")).toHaveTextContent("Label is required");
  });
}); 