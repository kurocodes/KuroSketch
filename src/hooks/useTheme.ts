import { useCallback, useState } from "react";
import { theme, type ThemeMode } from "../theme/theme";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    mode,
    colors: theme[mode],
    toggleTheme,
  };
}
