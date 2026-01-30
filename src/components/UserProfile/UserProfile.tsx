'use client';

import { useEffect, useState } from 'react';
import styles from './userProfile.module.css';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { getCourses } from '@/services/courses/coursesApi';
import { getCourseProgress } from '@/services/progress/progressApi';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';
import { Course } from '@/sharedTypes/sharedTypes';
import { calculateCourseProgress, transformCourse } from '@/utils/courseUtils';
import { getAxiosErrorMessage, isNetworkError } from '@/utils/errorUtils';
import UserCourseCard from '@/components/UserCourseCard/UserCourseCard';
import ProfileSkeleton from '@/components/UserProfile/ProfileSkeleton';
import CourseCardSkeleton from '@/components/CourseCardSkeleton/CourseCardSkeleton';

interface UserProfileProps {
    onLogout?: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
    const { user, isLoading, refreshUser } = useUser();
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [coursesProgress, setCoursesProgress] = useState<Record<string, number>>({});
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [coursesError, setCoursesError] = useState<string | null>(null);

    // Извлекаем имя из email (часть до @)
    const userName = user?.email ? user.email.split('@')[0] : '';
    const userEmail = user?.email || '';

    useEffect(() => {
        if (user?.selectedCourses && user.selectedCourses.length > 0) {
            loadUserCourses();
        } else {
            setUserCourses([]);
            setCoursesProgress({});
            setCoursesError(null);
        }
    }, [user?.selectedCourses]); // eslint-disable-line react-hooks/exhaustive-deps -- loadUserCourses depends on user, re-running on user change is intended

    const loadUserCourses = async () => {
        if (!user?.selectedCourses || user.selectedCourses.length === 0) return;

        setIsLoadingCourses(true);
        setCoursesError(null);
        try {
            // Загружаем все курсы
            const allCourses = await getCourses();

            // Фильтруем только курсы пользователя
            const userCourseIds = user.selectedCourses;
            const filteredCourses = allCourses.filter((course) =>
                userCourseIds.includes(course._id)
            );

            // Преобразуем в формат для компонентов
            const transformedCourses = filteredCourses.map(transformCourse);
            setUserCourses(transformedCourses);

            // Загружаем прогресс для каждого курса (totalWorkouts — из данных курса, не из API прогресса)
            const progressMap: Record<string, number> = {};
            for (const course of filteredCourses) {
                try {
                    const progress = await getCourseProgress(course._id);
                    const totalWorkoutsInCourse = course.workouts?.length ?? 0;
                    progressMap[course._id] = calculateCourseProgress(progress, totalWorkoutsInCourse);
                } catch (error) {
                    progressMap[course._id] = 0;
                    if (!isNetworkError(error)) {
                        console.error(`Ошибка при загрузке прогресса для курса ${course._id}:`, error);
                    }
                }
            }
            setCoursesProgress(progressMap);
        } catch (error) {
            console.error('Ошибка при загрузке курсов пользователя:', error);
            setCoursesError(getAxiosErrorMessage(error, 'Не удалось загрузить курсы'));
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const handleCourseRemoved = () => {
        refreshUser();
        // loadUserCourses вызовется из useEffect при обновлении user.selectedCourses
    };

    const handleProgressUpdated = () => {
        loadUserCourses();
    };

    return (
        <div className="center">
            <h1 className={styles.profileTitle}>Профиль</h1>
            {isLoading ? (
                <ProfileSkeleton />
            ) : (
                <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        <Image
                            src="/maskUser.png"
                            alt="Аватар пользователя"
                            width={197}
                            height={197}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoBlock}>
                            <h2 className={styles.userName}>{userName}</h2>
                            <p className={styles.userLogin}>Логин: {userEmail}</p>
                        </div>
                        <button onClick={onLogout} className={`btn-secondary ${styles.logoutButton}`}>
                            Выйти
                        </button>
                    </div>
                </div>
            )}

            <h2 className={styles.coursesTitle}>Мои курсы</h2>
            <div className={styles.courses__grid}>
                {isLoadingCourses ? (
                    <>
                        <CourseCardSkeleton />
                        <CourseCardSkeleton />
                        <CourseCardSkeleton />
                    </>
                ) : coursesError ? (
                    <p className={styles.errorMessage}>{coursesError}</p>
                ) : (
                    userCourses.map((course) => (
                        <UserCourseCard
                            key={course.id}
                            course={course}
                            progress={coursesProgress[course.id] || 0}
                            onCourseRemoved={handleCourseRemoved}
                            onProgressUpdated={handleProgressUpdated}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
