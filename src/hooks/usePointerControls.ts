import React, { useCallback, useEffect, useRef } from "react";
import { screenToWorld, type Camera } from "../canvas/camera";
import type { ToolType } from "../canvas/types";

interface PointerControlProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  camera: Camera;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
  currentTool: ToolType;
  forcePan: boolean;
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
  zoomAt: (delta: number, x: number, y: number) => void;
}

export function usePointerControls({
  canvasRef,
  camera,
  setCamera,
  currentTool,
  forcePan,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  zoomAt,
}: PointerControlProps) {
  const isMiddlePanRef = useRef(false);
  const isPointerDown = useRef(false);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(
    new Map(),
  );
  const lastMidpoint = useRef<{ x: number; y: number } | null>(null);
  const lastDistance = useRef<number | null>(null);

  const getScreenPos = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      const { x, y } = getScreenPos(e);

      if (e.ctrlKey) {
        zoomAt(e.deltaY, x, y);
        return;
      }

      let dx = e.deltaX;
      let dy = e.deltaY;

      if (e.shiftKey) {
        dx = e.deltaY;
        dy = 0;
      }

      setCamera((c) => ({
        ...c,
        x: c.x - dx,
        y: c.y - dy,
      }));
    };

    canvas.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", wheelHandler);
    };
  }, [zoomAt, setCamera, canvasRef, getScreenPos]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only allow left click for mouse
    const isMouse = e.pointerType === "mouse";
    const isLeftClick = e.button === 0;
    const isMiddleClick = e.button === 1;

    // Middle click always pans
    if (isMouse && isMiddleClick) {
      isMiddlePanRef.current = true;
      isPointerDown.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      const { x, y } = getScreenPos(e);
      onPointerDown(x, y, { forcePan: true });
      return;
    }

    // Block right click
    if (isMouse && !isLeftClick) return;

    isPointerDown.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);

    if (currentTool === "text") {
      e.preventDefault();
    }

    const { x, y } = getScreenPos(e);
    activePointers.current.set(e.pointerId, { x, y });

    // Left click pan (space or pan tool)
    if (forcePan || currentTool === "pan") {
      onPointerDown(x, y);
      return;
    }

    if (currentTool === "text") {
      onPointerDown(x, y);
      return;
    }

    const world = screenToWorld(x, y, camera);
    onPointerDown(world.x, world.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;

    const { x, y } = getScreenPos(e);
    activePointers.current.set(e.pointerId, { x, y });

    // Middle click pan
    if (isMiddlePanRef.current) {
      onPointerMove(x, y, { forcePan: true });
      return;
    }

    if (forcePan || currentTool === "pan") {
      onPointerMove(x, y); // screen space
      return;
    }

    if (activePointers.current.size === 2) {
      const pointers = Array.from(activePointers.current.values());
      const p1 = pointers[0];
      const p2 = pointers[1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      if (!lastDistance.current) {
        lastMidpoint.current = { x: midX, y: midY };
        lastDistance.current = distance;
        return;
      }

      const dx = midX - lastMidpoint.current!.x;
      const dy = midY - lastMidpoint.current!.y;

      const scale = distance / (lastDistance.current || distance);

      setCamera((c) => {
        const newZoom = Math.min(Math.max(c.zoom * scale, 0.2), 5);

        const zoomRatio = newZoom / c.zoom;

        return {
          zoom: newZoom,
          x: midX - (midX - (c.x + dx)) * zoomRatio,
          y: midY - (midY - (c.y + dy)) * zoomRatio,
        };
      });

      lastMidpoint.current = { x: midX, y: midY };
      lastDistance.current = distance;
      return;
    }

    const world = screenToWorld(x, y, camera);
    onPointerMove(world.x, world.y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isMiddlePanRef.current) {
      onPointerUp({ forcePan: true });
      isMiddlePanRef.current = false;
    } else {
      onPointerUp();
    }
    isPointerDown.current = false;
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) {
      lastMidpoint.current = null;
      lastDistance.current = null;
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) =>
    e.preventDefault();

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    // onWheel: handleWheel,
    onContextMenu: handleContextMenu,
  };
}
