import type { DrawingElement } from "./types";

export function moveElement(
  el: DrawingElement,
  dx: number,
  dy: number,
): DrawingElement {
  const moved: DrawingElement = {
    ...el,
    x1: el.x1 + dx,
    y1: el.y1 + dy,
    x2: el.x2 + dx,
    y2: el.y2 + dy,
    points: el.points?.map((p) => ({
      x: p.x + dx,
      y: p.y + dy,
    })),
  };

  moved.roughElement = undefined;

  return moved;
}

// export function moveElement(element: DrawingElement, dx: number, dy: number): DrawingElement {
//     if (element.type === "pencil" && element.points) {
//         return {
//             ...element,
//             points: element.points.map(p => ({
//                 x: p.x + dx,
//                 y: p.y + dy,
//             })),
//             x1: element.x1 + dx,
//             y1: element.y1 + dy,
//             x2: element.x2 + dx,
//             y2: element.y2 + dy,
//         }
//     }

//     return {
//         ...element,
//         x1: element.x1 + dx,
//         y1: element.y1 + dy,
//         x2: element.x2 + dx,
//         y2: element.y2 + dy,
//     }
// }
