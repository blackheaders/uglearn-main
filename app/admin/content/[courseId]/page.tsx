'use client';
import { AddContent } from "@/components/admin/AddContent";
import { AdminCourseContent } from "@/components/admin/AdminCourseContent";

export default async function UpdateCourseContent({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;
  const rest: string[] = [];
  const course = await fetch('/api/admin/course/byId', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  }).then((res) => res.json());
  const fullCourseContent = await fetch(`/api/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  }).then((res) => res.json());

  return (
    <main className="wrapper flex max-w-screen-xl m-10 flex-col gap-14">
      <div className="flex w-full flex-col justify-between gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <h1 className="text-2xl font-bold md:text-4xl">Content</h1>
        <p className="text-lg capitalize">{course?.title || ""}</p>
      </div>

      <AddContent
        rest={rest}
        courseId={courseId}
        parentContentId={rest[rest.length - 1]}
        courseTitle={course?.title || ""}
        gdlink={course?.gdlink}
      />
      <AdminCourseContent
        rest={rest}
        // @ts-ignore
        courseContent={fullCourseContent?.map((x: any) => ({
          title: x?.title || '',
          type: x?.type || '',
          image: x?.thumbnail || '',
          id: x?.id || 0,
          createdAt: x?.createdAt,
        }))}
        courseId={courseId}
      />
    </main>
  );
}
