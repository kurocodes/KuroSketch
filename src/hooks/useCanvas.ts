import React, { useRef, useState, type CSSProperties } from "react";
import {
  type DrawingElement,
  type HistoryState,
  type ToolType,
} from "../canvas/types";
import type { ToolContext, ToolHandler } from "../canvas/tools";
import { selectionTool } from "../canvas/tools/selection";
import { pencilTool } from "../canvas/tools/pencil";
import { ellipseTool, lineTool, rectTool } from "../canvas/tools/shapeTool";
import { textTool } from "../canvas/tools/text";
import { eraserTool } from "../canvas/tools/eraser";
import { panTool } from "../canvas/tools/pan";
import type { Camera } from "../canvas/camera";
import type { RoughGenerator } from "roughjs/bin/generator";

const tools: Record<ToolType, ToolHandler | undefined> = {
  selection: selectionTool,
  pencil: pencilTool,
  line: lineTool,
  rect: rectTool,
  ellipse: ellipseTool,
  text: textTool,
  eraser: eraserTool,
  pan: panTool,
};

export function useCanvas({
  elements,
  currentTool,
  commit,
  preview,
  setHistory,
  defaultStroke,
  setCamera,
  forcePan,
  startTextEditing,
  roughGenerator,
}: {
  elements: DrawingElement[];
  currentTool: ToolType;
  commit: (els: DrawingElement[]) => void;
  preview: (fn: (els: DrawingElement[]) => DrawingElement[]) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;
  defaultStroke: string;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
  forcePan: boolean;
  startTextEditing?: (x: number, y: number) => void;
  roughGenerator?: RoughGenerator | null;
}) {
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null,
  );
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const dragStartSnapshot = useRef<DrawingElement[] | null>(null);
  const isPanningRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);

  const tool = tools[forcePan ? "pan" : currentTool];

  const panCursor = isPanning ? "grabbing" : "grab";

  //   const generateId = () => `${Date.now()}-${Math.random()}`;
  const generateId = () => Date.now().toString();

  const ctx: ToolContext = {
    elements,
    currentElement,
    setCurrentElement,
    commit,
    preview,
    setHistory,
    selectedElement,
    setSelectedElement,
    isDragging,
    setIsDragging,
    lastMousePos,
    dragStartSnapshot,
    generateId,
    defaultStroke,
    isPanningRef,
    setIsPanning,
    setCamera,
    startTextEditing,
    roughGenerator,
  };

  const onPointerDown = (x: number, y: number) => {
    tool?.onPointerDown?.(x, y, ctx);
  };

  const onPointerMove = (x: number, y: number) => {
    tool?.onPointerMove?.(x, y, ctx);
  };

  const onPointerUp = () => {
    tool?.onPointerUp?.(ctx);
  };

  const ToolCursor: { [key in ToolType]: CSSProperties["cursor"] } = {
    line: "crosshair",
    rect: "crosshair",
    ellipse: "crosshair",
    pencil: "crosshair",
    text: "text",
    selection: "move",
    eraser: "crosshair",
    pan: panCursor,
  };

  return { currentElement, onPointerDown, onPointerMove, onPointerUp, ToolCursor };
}
