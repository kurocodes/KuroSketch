// import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { TOOLS } from "./tools.config";
import ToolButton from "./ToolButton";
import type { ToolType } from "../../canvas/types";

export default function Toolbar({
  currentTool,
  setCurrentTool,
}: {
  currentTool: ToolType;
  setCurrentTool: React.Dispatch<React.SetStateAction<ToolType>>;
}) {
  // const [active, setActive] = useState<ToolType>("rect");
  const { colors } = useTheme();

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 border border-t-0 rounded-b-2xl p-1"
      style={{
        borderColor: colors.uiBorder,
        backgroundColor: colors.uiBg,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <div className="flex gap-0.5">
        {TOOLS.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            active={currentTool}
            setActive={setCurrentTool}
          />
        ))}
      </div>
    </div>
  );
}
