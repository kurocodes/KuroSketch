import { moveElement } from "../elementUtils";
import { isPointInsideElement } from "../hitTest";
import type { ToolHandler } from "../tools";

export const selectionTool: ToolHandler = {
  onMouseDown(x, y, ctx) {
    for (let i = ctx.elements.length - 1; i >= 0; i--) {
      const el = ctx.elements[i];
      if (isPointInsideElement(x, y, el)) {
        ctx.setSelectedElement(el);
        // ctx.setIsDragging(true);
        ctx.lastMousePos.current = { x, y };
        ctx.dragStartSnapshot.current = ctx.elements.map((el) => ({ ...el }));
        return;
      }
    }

    ctx.setSelectedElement(null);
  },

  onMouseMove(x, y, ctx) {
    if (!ctx.lastMousePos.current) return;

    const dx = x - ctx.lastMousePos.current.x;
    const dy = y - ctx.lastMousePos.current.y;

    ctx.preview((prev) =>
      prev.map(
        (el) => {
          if (el.id !== ctx.selectedElement?.id) return el;

          const moved = moveElement(el, dx, dy);
          const g = ctx.roughGenerator;
          if (!g) return moved;

          switch (moved.type) {
            case "line":
              moved.roughElement = g.line(
                moved.x1,
                moved.y1,
                moved.x2,
                moved.y2,
                { stroke: moved.stroke, seed: moved.seed },
              );
              break;

            case "rect":
              moved.roughElement = g.rectangle(
                Math.min(moved.x1, moved.x2),
                Math.min(moved.y1, moved.y2),
                Math.abs(moved.x2 - moved.x1),
                Math.abs(moved.y2 - moved.y1),
                { stroke: moved.stroke, seed: moved.seed },
              );
              break;

            case "ellipse": {
              const minX = Math.min(moved.x1, moved.x2);
              const minY = Math.min(moved.y1, moved.y2);
              const width = Math.abs(moved.x2 - moved.x1);
              const height = Math.abs(moved.y2 - moved.y1);
              const centerX = minX + width / 2;
              const centerY = minY + height / 2;

              moved.roughElement = g.ellipse(centerX, centerY, width, height, {
                stroke: moved.stroke,
                seed: moved.seed,
              });
              break;
            }

            case "pencil":
              if (moved.points) {
                moved.roughElement = g.linearPath(
                  moved.points.map((p) => [p.x, p.y]),
                  { stroke: moved.stroke, seed: moved.seed },
                );
              }
              break;
          }

          return moved;
        },
      ),
    );

    ctx.lastMousePos.current = { x, y };
  },

  onMouseUp(ctx) {
    const snapshot = ctx.dragStartSnapshot.current;
    if (!snapshot) return;

    const g = ctx.roughGenerator;
    if (!g) return;

    const finalized = ctx.elements.map((el) => {
      if (el.id !== ctx.selectedElement?.id) return el;

      switch (el.type) {
        case "line":
          return {
            ...el,
            roughElement: g.line(el.x1, el.y1, el.x2, el.y2, {
              stroke: el.stroke,
              seed: el.seed
            }),
          };

        case "rect":
          return {
            ...el,
            roughElement: g.rectangle(
              Math.min(el.x1, el.x2),
              Math.min(el.y1, el.y2),
              Math.abs(el.x2 - el.x1),
              Math.abs(el.y2 - el.y1),
              { stroke: el.stroke, seed: el.seed },
            ),
          };

        case "ellipse": {
          const d = Math.max(Math.abs(el.x2 - el.x1), Math.abs(el.y2 - el.y1));
          return {
            ...el,
            roughElement: g.circle(el.x1, el.y1, d, {
              stroke: el.stroke,
              seed: el.seed
            }),
          };
        }

        case "pencil":
          if (!el.points) return el;
          return {
            ...el,
            roughElement: g.linearPath(
              el.points.map((p) => [p.x, p.y]),
              { stroke: el.stroke, seed: el.seed },
            ),
          };

        default:
          return el;
      }
    });

    ctx.commit(finalized, snapshot);

    ctx.lastMousePos.current = null;
    ctx.dragStartSnapshot.current = null;
    ctx.setSelectedElement(null);
  },
};
