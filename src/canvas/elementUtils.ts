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
