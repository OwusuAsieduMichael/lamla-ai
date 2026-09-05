/**
 * KNUST crest colors, refined for UI contrast on a white theme.
 * Gold matches the eagle and banner; green the shield; red the flame.
 */
export const brandColors = {
  gold: "#D4A017",
  green: "#1B6B3A",
  red: "#C41E3A",
  black: "#1A1814",
  white: "#FFFFFF",
} as const;

export type BrandColor = keyof typeof brandColors;
