import React, { useEffect, useState } from "react";

import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";



export const PostStats = ({ post, userId }: { post: Models.Document, userId: string }) => {
    const likesList = post.likes.map((user: Models.Document) => user.$id);
    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);
    
    const { mutate: likePost, isLoading: isLikePending } = useLikePost();
    const { mutate: savePost, isLoading: isSavePending } = useSavePost();
    const { mutate: deleteSavedPost, isLoading: isDeleteSavedPending } = useDeleteSavedPost();
    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post?.$id === post?.$id
    );


    useEffect(() => {
        setIsSaved(!!savedPostRecord);
    }, [currentUser]);


    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];
        const hasLikes = newLikes.includes(userId);
        if (hasLikes) {
            newLikes = newLikes.filter(id => id !== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes });
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
       
        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post.$id, userId });
            setIsSaved(true);
        }
    }


    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <button
                    onClick={handleLikePost}
                    type="button"
                    disabled={isLikePending}
                    className={`${isLikePending && 'opacity-10'}`}
                >
                    <img
                        src={`/assets/icons/${checkIsLiked(likes, userId) ? 'liked' : 'like'}.svg`}
                        alt="like"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />

                </button>
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2 mr-5">
                <button
                    className={`${isSavePending || isDeleteSavedPending && 'opacity-10'}`}
                    onClick={handleSavePost}
                    type="button"
                    disabled={isSavePending || isDeleteSavedPending}
                >
                    <img
                        src={`/assets/icons/${isSaved ? 'saved' : 'save'}.svg`}
                        alt="save"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </button>
            </div>
        </div>
    );
}