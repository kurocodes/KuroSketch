import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { ToolType } from "./canvas/types";
import useHistory from "./hooks/useHistory";
import { useCamera } from "./hooks/useCamera";
import { useTheme } from "./hooks/useTheme";
import { useCanvas } from "./hooks/useCanvas";
import { useKeyboard } from "./hooks/useKeyboard";
import CanvasStage from "./components/canvas/CanvasStage";
import ThemeToggle from "./components/controls/ThemeToggle";
import Toolbar from "./components/toolbar/Toolbar";
import ZoomControls from "./components/controls/ZoomControls";
import HistoryControls from "./components/controls/HistoryControls";
import HelpButton from "./components/overlays/HelpButton";
import TextEditor from "./components/overlays/TextEditor";
import { screenToWorld } from "./canvas/camera";
import InfoModal from "./components/overlays/InfoModal";
import type { RoughGenerator } from "roughjs/bin/generator";

export default function App() {
  // global editor state
  const [currentTool, setCurrentTool] = useState<ToolType>("rect");
  const [forcePan, setForcePan] = useState(false);

  const [textEditor, setTextEditor] = useState<{ x: number; y: number } | null>(
    null,
  );
  const isTextEditing = textEditor !== null;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [roughGenerator, setRoughGenerator] = useState<RoughGenerator | null>(
    null,
  );

  // engine hooks
  const history = useHistory();
  const camera = useCamera();
  const theme = useTheme();

  // keyboard shortcuts
  useKeyboard(
    setCurrentTool,
    history.undo,
    history.redo,
    setForcePan,
    isTextEditing,
  );

  const canvas = useCanvas({
    elements: history.elements,
    currentTool,
    commit: history.commit,
    preview: history.preview,
    setHistory: history.setHistory,
    defaultStroke: theme.colors.defaultStroke,
    setCamera: camera.setCamera,
    forcePan,
    startTextEditing: (x, y) => setTextEditor({ x, y }),
    roughGenerator,
  });

  const zoomAtCenter = (delta: number) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    camera.zoomAt(delta, centerX, centerY);
  };

  return (
    <>
      {/* CANVAS */}
      <CanvasStage
        elements={history.elements}
        currentElement={canvas.currentElement}
        currentTool={currentTool}
        onPointerDown={canvas.onPointerDown}
        onPointerMove={canvas.onPointerMove}
        onPointerUp={canvas.onPointerUp}
        camera={camera.camera}
        setCamera={camera.setCamera}
        zoomAt={camera.zoomAt}
        canvasBg={theme.colors.canvasBg}
        forcePan={forcePan}
        toolCursor={canvas.ToolCursor}
        setRoughGenerator={setRoughGenerator}
      />

      {textEditor && (
        <TextEditor
          x={textEditor.x}
          y={textEditor.y}
          onCancel={() => setTextEditor(null)}
          onSubmit={(text) => {
            const world = screenToWorld(
              textEditor.x,
              textEditor.y,
              camera.camera,
            );
            history.commit([
              ...history.elements,
              {
                id: Date.now().toString(),
                type: "text",
                x1: world.x,
                y1: world.y,
                x2: world.x,
                y2: world.y,
                text,
                stroke: theme.colors.defaultStroke,
                seed: Math.floor(Math.random() * 1000000),
              },
            ]);

            setTextEditor(null);
          }}
        />
      )}

      {/* UI LAYER */}
      <ThemeToggle mode={theme.mode} toggleTheme={theme.toggleTheme} />
      <div className="fixed bottom-2 left-2 flex items-start gap-2">
        <ZoomControls
          zoomIn={() => zoomAtCenter(-1)}
          zoomOut={() => zoomAtCenter(1)}
          // zoomPercent={camera.camera.zoom * 100}
          // resetZoom={resetZoom}
        />
        <HistoryControls undo={history.undo} redo={history.redo} />
      </div>
      <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <AnimatePresence>
        <InfoModal open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      </AnimatePresence>
      <HelpButton onClick={() => setIsInfoOpen(true)} />
    </>
  );
}
