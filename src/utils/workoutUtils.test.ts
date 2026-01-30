import { getExerciseProgressPercent } from './workoutUtils';

describe('getExerciseProgressPercent', () => {
  it('returns 0 for invalid input (null, empty, out of bounds, quantity<=0)', () => {
    expect(getExerciseProgressPercent(0, null as unknown as number[], 10)).toBe(
      0,
    );
    expect(getExerciseProgressPercent(0, [], 10)).toBe(0);
    expect(getExerciseProgressPercent(5, [1, 2, 3], 10)).toBe(0);
    expect(getExerciseProgressPercent(0, [5], 0)).toBe(0);
  });

  it('returns rounded percentage for partial progress, 100 when done, cap at 100', () => {
    expect(getExerciseProgressPercent(0, [5], 10)).toBe(50);
    expect(getExerciseProgressPercent(0, [10], 10)).toBe(100);
    expect(getExerciseProgressPercent(0, [15], 10)).toBe(100);
  });
});
