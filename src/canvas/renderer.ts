import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement } from "./types";

export function drawElement(
  element: DrawingElement,
  rc: RoughCanvas,
  ctx: CanvasRenderingContext2D,
) {
  const { x1, y1, x2, y2 } = element;

  switch (element.type) {
    case "line":
      rc.line(x1, y1, x2, y2, {
        seed: Number(element.id),
        stroke: element.stroke ?? "#000",
      });
      break;

    case "rect":
      rc.rectangle(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1),
        { seed: Number(element.id), stroke: element.stroke || "#000" },
      );
      break;

    case "circle": {
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const diameter = Math.max(width, height);

      rc.circle(x1, y1, diameter, {
        seed: Number(element.id),
        stroke: element.stroke ?? "#000",
      });
      break;
    }

    case "pencil": {
      if (!element.points) return;
      rc.linearPath(
        element.points.map((p) => [p.x, p.y]),
        { seed: Number(element.id), stroke: element.stroke ?? "#000" },
      );
      break;
    }

    case "text":
      ctx.font = "16px sans-serif";
      ctx.fillStyle = element.stroke ?? "#000";
      ctx.textBaseline = "top";
      if (element.text) ctx.fillText(element.text, x1, y1);
      break;
  }
}
