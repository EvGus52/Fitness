'use client';

import { useEffect, useState } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import Header from '@/components/Header/Header';
import { getCourses } from '@/services/courses/coursesApi';
import { Course } from '@/sharedTypes/sharedTypes';
import { transformCourse } from '@/utils/courseUtils';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { useUser } from '@/contexts/UserContext';

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
        setError(getAxiosErrorMessage(err, 'Не удалось загрузить курсы'));
        setIsLoading(false);
      });
  }, []);

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
      <Centerblock
        courses={courses}
        selectedCourses={user?.selectedCourses || []}
        isLoading={isLoading}
        error={error}
        onCourseAdded={refreshUser}
        onCourseRemoved={refreshUser}
      />
      {!isLoading && !error && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            href="#header"
            onClick={handleScrollToTop}
            className="btn btn-mb-80"
          >
            Наверх <span style={{ verticalAlign: 'text-top', lineHeight: 1, display: 'inline-block' }}>↑</span>
          </a>
        </div>
      )}
    </>
  );
}
