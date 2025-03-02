'use client';
import { CheckCircle2, Play, Trash } from 'lucide-react';
// import { Bookmark } from '@prisma/client';
// import BookmarkButton from './bookmark/BookmarkButton';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import React, { useState } from 'react';
import CardComponent from './CardComponent';
import VideoThumbnail from './videothumbnail';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export const formatTime = (seconds: number): string => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return hh ? `${hh}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
  };
  
export const ContentCard = ({
  title,
  onClick,
  markAsCompleted,
  type,
  videoProgressPercent,
  contentId,
  contentDuration,
  weeklyContentTitles,
}: {
  type: string;
  contentId?: number;
  image: string;
  title: string;
  onClick: () => void;
  markAsCompleted?: boolean;
  percentComplete?: number | null;
  videoProgressPercent?: number;
  contentDuration?: number;
  uploadDate?: string;
  weeklyContentTitles?: string[];
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Are you sure you want to delete this course?')) {
        try {
          setIsDeleting(true);
          const response = await fetch(`/api/admin/content`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: contentId }),
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
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={onClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e: React.KeyboardEvent) =>
              ['Enter', ' '].includes(e.key) && onClick()
            }
            className={`group relative flex h-fit w-full max-w-md cursor-pointer flex-col gap-2 rounded-2xl transition-all duration-300 hover:-translate-y-2`}
          >
            {markAsCompleted && (
              <div className="absolute right-2 top-2 z-10">
                <CheckCircle2 color="green" size={30} fill="lightgreen" />
              </div>
            )}
              <Button className="absolute bottom-12 left-2 z-10 rounded-md p-2 font-semibold text-white" variant="default" onClick={handleDelete} disabled={isDeleting}>
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
            {type === 'video' && (
              <div className="absolute bottom-12 right-2 z-10 rounded-md p-2 font-semibold text-white">
                <Play className="size-6" />
              </div>
            )}
            {type !== 'video' && (
              <div className="relative overflow-hidden rounded-md">
                <CardComponent
                
                  title={title}
                  contentDuration={
                    contentDuration && formatTime(contentDuration)
                  }
                  type={type}
                />
              </div>
            )}
            {type === 'video' && (
              <div className="relative overflow-hidden">
                <VideoThumbnail
                  title={title}
                  contentId={contentId ?? 0}
                  imageUrl=""
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <h3 className="w-full truncate text-xl font-bold capitalize tracking-tighter md:text-2xl">
                {title}
              </h3>
            </div>
          </motion.div>
        </TooltipTrigger>
        {Array.isArray(weeklyContentTitles) &&
          weeklyContentTitles?.length > 0 && (
            <TooltipContent sideOffset={16}>
              {weeklyContentTitles?.map((title) => <p>{title}</p>)}
            </TooltipContent>
          )}
      </Tooltip>
    </TooltipProvider>
  );
};
