import type { IconType } from "react-icons";
import {
  LuMousePointer2,
  LuHand,
  LuPencil,
  LuBaseline,
  LuMinus,
  LuSquare,
  LuCircle,
  LuEraser,
} from "react-icons/lu";

export type Tool = {
  id: string;
  label: string;
  icon: IconType;
  shortcut: string;
};

export const TOOLS: Tool[] = [
  { id: "selection", label: "Selection", icon: LuMousePointer2, shortcut: "S" },
  { id: "pan", label: "Pan", icon: LuHand, shortcut: "Space" },
  { id: "pencil", label: "Pencil", icon: LuPencil, shortcut: "P" },
  { id: "line", label: "Line", icon: LuMinus, shortcut: "L" },
  { id: "rect", label: "Rectangle", icon: LuSquare, shortcut: "R" },
  { id: "circle", label: "Circle", icon: LuCircle, shortcut: "C" },
  { id: "text", label: "Text", icon: LuBaseline, shortcut: "T" },
  { id: "eraser", label: "Eraser", icon: LuEraser, shortcut: "E" },
];
