import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement } from "./canvas/types";
import { drawElement } from "./canvas/renderer";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);

  // Setup phase (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // initialize rough.js
    const rc = rough.canvas(canvas);
    setRoughCanvas(rc);

    // Temprary test data
    setElements([
      {
        id: "rect-1",
        type: "rect",
        x1: 100,
        y1: 100,
        x2: 300,
        y2: 220,
      },
      {
        id: "line-1",
        type: "line",
        x1: 300,
        y1: 300,
        x2: 500,
        y2: 420,
      },
      {
        id: "circle-1",
        type: "circle",
        x1: 100,
        y1: 100,
        x2: 300,
        y2: 220,
      }
    ]);
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
        drawElement(element, roughCanvas);
      })
    };

    render();
  }, [elements, roughCanvas]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ display: "block", backgroundColor: "#fdfdfd" }}
      />
    </div>
  );
}
