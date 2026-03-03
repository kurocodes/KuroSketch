import type { ToolHandler } from "../tools";
import type { DrawingElement } from "../types";

export const pencilTool: ToolHandler = {
  onPointerDown(x, y, ctx) {
    const element: DrawingElement = {
      id: ctx.generateId(),
      type: "pencil",
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      points: [{ x: x, y: y }],
      stroke: { type: "theme", role: "defaultStroke" },
      seed: Math.floor(Math.random() * 1000000),
    };

    ctx.setCurrentElement(element);
  },

  onPointerMove(x, y, ctx) {
    ctx.setCurrentElement((prev) => {
      if (!prev || prev.type !== "pencil" || !prev.points) return prev;

      const updated = {
        ...prev,
        points: [...prev.points, { x, y }],
        x2: x,
        y2: y,
      };

      return updated;
    });
  },

  onPointerUp(ctx) {
    if (!ctx.currentElement) return;

    ctx.commit([...ctx.elements, ctx.currentElement]);
    ctx.setCurrentElement(null);
  },
};
