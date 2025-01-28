import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NameField } from "./NameField";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

// Mock Chakra components
vi.mock("@chakra-ui/react", () => ({
  Input: React.forwardRef(({ onChange, onBlur, name, ...props }: any, ref) => (
    <input
      data-testid="name-input"
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      ref={ref}
      {...props}
    />
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

describe("NameField", () => {
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
    render(<NameField form={mockForm} />);
    
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByTestId("helper-text")).toHaveTextContent(
      "A unique identifier for this input"
    );
  });

  it("registers name field with form", () => {
    render(<NameField form={mockForm} />);
    
    expect(mockForm.register).toHaveBeenCalledWith("name");
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
  });

  it("displays error message when name is invalid", () => {
    const formWithError = {
      ...mockForm,
      formState: {
        errors: {
          name: {
            message: "Name is required"
          }
        }
      }
    } as unknown as UseFormReturn<FormValues>;

    render(<NameField form={formWithError} />);
    
    expect(screen.getByTestId("error-text")).toHaveTextContent("Name is required");
  });
}); 