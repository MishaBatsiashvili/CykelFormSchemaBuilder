import { createListCollection } from "@chakra-ui/react";
import { useSchemaStore } from "@/store/schema";

export const RUNNABLE_TYPES = [
  { label: "Initial", value: "initial" },
  { label: "Secondary", value: "secondary" },
] as const;

export const typesCollection = createListCollection({
  items: RUNNABLE_TYPES,
});

export const validateUniquePath = (path: string): boolean => {
  const runnables = useSchemaStore.getState().history.present.runnables;
  return !runnables.some(r => r.path === path);
}; 