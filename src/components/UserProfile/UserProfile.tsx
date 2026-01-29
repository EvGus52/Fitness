'use client';

import { useEffect, useState } from 'react';
import styles from './userProfile.module.css';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { getCourses } from '@/services/courses/coursesApi';
import { getCourseProgress } from '@/services/progress/progressApi';
import { CourseFromAPI, CourseProgress } from '@/sharedTypes/sharedTypes';
import { Course } from '@/sharedTypes/sharedTypes';
import UserCourseCard from '@/components/UserCourseCard/UserCourseCard';
import ProfileSkeleton from '@/components/UserProfile/ProfileSkeleton';
import CourseCardSkeleton from '@/components/CourseCardSkeleton/CourseCardSkeleton';

interface UserProfileProps {
    onLogout?: () => void;
}

// Маппинг названий курсов на изображения
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
    return 3;
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

// Вычисление прогресса курса: 100% только когда все тренировки курса выполнены (workoutCompleted).
// totalWorkoutsInCourse — реальное число тренировок в курсе (из данных курса), не из progress.
const calculateCourseProgress = (
    progress: CourseProgress | null,
    totalWorkoutsInCourse: number
): number => {
    if (!progress || totalWorkoutsInCourse === 0) return 0;
    const list = progress.workoutsProgress;
    if (!Array.isArray(list)) return 0;

    const completedWorkouts = list.filter(
        (wp) => wp.workoutCompleted
    ).length;

    return Math.round((completedWorkouts / totalWorkoutsInCourse) * 100);
};

export default function UserProfile({ onLogout }: UserProfileProps) {
    const { user, isLoading, refreshUser } = useUser();
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [coursesProgress, setCoursesProgress] = useState<Record<string, number>>({});
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    // Извлекаем имя из email (часть до @)
    const userName = user?.email ? user.email.split('@')[0] : '';
    const userEmail = user?.email || '';

    useEffect(() => {
        if (user?.selectedCourses && user.selectedCourses.length > 0) {
            loadUserCourses();
        } else {
            setUserCourses([]);
            setCoursesProgress({});
        }
    }, [user?.selectedCourses]); // eslint-disable-line react-hooks/exhaustive-deps -- loadUserCourses depends on user, re-running on user change is intended

    const loadUserCourses = async () => {
        if (!user?.selectedCourses || user.selectedCourses.length === 0) return;

        setIsLoadingCourses(true);
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
                    const isNetworkError =
                        error instanceof Error &&
                        (error.message === 'Network Error' || (error as { code?: string }).code === 'ERR_NETWORK');
                    if (!isNetworkError) {
                        console.error(`Ошибка при загрузке прогресса для курса ${course._id}:`, error);
                    }
                }
            }
            setCoursesProgress(progressMap);
        } catch (error) {
            console.error('Ошибка при загрузке курсов пользователя:', error);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const handleCourseRemoved = () => {
        refreshUser();
        loadUserCourses();
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
