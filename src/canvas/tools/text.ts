import type { ToolHandler } from "../tools";

export const textTool: ToolHandler = {
  onPointerDown(x, y, ctx) {
    ctx.startTextEditing?.(x, y);
  },
};
