import { useTheme } from "../../hooks/useTheme";
import { motion } from "motion/react";
import { LuInfo } from "react-icons/lu";

export default function HelpButton({ onClick }: { onClick: () => void }) {
  const { colors } = useTheme();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="fixed bottom-2 right-2 p-2 rounded-2xl aspect-square cursor-pointer"
      style={{ backgroundColor: colors.accent }}
    >
      <span style={{ color: colors.uiText }}>
        <LuInfo size={24} color={colors.uiBg} />
      </span>
    </motion.button>
  );
}
