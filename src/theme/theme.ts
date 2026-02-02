export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    canvasBg: "#ffffff",
    defaultStroke: "#000000",
    uiBg: "#f8fafc",
    uiBorder: "#e5e7eb",
    uiText: "#0f172a",
    accent: "#2563eb", // blue
  },
  dark: {
    canvasBg: "#1e1e1e",
    defaultStroke: "#ffffff",
    uiBg: "#0f172a",
    uiBorder: "#1f2933",
    uiText: "#e5e7eb",
    accent: "#3b82f6",
  },
} as const;
