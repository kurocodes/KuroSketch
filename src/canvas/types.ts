import type { Drawable } from "roughjs/bin/core";

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

export interface DrawingElement {
  id: string;
  type: ElementType;

  // Unified geometry
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  // Optional fields
  stroke?: string;

  points?: Point[]; // pencil
  text?: string;

  roughElement?: Drawable;
}

export type HistoryState = {
  past: DrawingElement[][];
  present: DrawingElement[];
  future: DrawingElement[][];
};