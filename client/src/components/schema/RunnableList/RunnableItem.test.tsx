import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RunnableItem } from "./RunnableItem";

// Helper to convert Chakra props to style object
const convertChakraProps = (props: any) => {
  const styleProps: any = {};
  
  if (props.alignItems) styleProps.alignItems = props.alignItems;
  if (props.justifyContent) styleProps.justifyContent = props.justifyContent;
  if (props.borderRadius) styleProps.borderRadius = "0.375rem";
  if (props.borderColor) styleProps.borderColor = props.borderColor === "white" ? "white" : "transparent";
  if (props.bg) styleProps.backgroundColor = props.bg === "gray.100" ? "#E2E8F0" : "#F7FAFC";
  if (props.p) styleProps.padding = "0.75rem";
  if (props.mb) styleProps.marginBottom = "0.5rem";
  if (props.gap) styleProps.gap = "0.25rem";
  if (props.px) styleProps.paddingLeft = styleProps.paddingRight = "0.5rem";
  if (props.py) styleProps.paddingTop = styleProps.paddingBottom = "0.25rem";
  if (props.width === "full") styleProps.width = "100%";
  if (props.display) styleProps.display = props.display;
  if (props.fontSize) styleProps.fontSize = props.fontSize === "xs" ? "0.75rem" : "0.875rem";
  if (props.fontWeight) styleProps.fontWeight = props.fontWeight === "medium" ? 500 : 400;
  if (props.color) styleProps.color = props.color === "gray.500" ? "#718096" : props.color;

  return styleProps;
};

// Mock Chakra UI components
vi.mock("@chakra-ui/react", () => ({
  Box: ({ children, onClick, ...props }: any) => 
    React.createElement("div", { 
      onClick, 
      "data-testid": "runnable-item",
      style: convertChakraProps(props)
    }, children),
  Flex: ({ children, ...props }: any) => 
    React.createElement("div", { 
      style: convertChakraProps(props)
    }, children),
  Text: ({ children, ...props }: any) => 
    React.createElement("span", { 
      style: convertChakraProps(props)
    }, children),
  Badge: ({ children, colorScheme, ...props }: any) => 
    React.createElement("span", { 
      "data-testid": `badge-${colorScheme}`,
      style: convertChakraProps(props)
    }, children)
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Workflow: () => 
    React.createElement("span", { 
      "data-testid": "workflow-icon" 
    }, "Workflow"),
  ArrowRight: () => 
    React.createElement("span", { 
      "data-testid": "arrow-icon" 
    }, "Arrow")
}));

describe("RunnableItem", () => {
  const mockInitialRunnable = {
    path: "/test/path",
    type: "initial" as const,
    inputs: [
      { name: "input1", label: "Input 1", type: "dropdown" as const, required: false },
      { name: "input2", label: "Input 2", type: "dropdown" as const, required: false }
    ]
  };

  const mockSecondaryRunnable = {
    path: "/another/path",
    type: "secondary" as const,
    inputs: [
      { name: "input1", label: "Input 1", type: "dropdown" as const, required: false }
    ]
  };

  const defaultProps = {
    runnable: mockInitialRunnable,
    isSelected: false,
    onSelect: vi.fn()
  };

  it("renders initial runnable correctly", () => {
    render(<RunnableItem {...defaultProps} />);

    expect(screen.getByText("/test/path")).toBeInTheDocument();
    expect(screen.getByText("initial")).toBeInTheDocument();
    expect(screen.getByTestId("workflow-icon")).toBeInTheDocument();
    expect(screen.getByText("2 inputs")).toBeInTheDocument();
    expect(screen.getByTestId("badge-blue")).toBeInTheDocument();
  });

  it("renders secondary runnable correctly", () => {
    render(
      <RunnableItem
        {...defaultProps}
        runnable={mockSecondaryRunnable}
      />
    );

    expect(screen.getByText("/another/path")).toBeInTheDocument();
    expect(screen.getByText("secondary")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
    expect(screen.getByText("1 input")).toBeInTheDocument();
    expect(screen.getByTestId("badge-gray")).toBeInTheDocument();
  });

  it("handles selection correctly", () => {
    const onSelect = vi.fn();
    render(
      <RunnableItem
        {...defaultProps}
        onSelect={onSelect}
      />
    );

    const item = screen.getByTestId("runnable-item");
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledWith(mockInitialRunnable);
  });

  it("applies selected styles when isSelected is true", () => {
    render(
      <RunnableItem
        {...defaultProps}
        isSelected={true}
      />
    );

    const item = screen.getByTestId("runnable-item");
    expect(item).toHaveStyle({ 
      backgroundColor: "#E2E8F0"  // This is the hex value for gray.100
    });
  });

  it("pluralizes inputs text correctly", () => {
    const { rerender } = render(<RunnableItem {...defaultProps} />);
    expect(screen.getByText("2 inputs")).toBeInTheDocument();

    rerender(
      <RunnableItem
        {...defaultProps}
        runnable={mockSecondaryRunnable}
      />
    );
    expect(screen.getByText("1 input")).toBeInTheDocument();

    rerender(
      <RunnableItem
        {...defaultProps}
        runnable={{ ...mockInitialRunnable, inputs: [] }}
      />
    );
    expect(screen.getByText("0 inputs")).toBeInTheDocument();
  });
}); 