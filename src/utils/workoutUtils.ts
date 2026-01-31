/**
 * progressData[i] — сколько сделано по i-му упражнению; 100% когда value === quantity.
 */
export function getExerciseProgressPercent(
  exerciseIndex: number,
  progressData: number[],
  quantity: number,
): number {
  if (!progressData || exerciseIndex >= progressData.length || quantity <= 0)
    return 0;
  const value = progressData[exerciseIndex];
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.round((value / quantity) * 100));
}
