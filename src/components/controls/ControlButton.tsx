import type { IconType } from "react-icons";
import { useTheme } from "../../hooks/useTheme";
import { motion } from "motion/react";
import type { CSSProperties } from "react";

export function ControlButton({
  Icon,
  className,
  color,
  cursor = "pointer",
  onClick,
}: {
  Icon: IconType;
  className: string;
  color?: string;
  cursor?: CSSProperties["cursor"];
  onClick: () => void;
}) {
  const { colors } = useTheme();

  return (
    <motion.button
      // role="button"
      onClick={onClick}
      whileHover={{ backgroundColor: colors.uiBorder }}
      transition={{ backgroundColor: { duration: 0 } }}
      className={`p-1.5 cursor-z ${className}`}
      style={{ cursor: cursor }}
    >
      <span style={{ color: colors.uiText }}>
        <Icon size={24} color={color} />
      </span>
    </motion.button>
  );
}
