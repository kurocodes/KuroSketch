export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    canvasBg: "hsl(240, 30%, 97%)",
    defaultStroke: "hsl(240, 15%, 20%)",
    uiBg: "hsl(240, 25%, 94%)",
    uiBorder: "hsl(240, 18%, 85%)",
    uiTextPrimary: "hsl(240, 20%, 18%)",
    uiTextMuted: "hsl(240, 12%, 45%)",
    accent: "hsl(260, 70%, 60%)", // main lavender
    accentSoft: "hsl(260, 65%, 72%)", // lighter lavender variant
    hover: "hsla(260, 70%, 60%, 0.18)",
    shadowSoft: "0 8px 30px hsla(240, 20%, 30%, 0.12)",
    shadowStrong: "0 15px 40px hsla(240, 25%, 25%, 0.18)",
  },

  dark: {
    canvasBg: "hsl(250, 18%, 10%)",
    defaultStroke: "hsl(240, 20%, 85%)",
    uiBg: "hsl(250, 16%, 14%)",
    uiBorder: "hsl(250, 14%, 22%)",
    uiTextPrimary: "hsl(240, 15%, 88%)",
    uiTextMuted: "hsl(240, 10%, 60%)",
    accent: "hsl(265, 75%, 68%)", // glowing lavender
    accentSoft: "hsl(265, 55%, 45%)", // deeper variant
    hover: "hsla(265, 75%, 68%, 0.22)",
    shadowSoft: "0 8px 30px hsla(260, 40%, 5%, 0.6)",
    shadowStrong: "0 15px 45px hsla(260, 50%, 5%, 0.75)",
  },
} as const;

export type Theme = typeof theme;
