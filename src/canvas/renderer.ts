import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement } from "./types";

export function drawElement(
  element: DrawingElement,
  rc: RoughCanvas,
  ctx: CanvasRenderingContext2D,
) {
  // TEXT (unchanged)
  if (element.type === "text") {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = element.stroke ?? "#000";
    ctx.textBaseline = "top";
    ctx.fillText(element.text ?? "", element.x1, element.y1);
    return;
  }

  // 🔒 COMMITTED element (fast path)
  if (element.roughElement) {
    rc.draw(element.roughElement);
    return;
  }

  // 🔥 PREVIEW element (selection drag OR drawing)
  switch (element.type) {
    case "line":
      rc.line(element.x1, element.y1, element.x2, element.y2, {
        stroke: element.stroke,
      });
      break;

    case "rect":
      rc.rectangle(
        Math.min(element.x1, element.x2),
        Math.min(element.y1, element.y2),
        Math.abs(element.x2 - element.x1),
        Math.abs(element.y2 - element.y1),
        { stroke: element.stroke },
      );
      break;

    case "ellipse": {
      const minX = Math.min(element.x1, element.x2);
      const minY = Math.min(element.y1, element.y2);
      const width = Math.abs(element.x2 - element.x1);
      const height = Math.abs(element.y2 - element.y1);

      const centerX = minX + width / 2;
      const centerY = minY + height / 2;

      rc.ellipse(centerX, centerY, width, height, {
        stroke: element.stroke,
      });

      break;
    }

    case "pencil":
      if (!element.points) return;
      rc.linearPath(
        element.points.map((p) => [p.x, p.y]),
        { stroke: element.stroke },
      );
      break;
  }
}
