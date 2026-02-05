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
        stroke: ctx.defaultStroke,
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
      if (!ctx.currentElement || !ctx.roughGenerator) return;

      const el = ctx.currentElement;
      const g = ctx.roughGenerator;

      switch (type) {
        case "line":
          el.roughElement = g.line(el.x1, el.y1, el.x2, el.y2, {
            stroke: el.stroke,
          });
          break;

        case "rect":
          el.roughElement = g.rectangle(
            Math.min(el.x1, el.x2),
            Math.min(el.y1, el.y2),
            Math.abs(el.x2 - el.x1),
            Math.abs(el.y2 - el.y1),
            { stroke: el.stroke },
          );
          break;

        case "circle": {
          const diameter = Math.max(
            Math.abs(el.x2 - el.x1),
            Math.abs(el.y2 - el.y1),
          );

          el.roughElement = g.circle(el.x1, el.y1, diameter, {
            stroke: el.stroke,
          });
          break;
        }
      }

      ctx.commit([...ctx.elements, el]);
      ctx.setCurrentElement(null);
    },
  };
}

export const lineTool = createShapeTool("line");
export const rectTool = createShapeTool("rect");
export const circleTool = createShapeTool("circle");
