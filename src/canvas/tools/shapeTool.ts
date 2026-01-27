import type { ToolHandler } from "../tools";
import type { DrawingElement, ElementType } from "../types";

export function createShapeTool(type: ElementType): ToolHandler {
  return {
    onMouseDown(x, y, ctx) {
      const element: DrawingElement = {
        id: ctx.generateId(),
        type,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      };

      ctx.setCurrentElement(element);
    },

    onMouseMove(x, y, ctx) {
      ctx.setCurrentElement((prev) => {
        if (!prev || prev.type !== type) return prev;

        return {
          ...prev,
          x2: x,
          y2: y,
        };
      });
    },

    onMouseUp(ctx) {
      if (!ctx.currentElement) return;

      ctx.commit([...ctx.elements, ctx.currentElement]);
      ctx.setCurrentElement(null);
    },
  };
}

export const lineTool = createShapeTool("line");
export const rectTool = createShapeTool("rect");
export const circleTool = createShapeTool("circle");
