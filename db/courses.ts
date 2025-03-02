import db from '@/db';


export async function getCourse(courseId: string) {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });
  return course;
}

export async function findContentById( contentId : string) {
  const content = await db.content.findUnique({
    where: {
      id: contentId,
    },
  });
  return content;
}

export async function getFullContent(courseId?: string, parentId?: string) {
  if (courseId) {
    let content = await db.content.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "asc",
      },
    });
    content = content.filter((content) => content.parentId === null);
    return content;
  } else if (parentId) {
    const content = await db.content.findMany({
      where: {
        parentId: parentId,
      },
      orderBy: {
        position: "asc",
      },
    });
    return content;
  }
  return [];
}