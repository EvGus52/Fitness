import {
  Course,
  CourseFromAPI,
  CourseProgress,
} from '@/sharedTypes/sharedTypes';

/**
 * Моковые данные курсов для тестов (unit, integration, Storybook).
 * Импорт: import { mockCourses } from '@/__fixtures__/courses';
 */
export const mockCourses: Course[] = [
  {
    id: '1',
    nameRU: 'Йога',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 1,
    image: '/Yoga.png',
  },
  {
    id: '2',
    nameRU: 'Стретчинг',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 1,
    image: '/Stretching.png',
  },
  {
    id: '3',
    nameRU: 'Фитнес',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 1,
    image: '/Fitness.png',
  },
  {
    id: '4',
    nameRU: 'Степ-аэробика',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 1,
    image: '/StepAirobic.png',
  },
  {
    id: '5',
    nameRU: 'Бодифлекс',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 1,
    image: '/BodyFlex.png',
  },
];

/**
 * Моковые курсы в формате API для тестов courseUtils и др.
 * Импорт: import { mockCoursesFromAPI } from '@/__fixtures__/courses';
 */
export const mockCoursesFromAPI: CourseFromAPI[] = [
  {
    _id: '1',
    nameEN: 'Yoga',
    nameRU: 'Йога',
    order: 1,
    difficulty: 'легкий',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    description: '',
    directions: [],
    fitting: [],
    workouts: [],
    __v: 0,
  },
  {
    _id: '2',
    nameEN: 'Stretching',
    nameRU: 'Стретчинг',
    order: 2,
    difficulty: 'средний',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    description: '',
    directions: ['гибкость'],
    fitting: ['всем'],
    workouts: ['w1', 'w2'],
    __v: 0,
  },
  {
    _id: '3',
    nameEN: 'Unknown',
    nameRU: 'Неизвестный курс',
    order: 3,
    difficulty: 'сложный',
    durationInDays: 14,
    dailyDurationInMinutes: { from: 15, to: 30 },
    description: '',
    directions: [],
    fitting: [],
    workouts: [],
    __v: 0,
  },
];

/**
 * Моковый прогресс по курсу для тестов calculateCourseProgress.
 * Импорт: import { mockCourseProgress } from '@/__fixtures__/courses';
 */
export const mockCourseProgress: CourseProgress = {
  courseId: '2',
  courseCompleted: false,
  workoutsProgress: [
    { workoutId: 'w1', workoutCompleted: true, progressData: [1, 1, 1] },
    { workoutId: 'w2', workoutCompleted: true, progressData: [1, 1] },
  ],
};
