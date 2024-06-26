import { GridPostList } from "@/components/shared/GridPostList";
import { Loader } from "@/components/shared/Loader";
import { useAuth } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";



const Saved = () => {
  const { user } = useAuth();
  const { data } = useGetSavedPosts(user.id);

  const savedPosts = data?.map(post => post.post);

  return(
    <div className="saved-container">
      <div className="flex w-full max-w-5xl gap-2">
        <img src="/assets/icons/save.svg" alt="edit" width={36} height={36} className="invert-white" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      {!savedPosts ? <Loader /> : (
        <ul className="flex justify-center w-full max-w-5xl gap-9">
          {!savedPosts.length ? (
            <p className="text-light-4">No available posts</p>
          ): (
              <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default Saved;