import { useAuth } from "@/context/AuthContext";
import { GridPostListProps } from "@/types";
import { Link } from "react-router-dom";
import { PostStats } from "./PostStats";



export const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useAuth();

  return (
    <ul className="grid-container">
      {posts?.map(post => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex flex-1 items-center justify-start gap-2">
                <img
                  src={'/assets/icons/profile-placeholder.svg' || post.creator.imageUrl}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}