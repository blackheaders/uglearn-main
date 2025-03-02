"use client";
import React, { useEffect, useState } from "react";
import { SelectCourse } from "@/components/admin/SelectCourse";
import { Cuboid } from "lucide-react";
import Link from "next/link";
import { CourseZ } from "@/types/types";

export default function CourseContent() {
  const [courses, setCourses] = useState<CourseZ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect( () => {
    fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamp: Date.now() })
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="mx-auto max-w-screen-xl cursor-pointer justify-between p-4">
      <section className="my-4 flex items-center gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <Cuboid size={18} />
        <Link href="/admin/add-course" className="text-lg font-semibold">
          <h2 className="text-md font-bold">Add Course</h2>
        </Link>
      </section>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <SelectCourse courses={courses} />
      )}
    </div>
  );
}
