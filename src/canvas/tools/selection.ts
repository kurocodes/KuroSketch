import { moveElement } from "../elementUtils";
import { isPointInsideElement } from "../hitTest";
import type { ToolHandler } from "../tools";

export const selectionTool: ToolHandler = {
  onPointerDown(x, y, ctx) {
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

  onPointerMove(x, y, ctx) {
    if (!ctx.lastMousePos.current) return;

    const dx = x - ctx.lastMousePos.current.x;
    const dy = y - ctx.lastMousePos.current.y;

    ctx.preview((prev) =>
      prev.map((el) => {
        if (el.id !== ctx.selectedElement?.id) return el;
        const moved = moveElement(el, dx, dy);
        return moved;
      }),
    );

    ctx.lastMousePos.current = { x, y };
  },

  onPointerUp(ctx) {
    const snapshot = ctx.dragStartSnapshot.current;
    if (!snapshot) return;

    ctx.commit(ctx.elements, snapshot);

    ctx.lastMousePos.current = null;
    ctx.dragStartSnapshot.current = null;
    ctx.setSelectedElement(null);
  },
};
