import { describe, it, expect, vi } from "vitest";
import { RUNNABLE_TYPES, typesCollection, validateUniquePath } from "./utils";
import { useSchemaStore } from "@/store/schema";

// Mock createListCollection
vi.mock("@chakra-ui/react", () => ({
  createListCollection: ({ items }: any) => ({
    items,
    getItem: (value: string) => items.find((item: any) => item.value === value),
    getDisplayValue: (value: string) => {
      const item = items.find((item: any) => item.value === value);
      return item ? item.label : value;
    }
  })
}));

// Mock the schema store
vi.mock("@/store/schema", () => ({
  useSchemaStore: {
    getState: vi.fn(() => ({
      history: {
        present: {
          runnables: [
            { path: "/existing/path", type: "initial" },
            { path: "/another/path", type: "secondary" }
          ]
        }
      }
    }))
  }
}));

describe("RunnableList utils", () => {
  describe("RUNNABLE_TYPES", () => {
    it("contains initial and secondary types", () => {
      expect(RUNNABLE_TYPES).toEqual([
        { label: "Initial", value: "initial" },
        { label: "Secondary", value: "secondary" }
      ]);
    });
  });

  describe("typesCollection", () => {
    it("can get item by value", () => {
      const initialType = typesCollection.getItem("initial");
      expect(initialType).toEqual({ label: "Initial", value: "initial" });

      const secondaryType = typesCollection.getItem("secondary");
      expect(secondaryType).toEqual({ label: "Secondary", value: "secondary" });
    });

    it("returns undefined for non-existent value", () => {
      const nonExistentType = typesCollection.getItem("invalid");
      expect(nonExistentType).toBeUndefined();
    });

    it("can get display value", () => {
      const initialLabel = typesCollection.getDisplayValue("initial");
      expect(initialLabel).toBe("Initial");

      const secondaryLabel = typesCollection.getDisplayValue("secondary");
      expect(secondaryLabel).toBe("Secondary");
    });

    it("returns original value for non-existent display value", () => {
      const nonExistentLabel = typesCollection.getDisplayValue("invalid");
      expect(nonExistentLabel).toBe("invalid");
    });
  });

  describe("validateUniquePath", () => {
    it("returns false for existing paths", () => {
      expect(validateUniquePath("/existing/path")).toBe(false);
      expect(validateUniquePath("/another/path")).toBe(false);
    });

    it("returns true for unique paths", () => {
      expect(validateUniquePath("/new/path")).toBe(true);
      expect(validateUniquePath("/unique/path")).toBe(true);
    });

    it("is case sensitive", () => {
      expect(validateUniquePath("/EXISTING/PATH")).toBe(true);
    });
  });
}); 