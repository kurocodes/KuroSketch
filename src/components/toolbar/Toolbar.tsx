import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { TOOLS } from "./tools.config";
import ToolButton from "./ToolButton";
import type { ToolType } from "../../canvas/types";
import { LayoutGroup } from "motion/react";

export default function Toolbar({
  currentTool,
  setCurrentTool,
}: {
  currentTool: ToolType;
  setCurrentTool: React.Dispatch<React.SetStateAction<ToolType>>;
}) {
  const { colors } = useTheme();
  const [hoveredTool, setHoveredTool] = useState<ToolType | null>(null);
  const [animateLabelOnMount, setAnimateLabelOnMount] = useState(true);
  const hoverTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current !== null) {
        window.clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const showTooltip = (toolId: ToolType) => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
    }

    if (hoveredTool) {
      setAnimateLabelOnMount(false);
      setHoveredTool(toolId);
      return;
    }

    hoverTimeout.current = window.setTimeout(() => {
      setAnimateLabelOnMount(true);
      setHoveredTool(toolId);
    }, 350);
  };

  const hideTooltip = () => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = window.setTimeout(() => {
      setHoveredTool(null);
    }, 120);
  };

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 border border-t-0 rounded-b-2xl p-1"
      style={{
        borderColor: colors.uiBorder,
        backgroundColor: colors.uiBg,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <LayoutGroup id="toolbar-tooltips">
        <div className="flex gap-0.5">
          {TOOLS.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              active={currentTool}
              setActive={setCurrentTool}
              showLabel={hoveredTool === tool.id}
              onHoverStart={() => showTooltip(tool.id)}
              onHoverEnd={hideTooltip}
              animateLabelOnMount={animateLabelOnMount}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
