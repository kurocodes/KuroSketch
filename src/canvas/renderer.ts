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

  if (element.roughElement) {
    rc.draw(element.roughElement);
    return;
  }
}
