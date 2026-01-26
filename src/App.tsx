import { useEffect, useRef, useState, type MouseEvent } from "react";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { DrawingElement, ToolType } from "./canvas/types";
import { drawElement } from "./canvas/renderer";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null,
  );
  const [currentTool, setCurrentTool] = useState<ToolType>("text");
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const dragStartSnapshot = useRef<DrawingElement[] | null>(null);

  const isHistoryNavigation = useRef(false);

  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([]);

  const undo = () => {
    // console.log("undoStack: ", undoStack);
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;

      const prevoius = prev[prev.length - 1];
      if (!prevoius) return prev;

      isHistoryNavigation.current = true;

      setRedoStack((r) => [...r, elements]);
      setElements(prevoius);

      isHistoryNavigation.current = false;

      return prev.slice(0, -1);
    });
    console.log("Undo --> undoStack: ", undoStack, "redoStack: ", redoStack);
  };

  const redo = () => {
    // console.log("redoStack: ", redoStack);
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;

      const next = prev[prev.length - 1];

      isHistoryNavigation.current = true;

      setUndoStack((u) => [...u, elements]);
      setElements(next);

      isHistoryNavigation.current = false;

      return prev.slice(0, -1);
    });

    console.log("Redo --> undoStack: ", undoStack, "redoStack: ", redoStack);
  };

  // Setup phase (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // initialize rough.js
    const rc = rough.canvas(canvas);
    setRoughCanvas(rc);
  }, []);

  // Render phase (runs every frame)
  useEffect(() => {
    if (!canvasRef.current || !roughCanvas) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // clear entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      elements.forEach((element) => {
        drawElement(element, roughCanvas, ctx);
      });

      if (currentElement) {
        drawElement(currentElement, roughCanvas, ctx);
      }
    };

    render();
  }, [elements, currentElement, roughCanvas]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "l") setCurrentTool("line");
      if (e.key === "r") setCurrentTool("rect");
      if (e.key === "c") setCurrentTool("circle");
      if (e.key === "p") setCurrentTool("pencil");
      if (e.key === "t") setCurrentTool("text");
      if (e.key === "s") setCurrentTool("selection");
      if (e.key === "e") setCurrentTool("eraser");
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generateId = () => Date.now().toString();

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (currentTool === "selection") {
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (isPointInsideElement(mouseX, mouseY, element)) {
          setSelectedElement(element);
          setIsDragging(true);
          lastMousePos.current = { x: mouseX, y: mouseY };

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
        if (isPointInsideElement(mouseX, mouseY, element)) {
          commitHistory(elements.filter((el) => el.id !== element.id));
          return;
        }
      }
      return;
    }

    if (currentTool === "pencil") {
      setCurrentElement({
        id: generateId(),
        type: "pencil",
        x1: mouseX,
        y1: mouseY,
        x2: mouseX,
        y2: mouseY,
        points: [{ x: mouseX, y: mouseY }],
      });
      return;
    }

    if (currentTool === "text") {
      const text = prompt("Enter text");
      if (!text) return;

      const newElement: DrawingElement = {
        id: generateId(),
        type: "text",
        x1: mouseX,
        y1: mouseY,
        x2: mouseX,
        y2: mouseY,
        text,
      };

      setElements((prev) => [...prev, newElement]);
      return;
    }

    const newElement: DrawingElement = {
      id: generateId(),
      type: currentTool,
      x1: mouseX,
      y1: mouseY,
      x2: mouseX,
      y2: mouseY,
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // move selected element
    if (
      currentTool === "selection" &&
      isDragging &&
      selectedElement &&
      lastMousePos.current
    ) {
      const dx = mouseX - lastMousePos.current.x;
      const dy = mouseY - lastMousePos.current.y;

      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElement.id) return el;

          if (el.type === "pencil" && el.points) {
            return {
              ...el,
              points: el.points.map((p) => ({
                x: p.x + dx,
                y: p.y + dy,
              })),
              x1: el.x1 + dx,
              y1: el.y1 + dy,
              x2: el.x2 + dx,
              y2: el.y2 + dy,
            };
          }

          return {
            ...el,
            x1: el.x1 + dx,
            y1: el.y1 + dy,
            x2: el.x2 + dx,
            y2: el.y2 + dy,
          };
        }),
      );

      lastMousePos.current = { x: mouseX, y: mouseY };
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
          points: [...prev.points, { x: mouseX, y: mouseY }],
        };
      });
      return;
    }

    // draw other shapes
    setCurrentElement({
      ...currentElement,
      x2: mouseX,
      y2: mouseY,
    });
  };

  const handleMouseUp = () => {
    if (currentElement) {
      // setElements((prev) => [...prev, currentElement]);
      commitHistory([...elements, currentElement]);
    }
    const snapshot = dragStartSnapshot.current;

    if (snapshot) {
      setUndoStack((prev) => [...prev, snapshot]);
      setRedoStack([]);
    }

    dragStartSnapshot.current = null;
    setIsDragging(false);
    lastMousePos.current = null;
    setCurrentElement(null);
  };

  // Hit detection
  const isPointInsideElement = (
    x: number,
    y: number,
    element: DrawingElement,
  ): boolean => {
    switch (element.type) {
      case "line": {
        const distance = distanceFromPointToLine(x, y, element);
        return distance < 6; // 6 = arbitrary threshold/tolerance
      }

      case "rect": {
        const minX = Math.min(element.x1, element.x2);
        const minY = Math.min(element.y1, element.y2);
        const maxX = Math.max(element.x1, element.x2);
        const maxY = Math.max(element.y1, element.y2);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      }

      case "circle": {
        const centerX = (element.x1 + element.x2) / 2;
        const centerY = (element.y1 + element.y2) / 2;
        const radius =
          Math.sqrt(
            (element.x2 - element.x1) ** 2 + (element.y2 - element.y1) ** 2,
          ) / 2;
        return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
      }

      // temporary solution
      case "pencil": {
        if (!element.points) return false;
        return element.points.some((p) => Math.hypot(p.x - x, p.y - y) < 5);
      }

      // temporary solution
      case "text": {
        return (
          x >= element.x1 &&
          x <= element.x1 + 100 &&
          y >= element.y1 &&
          y <= element.y1 + 20
        );
      }
    }
  };

  const commitHistory = (newElements: DrawingElement[]) => {
    if (isHistoryNavigation.current) return;

    console.log("undoStack: ", undoStack, "redostack: ", redoStack);

    setUndoStack((prev) => [...prev, elements.map((el) => ({ ...el }))]);
    setRedoStack([]); // clear redo on new actions
    setElements(newElements);
  };

  const distanceFromPointToLine = (
    x: number,
    y: number,
    line: DrawingElement,
  ) => {
    const A = x - line.x1;
    const B = y - line.y1;
    const C = line.x2 - line.x1;
    const D = line.y2 - line.y1;

    const dot = A * C + B * D;
    const lenSq = C ** 2 + D ** 2;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = line.x1;
      yy = line.y1;
    } else if (param > 1) {
      xx = line.x2;
      yy = line.y2;
    } else {
      xx = line.x1 + param * C;
      yy = line.y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx ** 2 + dy ** 2);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ display: "block", backgroundColor: "#fdfdfd" }}
      />
    </div>
  );
}
