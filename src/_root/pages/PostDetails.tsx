import { Link, useNavigate, useParams } from "react-router-dom";

import { useDeletePost, useGetPostById, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "@/components/shared/Loader";
import { multiFormatDateString } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PostStats } from "@/components/shared/PostStats";
import { GridPostList } from "@/components/shared/GridPostList";



const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useAuth();
  const { mutate: deletePost } = useDeletePost();
  const { data: userPosts, isPending: isUserPostPending } = useGetUserPosts(post?.creator.$id);
  const navigate = useNavigate();

  const otherUserPosts = userPosts?.documents.filter(userPost => userPost.$id !== id);
  

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate('/');
  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />

          <div className="post_details-info">
            <div className="w-full flex-between">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={'/assets/icons/profile-placeholder.svg' || post?.creator.imageUrl}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)} • {post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-2">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-1 w-full flex-col small-medium lg:base-regular">
              <p>{post?.caption}</p>
              {post?.tags?.filter(Boolean).length > 0 && (
                <ul className="flex gap-1 mt-2">
                  {post?.tags.map((tag: string) => (
                    <li key={tag} className="text-light-3">
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="w-full">
              <PostStats post={post!} userId={user.id} />
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl">
        <hr className="w-full border border-dark-4/80" />
        <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
        {isUserPostPending || !otherUserPosts ? (
          <Loader />
        ) : (
            <GridPostList posts={otherUserPosts} />
        )}
      </div>
    </div>
  );
}

export default PostDetails;