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
      prev.map((el) =>
        el.id === ctx.selectedElement?.id ? moveElement(el, dx, dy) : el,
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
              { stroke: el.stroke },
            ),
          };

        case "ellipse": {
          const d = Math.max(Math.abs(el.x2 - el.x1), Math.abs(el.y2 - el.y1));
          return {
            ...el,
            roughElement: g.circle(el.x1, el.y1, d, {
              stroke: el.stroke,
            }),
          };
        }

        case "pencil":
          if (!el.points) return el;
          return {
            ...el,
            roughElement: g.linearPath(
              el.points.map((p) => [p.x, p.y]),
              { stroke: el.stroke },
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
