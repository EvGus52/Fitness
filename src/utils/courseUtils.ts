import {
  Course,
  CourseFromAPI,
  CourseProgress,
} from '@/sharedTypes/sharedTypes';

/**
 * Маппинг названий курсов (nameEN / nameRU) на путь к изображению в public.
 */
export function getCourseImage(nameEN: string, nameRU: string): string {
  const imageMap: Record<string, string> = {
    yoga: '/Yoga.png',
    stretching: '/Stretching.png',
    fitness: '/Fitness.png',
    stepairobic: '/StepAirobic.png',
    bodyflex: '/BodyFlex.png',
    'степ-аэробика': '/StepAirobic.png',
    йога: '/Yoga.png',
    стретчинг: '/Stretching.png',
    фитнес: '/Fitness.png',
    бодифлекс: '/BodyFlex.png',
  };

  const keyEN = nameEN.toLowerCase();
  const keyRU = nameRU.toLowerCase();

  return imageMap[keyEN] || imageMap[keyRU] || '/Fitness.png';
}

/**
 * Преобразование строки сложности с API в число 1–5 для UI.
 */
export function difficultyToNumber(difficulty: string): number {
  const lower = difficulty.toLowerCase();
  if (lower.includes('легк') || lower.includes('начал')) return 1;
  if (lower.includes('средн')) return 3;
  if (lower.includes('сложн') || lower.includes('продвинут')) return 5;
  return 3;
}

/**
 * Преобразование курса из формата API (CourseFromAPI) в формат для компонентов (Course).
 */
export function transformCourse(course: CourseFromAPI): Course {
  return {
    id: course._id,
    nameRU: course.nameRU,
    durationInDays: course.durationInDays,
    dailyDurationInMinutes: course.dailyDurationInMinutes,
    difficulty: difficultyToNumber(course.difficulty),
    image: getCourseImage(course.nameEN, course.nameRU),
  };
}

/**
 * Вычисление прогресса курса в процентах (0–100).
 * 100% только когда все тренировки курса выполнены (workoutCompleted).
 * totalWorkoutsInCourse — реальное число тренировок в курсе (из данных курса), не из progress.
 */
export function calculateCourseProgress(
  progress: CourseProgress | null,
  totalWorkoutsInCourse: number,
): number {
  if (!progress || totalWorkoutsInCourse === 0) return 0;
  const list = progress.workoutsProgress;
  if (!Array.isArray(list)) return 0;

  const completedWorkouts = list.filter((wp) => wp.workoutCompleted).length;
  return Math.round((completedWorkouts / totalWorkoutsInCourse) * 100);
}

/** Курс для страницы детали: только поля, используемые AboutCourse и CourseEnrollment (id, nameRU, image, suitableFor, directions) */
export type CourseForDetailPage = {
  id: string;
  nameRU: string;
  image: string;
  suitableFor?: string[];
  directions?: string[];
};

/**
 * Преобразование курса из API в формат для страницы детали курса (/courses?id=...).
 * Берутся только id, nameRU, image (по order), suitableFor, directions — остальное на странице не используется.
 */
export function transformCourseForDetailPage(
  course: CourseFromAPI,
): CourseForDetailPage {
  return {
    id: course._id,
    nameRU: course.nameRU,
    image: `/skill card ${course.order}.png`,
    suitableFor: course.fitting ?? [],
    directions: course.directions ?? [],
  };
}
