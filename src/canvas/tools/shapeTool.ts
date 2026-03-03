import type { ToolHandler } from "../tools";
import type { DrawingElement, ElementType } from "../types";

export function createShapeTool(type: ElementType): ToolHandler {
  return {
    onPointerDown(x, y, ctx) {
      const element: DrawingElement = {
        id: ctx.generateId(),
        type,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        stroke: { type: "theme", role: "defaultStroke" },
        seed: Math.floor(Math.random() * 1000000),
      };

      ctx.setCurrentElement(element);
    },

    onPointerMove(x, y, ctx) {
      ctx.setCurrentElement((prev) => {
        if (!prev || prev.type !== type) return prev;

        const updated = {
          ...prev,
          x2: x,
          y2: y,
        };

        return updated;
      });
    },

    onPointerUp(ctx) {
      if (!ctx.currentElement) return;

      const el = ctx.currentElement;

      ctx.commit([...ctx.elements, el]);
      ctx.setCurrentElement(null);
    },
  };
}

export const lineTool = createShapeTool("line");
export const rectTool = createShapeTool("rect");
export const ellipseTool = createShapeTool("ellipse");
