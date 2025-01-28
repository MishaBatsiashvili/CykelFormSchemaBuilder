import { create } from 'zustand';
import { Schema, Runnable, Input } from '@/lib/schema';

interface HistoryState {
  past: Schema[];
  present: Schema;
  future: Schema[];
}

interface SchemaState {
  history: HistoryState;
  selectedRunnable: Runnable | null;
  isValid: boolean;
  validateSchema: () => boolean;
  setSelectedRunnable: (runnable: Runnable | null) => void;
  addRunnable: (runnable: Runnable) => void;
  updateRunnable: (runnable: Runnable) => void;
  deleteRunnable: (path: string) => void;
  addInput: (runnablePath: string, input: Input) => void;
  updateInput: (runnablePath: string, input: Input, oldName?: string) => void;
  deleteInput: (runnablePath: string, inputName: string) => void;
  reorderInputs: (runnablePath: string, inputNames: string[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialState: Pick<SchemaState, 'history' | 'selectedRunnable' | 'isValid'> = {
  history: {
    past: [],
    present: { runnables: [] },
    future: [],
  },
  selectedRunnable: null,
  isValid: false,
};

// Helper function to save state to history
const saveToHistory = (state: SchemaState, newPresent: Schema) => {
  const { history } = state;
  return {
    past: [...history.past, history.present],
    present: newPresent,
    future: [],
  };
};

// Helper function to check if a runnable still exists in a schema
const findRunnable = (schema: Schema, path: string): Runnable | null => {
  return schema.runnables.find(r => r.path === path) || null;
};

export const useSchemaStore = create<SchemaState>((set, get) => ({
  ...initialState,

  validateSchema: () => {
    const state = get();
    const constraints = [
      state.history.present.runnables.length > 0,
      state.history.present.runnables.every(runnable => runnable.inputs.length > 0),
      state.history.present.runnables.every(runnable => runnable.inputs.length <= 20)
    ];

    const isValid = constraints.every(Boolean);
    set({ isValid });
    return isValid;
  },

  setSelectedRunnable: (runnable) => set({ selectedRunnable: runnable }),

  addRunnable: (runnable) =>
    set((state) => {
      const newSchema = {
        runnables: [...state.history.present.runnables, runnable],
      };
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: runnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  updateRunnable: (runnable) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.map((r) =>
          r.path === runnable.path ? runnable : r
        ),
      };
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: runnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  deleteRunnable: (path) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.filter((r) => r.path !== path),
      };
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: null,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  addInput: (runnablePath, input) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.map((r) =>
          r.path === runnablePath
            ? { ...r, inputs: [...r.inputs, input] }
            : r
        ),
      };
      const updatedRunnable = newSchema.runnables.find(r => r.path === runnablePath) || null;
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: updatedRunnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  updateInput: (runnablePath, input, oldName) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.map((r) =>
          r.path === runnablePath
            ? {
                ...r,
                inputs: r.inputs.map((i) =>
                  i.name === (oldName || input.name) ? input : i
                ),
              }
            : r
        ),
      };
      const updatedRunnable = newSchema.runnables.find(r => r.path === runnablePath) || null;
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: updatedRunnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  deleteInput: (runnablePath, inputName) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.map((r) =>
          r.path === runnablePath
            ? {
                ...r,
                inputs: r.inputs.filter((i) => i.name !== inputName),
              }
            : r
        ),
      };
      const updatedRunnable = newSchema.runnables.find(r => r.path === runnablePath) || null;
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: updatedRunnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  reorderInputs: (runnablePath, inputNames) =>
    set((state) => {
      const newSchema = {
        runnables: state.history.present.runnables.map((r) =>
          r.path === runnablePath
            ? {
                ...r,
                inputs: inputNames
                  .map((name) => r.inputs.find((i) => i.name === name))
                  .filter(Boolean) as Input[],
              }
            : r
        ),
      };
      const updatedRunnable = newSchema.runnables.find(r => r.path === runnablePath) || null;
      const newState = {
        history: saveToHistory(state, newSchema),
        selectedRunnable: updatedRunnable,
      };
      const isValid = get().validateSchema();
      return { ...newState, isValid };
    }),

  undo: () => set((state) => {
    const { past, present, future } = state.history;
    if (past.length === 0) return state;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    // If there's a selected runnable, check if it still exists in the previous state
    const currentSelectedPath = state.selectedRunnable?.path;
    const updatedSelectedRunnable = currentSelectedPath 
      ? findRunnable(previous, currentSelectedPath)
      : null;

    return {
      history: {
        past: newPast,
        present: previous,
        future: [present, ...future],
      },
      selectedRunnable: updatedSelectedRunnable,
      isValid: get().validateSchema(),
    };
  }),

  redo: () => set((state) => {
    const { past, present, future } = state.history;
    if (future.length === 0) return state;

    const next = future[0];
    const newFuture = future.slice(1);

    // If there's a selected runnable, check if it still exists in the next state
    const currentSelectedPath = state.selectedRunnable?.path;
    const updatedSelectedRunnable = currentSelectedPath 
      ? findRunnable(next, currentSelectedPath)
      : null;

    return {
      history: {
        past: [...past, present],
        present: next,
        future: newFuture,
      },
      selectedRunnable: updatedSelectedRunnable,
      isValid: get().validateSchema(),
    };
  }),

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,
}));