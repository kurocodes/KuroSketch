import type React from "react";
import type { DrawingElement, HistoryState } from "./types";
import type { Camera } from "./camera";

export type ToolContext = {
  elements: DrawingElement[];
  currentElement: DrawingElement | null;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<DrawingElement | null>
  >;
  commit: (els: DrawingElement[], pastOverride?: DrawingElement[]) => void;
  preview: (fn: (els: DrawingElement[]) => DrawingElement[]) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;

  // drag helpers
  selectedElement: DrawingElement | null;
  setSelectedElement: (el: DrawingElement | null) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  lastMousePos: React.RefObject<{ x: number; y: number } | null>;
  dragStartSnapshot: React.RefObject<DrawingElement[] | null>;

  generateId: () => string;

  defaultStroke: string;

  // pan helpers
  isPanning: React.RefObject<boolean>;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;

  // text helper
  startTextEditing?: (x: number, y: number) => void;
};

export type ToolHandler = {
  onMouseDown?: (x: number, y: number, ctx: ToolContext) => void;
  onMouseMove?: (x: number, y: number, ctx: ToolContext) => void;
  onMouseUp?: (ctx: ToolContext) => void;
};
