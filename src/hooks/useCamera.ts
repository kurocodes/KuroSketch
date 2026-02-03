import { useState } from "react";
import { defaultCamera, type Camera } from "../canvas/camera";

export function useCamera() {
  const [camera, setCamera] = useState<Camera>(defaultCamera);

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

  return { camera, setCamera, zoomAt };
}
