export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    canvasBg: "#ffffff",
    defaultStroke: "#000000",
    uiBg: "#f4f4f5",
    uiText: "#18181b",
  },
  dark: {
    canvasBg: "#1e1e1e",
    defaultStroke: "#ffffff",
    uiBg: "#09090b",
    uiText: "#fafafa",
  },
} as const;
