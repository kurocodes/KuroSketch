import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement, StrokeType } from "./types";

export function drawElement(
  element: DrawingElement,
  rc: RoughCanvas,
  ctx: CanvasRenderingContext2D,
  themeColors: { defaultStroke: string },
) {
  function resolveStroke(
    stroke: StrokeType | undefined,
    themeColors: { defaultStroke: string },
  ) {
    if (!stroke) return themeColors.defaultStroke;

    if (stroke.type === "theme") {
      return themeColors[stroke.role];
    }

    return stroke.value;
  }

  const strokeColor = resolveStroke(element.stroke, themeColors);

  // TEXT (unchanged)
  if (element.type === "text") {
    ctx.font = "24px sans-serif";
    ctx.fillStyle = strokeColor;
    ctx.textBaseline = "top";
    ctx.fillText(element.text ?? "", element.x1, element.y1);
    return;
  }

  switch (element.type) {
    case "line":
      rc.line(element.x1, element.y1, element.x2, element.y2, {
        stroke: strokeColor,
        seed: element.seed,
      });
      break;

    case "rect":
      rc.rectangle(
        Math.min(element.x1, element.x2),
        Math.min(element.y1, element.y2),
        Math.abs(element.x2 - element.x1),
        Math.abs(element.y2 - element.y1),
        {
          stroke: strokeColor,
          seed: element.seed,
        },
      );
      break;

    case "ellipse": {
      const minX = Math.min(element.x1, element.x2);
      const minY = Math.min(element.y1, element.y2);
      const width = Math.abs(element.x2 - element.x1);
      const height = Math.abs(element.y2 - element.y1);

      rc.ellipse(minX + width / 2, minY + height / 2, width, height, {
        stroke: strokeColor,
        seed: element.seed,
      });
      break;
    }

    case "pencil": {
      rc.linearPath(
        element.points?.map((p) => [p.x, p.y]) ?? [],
        {
          stroke: strokeColor,
          seed: element.seed,
        },
      );
    }
  }
}
