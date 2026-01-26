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

// Тип курса для использования в приложении
// Может быть расширен полями для отображения (например, image)
export type CourseType = CourseFromAPI & {
  id?: string; // Для совместимости с существующим кодом (может быть равен _id)
  image?: string; // Путь к изображению (добавляется на клиенте)
};

// Тип для создания пользователя
export type createUserProp = {
  email: string;
  password: string;
};
