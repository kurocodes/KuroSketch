import React, { useRef, useState } from "react";
import { isPointInsideElement } from "../canvas/hitTest";
import { type DrawingElement, type HistoryState, type ToolType } from "../canvas/types";
import { moveElement } from "../canvas/elementUtils";

export function useCanvas({
  elements,
  currentTool,
  commit,
  setHistory,
}: {
  elements: DrawingElement[];
  currentTool: ToolType;
  commit: (els: DrawingElement[]) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;
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

//   const generateId = () => `${Date.now()}-${Math.random()}`;
  const generateId = () => Date.now().toString();

  const onMouseDown = (x: number, y: number) => {
    if (currentTool === "selection") {
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (isPointInsideElement(x, y, element)) {
          setSelectedElement(element);
          setIsDragging(true);
          lastMousePos.current = { x: x, y: y };

          dragStartSnapshot.current = elements.map((el) => ({ ...el }));

          return;
        }
      }

      setSelectedElement(null);
      return;
    }

    if (currentTool === "eraser") {
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (isPointInsideElement(x, y, element)) {
          commit(elements.filter((el) => el.id !== element.id));
          return;
        }
      }
      return;
    }

    if (currentTool === "pencil") {
      setCurrentElement({
        id: generateId(),
        type: "pencil",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        points: [{ x: x, y: y }],
      });
      return;
    }

    if (currentTool === "text") {
      const text = prompt("Enter text");
      if (!text) return;

      const newElement: DrawingElement = {
        id: generateId(),
        type: "text",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        text,
      };

      commit([...elements, newElement]);
      return;
    }

    const newElement: DrawingElement = {
      id: generateId(),
      type: currentTool,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    };

    setCurrentElement(newElement);
  };

  const onMouseMove = (x: number, y: number) => {
    if (
      currentTool === "selection" &&
      isDragging &&
      selectedElement &&
      lastMousePos.current
    ) {
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;

      setHistory((h) => ({
        ...h,
        present: h.present.map((el) => {
          if (el.id !== selectedElement.id) return el;

          return moveElement(el, dx, dy);
        }),
      }));

      lastMousePos.current = { x: x, y: y };
      return;
    }

    // Draw shapes
    if (!currentElement) return;

    // draw pencil
    if (currentTool === "pencil") {
      setCurrentElement((prev) => {
        if (!prev || !prev.points) return prev;

        return {
          ...prev,
          points: [...prev.points, { x: x, y: y }],
        };
      });
      return;
    }

    // draw other shapes
    setCurrentElement({
      ...currentElement,
      x2: x,
      y2: y,
    });
  };

  const onMouseUp = () => {
    if (currentElement) {
      commit([...elements, currentElement]);
    }
    const snapshot = dragStartSnapshot.current;

    if (snapshot) {
      setHistory((h) => ({
        ...h,
        past: [...h.past, snapshot],
        future: [],
      }));
    }

    dragStartSnapshot.current = null;
    setIsDragging(false);
    lastMousePos.current = null;
    setCurrentElement(null);
  };

  return { currentElement, onMouseDown, onMouseMove, onMouseUp };
}
