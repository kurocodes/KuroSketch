import { useEffect, useRef, useState, type MouseEvent } from "react";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement } from "./canvas/types";
import { drawElement } from "./canvas/renderer";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null,
  );

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
      });

      if (currentElement) {
        drawElement(currentElement, roughCanvas);
      }
    };

    render();
  }, [elements, currentElement, roughCanvas]);

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: "line",
      x1: mouseX,
      y1: mouseY,
      x2: mouseX,
      y2: mouseY,
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!currentElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setCurrentElement({
      ...currentElement,
      x2: mouseX,
      y2: mouseY,
    });
  };

  const handleMouseUp = () => {
    if (currentElement) {
      setElements(prev => [...prev, currentElement]);
    }
    setCurrentElement(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ display: "block", backgroundColor: "#fdfdfd" }}
      />
    </div>
  );
}
