import type { IconType } from "react-icons";
import { useTheme } from "../../hooks/useTheme";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import Label from "../label/Label";

export function ControlButton({
  Icon,
  className,
  color,
  cursor = "pointer",
  onClick,
  label,
  tooltipPosition = "top",
  showLabel = false,
  onHoverStart,
  onHoverEnd,
  tooltipLayoutId = "control-tooltip",
  animateLabelOnMount = true,
}: {
  Icon: IconType;
  className: string;
  color?: string;
  cursor?: CSSProperties["cursor"];
  onClick: () => void;
  label?: string;
  tooltipPosition?: "top" | "bottom";
  showLabel?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  tooltipLayoutId?: string;
  animateLabelOnMount?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <motion.button
      // role="button"
      onClick={onClick}
      whileHover={{ backgroundColor: colors.uiBorder }}
      transition={{ backgroundColor: { duration: 0 } }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      className={`relative p-1.5 cursor-z ${className}`}
      style={{ cursor: cursor }}
    >
      <span style={{ color: colors.uiText }}>
        <Icon size={24} color={color} />
      </span>
      {label && showLabel && (
        <Label
          tooltipPosition={tooltipPosition}
          layoutId={tooltipLayoutId}
          animateOnMount={animateLabelOnMount}
        >
          {label}
        </Label>
      )}
    </motion.button>
  );
}
