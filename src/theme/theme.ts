export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    canvasBg: "hsla(0, 0%, 88%, 1)",
    defaultStroke: "hsla(0, 0%, 0%, 1)",
    uiBg: "hsla(222, 47%, 89%, 1)",
    uiBorder: "hsla(210, 24%, 84%, 1)",
    uiText: "hsla(220, 13%, 9%, 1)",
    accent: "hsla(221, 83%, 53%, 1)", // blue
  },
  dark: {
    canvasBg: "hsla(0, 0%, 12%, 1)",
    defaultStroke: "hsla(0, 0%, 100%, 1)",
    uiBg: "hsla(222, 47%, 11%, 1)",
    uiBorder: "hsla(210, 24%, 16%, 1)",
    uiText: "hsla(220, 13%, 91%, 1)",
    accent: "hsla(221, 83%, 47%, 1)",
  },
} as const;

export type Theme = typeof theme;
