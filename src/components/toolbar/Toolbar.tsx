import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { TOOLS } from "./tools.config";
import ToolButton from "./ToolButton";

export default function Toolbar() {
  const [active, setActive] = useState("rect");
  const { colors } = useTheme();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 border-3 rounded-t-2xl p-1"
      style={{ borderColor: colors.uiBorder, backgroundColor: colors.uiBg }}
    >
      <div className="flex gap-1">
        {TOOLS.map((tool) => (
          <ToolButton tool={tool} active={active} setActive={setActive} />
        ))}
      </div>
    </div>
  );
}
