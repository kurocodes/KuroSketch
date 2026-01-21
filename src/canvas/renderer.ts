import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement } from "./types";

export function drawElement(element: DrawingElement, rc: RoughCanvas) {
  const { x1, y1, x2, y2 } = element;

  switch (element.type) {
    case "line":
      rc.line(x1, y1, x2, y2);
      break;

    case "rect":
      rc.rectangle(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1),
      );
      break;

    case "circle": {
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const diameter = Math.max(width, height);

      rc.circle(x1, y1, diameter);
      break;
    }

    case "pencil": {
      if (!element.points) return;
      for (let i = 0; i < element.points.length - 1; i++) {
        const p1 = element.points[i];
        const p2 = element.points[i + 1];
        rc.line(p1.x, p1.y, p2.x, p2.y);
      }
      break;
    }

    case "text":
      // TODO: implement text rendering (Phase 6)
      break;
  }
}
