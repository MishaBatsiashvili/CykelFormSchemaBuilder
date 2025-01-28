import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock child components
vi.mock("@/pages/builder", () => ({
  default: () => <div data-testid="builder">Builder Page</div>,
}));

vi.mock("@/components/chakra/toaster", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

vi.mock("@/components/chakra/provider", () => ({
  Provider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chakra-provider">{children}</div>
  ),
}));

describe("App", () => {
  it("renders the app with all required components", () => {
    render(<App />);
    
    // Check if the Chakra Provider is rendered
    expect(screen.getByTestId("chakra-provider")).toBeInTheDocument();
    
    // Check if the Builder page is rendered by default
    expect(screen.getByTestId("builder")).toBeInTheDocument();
    
    // Check if the Toaster is rendered
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });
}); 