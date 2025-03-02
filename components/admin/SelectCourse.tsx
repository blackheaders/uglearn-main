'use client';
import { CourseZ } from '@/types/types';
import { useRouter } from 'next/navigation';
import { CourseCard } from '../CourseCard';

export const SelectCourse = ({ courses }: { courses: CourseZ[] }) => {
  const router = useRouter();

  return (
    <div className="mx-auto grid max-w-screen-xl cursor-pointer grid-cols-1 justify-between gap-5 p-4 md:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          //@ts-ignore
          course={course}
          onClick={() => {
            router.push(`/admin/content/${course.id}`);
          }}
          key={course.id}
        />
      ))}
    </div>
  );
};
