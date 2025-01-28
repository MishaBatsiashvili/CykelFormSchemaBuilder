import { describe, it, expect } from "vitest";
import { calculateDragDirection } from "./utils";

describe("calculateDragDirection", () => {
  // Mock DOMRect for testing
  const createMockRect = (top: number, bottom: number): DOMRect => ({
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => {}
  });

  it("returns false when moving downwards and cursor is above middle", () => {
    const dragIndex = 0;
    const hoverIndex = 1;
    const hoverRect = createMockRect(100, 200); // 100px height element
    const clientOffset = { x: 0, y: 120 }; // 20px from top (less than middle)

    const result = calculateDragDirection(dragIndex, hoverIndex, hoverRect, clientOffset);
    expect(result).toBe(false);
  });

  it("returns true when moving downwards and cursor is below middle", () => {
    const dragIndex = 0;
    const hoverIndex = 1;
    const hoverRect = createMockRect(100, 200);
    const clientOffset = { x: 0, y: 160 }; // 60px from top (more than middle)

    const result = calculateDragDirection(dragIndex, hoverIndex, hoverRect, clientOffset);
    expect(result).toBe(true);
  });

  it("returns false when moving upwards and cursor is below middle", () => {
    const dragIndex = 1;
    const hoverIndex = 0;
    const hoverRect = createMockRect(100, 200);
    const clientOffset = { x: 0, y: 160 }; // 60px from top (more than middle)

    const result = calculateDragDirection(dragIndex, hoverIndex, hoverRect, clientOffset);
    expect(result).toBe(false);
  });

  it("returns true when moving upwards and cursor is above middle", () => {
    const dragIndex = 1;
    const hoverIndex = 0;
    const hoverRect = createMockRect(100, 200);
    const clientOffset = { x: 0, y: 120 }; // 20px from top (less than middle)

    const result = calculateDragDirection(dragIndex, hoverIndex, hoverRect, clientOffset);
    expect(result).toBe(true);
  });

  it("handles exact middle position", () => {
    const hoverRect = createMockRect(100, 200);
    const clientOffset = { x: 0, y: 150 }; // exactly at middle

    // Moving downwards at middle
    expect(calculateDragDirection(0, 1, hoverRect, clientOffset)).toBe(true);
    
    // Moving upwards at middle
    expect(calculateDragDirection(1, 0, hoverRect, clientOffset)).toBe(true);
  });

  it("handles zero-height elements", () => {
    const hoverRect = createMockRect(100, 100); // zero height
    const clientOffset = { x: 0, y: 100 };

    // Should still work without division by zero errors
    expect(calculateDragDirection(0, 1, hoverRect, clientOffset)).toBe(true);
    expect(calculateDragDirection(1, 0, hoverRect, clientOffset)).toBe(true);
  });
}); 