export type ElementType = "line" | "rect" | "ellipse" | "pencil" | "text";

export type ToolType =
  | "line"
  | "rect"
  | "ellipse"
  | "pencil"
  | "text"
  | "selection"
  | "eraser"
  | "pan";

export interface Point {
  x: number;
  y: number;
}

export type StrokeType =
  | { type: "theme"; role: "defaultStroke" }
  | { type: "custom"; value: string };

export interface DrawingElement {
  id: string;
  type: ElementType;

  // Unified geometry
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  // Optional fields
  stroke?: StrokeType;

  points?: Point[]; // pencil
  text?: string;

  seed: number;
}

export type HistoryState = {
  past: DrawingElement[][];
  present: DrawingElement[];
  future: DrawingElement[][];
};
