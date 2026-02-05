import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { ControlButton } from "./ControlButton";

type ZoomControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  // zoomPercent: number;
  // resetZoom: () => void;
};

export default function ZoomControls({
  zoomIn,
  zoomOut,
  // zoomPercent,
  // resetZoom,
}: ZoomControlsProps) {
  const { colors } = useTheme();
  const [hoveredControl, setHoveredControl] = useState<"in" | "out" | null>(
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

  const showTooltip = (id: "in" | "out") => {
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

  const hideTooltip = () => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = window.setTimeout(() => {
      setHoveredControl(null);
    }, 120);
  };

  return (
    <div
      className="flex items-center justify-center border rounded-2xl  gap-px"
      style={{ borderColor: colors.uiBorder, backgroundColor: colors.uiBg }}
    >
      <LayoutGroup id="zoom-tooltips">
        <ControlButton
          Icon={LuZoomIn}
          className="rounded-l-[14px]"
          cursor="pointer"
          onClick={zoomIn}
          label="Zoom In"
          tooltipPosition="top"
          tooltipLayoutId="zoom-tooltip"
          showLabel={hoveredControl === "in"}
          onHoverStart={() => showTooltip("in")}
          onHoverEnd={hideTooltip}
          animateLabelOnMount={animateLabelOnMount}
        />
        {/* <button
        type="button"
        onClick={resetZoom}
        className="px-2.5 py-1 text-sm font-medium"
        style={{ color: colors.uiText }}
      >
        {Math.round(zoomPercent)}%
      </button> */}
        <span
          className="h-8 w-0.5 rounded"
          style={{ backgroundColor: colors.uiBorder }}
        ></span>
        <ControlButton
          Icon={LuZoomOut}
          className="rounded-r-[14px]"
          cursor="pointer"
          onClick={zoomOut}
          label="Zoom Out"
          tooltipPosition="top"
          tooltipLayoutId="zoom-tooltip"
          showLabel={hoveredControl === "out"}
          onHoverStart={() => showTooltip("out")}
          onHoverEnd={hideTooltip}
          animateLabelOnMount={animateLabelOnMount}
        />
      </LayoutGroup>
    </div>
  );
}
