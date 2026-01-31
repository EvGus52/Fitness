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
  difficulty: string;
  durationInDays: number;
  workouts: string[];
  __v: number;
};

export type Course = {
  id: string;
  nameRU: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  difficulty: number;
  image: string;
};

export type createUserProp = {
  email: string;
  password: string;
};

export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
};

export type Exercise = {
  name: string;
  quantity: number;
  _id: string;
};

export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
};

export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type AddCourseResponse = {
  message: string;
};

export type DeleteCourseResponse = {
  message: string;
};

export type ResetProgressResponse = {
  message: string;
};

export type ApiErrorBody = { message?: string };
