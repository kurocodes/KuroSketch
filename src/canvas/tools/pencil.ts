import type { ToolHandler } from "../tools";
import type { DrawingElement } from "../types";

export const pencilTool: ToolHandler = {
  onPointerDown(x, y, ctx) {
    const element: DrawingElement = {
      id: ctx.generateId(),
      type: "pencil",
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      points: [{ x: x, y: y }],
      stroke: ctx.defaultStroke,
      seed: Math.floor(Math.random() * 1000000),
    };

    ctx.setCurrentElement(element);
    // return;
  },

  onPointerMove(x, y, ctx) {
    ctx.setCurrentElement((prev) => {
      if (
        !prev ||
        prev.type !== "pencil" ||
        !prev.points ||
        !ctx.roughGenerator
      )
        return prev;

      const updated = {
        ...prev,
        points: [...prev.points, { x, y }],
        x2: x,
        y2: y,
      };

      const g = ctx.roughGenerator;
      if (!g) return updated;

      updated.roughElement = g.linearPath(
        updated.points.map((p) => [p.x, p.y]),
        { stroke: updated.stroke,  seed: updated.seed, },
      );

      return updated
    });
  },

  onPointerUp(ctx) {
    if (!ctx.currentElement) return;

    const el = ctx.currentElement;

    if (!el.points) return;

    el.roughElement = ctx.roughGenerator?.linearPath(
      el.points.map((p) => [p.x, p.y]),
      { stroke: el.stroke || "#000",  seed: el.seed, },
    );

    ctx.commit([...ctx.elements, ctx.currentElement]);
    ctx.setCurrentElement(null);
  },
};
