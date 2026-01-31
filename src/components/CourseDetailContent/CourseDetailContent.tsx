'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import AboutCourse from '@/components/AboutCourse/AboutCourse';
import CourseEnrollment from '@/components/CourseEnrollment/CourseEnrollment';
import { getCourses } from '@/services/courses/coursesApi';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';
import { transformCourseForDetailPage } from '@/utils/courseUtils';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { useUser } from '@/contexts/UserContext';
import styles from './courseDetailContent.module.css';

export default function CourseDetailContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const { user, refreshUser } = useUser();
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(getAxiosErrorMessage(err, 'Не удалось загрузить курсы'));
        setIsLoading(false);
      });
  }, []);

  const courseFromAPI = courses.find((c) => c._id === courseId);
  const courseWithData = courseFromAPI
    ? transformCourseForDetailPage(courseFromAPI)
    : null;

  if (isLoading) {
    return (
      <>
        <Header />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Загрузка курса...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      {courseWithData ? (
        <>
          <AboutCourse course={courseWithData} />
          <CourseEnrollment
            courseId={courseWithData.id}
            isAdded={user?.selectedCourses?.includes(courseWithData.id)}
            onCourseAdded={refreshUser}
          />
        </>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Курс не найден</p>
        </div>
      )}
    </div>
  );
}
