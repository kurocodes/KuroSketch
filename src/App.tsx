import { useEffect, useRef, useState, type MouseEvent } from "react";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { type ToolType } from "./canvas/types";
import { drawElement } from "./canvas/renderer";
import useHistory from "./hooks/useHistory";
import { useKeyboard } from "./hooks/useKeyboard";
import { useCanvas } from "./hooks/useCanvas";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);

  const { elements, setHistory, commit, undo, redo } = useHistory();
  const [currentTool, setCurrentTool] = useState<ToolType>("text");
  const { currentElement, onMouseDown, onMouseMove, onMouseUp } = useCanvas({
    elements,
    currentTool,
    commit,
    setHistory,
  });

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

      elements.forEach((element) => {
        drawElement(element, roughCanvas, ctx);
      });

      if (currentElement) {
        drawElement(currentElement, roughCanvas, ctx);
      }
    };

    render();
  }, [elements, currentElement, roughCanvas]);

  useKeyboard(setCurrentTool, undo, redo);

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    onMouseDown(mouseX, mouseY);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    onMouseMove(mouseX, mouseY);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        style={{ display: "block", backgroundColor: "#fdfdfd" }}
      />
    </div>
  );
}
