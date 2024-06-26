import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "@/components/shared/Loader";
import { PostCard } from "@/components/shared/PostCard";
import { UserCard } from "@/components/shared/UserCard";
import { useGetPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";



const Home = () => {
  const { data: creators, isPending: isUserLoading, isError: isErrorCreators } = useGetUsers(10);
  const { data: posts, fetchNextPage, hasNextPage, isError: isErrorPosts, isPending: isPostLoading } = useGetPosts();
  const shouldShowPosts = posts?.pages.every(item => !item?.documents.length);
  const { ref, inView } = useInView();


  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);
  

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something went wrong :(</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something went wrong :(</p>
        </div>
      </div>
    )
  }

  const modPosts = posts?.pages.map((page) => {
    return page?.documents.map(post => <PostCard key={post.$id} post={post} />)
  })  

  const modCreators = creators?.documents.slice().sort((a, b) => b.posts.length - a.posts.length);


  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
              shouldShowPosts ? (
                <p className="w-full text-light-4 mt-10 text-center">End of posts</p>
              ) : (
                <ul className="flex flex-1 w-full flex-col gap-9">
                  {modPosts}
                </ul>
              )
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
            <ul className="grid 2xl:grid-cols-2 gap-6">
              {modCreators?.map(creator => (
                <li key={creator.$id}>
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
        )}
      </div>
    </div>
  );
}

export default Home;