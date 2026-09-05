export type ImportanceSignals = {
  pastQuestionOverlap: number;
  recency: number;
  sourceWeight: number;
};

export function scoreAcademicImportance(signals: ImportanceSignals): number {
  const pastQuestionOverlap = clamp01(signals.pastQuestionOverlap);
  const recency = clamp01(signals.recency);
  const sourceWeight = clamp01(signals.sourceWeight);

  return Number(
    (pastQuestionOverlap * 0.5 + recency * 0.2 + sourceWeight * 0.3).toFixed(4),
  );
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}
