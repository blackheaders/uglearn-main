'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageCircle, PlayCircle, Trash } from "lucide-react";
import { useState } from 'react';

type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    openToEveryone?: boolean;
    totalVideos?: number;
    totalVideosWatched?: number;
  };

export const CourseCard = ({
  course,
  onClick,
}: {
  course: Course;
  onClick: () => void;
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const imageUrl = course.imageUrl ? course.imageUrl : 'banner_placeholder.png';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/admin/course`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: course.id }),
        });
        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-lg cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          alt={course.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          height="200"
          src={imageUrl}
          style={{
            aspectRatio: "300/200",
            objectFit: "cover",
            filter: "brightness(1.2) contrast(1.1)",
          }}
          width="300"
        />        
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex space-x-2">
          <Button className="flex-1" variant="default" onClick={onClick}>
            <PlayCircle className="w-4 h-4 mr-2" />
            View Course
          </Button>
          <Button className="bg-red-400" variant="default" onClick={handleDelete} disabled={isDeleting}>
            <Trash className="w-4 h-4" />
            {isDeleting && (
              <motion.div
                className="ml-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⌛
              </motion.div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
