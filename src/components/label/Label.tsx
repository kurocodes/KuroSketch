import { motion } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import type React from "react";

export default function Label({
  tooltipPosition,
  layoutId,
  animateOnMount = true,
  children,
}: {
  tooltipPosition: "top" | "bottom";
  layoutId: string;
  animateOnMount?: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <motion.div
      layoutId={layoutId}
      layout
      initial={
        animateOnMount
          ? { opacity: 0, y: tooltipPosition === "top" ? 4 : -4 }
          : false
      }
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: tooltipPosition === "top" ? 4 : -4 }}
      className={`absolute left-1/2 -translate-x-1/2 rounded-lg border px-2 py-1 text-xs shadow-lg whitespace-nowrap z-20 ${
        tooltipPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
      style={{
        backgroundColor: colors.uiBg,
        borderColor: colors.uiBorder,
        color: colors.uiText,
      }}
    >
      {children}
    </motion.div>
  );
}
