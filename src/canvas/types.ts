export type ElementType = "line" | "rect" | "circle" | "pencil" | "text";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: ElementType;

  // Unified geometry
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  // Optional fields
  points?: Point[]; // pencil
  text?: string;
}
