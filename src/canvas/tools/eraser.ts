import { isPointInsideElement } from "../hitTest";
import type { ToolHandler } from "../tools";


export const eraserTool: ToolHandler = {
    onPointerDown(x, y, ctx) {
        for (let i = ctx.elements.length - 1; i >= 0; i--) {
            const el = ctx.elements[i];
            if (isPointInsideElement(x, y, el)) {
                ctx.commit(ctx.elements.filter(e => e.id !== el.id));
                return;
            }
        }
        // return;
    },
}