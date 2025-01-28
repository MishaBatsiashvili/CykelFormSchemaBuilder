import { describe, it, expect, vi, beforeEach } from "vitest";
import { useToast, toast } from "./use-toast";
import { toaster } from "@/components/chakra/toaster";

// Mock the toaster
vi.mock("@/components/chakra/toaster", () => ({
  toaster: {
    create: vi.fn(),
    dismiss: vi.fn()
  }
}));

describe("Toast Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useToast hook", () => {
    it("returns toast and dismiss functions", () => {
      const { toast, dismiss } = useToast();
      expect(typeof toast).toBe("function");
      expect(typeof dismiss).toBe("function");
    });

    it("dismiss function is the same as toaster.dismiss", () => {
      const { dismiss } = useToast();
      expect(dismiss).toBe(toaster.dismiss);
    });
  });

  describe("toast function", () => {
    it("creates a toast with default values", () => {
      toast({
        title: "Test Toast"
      });

      expect(toaster.create).toHaveBeenCalledWith({
        title: "Test Toast",
        description: undefined,
        type: "info",
        duration: 5000,
        meta: {
          closable: true
        }
      });
    });

    it("creates a toast with custom values", () => {
      toast({
        title: "Custom Toast",
        description: "Custom Description",
        type: "success",
        duration: 3000,
        isClosable: false
      });

      expect(toaster.create).toHaveBeenCalledWith({
        title: "Custom Toast",
        description: "Custom Description",
        type: "success",
        duration: 3000,
        meta: {
          closable: false
        }
      });
    });

    it("creates an error toast", () => {
      toast({
        title: "Error Toast",
        type: "error"
      });

      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error Toast",
        description: undefined,
        type: "error",
        duration: 5000,
        meta: {
          closable: true
        }
      });
    });

    it("creates a loading toast", () => {
      toast({
        title: "Loading Toast",
        type: "loading"
      });

      expect(toaster.create).toHaveBeenCalledWith({
        title: "Loading Toast",
        description: undefined,
        type: "loading",
        duration: 5000,
        meta: {
          closable: true
        }
      });
    });

    it("handles undefined optional props correctly", () => {
      toast({});

      expect(toaster.create).toHaveBeenCalledWith({
        title: undefined,
        description: undefined,
        type: "info",
        duration: 5000,
        meta: {
          closable: true
        }
      });
    });
  });

  describe("toast dismiss", () => {
    it("calls toaster.dismiss", () => {
      const { dismiss } = useToast();
      dismiss();
      expect(toaster.dismiss).toHaveBeenCalled();
    });

    it("can dismiss specific toast by id", () => {
      const { dismiss } = useToast();
      const toastId = "test-toast-id";
      dismiss(toastId);
      expect(toaster.dismiss).toHaveBeenCalledWith(toastId);
    });
  });
}); 