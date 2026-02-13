import { useEffect } from "react";
import type { ToolType } from "../canvas/types";

export function useKeyboard(
  setTool: (tool: ToolType) => void,
  undo: () => void,
  redo: () => void,
  setForcePan: React.Dispatch<React.SetStateAction<boolean>>,
  isTextEditing: boolean,
) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTextEditing) return;

      if (e.code === "Space") {
        e.preventDefault();
        setForcePan(true);
      }
      if (e.key === "1") setTool("selection");
      if (e.key === "2") setTool("rect");
      if (e.key === "3") setTool("ellipse");
      if (e.key === "4") setTool("line");
      if (e.key === "5") setTool("pencil");
      if (e.key === "6") setTool("text");
      if (e.key === "e") setTool("eraser");

      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setForcePan(false);
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [isTextEditing, undo, redo, setForcePan, setTool]);
}
