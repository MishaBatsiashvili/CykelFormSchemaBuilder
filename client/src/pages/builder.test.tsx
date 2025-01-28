import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Builder from "./builder";
import { useSchemaStore } from "@/store/schema";

// Mock the store
const defaultState = {
  selectedRunnable: null,
  history: {
    past: [],
    present: { runnables: [] },
    future: []
  },
  setSelectedRunnable: vi.fn(),
  isValid: true,
  validateSchema: vi.fn(),
  addRunnable: vi.fn(),
  updateRunnable: vi.fn(),
  deleteRunnable: vi.fn(),
  addInput: vi.fn(),
  updateInput: vi.fn(),
  deleteInput: vi.fn(),
  reorderInputs: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn(),
  canUndo: vi.fn(),
  canRedo: vi.fn()
};

vi.mock("@/store/schema", () => ({
  useSchemaStore: vi.fn((selector) => selector(defaultState))
}));

// Mock components
vi.mock("@/components/schema/RunnableList/index", () => ({
  default: () => <div data-testid="runnable-list">Runnable List</div>
}));

vi.mock("@/components/schema/RunnableForm/index", () => ({
  default: ({ runnable }: { runnable: any }) => (
    <div data-testid="runnable-form">Runnable Form: {runnable?.id}</div>
  )
}));

vi.mock("@/components/schema/SchemaPreview/index", () => ({
  default: () => <div data-testid="schema-preview">Schema Preview</div>
}));

// Mock Chakra components with style conversion
vi.mock("@chakra-ui/react", () => {
  const styleProps = {
    borderRightWidth: "borderRight",
    borderLeftWidth: "borderLeft",
    textAlign: "textAlign",
    maxW: "maxWidth",
    py: "padding",
    p: "padding",
    w: "width",
    h: "height",
    gap: "gap",
    flex: "flex"
  };

  const convertChakraProps = (props: any) => {
    const { children, ...rest } = props;
    const styles: any = {};
    
    Object.entries(rest).forEach(([key, value]) => {
      if (styleProps[key as keyof typeof styleProps]) {
        const cssKey = styleProps[key as keyof typeof styleProps];
        if (key === 'w' || key === 'maxW') {
          styles[cssKey] = value === "container.xl" ? "1280px" : value;
        } else if (key === 'py') {
          styles[cssKey] = `${Number(value) * 0.25}rem`;
        } else if (key === 'p') {
          styles[cssKey] = `${Number(value) * 0.25}rem`;
        } else if (key === 'gap') {
          styles[cssKey] = `${Number(value) * 0.25}rem`;
        } else if (key.includes("Width")) {
          styles[cssKey] = "1px solid";
        } else {
          styles[cssKey] = value;
        }
      }
    });

    return { style: styles };
  };

  return {
    Box: ({ children, ...props }: any) => (
      <div {...convertChakraProps(props)}>{children}</div>
    ),
    Container: ({ children, ...props }: any) => (
      <div {...convertChakraProps(props)}>{children}</div>
    ),
    Flex: ({ children, ...props }: any) => (
      <div {...convertChakraProps(props)}>{children}</div>
    ),
    Text: ({ children, color, ...props }: any) => (
      <span 
        {...convertChakraProps(props)}
        style={{ 
          ...convertChakraProps(props).style,
          color: color === "gray.500" ? "#718096" : color 
        }}
      >
        {children}
      </span>
    ),
    Card: {
      Root: ({ children, ...props }: any) => (
        <div {...convertChakraProps(props)}>{children}</div>
      )
    }
  };
});

// Mock react-dnd
vi.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  HTML5Backend: {}
}));

describe("Builder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all components in initial state", () => {
    render(<Builder />);
    
    // Check if main components are rendered
    expect(screen.getByTestId("runnable-list")).toBeInTheDocument();
    expect(screen.getByTestId("schema-preview")).toBeInTheDocument();
    
    // Check if the empty state message is shown when no runnable is selected
    expect(screen.getByText("Select or create a runnable to begin")).toBeInTheDocument();
  });

  it("renders RunnableForm when a runnable is selected", () => {
    const mockedUseSchemaStore = vi.mocked(useSchemaStore);
    mockedUseSchemaStore.mockImplementation((selector) => {
      const state = {
        ...defaultState,
        selectedRunnable: {
          path: "test-runnable",
          type: "initial" as const,
          inputs: []
        }
      };
      return selector(state);
    });

    render(<Builder />);
    
    // Check if RunnableForm is rendered instead of empty state
    expect(screen.getByTestId("runnable-form")).toBeInTheDocument();
    expect(screen.queryByText("Select or create a runnable to begin")).not.toBeInTheDocument();
  });

  it("calls setSelectedRunnable with null on mount", () => {
    const setSelectedRunnable = vi.fn();
    const mockedUseSchemaStore = vi.mocked(useSchemaStore);
    mockedUseSchemaStore.mockImplementation((selector) => {
      const state = {
        ...defaultState,
        setSelectedRunnable
      };
      return selector(state);
    });

    render(<Builder />);
    
    // Check if setSelectedRunnable was called with null
    expect(setSelectedRunnable).toHaveBeenCalledWith(null);
  });
}); 