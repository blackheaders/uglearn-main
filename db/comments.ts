import db from "@/db";

export async function getComments(contentId: string) {
    const comments = await db.comment.findMany({
        where: { contentId, parentId: null },
        include: {
            user: {
                select: { id: true, name: true }
            },
            children: {
                include: {
                    user: {
                        select: { id: true, name: true }
                    }
                }
            }
        },
        orderBy: { createdAt: "asc" }
    });
    return comments;
}

export async function createComment({ content, contentId, userId, parentId }: { content: string, contentId: string, userId: string, parentId: string | null }) {
    const comment = await db.$transaction(async (prisma) => {
        const newComment = await prisma.comment.create({
            data: {
                content,
                contentId,
                userId,
                parentId,
            }
        });

        if (parentId) {
            await prisma.comment.update({
                where: {
                    id: parentId,
                },
                data: {
                    repliesCount: {
                        increment: 1,
                    }
                }
            });
        }

        return newComment;
    });

    return comment;
}
export async function deleteComment(id: string) {
    const comment = await db.$transaction(async (prisma) => {
        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) throw new Error("Comment not found");

        await prisma.comment.deleteMany({
            where: { parentId: id },
        });

        // Delete all votes related to this comment
        await prisma.vote.deleteMany({
            where: { commentId: id },
        });

        if (comment.parentId) {
            await prisma.comment.update({
                where: { id: comment.parentId },
                data: { repliesCount: { decrement: 1 } },
            });
        }

        return prisma.comment.delete({
            where: { id },
        });
    });

    return comment;
}


export async function createPinComment(id: string) {
    const comment = await db.comment.update({
        where: {
            id,
        },
        data: {
            isPinned: true,
        },
    });
    return comment;
}

export async function AddVote({ commentId, userId, voteType }: { commentId: string, userId: string, voteType: 'upvote' | 'downvote' }) {
    // add all inside transaction
    const vote = await db.$transaction(async (prisma) => {
        const vote = await prisma.vote.findFirst({
            where: {
                commentId,
                userId,
            },
        });
        if (vote) {
            if (vote.voteType === voteType) {
                // delete vote
                await prisma.vote.delete({
                    where: {
                        id: vote.id,
                    },
                });
                // decrease votes count
                if (voteType === 'upvote') {
                    await prisma.comment.update({
                        where: {
                            id: commentId,
                        },
                        data: {
                            upvotes: {
                                decrement: 1,
                            }
                        },
                    });
                } else {
                    await prisma.comment.update({
                        where: {
                            id: commentId,
                        },
                        data: {
                            downvotes: {
                                decrement: 1,
                            }
                        },
                    });
                }
                return null;
            } else {
                await prisma.vote.update({
                    where: {
                        id: vote.id,
                    },
                    data: {
                        voteType: voteType,
                    },
                });
                // increase votes count
                if (voteType === 'upvote') {
                    await prisma.comment.update({
                        where: {
                            id: commentId,
                        },
                        data: {
                            upvotes: {
                                increment: 1,
                            },
                            downvotes: {
                                decrement: 1,
                            }
                        },
                    });
                } else {
                    await prisma.comment.update({
                        where: {
                            id: commentId,
                        },
                        data: {
                            downvotes: {
                                increment: 1,
                            }, 
                            upvotes: {
                                decrement: 1,
                            }
                        },
                    });
                }
                return vote;
            }
        } else {
            const newVote = await prisma.vote.create({
                data: {
                    commentId,
                    userId,
                    voteType: voteType,
                },
            });
            // increase votes count
            if (voteType === 'upvote') {
                await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        upvotes: {
                            increment: 1,
                        }
                    },
                });
            }else {
                await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        downvotes: {
                            increment: 1,
                        }
                    },
                });
            }
            return newVote;
        }                
    });

    return vote;
}