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

// Вычисление прогресса курса
const calculateCourseProgress = (progress: CourseProgress | null): number => {
  if (!progress || !progress.workoutsProgress.length) return 0;

  const completedWorkouts = progress.workoutsProgress.filter(
    (wp) => wp.workoutCompleted
  ).length;
  const totalWorkouts = progress.workoutsProgress.length;

  return Math.round((completedWorkouts / totalWorkouts) * 100);
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
    }, [user?.selectedCourses]);

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

            // Загружаем прогресс для каждого курса
            const progressMap: Record<string, number> = {};
            for (const courseId of userCourseIds) {
                try {
                    const progress = await getCourseProgress(courseId);
                    progressMap[courseId] = calculateCourseProgress(progress);
                } catch (error) {
                    console.error(`Ошибка при загрузке прогресса для курса ${courseId}:`, error);
                    progressMap[courseId] = 0;
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

    if (isLoading) {
        return (
            <div className={styles.profile}>
                <div className="center">
                    <div className={styles.profileCard}>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profile}>
            <div className="center">
                <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        <Image
                            src="/maskUser.png"
                            alt="Аватар пользователя"
                            width={100}
                            height={100}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>{userName}</h2>
                        <p className={styles.userLogin}>Логин: {userEmail}</p>
                        <button onClick={onLogout} className="btn-secondary">
                            Выйти
                        </button>
                    </div>
                </div>

                {userCourses.length > 0 && (
                    <div className={styles.courses__grid}>
                        {isLoadingCourses ? (
                            <p>Загрузка курсов...</p>
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
                )}
            </div>
        </div>
    );
}
