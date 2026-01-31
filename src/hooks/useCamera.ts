import { useRef, useState } from "react";
import { defaultCamera, type Camera } from "../canvas/camera";

export function useCamera() {
  const [camera, setCamera] = useState<Camera>(defaultCamera);

  const isPanning = useRef(false);
  const lastMouse = useRef<{ x: number; y: number } | null>(null);

  const startPan = (x: number, y: number) => {
    isPanning.current = true;
    lastMouse.current = { x, y };
  };

  const pan = (x: number, y: number) => {
    if (!isPanning.current || !lastMouse.current) return;

    const dx = x - lastMouse.current.x;
    const dy = y - lastMouse.current.y;

    setCamera((c) => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy,
    }));

    lastMouse.current = { x, y };
  };

  const endPan = () => {
    isPanning.current = false;
    lastMouse.current = null;
  };

  const zoomAt = (delta: number, mouseX: number, mouseY: number) => {
    setCamera((c) => {
      const zoomFactor = delta > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(c.zoom * zoomFactor, 0.2), 5);

      // zoom toward mouse
      const scale = newZoom / c.zoom;

      return {
        zoom: newZoom,
        x: mouseX - (mouseX - c.x) * scale,
        y: mouseY - (mouseY - c.y) * scale,
      };
    });
  };

  return { camera, startPan, pan, endPan, zoomAt };
}
