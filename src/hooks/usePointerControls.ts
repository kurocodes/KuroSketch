import React, { useRef } from "react";
import { screenToWorld, type Camera } from "../canvas/camera";
import type { ToolType } from "../canvas/types";

interface PointerControlProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  camera: Camera;
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
  currentTool,
  forcePan,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  zoomAt,
}: PointerControlProps) {
  const isMiddlePanRef = useRef(false);
  const isPointerDown = useRef(false);

  const getScreenPos = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

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

    // Middle click pan
    if (isMiddlePanRef.current) {
      onPointerMove(x, y, { forcePan: true });
      return;
    }

    if (forcePan || currentTool === "pan") {
      onPointerMove(x, y); // screen space
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
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // e.preventDefault();
    const { x, y } = getScreenPos(e);
    zoomAt(e.deltaY, x, y);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) =>
    e.preventDefault();

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onWheel: handleWheel,
    onContextMenu: handleContextMenu,
  };
}
