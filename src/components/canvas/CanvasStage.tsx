import { useEffect, useRef, type CSSProperties } from "react";
import { type Camera } from "../../canvas/camera";
import type { DrawingElement, ToolType } from "../../canvas/types";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { drawElement } from "../../canvas/renderer";
import type { RoughGenerator } from "roughjs/bin/generator";
import { usePointerControls } from "../../hooks/usePointerControls";

type Props = {
  elements: DrawingElement[];
  currentElement: DrawingElement | null;
  currentTool: ToolType;
  onPointerDown: (
    x: number,
    y: number,
    options?: { forcePan?: boolean },
  ) => void;
  onPointerMove: (
    x: number,
    y: number,
    options?: { forcePan?: boolean },
  ) => void;
  onPointerUp: (options?: { forcePan?: boolean }) => void;
  camera: Camera;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
  zoomAt: (delta: number, x: number, y: number) => void;
  canvasBg: string;
  forcePan: boolean;
  toolCursor: { [key in ToolType]: CSSProperties["cursor"] };
  setRoughGenerator: (generator: RoughGenerator) => void;
};

export default function CanvasStage({
  elements,
  currentElement,
  currentTool,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  camera,
  setCamera,
  zoomAt,
  canvasBg,
  forcePan,
  toolCursor,
  setRoughGenerator,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const roughRef = useRef<RoughCanvas | null>(null);
  const generatorRef = useRef<RoughGenerator | null>(null);

  const pointerHandlers = usePointerControls({
    canvasRef,
    camera,
    setCamera,
    currentTool,
    forcePan,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomAt,
  });

  // setup (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    roughRef.current = rough.canvas(canvas);
    generatorRef.current = rough.generator();
  }, []);

  // render (runs every frame)
  useEffect(() => {
    const canvas = canvasRef.current;
    const rc = roughRef.current;
    if (!canvas || !rc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    elements.forEach((el) => drawElement(el, rc, ctx));
    if (currentElement) drawElement(currentElement, rc, ctx);

    ctx.restore();
  }, [elements, currentElement, camera]);

  useEffect(() => {
    if (generatorRef.current) {
      setRoughGenerator(generatorRef.current);
    }
  }, [setRoughGenerator]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        backgroundColor: canvasBg,
        cursor: toolCursor[currentTool],
        touchAction: "none",
      }}
      {...pointerHandlers}
    />
  );
}
