
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import AboutCourse from '@/components/AboutCourse/AboutCourse';
import CourseEnrollment from '@/components/CourseEnrollment/CourseEnrollment';
import { getCourses } from '@/services/courses/coursesApi';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';
import { Course } from '@/sharedTypes/sharedTypes';

function CoursesContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get('id');
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
                console.error('Ошибка при загрузке курсов:', err);
                setError('Не удалось загрузить курсы');
                setIsLoading(false);
            });
    }, []);

    // Находим курс по ID из данных API
    const courseFromAPI = courses.find((c) => c._id === courseId);

    // Преобразуем данные из API в формат для компонента
    const courseWithData: (Course & {
        suitableFor?: string[];
        directions?: string[];
    }) | null = courseFromAPI
        ? {
            id: courseFromAPI._id,
            nameRU: courseFromAPI.nameRU,
            durationInDays: courseFromAPI.durationInDays,
            dailyDurationInMinutes: courseFromAPI.dailyDurationInMinutes,
            difficulty: courseFromAPI.difficulty.toLowerCase().includes('легк') ? 1 : 
                       courseFromAPI.difficulty.toLowerCase().includes('средн') ? 3 : 5,
            image: `/skill card ${courseFromAPI.order}.png`, // используем order для изображения
            suitableFor: courseFromAPI.fitting || [],
            directions: courseFromAPI.directions || [],
        }
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
        <>
            <Header />
            {courseWithData ? (
                <>
                    <AboutCourse course={courseWithData} />
                    <CourseEnrollment />
                </>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <p>Курс не найден</p>
                </div>
            )}
        </>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <CoursesContent />
        </Suspense>
    );
}