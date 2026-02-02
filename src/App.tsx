import { useEffect, useRef, useState, type MouseEvent } from "react";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { type ToolType } from "./canvas/types";
import { drawElement } from "./canvas/renderer";
import useHistory from "./hooks/useHistory";
import { useKeyboard } from "./hooks/useKeyboard";
import { useCanvas } from "./hooks/useCanvas";
import { useCamera } from "./hooks/useCamera";
import { screenToWorld } from "./canvas/camera";
import { useKeyState } from "./hooks/useKeyState";
import { useTheme } from "./hooks/useTheme";
import ToggleButton from "./components/ToggleButton";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);

  const { elements, setHistory, commit, preview, undo, redo } = useHistory();
  const [currentTool, setCurrentTool] = useState<ToolType>("text");
  const { mode, colors, toggleTheme } = useTheme();
  const { currentElement, onMouseDown, onMouseMove, onMouseUp } = useCanvas({
    elements,
    currentTool,
    commit,
    preview,
    setHistory,
    defaultStroke: colors.defaultStroke,
  });
  const { camera, startPan, pan, endPan, zoomAt } = useCamera();

  const spacePressed = useKeyState(" ");

  // Setup phase (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // initialize rough.js
    const rc = rough.canvas(canvas);
    setRoughCanvas(rc);
  }, []);

  // Render phase (runs every frame)
  useEffect(() => {
    if (!canvasRef.current || !roughCanvas) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // clear entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.zoom, camera.zoom);

      elements.forEach((element) => {
        drawElement(element, roughCanvas, ctx);
      });

      if (currentElement) {
        drawElement(currentElement, roughCanvas, ctx);
      }

      ctx.restore();
    };

    render();
  }, [elements, currentElement, roughCanvas, camera]);

  useKeyboard(setCurrentTool, undo, redo);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (spacePressed) {
      startPan(screenX, screenY);
      return;
    }

    const { x, y } = screenToWorld(screenX, screenY, camera);
    onMouseDown(x, y);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (spacePressed && e.buttons === 1) {
      pan(screenX, screenY);
      return;
    }

    const { x, y } = screenToWorld(screenX, screenY, camera);
    onMouseMove(x, y);
  };

  const handleMouseUp = () => {
    endPan();
    if (!spacePressed) onMouseUp();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();

          const rect = canvasRef.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          zoomAt(e.deltaY, x, y);
        }}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
          backgroundColor: colors.canvasBg,
        }}
      />

      {/* <div className="fixed top-0 left-4" style={{ backgroundColor: colors.uiBg, color: colors.uiText }}>KuroSketch Logo</div> */}
      <ToggleButton mode={mode} toggleTheme={toggleTheme} />
      <div className="fixed bottom-4 left-4 bg-gray-400">
        Zoom and undo/redo buttons
      </div>
      <div className="fixed bottom-0 left-1/2 bg-green-300">Toolbar</div>
      <div className="fixed bottom-4 right-4 bg-gray-400">Help button</div>
      <div className="fixed right-0 top-1/2 bg-pink-400">
        Social media buttons
      </div>
    </div>
  );
}
