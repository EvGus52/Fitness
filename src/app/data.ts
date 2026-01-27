import { Course } from '@/sharedTypes/sharedTypes';

// Временные моковые данные (позже будут из API)
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
