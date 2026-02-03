export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    canvasBg: "#fdfcf8",
    defaultStroke: "#000000",
    uiBg: "#f3f4f6",
    uiBorder: "#d1d5db",
    uiText: "#1f2937",
    accent: "#16a34a", // green
  },
  dark: {
    canvasBg: "#1c1c1a",
    defaultStroke: "#ffffff",
    uiBg: "#111827",
    uiBorder: "#1f2937",
    uiText: "#d1d5db",
    accent: "#22c55e",
  },
} as const;

// 1st
// export const theme = {
//   light: {
//     canvasBg: "#ffffff",
//     defaultStroke: "#000000",
//     uiBg: "#f8fafc",
//     uiBorder: "#e5e7eb",
//     uiText: "#0f172a",
//     accent: "#2563eb", // blue
//   },
//   dark: {
//     canvasBg: "#1e1e1e",
//     defaultStroke: "#ffffff",
//     uiBg: "#0f172a",
//     uiBorder: "#1f2933",
//     uiText: "#e5e7eb",
//     accent: "#3b82f6",
//   },
// } as const;
