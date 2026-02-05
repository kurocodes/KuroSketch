import type { ToolHandler } from "../tools";

export const panTool: ToolHandler = {
    onMouseDown(x, y, ctx) {
        ctx.isPanningRef.current = true;
        ctx.setIsPanning(true);
        ctx.lastMousePos.current = { x, y };
    },

    onMouseMove(x, y, ctx) {
        if (!ctx.isPanningRef.current || !ctx.lastMousePos.current) return;

        const dx = x - ctx.lastMousePos.current.x;
        const dy = y - ctx.lastMousePos.current.y;

        ctx.setCamera((c) => ({
            ...c,
            x: c.x + dx,
            y: c.y + dy
        }));

        ctx.lastMousePos.current = { x, y };
    },

    onMouseUp(ctx) {
        ctx.isPanningRef.current = false;
        ctx.setIsPanning(false);
        ctx.lastMousePos.current = null;
    },
}
