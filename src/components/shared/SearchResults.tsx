import { SearchResultsProps } from "@/types";
import { Loader } from "./Loader";
import { GridPostList } from "./GridPostList";



export const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {

  if (isSearchFetching) return <Loader />

  if (searchedPosts && searchedPosts.documents.length) {
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  } 

  return <p className="text-light-4 text-center w-full mt-10">No results found</p>
}