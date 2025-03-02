"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Comment, User } from "@/types/types";
import {
  MessageCircle,
  MoreVertical,
  Pin,
  Reply,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";

interface CommentFormProps {
  parentId?: string | null;
  onSubmit: (content: string) => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  parentId,
  onSubmit,
  placeholder = "Add a comment...",
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4 mb-6">
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2 bg-[#5C67E5] text-white rounded-lg hover:bg-[#4f5ed7] disabled:opacity-50 disabled:cursor-not-allowed">
            Comment
          </button>
        </div>
      </div>
    </form>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onVote: (commentId: string, type: "upvote" | "downvote") => void;
  isReply?: boolean;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  session: any;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onVote,
  isReply,
  session,
  setComments,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [displayedReplies, setDisplayedReplies] = useState(10);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil(
        (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
      "day"
    );
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/comment?id=${comment.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } else {
      console.error("Failed to delete comment:", data.error);
    }
  };
  return (
    <div className={!isReply ? "mb-4" : ""}>
      <div
        className={`p-4 rounded-lg ${
          comment.isPinned ? "bg-blue-50" : "bg-white"
        }`}>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{comment.user.name}</span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isPinned && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Pin className="w-4 h-4" />
                  <span className="text-sm">Pinned</span>
                </div>
              )}
            </div>
            <p className="text-gray-800 mb-3">{comment.content}</p>
            {!isReply && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVote(comment.id, "upvote")}
                    className="p-1 hover:bg-gray-100 rounded">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <span className="text-sm">{comment.upvotes}</span>
                  <button
                    onClick={() => onVote(comment.id, "downvote")}
                    className="p-1 hover:bg-gray-100 rounded">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm">{comment.downvotes}</span>
                </div>
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Reply className="w-4 h-4" />
                  <span className="text-sm">Reply</span>
                </button>
                {/* @ts-ignore */}
                {session.user?.id === comment.user.id && session.user?.role === "admin" && (
                  <div className="relative">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 py-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                  </div>
                )}
              </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div className="ml-14 mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-[#5C67E5] hover:text-[#4f5ed7] mb-2">
            <MessageCircle className="w-4 h-4" />
            <span>
              {showReplies ? "Hide" : "View"} {comment.repliesCount} replies
            </span>
          </button>

          {showReplies && (
            <div className="-space-y-6">
              {comment.children.slice(0, displayedReplies).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onVote={onVote}
                  isReply={true}
                  setComments={setComments}
                  session={session}
                />
              ))}
              {comment.children.length > displayedReplies && (
                <button
                  onClick={() => setDisplayedReplies((prev) => prev + 10)}
                  className="text-[#5C67E5] hover:text-[#4f5ed7] text-sm">
                  Show more replies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CommentsProps {
  contentId: string;
}

const Comments: React.FC<CommentsProps> = ({ contentId }) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div>You must be logged in to view comments.</div>;
  }

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const sampleComments: Comment[] = await fetch(
        `/api/comment?contentId=${contentId}`
      ).then((res) => res.json());

      setComments(
        [...sampleComments].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.upvotes - a.upvotes;
        })
      );
    };

    fetchComments();
  }, [contentId]);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleComment = async (content: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          contentId,
          //@ts-ignore
          userId: session.user.id,
          parentId: null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        //@ts-ignore
        if (session?.user || session.user?.role === "admin") {
          await fetch(`/api/comment/pin?id=${data.id}`);
          data.isPinned = true;
        }
        data.user = session.user;
        setComments([data, ...comments]);
      } else {
        console.error("Failed to add comment:", data.error);
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  const handleSubmitReply = async (content: string) => {
    if (!replyingTo) return;

    const response = await fetch(`/api/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        contentId,
        //@ts-ignore
        userId: session?.user?.id,
        parentId: replyingTo,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      //@ts-ignore
        if (session?.user || session.user?.role === "admin") {
          await fetch(`/api/comment/pin?id=${data.id}`);
          data.isPinned = true;
        }
      data.user = session.user;
      const updatedComments = comments.map((comment) => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            children: [...(comment.children || []), data],
            repliesCount: (comment.repliesCount || 0) + 1,
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      console.error("Failed to add reply:", data.error);
    }

    setReplyingTo(null);
  };

  const handleVote = async (commentId: string, type: "upvote" | "downvote") => {
    const response = await fetch(`/api/comment/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentId,
        //@ts-ignore
        userId: session.user.id,
        voteType: type,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      data.user = session.user;
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {

            if ( data === null) {
              return {
                ...comment,
                upvotes:
                  type === "upvote" ? comment.upvotes - 1 : comment.upvotes,
                downvotes:
                  type === "downvote" ? comment.downvotes - 1 : comment.downvotes,
              };
            }
            return {
              ...comment,
              upvotes:
                type === "upvote" ? comment.upvotes + 1 : comment.upvotes,
              downvotes:
                type === "downvote" ? comment.downvotes + 1 : comment.downvotes,
            };
          }
          return comment;
        })
      );
    } else {
      console.error("Failed to add vote:", data.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h3 className="text-xl font-semibold mb-6">Comments</h3>
      <CommentForm onSubmit={handleComment} />

      <div className="space-y-6">
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <CommentItem
              session={session}
              comment={comment}
              onReply={handleReply}
              onVote={handleVote}
              setComments={setComments}
              isReply={false}
            />
            {comment && comment.id && replyingTo === comment.id && (
              <div className="ml-14">
                <CommentForm
                  parentId={comment.id}
                  onSubmit={handleSubmitReply}
                  placeholder="Write a reply..."
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Comments;
