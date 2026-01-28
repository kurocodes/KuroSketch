import { useState } from "react";
import type { DrawingElement, HistoryState } from "../canvas/types";

export default function useHistory() {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: [],
  });
  const elements = history.present;

  const commitHistory = (
    newElements: DrawingElement[],
    pastOverride?: DrawingElement[],
  ) => {
    setHistory((h) => ({
      past: pastOverride
        ? [...h.past, pastOverride.map((el) => ({ ...el }))]
        : [...h.past, h.present.map((el) => ({ ...el }))],
      present: newElements,
      future: [], // clear redo on new actions
    }));
  };

  const preview = (updater: (els: DrawingElement[]) => DrawingElement[]) => {
    setHistory((h) => ({
      ...h,
      present: updater(h.present),
    }));
  };

  const undo = () => {
    setHistory((h) => {
      if (h.past.length === 0) return h;

      const previous = h.past[h.past.length - 1];
      const newPast = h.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [h.present, ...h.future],
      };
    });
  };

  const redo = () => {
    setHistory((h) => {
      if (h.future.length === 0) return h;

      const next = h.future[0];
      const newFuture = h.future.slice(1);

      return {
        past: [...h.past, h.present],
        present: next,
        future: newFuture,
      };
    });
  };

  return { elements, setHistory, commit: commitHistory, preview, undo, redo };
}
