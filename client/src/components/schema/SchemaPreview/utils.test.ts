import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUnfulfilledConstraints, downloadSchema } from "./utils";
import { Schema } from "@/lib/schema";

describe("getUnfulfilledConstraints", () => {
  it("returns constraint when schema has no runnables", () => {
    const schema: Schema = {
      runnables: []
    };

    const constraints = getUnfulfilledConstraints(schema);
    expect(constraints).toContain("At least one runnable is required");
  });

  it("returns constraint when runnable has no inputs", () => {
    const schema: Schema = {
      runnables: [
        {
          path: "/test",
          type: "initial",
          inputs: []
        }
      ]
    };

    const constraints = getUnfulfilledConstraints(schema);
    expect(constraints).toContain('Runnable "/test" has no inputs');
  });

  it("returns constraint when runnable exceeds max inputs", () => {
    const schema: Schema = {
      runnables: [
        {
          path: "/test",
          type: "initial",
          inputs: Array(21).fill({
            name: "input",
            label: "Input",
            type: "textarea"
          })
        }
      ]
    };

    const constraints = getUnfulfilledConstraints(schema);
    expect(constraints).toContain('Runnable "/test" exceeds maximum of 20 inputs');
  });

  it("returns multiple constraints when multiple rules are violated", () => {
    const schema: Schema = {
      runnables: [
        {
          path: "/test1",
          type: "initial",
          inputs: []
        },
        {
          path: "/test2",
          type: "initial",
          inputs: Array(21).fill({
            name: "input",
            label: "Input",
            type: "textarea"
          })
        }
      ]
    };

    const constraints = getUnfulfilledConstraints(schema);
    expect(constraints).toHaveLength(2);
    expect(constraints).toContain('Runnable "/test1" has no inputs');
    expect(constraints).toContain('Runnable "/test2" exceeds maximum of 20 inputs');
  });

  it("returns empty array when all constraints are satisfied", () => {
    const schema: Schema = {
      runnables: [
        {
          path: "/test",
          type: "initial",
          inputs: [
            {
              name: "input",
              label: "Input",
              type: "textarea"
            }
          ]
        }
      ]
    };

    const constraints = getUnfulfilledConstraints(schema);
    expect(constraints).toHaveLength(0);
  });
});

describe("downloadSchema", () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;
  let appendChildMock: ReturnType<typeof vi.fn>;
  let removeChildMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    createObjectURLMock = vi.fn().mockReturnValue("blob:test-url");
    revokeObjectURLMock = vi.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock document.createElement
    clickMock = vi.fn();
    const mockAnchor = {
      href: "",
      download: "",
      click: clickMock
    };
    global.document.createElement = vi.fn().mockReturnValue(mockAnchor);

    // Mock document.body methods
    appendChildMock = vi.fn();
    removeChildMock = vi.fn();
    global.document.body.appendChild = appendChildMock;
    global.document.body.removeChild = removeChildMock;
  });

  it("downloads schema as JSON file", () => {
    const schema: Schema = {
      runnables: [
        {
          path: "/test",
          type: "initial",
          inputs: [
            {
              name: "input",
              label: "Input",
              type: "textarea"
            }
          ]
        }
      ]
    };

    downloadSchema(schema);

    // Verify Blob creation
    expect(createObjectURLMock).toHaveBeenCalledWith(
      expect.any(Blob)
    );

    // Verify link creation and attributes
    const mockAnchor = document.createElement("a");
    expect(mockAnchor.download).toBe("schema.json");
    expect(mockAnchor.href).toBe("blob:test-url");

    // Verify DOM operations
    expect(appendChildMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:test-url");
  });
}); 