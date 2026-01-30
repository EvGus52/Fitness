import {
  getCourseImage,
  difficultyToNumber,
  transformCourse,
  calculateCourseProgress,
  transformCourseForDetailPage,
} from './courseUtils';
import { mockCoursesFromAPI, mockCourseProgress } from '@/__fixtures__/courses';

describe('getCourseImage', () => {
  it('returns image by nameEN/nameRU or default /Fitness.png', () => {
    expect(getCourseImage('yoga', 'Йога')).toBe('/Yoga.png');
    expect(getCourseImage('unknown', 'Неизвестный')).toBe('/Fitness.png');
  });
});

describe('difficultyToNumber', () => {
  it('maps легкий→1, средний→3, сложный→5, unknown→3', () => {
    expect(difficultyToNumber('легкий')).toBe(1);
    expect(difficultyToNumber('средний')).toBe(3);
    expect(difficultyToNumber('сложный')).toBe(5);
    expect(difficultyToNumber('другое')).toBe(3);
  });
});

describe('transformCourse', () => {
  it('transforms API course to Course (id, nameRU, difficulty, image)', () => {
    const api = mockCoursesFromAPI[0];
    const result = transformCourse(api);
    expect(result.id).toBe(api._id);
    expect(result.nameRU).toBe(api.nameRU);
    expect(result.difficulty).toBe(1);
    expect(result.image).toBe('/Yoga.png');
  });
});

describe('calculateCourseProgress', () => {
  it('returns 0 for null/zero total, 100 when all done, rounded % for partial', () => {
    expect(calculateCourseProgress(null, 5)).toBe(0);
    const total = mockCourseProgress.workoutsProgress.length;
    expect(calculateCourseProgress(mockCourseProgress, total)).toBe(100);
    const partial = {
      ...mockCourseProgress,
      workoutsProgress: [
        { workoutId: 'w1', workoutCompleted: true, progressData: [1] },
        { workoutId: 'w2', workoutCompleted: false, progressData: [0] },
      ],
    };
    expect(calculateCourseProgress(partial, 2)).toBe(50);
  });
});

describe('transformCourseForDetailPage', () => {
  it('transforms to id, nameRU, image by order, suitableFor, directions', () => {
    const api = mockCoursesFromAPI[1];
    const result = transformCourseForDetailPage(api);
    expect(result.id).toBe(api._id);
    expect(result.nameRU).toBe(api.nameRU);
    expect(result.image).toBe(`/skill card ${api.order}.png`);
    expect(result.directions).toEqual(['гибкость']);
    expect(result.suitableFor).toEqual(['всем']);
  });
});
