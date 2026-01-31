'use client';

import styles from './workoutVideo.module.css';

interface WorkoutVideoProps {
  videoUrl: string;
  title?: string;
}

export default function WorkoutVideo({ videoUrl, title }: WorkoutVideoProps) {
  if (!videoUrl) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.placeholder}>Видео недоступно</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        src={videoUrl}
        title={title ?? 'Видео тренировки'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
