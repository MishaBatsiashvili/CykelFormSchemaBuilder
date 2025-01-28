import { describe, it, expect, vi } from "vitest";
import { useAvailableOutputKeys } from "./useAvailableOutputKeys";
import { useSchemaStore } from "@/store/schema";
import { renderHook } from "@testing-library/react";

// Mock the schema store
vi.mock("@/store/schema", () => ({
  useSchemaStore: vi.fn()
}));

describe("useAvailableOutputKeys", () => {
  it("returns empty array when no runnables exist", () => {
    const mockState = {
      history: {
        present: {
          runnables: []
        }
      }
    };
    
    (useSchemaStore as any).mockImplementation((selector) => 
      selector(mockState)
    );

    const { result } = renderHook(() => useAvailableOutputKeys());
    
    expect(result.current.availableOutputKeys).toEqual([]);
    expect(result.current.schemaState).toEqual(mockState.history.present);
  });

  it("filters initial runnables and maps their output keys", () => {
    const mockState = {
      history: {
        present: {
          runnables: [
            {
              type: "initial",
              inputs: [
                { label: "Input 1", outputKey: "output1" },
                { label: "Input 2", outputKey: "output2" }
              ]
            },
            {
              type: "secondary",
              inputs: [
                { label: "Input 3", outputKey: "output3" }
              ]
            }
          ]
        }
      }
    };
    
    (useSchemaStore as any).mockImplementation((selector) => 
      selector(mockState)
    );

    const { result } = renderHook(() => useAvailableOutputKeys());
    
    expect(result.current.availableOutputKeys).toEqual([
      { label: "Input 1 (output1)", value: "output1" },
      { label: "Input 2 (output2)", value: "output2" }
    ]);
  });

  it("filters out inputs without output keys", () => {
    const mockState = {
      history: {
        present: {
          runnables: [
            {
              type: "initial",
              inputs: [
                { label: "Input 1", outputKey: "output1" },
                { label: "Input 2" },
                { label: "Input 3", outputKey: "" }
              ]
            }
          ]
        }
      }
    };
    
    (useSchemaStore as any).mockImplementation((selector) => 
      selector(mockState)
    );

    const { result } = renderHook(() => useAvailableOutputKeys());
    
    expect(result.current.availableOutputKeys).toEqual([
      { label: "Input 1 (output1)", value: "output1" }
    ]);
  });

  it("handles multiple initial runnables", () => {
    const mockState = {
      history: {
        present: {
          runnables: [
            {
              type: "initial",
              inputs: [
                { label: "Input 1", outputKey: "output1" }
              ]
            },
            {
              type: "initial",
              inputs: [
                { label: "Input 2", outputKey: "output2" }
              ]
            }
          ]
        }
      }
    };
    
    (useSchemaStore as any).mockImplementation((selector) => 
      selector(mockState)
    );

    const { result } = renderHook(() => useAvailableOutputKeys());
    
    expect(result.current.availableOutputKeys).toEqual([
      { label: "Input 1 (output1)", value: "output1" },
      { label: "Input 2 (output2)", value: "output2" }
    ]);
  });

  it("returns empty array for non-initial runnables with output keys", () => {
    const mockState = {
      history: {
        present: {
          runnables: [
            {
              type: "secondary",
              inputs: [
                { label: "Input 1", outputKey: "output1" }
              ]
            }
          ]
        }
      }
    };
    
    (useSchemaStore as any).mockImplementation((selector) => 
      selector(mockState)
    );

    const { result } = renderHook(() => useAvailableOutputKeys());
    
    expect(result.current.availableOutputKeys).toEqual([]);
  });
}); 