import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import type { ThemeMode } from "../../theme/theme";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({
  mode,
  toggleTheme,
}: {
  mode: ThemeMode;
  toggleTheme: () => void;
}) {
  const { colors } = useTheme();

  return (
    <motion.div
      role="button"
      whileHover={{ backgroundColor: colors.uiBorder }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-10 cursor-pointer border-2 rounded-2xl p-2"
      style={{
        borderColor: colors.uiBorder,
        backgroundColor: colors.uiBg,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "dark" ? (
          <motion.div
            key="dark"
            initial={{ scale: 0.9, filter: "blur(1px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.9, filter: "blur(1px)" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <MdDarkMode size={24} color={colors.uiText} />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ scale: 0.9, filter: "blur(1px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.9, filter: "blur(1px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <MdLightMode size={24} color={colors.uiText} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
