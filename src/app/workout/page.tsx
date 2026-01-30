import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import WorkoutPageContent from '@/components/WorkoutPageContent/WorkoutPageContent';
import styles from '@/components/WorkoutPageContent/workoutPageContent.module.css';

export default function WorkoutPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className={`center ${styles.page}`}>
            <p>Загрузка...</p>
          </div>
        </>
      }
    >
      <WorkoutPageContent />
    </Suspense>
  );
}
