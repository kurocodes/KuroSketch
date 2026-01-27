import type { ToolHandler } from "../tools";

export const textTool: ToolHandler = {
  onMouseDown(x, y, ctx) {
    const text = prompt("Enter text");
    if (!text) return;

    ctx.commit([
      ...ctx.elements,
      {
        id: ctx.generateId(),
        type: "text",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        text,
      },
    ]);
  },
};
