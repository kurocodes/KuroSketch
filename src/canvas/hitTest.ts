import type { DrawingElement } from "./types";

// const distanceFromPointToLine = (
//   x: number,
//   y: number,
//   line: DrawingElement,
// ) => {
//   const A = x - line.x1;
//   const B = y - line.y1;
//   const C = line.x2 - line.x1;
//   const D = line.y2 - line.y1;

//   const dot = A * C + B * D;
//   const lenSq = C ** 2 + D ** 2;
//   let param = -1;

//   if (lenSq !== 0) param = dot / lenSq;

//   let xx, yy;

//   if (param < 0) {
//     xx = line.x1;
//     yy = line.y1;
//   } else if (param > 1) {
//     xx = line.x2;
//     yy = line.y2;
//   } else {
//     xx = line.x1 + param * C;
//     yy = line.y1 + param * D;
//   }

//   const dx = x - xx;
//   const dy = y - yy;

//   return Math.sqrt(dx ** 2 + dy ** 2);
// };

// export const isPointInsideElement = (
//   x: number,
//   y: number,
//   element: DrawingElement,
// ): boolean => {
//   switch (element.type) {
//     case "line": {
//       const distance = distanceFromPointToLine(x, y, element);
//       return distance < 6; // 6 = arbitrary threshold/tolerance
//     }

//     case "rect": {
//       const minX = Math.min(element.x1, element.x2);
//       const minY = Math.min(element.y1, element.y2);
//       const maxX = Math.max(element.x1, element.x2);
//       const maxY = Math.max(element.y1, element.y2);
//       return x >= minX && x <= maxX && y >= minY && y <= maxY;
//     }

//     case "circle": {
//       const centerX = (element.x1 + element.x2) / 2;
//       const centerY = (element.y1 + element.y2) / 2;
//       const radius =
//         Math.sqrt(
//           (element.x2 - element.x1) ** 2 + (element.y2 - element.y1) ** 2,
//         ) / 2;
//       return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
//     }

//     // temporary solution
//     case "pencil": {
//       if (!element.points) return false;
//       return element.points.some((p) => Math.hypot(p.x - x, p.y - y) < 5);
//     }

//     // temporary solution
//     case "text": {
//       return (
//         x >= element.x1 &&
//         x <= element.x1 + 100 &&
//         y >= element.y1 &&
//         y <= element.y1 + 20
//       );
//     }
//   }
// };

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
