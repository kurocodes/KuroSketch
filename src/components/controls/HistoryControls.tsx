import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import { ControlButton } from "./ControlButton";
import { LuUndo2, LuRedo2 } from "react-icons/lu";

type HistoryControlsProps = {
  undo: () => void;
  redo: () => void;
};

export default function HistoryControls({ undo, redo }: HistoryControlsProps) {
  const { colors } = useTheme();
  const [hoveredControl, setHoveredControl] = useState<"undo" | "redo" | null>(
    null,
  );
  const [animateLabelOnMount, setAnimateLabelOnMount] = useState(true);
  const hoverTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current !== null) {
        window.clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const showTooltip = (id: "undo" | "redo") => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
    }

    if (hoveredControl) {
      setAnimateLabelOnMount(false);
      setHoveredControl(id);
      return;
    }

    hoverTimeout.current = window.setTimeout(() => {
      setAnimateLabelOnMount(true);
      setHoveredControl(id);
    }, 350);
  };

  const hideTooltip = (immediate = false) => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
    }

    if (immediate) {
      setHoveredControl(null);
      return;
    }

    hoverTimeout.current = window.setTimeout(() => {
      setHoveredControl(null);
    }, 120);
  };

  return (
    <div
      className="flex items-center border rounded-2xl gap-px"
      style={{ borderColor: colors.uiBorder, backgroundColor: colors.uiBg }}
    >
      <LayoutGroup id="history-tooltips">
        <ControlButton
          Icon={LuUndo2}
          className="rounded-l-[14px]"
          onClick={() => {
            undo();
            hideTooltip(true);
          }}
          label="Undo"
          tooltipPosition="top"
          tooltipLayoutId="history-tooltip"
          showLabel={hoveredControl === "undo"}
          onHoverStart={() => showTooltip("undo")}
          onHoverEnd={hideTooltip}
          animateLabelOnMount={animateLabelOnMount}
        />
        <span
          className="h-8 w-0.5 rounded"
          style={{ backgroundColor: colors.uiBorder }}
        ></span>
        <ControlButton
          Icon={LuRedo2}
          className="rounded-r-[14px]"
          onClick={() => {
            redo();
            hideTooltip(true);
          }}
          label="Redo"
          tooltipPosition="top"
          tooltipLayoutId="history-tooltip"
          showLabel={hoveredControl === "redo"}
          onHoverStart={() => showTooltip("redo")}
          onHoverEnd={hideTooltip}
          animateLabelOnMount={animateLabelOnMount}
        />
      </LayoutGroup>
    </div>
  );
}
