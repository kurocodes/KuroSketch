import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { useThemeContext } from "../../theme/useThemeContext";

export default function ThemeToggle() {
  const { colors, mode, toggleTheme } = useThemeContext();

  return (
    <motion.div
      role="button"
      whileHover={{ backgroundColor: colors.uiBorder }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="fixed max-sm:bottom-2 max-sm:right-14 sm:top-2 sm:right-2 z-10 cursor-pointer border rounded-2xl p-2"
      style={{
        borderColor: colors.uiBorder,
        backgroundColor: colors.uiBg,
        // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
