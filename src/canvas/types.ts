export type ElementType = "line" | "rect" | "circle" | "pencil" | "text";

// export type ToolType = "line" | "rect" | "circle" | "pencil" | "text" | "selection";

export type ToolType = ElementType | "selection" | "eraser";

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

export type HistoryState = {
  past: DrawingElement[][];
  present: DrawingElement[];
  future: DrawingElement[][]
}
