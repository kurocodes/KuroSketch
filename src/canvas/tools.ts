import type React from "react";
import type { DrawingElement, HistoryState } from "./types";


export type ToolContext = {
    elements: DrawingElement[];
    setCurrentElement: (el: DrawingElement | null) => void;
    commit: (els: DrawingElement[]) => void;
    setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;

    // drag helpers
    selectedElement: DrawingElement | null;
    setSelectedElement: (el: DrawingElement | null) => void;
    setIsDragging: (v: boolean) => void;
    lastMousePos: React.RefObject<{ x: number; y: number } | null>;
    dragStartSnapshot: React.RefObject<DrawingElement[] | null>;

    generateId: () => string;
}

export type ToolHandler = {
    onMouseDown?: (x: number, y: number, ctx: ToolContext) => void;
    onMouseMove?: (x: number, y: number, ctx: ToolContext) => void;
    onMouseUp?: (ctx: ToolContext) => void;
}