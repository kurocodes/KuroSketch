import { moveElement } from "../elementUtils";
import { isPointInsideElement } from "../hitTest";
import type { ToolHandler } from "../tools";
import type { DrawingElement, HistoryState } from "../types";

export const selectionTool: ToolHandler = {
  onMouseDown(x, y, ctx) {
    for (let i = ctx.elements.length - 1; i >= 0; i--) {
      const el = ctx.elements[i];
      if (isPointInsideElement(x, y, el)) {
        ctx.setSelectedElement(el);
        ctx.setIsDragging(true);
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

    ctx.setHistory((h: HistoryState) => ({
      ...h,
      present: h.present.map((el) =>
        el.id === ctx.selectedElement?.id ? moveElement(el, dx, dy) : el,
      ),
    }));

    ctx.lastMousePos.current = { x, y };
    // return;
  },

  onMouseUp(ctx) {
    if (ctx.dragStartSnapshot.current) {
      ctx.setHistory((h: HistoryState) => ({
        ...h,
        past: [...h.past, ctx.dragStartSnapshot.current as DrawingElement[]],
        future: [],
      }));

      ctx.setIsDragging(false);
      ctx.lastMousePos.current = null;
      ctx.dragStartSnapshot.current = null;
    }
  },
};

// if (currentElement) {
//       commit([...elements, currentElement]);
//     }
//     const snapshot = dragStartSnapshot.current;

//     if (snapshot) {
//       setHistory((h) => ({
//         ...h,
//         past: [...h.past, snapshot],
//         future: [],
//       }));
//     }

//     dragStartSnapshot.current = null;
//     setIsDragging(false);
//     lastMousePos.current = null;
//     setCurrentElement(null);
