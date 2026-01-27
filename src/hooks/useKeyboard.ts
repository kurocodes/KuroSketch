import { useEffect } from "react";
import type { ToolType } from "../canvas/types";


export function useKeyboard(setTool: (tool: ToolType) => void, undo: () => void, redo: () => void) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "l") setTool("line");
            if (e.key === "r") setTool("rect");
            if (e.key === "c") setTool("circle");
            if (e.key === "p") setTool("pencil");
            if (e.key === "t") setTool("text");
            if (e.key === "s") setTool("selection");
            if (e.key === "e") setTool("eraser");

            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                undo();
            }

            if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
                e.preventDefault();
                redo();
            }
        }

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);
}