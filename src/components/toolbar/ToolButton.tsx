import { motion } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import type { Tool } from "./tools.config";
import type React from "react";
import type { ToolType } from "../../canvas/types";

export default function ToolButton({
  tool,
  active,
  setActive,
}: {
  tool: Tool;
  active: ToolType;
  setActive: React.Dispatch<React.SetStateAction<ToolType>>;
}) {
  const { colors } = useTheme();

  return (
    <motion.div
      whileHover={{ backgroundColor: colors.uiBorder }}
      whileTap={{ scale: 0.95 }}
      transition={{ backgroundColor: { duration: 0 } }}
      onClick={() => setActive(tool.id)}
      className="relative p-2 rounded-xl cursor-pointer"
      style={{ borderColor: colors.uiBorder }}
    >
      <tool.icon
        size={24}
        className="relative z-10"
        style={{
          color: active === tool.id ? colors.uiBg : colors.uiText,
          transition: "color 0.2s ease-in-out",
        }}
      />
      {active === tool.id && (
        <motion.div
          layoutId="activeTool"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="w-full h-full absolute inset-0 rounded-xl"
          style={{ backgroundColor: colors.accent }}
        ></motion.div>
      )}
    </motion.div>
  );
}
