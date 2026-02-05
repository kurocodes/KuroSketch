import React, { useRef, useState } from "react";
import {
  type DrawingElement,
  type HistoryState,
  type ToolType,
} from "../canvas/types";
import type { ToolContext, ToolHandler } from "../canvas/tools";
import { selectionTool } from "../canvas/tools/selection";
import { pencilTool } from "../canvas/tools/pencil";
import { circleTool, lineTool, rectTool } from "../canvas/tools/shapeTool";
import { textTool } from "../canvas/tools/text";
import { eraserTool } from "../canvas/tools/eraser";
import { panTool } from "../canvas/tools/pan";
import type { Camera } from "../canvas/camera";

const tools: Record<ToolType, ToolHandler | undefined> = {
  selection: selectionTool,
  pencil: pencilTool,
  line: lineTool,
  rect: rectTool,
  circle: circleTool,
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
  const isPanning = useRef(false);

  const tool = tools[forcePan ? "pan" : currentTool];

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
    isPanning,
    setCamera,
    startTextEditing,
  };

  const onMouseDown = (x: number, y: number) => {
    tool?.onMouseDown?.(x, y, ctx);
  };

  const onMouseMove = (x: number, y: number) => {
    tool?.onMouseMove?.(x, y, ctx);
  };

  const onMouseUp = () => {
    tool?.onMouseUp?.(ctx);
  };

  return { currentElement, onMouseDown, onMouseMove, onMouseUp };
}
