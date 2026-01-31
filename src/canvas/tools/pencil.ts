import type { ToolHandler } from "../tools";
import type { DrawingElement } from "../types";

export const pencilTool: ToolHandler = {
  onMouseDown(x, y, ctx) {
    const element: DrawingElement = {
      id: ctx.generateId(),
      type: "pencil",
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      points: [{ x: x, y: y }],
      stroke: ctx.defaultStroke,
    };

    ctx.setCurrentElement(element);
    // return;
  },

  onMouseMove(x, y, ctx) {
    ctx.setCurrentElement((prev) => {
      if (!prev || prev.type !== "pencil" || !prev.points) return prev;

      return {
        ...prev,
        points: [...prev.points, { x, y }],
        x2: x,
        y2: y,
      };
    });
    //   return;
  },

  onMouseUp(ctx) {
    if (!ctx.currentElement) return;

    ctx.commit([...ctx.elements, ctx.currentElement]);
    ctx.setCurrentElement(null);
  },
};
