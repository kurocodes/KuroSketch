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
import type { ToolType } from "../../canvas/types";

export type Tool = {
  id: ToolType;
  label: string;
  icon: IconType;
  shortcut: string;
};

export const TOOLS: Tool[] = [
  { id: "pan", label: "Pan", icon: LuHand, shortcut: "Space" },
  { id: "selection", label: "Selection", icon: LuMousePointer2, shortcut: "1" },
  { id: "rect", label: "Rectangle", icon: LuSquare, shortcut: "2" },
  { id: "ellipse", label: "Ellipse", icon: LuCircle, shortcut: "3" },
  { id: "line", label: "Line", icon: LuMinus, shortcut: "4" },
  { id: "pencil", label: "Pencil", icon: LuPencil, shortcut: "5" },
  { id: "text", label: "Text", icon: LuBaseline, shortcut: "6" },
  { id: "eraser", label: "Eraser", icon: LuEraser, shortcut: "E" },
];
