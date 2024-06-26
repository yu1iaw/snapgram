import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { GridPostList } from "@/components/shared/GridPostList";
import { SearchResults } from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "@/components/shared/Loader";



const Explore = () => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const { ref, inView } = useInView();


  useEffect(()=> {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);


  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every(item => !item?.documents.length);


  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex w-full px-4 gap-1 rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h2 className="body-bold md:h3-bold">Popular Today</h2>
        <div className="flex-center bg-dark-3 gap-3 px-4 py-2 rounded-xl cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="w-full text-light-4 mt-10 text-center">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents} /> 
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Explore;