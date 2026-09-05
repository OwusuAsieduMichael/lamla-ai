export const appConfig = {
  name: "LAMLA AI",
  shortName: "LAMLA",
  description:
    "A student-centered academic intelligence platform. The current pilot is limited to KNUST BSc Computer Science.",
  phase: 16,
  phaseName: "KNUST web pilot",
} as const;

export type AppPhase = typeof appConfig.phase;
