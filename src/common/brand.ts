const colors = {
  background: "#090f16",
  text: "#dfe5ec",
  muted: "#c8c8c3",
  accent: "#b9bcfe",
  warm: "#f2cb9f",
} as const;

export const brand = {
  ...colors,
  gradient: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.warm} 50%, ${colors.accent} 100%)`,
};
