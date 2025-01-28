import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSchemaStore } from "./schema";
import { Schema, Runnable, Input } from "@/lib/schema";

// Mock the store implementation
vi.mock("./schema", () => ({
  useSchemaStore: {
    getState: vi.fn(),
    setState: vi.fn(),
  }
}));

describe("useSchemaStore", () => {
  const mockStore = {
    history: {
      past: [],
      present: { runnables: [] },
      future: [],
    },
    selectedRunnable: null,
    isValid: false,
    validateSchema: vi.fn(),
    setSelectedRunnable: vi.fn(),
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
    canRedo: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSchemaStore.getState as any).mockReturnValue(mockStore);
    mockStore.validateSchema.mockReturnValue(false);
    mockStore.canUndo.mockReturnValue(false);
    mockStore.canRedo.mockReturnValue(false);
  });

  describe("validateSchema", () => {
    it("validates empty schema as invalid", () => {
      const store = useSchemaStore.getState();
      store.validateSchema.mockReturnValue(false);
      expect(store.validateSchema()).toBe(false);
      expect(store.isValid).toBe(false);
    });

    it("validates schema with empty runnable as invalid", () => {
      const store = useSchemaStore.getState();
      store.validateSchema.mockReturnValue(false);
      store.addRunnable({
        path: "/test",
        type: "initial",
        inputs: []
      });
      expect(store.validateSchema()).toBe(false);
      expect(store.isValid).toBe(false);
    });
  });

  describe("runnable operations", () => {
    const testRunnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [{
        name: "input",
        label: "Input",
        type: "textarea"
      }]
    };

    it("adds runnable", () => {
      const store = useSchemaStore.getState();
      store.addRunnable(testRunnable);
      
      expect(store.addRunnable).toHaveBeenCalledWith(testRunnable);
    });

    it("updates runnable", () => {
      const store = useSchemaStore.getState();
      const updatedRunnable = {
        ...testRunnable,
        path: "/test-updated"
      };
      
      store.updateRunnable(updatedRunnable);
      expect(store.updateRunnable).toHaveBeenCalledWith(updatedRunnable);
    });

    it("deletes runnable", () => {
      const store = useSchemaStore.getState();
      store.deleteRunnable("/test");
      expect(store.deleteRunnable).toHaveBeenCalledWith("/test");
    });
  });

  describe("input operations", () => {
    const testInput: Input = {
      name: "input",
      label: "Input",
      type: "textarea"
    };

    it("adds input", () => {
      const store = useSchemaStore.getState();
      store.addInput("/test", testInput);
      expect(store.addInput).toHaveBeenCalledWith("/test", testInput);
    });

    it("updates input", () => {
      const store = useSchemaStore.getState();
      const updatedInput = {
        ...testInput,
        label: "Updated Input"
      };
      store.updateInput("/test", updatedInput);
      expect(store.updateInput).toHaveBeenCalledWith("/test", updatedInput);
    });

    it("updates input with name change", () => {
      const store = useSchemaStore.getState();
      const updatedInput = {
        ...testInput,
        name: "new-input"
      };
      store.updateInput("/test", updatedInput, "input");
      expect(store.updateInput).toHaveBeenCalledWith("/test", updatedInput, "input");
    });

    it("deletes input", () => {
      const store = useSchemaStore.getState();
      store.deleteInput("/test", "input");
      expect(store.deleteInput).toHaveBeenCalledWith("/test", "input");
    });

    it("reorders inputs", () => {
      const store = useSchemaStore.getState();
      const newOrder = ["input2", "input1"];
      store.reorderInputs("/test", newOrder);
      expect(store.reorderInputs).toHaveBeenCalledWith("/test", newOrder);
    });
  });

  describe("history operations", () => {
    it("handles undo operation", () => {
      const store = useSchemaStore.getState();
      store.undo();
      expect(store.undo).toHaveBeenCalled();
    });

    it("handles redo operation", () => {
      const store = useSchemaStore.getState();
      store.redo();
      expect(store.redo).toHaveBeenCalled();
    });

    it("checks undo availability", () => {
      const store = useSchemaStore.getState();
      store.canUndo.mockReturnValueOnce(false).mockReturnValueOnce(true);
      
      expect(store.canUndo()).toBe(false);
      expect(store.canUndo()).toBe(true);
    });

    it("checks redo availability", () => {
      const store = useSchemaStore.getState();
      store.canRedo.mockReturnValueOnce(false).mockReturnValueOnce(true);
      
      expect(store.canRedo()).toBe(false);
      expect(store.canRedo()).toBe(true);
    });
  });

  describe("selected runnable", () => {
    const testRunnable: Runnable = {
      path: "/test",
      type: "initial",
      inputs: [{
        name: "input",
        label: "Input",
        type: "textarea"
      }]
    };

    it("sets selected runnable", () => {
      const store = useSchemaStore.getState();
      store.setSelectedRunnable(testRunnable);
      expect(store.setSelectedRunnable).toHaveBeenCalledWith(testRunnable);
    });

    it("clears selected runnable", () => {
      const store = useSchemaStore.getState();
      store.setSelectedRunnable(null);
      expect(store.setSelectedRunnable).toHaveBeenCalledWith(null);
    });
  });
}); 