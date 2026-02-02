import { useState } from "react";
import type { ToolType } from "./canvas/types";
import useHistory from "./hooks/useHistory";
import { useCamera } from "./hooks/useCamera";
import { useTheme } from "./hooks/useTheme";
import { useCanvas } from "./hooks/useCanvas";
import { useKeyboard } from "./hooks/useKeyboard";
import CanvasStage from "./components/canvas/CanvasStage";
import ThemeToggle from "./components/controls/ThemeToggle";

export default function App() {
  // global editor state
  const [currentTool, setCurrentTool] = useState<ToolType>("rect");

  // engine hooks
  const history = useHistory();
  const camera = useCamera();
  const theme = useTheme();

  const canvas = useCanvas({
    elements: history.elements,
    currentTool,
    commit: history.commit,
    preview: history.preview,
    setHistory: history.setHistory,
    defaultStroke: theme.colors.defaultStroke,
  });

  // keyboard shortcuts
  useKeyboard(setCurrentTool, history.undo, history.redo);

  return (
    <>
      {/* CANVAS */}
      <CanvasStage
        elements={history.elements}
        currentElement={canvas.currentElement}
        onMouseDown={canvas.onMouseDown}
        onMouseMove={canvas.onMouseMove}
        onMouseUp={canvas.onMouseUp}
        camera={camera.camera}
        startPan={camera.startPan}
        pan={camera.pan}
        endPan={camera.endPan}
        zoomAt={camera.zoomAt}
        canvasBg={theme.colors.canvasBg}
      />

      {/* UI LAYER */}
      <ThemeToggle mode={theme.mode} toggleTheme={theme.toggleTheme} />
    </>
  );
}
