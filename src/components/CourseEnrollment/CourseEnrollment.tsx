'use client';

import styles from './courseEnrollment.module.css';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useUser } from '@/contexts/UserContext';
import { addUserCourse } from '@/services/userCourses/userCoursesApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';

interface CourseEnrollmentProps {
  courseId: string;
  isAdded?: boolean;
  onCourseAdded?: () => void;
}

export default function CourseEnrollment({
  courseId,
  isAdded = false,
  onCourseAdded,
}: CourseEnrollmentProps) {
  const { openSignin } = useAuthModal();
  const { user, refreshUser } = useUser();

  const handleButtonClick = async () => {
    if (!user) {
      openSignin();
      return;
    }
    if (isAdded) return;
    try {
      await addUserCourse(courseId);
      toast.success('Курс успешно добавлен!');
      await refreshUser();
      onCourseAdded?.();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Ошибка при добавлении курса'));
    }
  };

  const buttonText = !user
    ? 'Войдите, чтобы добавить курс'
    : isAdded
      ? 'Курс добавлен'
      : 'Добавить курс';

  return (
    <div className={styles.enrollment}>
      <div className="center">
        <div className={styles.enrollmentInner}>
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h2 className={styles.title}>Начните путь к новому телу</h2>
              <ul className={styles.benefitsList}>
                <li className={styles.benefitItem}>
                  проработка всех групп мышц
                </li>
                <li className={styles.benefitItem}>тренировка суставов</li>
                <li className={styles.benefitItem}>
                  улучшение циркуляции крови
                </li>
                <li className={styles.benefitItem}>
                  упражнения заряжают бодростью
                </li>
                <li className={styles.benefitItem}>
                  помогают противостоять стрессам
                </li>
              </ul>
              <button
                onClick={handleButtonClick}
                className={`btn btn-full ${styles.enrollmentBtn}`}
                disabled={isAdded}
              >
                {buttonText}
              </button>
            </div>
          </div>
          <div className={styles.imageBlock}>
            <div className={styles.lineWrapper}>
              <Image
                src="/line.svg"
                alt=""
                width={670}
                height={390}
                className={`${styles.line} ${styles.lineDesktop}`}
              />
              <Image
                src="/icon/linemob.svg"
                alt=""
                width={430}
                height={250}
                className={`${styles.line} ${styles.lineMobile}`}
              />
            </div>
            <div className={styles.menWrapper}>
              <Image
                src="/men.png"
                alt="Атлет"
                width={487}
                height={540}
                className={styles.men}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
