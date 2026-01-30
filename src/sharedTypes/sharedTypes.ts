// Тип данных курса, которые приходят с сервера
export type CourseFromAPI = {
  _id: string;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  description: string;
  directions: string[];
  fitting: string[];
  nameEN: string;
  nameRU: string;
  order: number;
  difficulty: string; // например: "легкий", "средний", "сложный"
  durationInDays: number;
  workouts: string[]; // массив ID тренировок
  __v: number;
};

// Тип курса для компонентов (трансформированные данные из CourseFromAPI)
export type Course = {
  id: string;
  nameRU: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  difficulty: number; // 1-5
  image: string; // путь к изображению
};

// Тип для создания пользователя
export type createUserProp = {
  email: string;
  password: string;
};

// Тип тренировки
export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
};

// Тип упражнения
export type Exercise = {
  name: string;
  quantity: number;
  _id: string;
};

// Тип прогресса по курсу
export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
};

// Тип прогресса по тренировке
export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

// Тип ответа для добавления курса
export type AddCourseResponse = {
  message: string;
};

// Тип ответа для удаления курса
export type DeleteCourseResponse = {
  message: string;
};

// Тип ответа для сброса прогресса
export type ResetProgressResponse = {
  message: string;
};

/** Тело ответа API с ошибкой (response.data) */
export type ApiErrorBody = { message?: string };
