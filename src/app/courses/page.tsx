import { Suspense } from 'react';
import CourseDetailContent from '@/components/CourseDetailContent/CourseDetailContent';

export default function CoursesPage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <CourseDetailContent />
        </Suspense>
    );
}
