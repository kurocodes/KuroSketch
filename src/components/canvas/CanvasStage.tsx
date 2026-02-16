import React, { useEffect, useRef, type CSSProperties } from "react";
import { screenToWorld, type Camera } from "../../canvas/camera";
import type { DrawingElement, ToolType } from "../../canvas/types";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { drawElement } from "../../canvas/renderer";
import type { RoughGenerator } from "roughjs/bin/generator";

type Props = {
  elements: DrawingElement[];
  currentElement: DrawingElement | null;
  currentTool: ToolType;
  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: () => void;
  camera: Camera;
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
  onMouseDown,
  onMouseMove,
  onMouseUp,
  camera,
  zoomAt,
  canvasBg,
  forcePan,
  toolCursor,
  setRoughGenerator,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const roughRef = useRef<RoughCanvas | null>(null);
  const generatorRef = useRef<RoughGenerator | null>(null);
  const isPointerDown = useRef(false);

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

  // mouse handlers
  const getScreenPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

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
      onPointerDown={(e) => {
        isPointerDown.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);

        if (currentTool === "text") {
          e.preventDefault();
        }

        const { x, y } = getScreenPos(e);

        if (forcePan || currentTool === "pan") {
          onMouseDown(x, y);
          return;
        }

        if (currentTool === "text") {
          onMouseDown(x, y);
          return;
        }

        const world = screenToWorld(x, y, camera);
        onMouseDown(world.x, world.y);
      }}

      onPointerMove={(e) => {
        if (!isPointerDown.current) return;
        const { x, y } = getScreenPos(e);

        if (forcePan || currentTool === "pan") {
          onMouseMove(x, y); // screen space
          return;
        }

        const world = screenToWorld(x, y, camera);
        onMouseMove(world.x, world.y);
      }}

      onPointerUp={(e) => {
        isPointerDown.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
        onMouseUp();
      }}
      onWheel={(e) => {
        // e.preventDefault();
        const { x, y } = getScreenPos(e);
        zoomAt(e.deltaY, x, y);
      }}
    />
  );
}
