import React, { useEffect, useRef } from "react";
import { screenToWorld, type Camera } from "../../canvas/camera";
import type { DrawingElement } from "../../canvas/types";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { useKeyState } from "../../hooks/useKeyState";
import { drawElement } from "../../canvas/renderer";

type Props = {
  elements: DrawingElement[];
  currentElement: DrawingElement | null;

  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: () => void;

  camera: Camera;
  startPan: (x: number, y: number) => void;
  pan: (x: number, y: number) => void;
  endPan: () => void;
  zoomAt: (delta: number, x: number, y: number) => void;

  canvasBg: string;
};

export default function CanvasStage({
  elements,
  currentElement,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  camera,
  startPan,
  pan,
  endPan,
  zoomAt,
  canvasBg,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const roughRef = useRef<RoughCanvas | null>(null);

    const spacePressed = useKeyState(" ");

    // setup (runs once)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        roughRef.current = rough.canvas(canvas);
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

        elements.forEach(el => drawElement(el, rc, ctx));
        if (currentElement) drawElement(currentElement, rc, ctx);

        ctx.restore();
    }, [elements, currentElement, camera]);

    // mouse handlers
    const getScreenPos = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100vw",
                height: "100vh",
                display: "block",
                backgroundColor: canvasBg,
                cursor: spacePressed ? "grab" : "crosshair",
            }}
            onMouseDown={(e) => {
                const { x, y } = getScreenPos(e);

                if (spacePressed) {
                    startPan(x, y);
                    return;
                }

                const world = screenToWorld(x, y, camera);
                onMouseDown(world.x, world.y);
            }}
            onMouseMove={(e) => {
                const { x, y } = getScreenPos(e);

                if (spacePressed && e.buttons === 1) {
                    pan(x, y);
                    return;
                }

                const world = screenToWorld(x, y, camera);
                onMouseMove(world.x, world.y);
            }}
            onMouseUp={() => {
                endPan();
                if (!spacePressed) onMouseUp();
            }}
            onWheel={(e) => {
                e.preventDefault();
                const { x, y } = getScreenPos(e);
                zoomAt(e.deltaY, x, y);
            }}
        />
    )
};
