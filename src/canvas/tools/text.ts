import type { ToolHandler } from "../tools";

export const textTool: ToolHandler = {
  onMouseDown(x, y, ctx) {
    ctx.startTextEditing?.(x, y);
  },
};
