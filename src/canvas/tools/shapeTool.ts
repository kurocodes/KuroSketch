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
        stroke: ctx.defaultStroke,
        seed: Math.floor(Math.random() * 1000000),
      };

      ctx.setCurrentElement(element);
    },

    onPointerMove(x, y, ctx) {
      ctx.setCurrentElement((prev) => {
        if (!prev || prev.type !== type || !ctx.roughGenerator) return prev;

        const updated = {
          ...prev,
          x2: x,
          y2: y,
        };

        const g = ctx.roughGenerator;

        switch (type) {
          case "line":
            updated.roughElement = g.line(
              updated.x1,
              updated.y1,
              updated.x2,
              updated.y2,
              {
                stroke: updated.stroke,
                seed: updated.seed,
              },
            );
            break;

          case "rect":
            updated.roughElement = g.rectangle(
              Math.min(updated.x1, updated.x2),
              Math.min(updated.y1, updated.y2),
              Math.abs(updated.x2 - updated.x1),
              Math.abs(updated.y2 - updated.y1),
              { stroke: updated.stroke, seed: updated.seed },
            );
            break;

          case "ellipse": {
            const minX = Math.min(updated.x1, updated.x2);
            const minY = Math.min(updated.y1, updated.y2);
            const width = Math.abs(updated.x2 - updated.x1);
            const height = Math.abs(updated.y2 - updated.y1);

            const centerX = minX + width / 2;
            const centerY = minY + height / 2;

            updated.roughElement = g.ellipse(centerX, centerY, width, height, {
              stroke: updated.stroke,
              seed: updated.seed,
            });
            break;
          }
        }

        return updated;
      });
    },

    onPointerUp(ctx) {
      if (!ctx.currentElement || !ctx.roughGenerator) return;

      const el = ctx.currentElement;
      const g = ctx.roughGenerator;

      switch (type) {
        case "line":
          el.roughElement = g.line(el.x1, el.y1, el.x2, el.y2, {
            stroke: el.stroke,
            seed: el.seed,
          });
          break;

        case "rect":
          el.roughElement = g.rectangle(
            Math.min(el.x1, el.x2),
            Math.min(el.y1, el.y2),
            Math.abs(el.x2 - el.x1),
            Math.abs(el.y2 - el.y1),
            { stroke: el.stroke, seed: el.seed },
          );
          break;

        case "ellipse": {
          const minX = Math.min(el.x1, el.x2);
          const minY = Math.min(el.y1, el.y2);
          const width = Math.abs(el.x2 - el.x1);
          const height = Math.abs(el.y2 - el.y1);

          const centerX = minX + width / 2;
          const centerY = minY + height / 2;

          el.roughElement = g.ellipse(centerX, centerY, width, height, {
            stroke: el.stroke,
            seed: el.seed,
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
export const ellipseTool = createShapeTool("ellipse");
