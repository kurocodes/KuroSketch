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
    // return;
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
    // return;
  },

  onMouseUp(ctx) {
    if (ctx.dragStartSnapshot.current) {
      // commit current elements (already previewed)
      ctx.commit(ctx.elements);
    }

    ctx.lastMousePos.current = null;
    ctx.dragStartSnapshot.current = null;
    ctx.setSelectedElement(null);
  },
};
