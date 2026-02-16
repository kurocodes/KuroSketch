import type { DrawingElement } from "./types";

export function isPointInsideElement(x: number, y: number, el: DrawingElement) {
  const { minX, minY, maxX, maxY } = getElementBounds(el);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

export function getElementBounds(el: DrawingElement) {
  switch (el.type) {
    case "line":
    case "rect":
    case "ellipse":
      return {
        minX: Math.min(el.x1, el.x2),
        minY: Math.min(el.y1, el.y2),
        maxX: Math.max(el.x1, el.x2),
        maxY: Math.max(el.y1, el.y2),
      };

    case "pencil": {
      if (!el.points || el.points.length === 0) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
      }

      const xs = el.points.map((p) => p.x);
      const ys = el.points.map((p) => p.y);

      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }

    case "text": {
      const width = (el.text?.length ?? 0) * 8; // rough estimate
      const height = 16;

      return {
        minX: el.x1,
        minY: el.y1,
        maxX: el.x1 + width,
        maxY: el.y1 + height,
      };
    }
  }
}
