import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DescriptionField } from "./DescriptionField";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

// Mock Chakra components
vi.mock("@chakra-ui/react", () => ({
  Input: React.forwardRef(({ ...props }: any, ref) => (
    <input data-testid="description-input" ref={ref} {...props} />
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

describe("DescriptionField", () => {
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
    render(<DescriptionField form={mockForm} />);
    
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("helper-text")).toHaveTextContent(
      "Add a description for this input"
    );
  });

  it("registers description field with form", () => {
    render(<DescriptionField form={mockForm} />);
    
    expect(mockForm.register).toHaveBeenCalledWith("description");
    expect(screen.getByTestId("description-input")).toBeInTheDocument();
  });

  it("displays error message when description is invalid", () => {
    const formWithError = {
      ...mockForm,
      formState: {
        errors: {
          description: {
            message: "Description is invalid"
          }
        }
      }
    } as unknown as UseFormReturn<FormValues>;

    render(<DescriptionField form={formWithError} />);
    
    expect(screen.getByTestId("error-text")).toHaveTextContent("Description is invalid");
  });
}); 