import { useParams } from "react-router-dom";

import { PostForm } from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "@/components/shared/Loader";



const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || '');


  if (isLoading) return <Loader />

  return(
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 w-full justify-start">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold w-full text-left">Edit Post</h2>
        </div>
        <PostForm action="update" post={post} />
      </div>
    </div>
  );
}

export default EditPost;