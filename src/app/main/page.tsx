'use client';

import { useEffect, useState } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import Header from '@/components/Header/Header';
import { getCourses } from '@/services/courses/coursesApi';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';
import { Course } from '@/sharedTypes/sharedTypes';
import { useUser } from '@/contexts/UserContext';
import styles from './page.module.css';

// Маппинг названий курсов на изображения (по nameEN или nameRU)
const getCourseImage = (nameEN: string, nameRU: string): string => {
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
};

// Преобразование строки сложности в число (1-5)
const difficultyToNumber = (difficulty: string): number => {
  const lower = difficulty.toLowerCase();
  if (lower.includes('легк') || lower.includes('начал')) return 1;
  if (lower.includes('средн')) return 3;
  if (lower.includes('сложн') || lower.includes('продвинут')) return 5;
  return 3; // по умолчанию
};

// Преобразование данных из API в формат для компонентов
const transformCourse = (course: CourseFromAPI): Course => {
  return {
    id: course._id,
    nameRU: course.nameRU,
    durationInDays: course.durationInDays,
    dailyDurationInMinutes: course.dailyDurationInMinutes,
    difficulty: difficultyToNumber(course.difficulty),
    image: getCourseImage(course.nameEN, course.nameRU),
  };
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useUser();

  useEffect(() => {
    getCourses()
      .then((data) => {
        const transformedCourses = data.map(transformCourse);
        setCourses(transformedCourses);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке курсов:', err);
        setError('Не удалось загрузить курсы');
        setIsLoading(false);
      });
  }, []);

  const handleCourseAdded = () => {
    refreshUser();
  };

  const handleCourseRemoved = () => {
    refreshUser();
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const header = document.getElementById('header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Загрузка курсов...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <Centerblock
            courses={courses}
            selectedCourses={user?.selectedCourses || []}
            onCourseAdded={handleCourseAdded}
            onCourseRemoved={handleCourseRemoved}
          />
          <div className={styles.scrollButtonWrapper}>
            <a
              href="#header"
              onClick={handleScrollToTop}
              className="btn btn-mb-80"
            >
              Наверх <span className={styles.arrow}>↑</span>
            </a>
          </div>
        </>
      )}
    </>
  );
}
