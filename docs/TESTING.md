# Анализ тестирования проекта Sky Fitness Pro

## Текущее состояние

### Установлено и настроено

- **Jest** — запуск тестов, конфиг через `next/jest` (трансформ, моки CSS/шрифтов, алиасы).
- **React Testing Library** — тестирование компонентов (`@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`).
- **Скрипты в `package.json`:**
  - `npm run test` — разовый прогон тестов;
  - `npm run test:watch` — режим watch;
  - `npm run test:coverage` — отчёт по покрытию.

### Где лежат тесты

- Рядом с кодом: `*.test.ts` / `*.test.tsx` (и при желании `*.spec.ts`).
- Альтернатива: папки `__tests__` рядом с модулями или в `src`.

### Что уже покрыто тестами

| Модуль                      | Файл тестов            | Что проверяется                                                                                                                                               |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/validation.ts`   | `validation.test.ts`   | `validateEmail` (валидный/пустой/неверный формат), `validatePassword` (длина, спецсимволы, заглавная, пустой)                                                 |
| `src/utils/errorUtils.ts`   | `errorUtils.test.ts`   | `isNetworkError`, `getAxiosErrorMessage`, `getAxiosErrorToastMessage` (разные типы ошибок и fallback)                                                         |
| `src/utils/courseUtils.ts`  | `courseUtils.test.ts`  | `getCourseImage`, `difficultyToNumber`, `transformCourse`, `calculateCourseProgress`, `transformCourseForDetailPage` (с фикстурами из `__fixtures__/courses`) |
| `src/utils/workoutUtils.ts` | `workoutUtils.test.ts` | `getExerciseProgressPercent` (процент прогресса по упражнению)                                                                                                |

**Итого:** 13 базовых юнит-тестов (по основному сценарию и одному граничному случаю на функцию). Все чистые функции покрыты. Компоненты и API-слой тестами не покрыты.
