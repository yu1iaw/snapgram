import { useState } from "react";
import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { GridPostList } from "@/components/shared/GridPostList";
import LikedPosts from "./LikedPosts";




const Profile = () => {
  const { id } = useParams();
  const [isFollowed, setIsFollowed] = useState(() => !!localStorage.getItem(id || ''));
  const { data: currentUser, isError, isLoading } = useGetUserById(id || '');
  const { user } = useAuth();
  const { pathname } = useLocation();


  if (isLoading) {
    return (
      <div className="w-full h-full flex-center">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full h-full flex-center">
        <p className="text-light-4">No user found</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:w-36 lg:h-36 rounded-full"
          />
          <div className="flex flex-1 flex-col justify-between md:mt-2">
            <div className="w-full flex flex-col">
              <h1 className="w-full text-center xl:text-left h3-bold md:h1-semibold">{currentUser?.name}</h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">@{currentUser?.username}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center xl:justify-start mt-10 gap-8 z-20">
              <StatBlock value={currentUser?.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser?.bio}
            </p>
          </div>
          <div className="flex-justify-center gap-4">
            <div className={`${user.id !== id && 'hidden'}`}>
              <Link
                to={`/update-profile/${currentUser?.$id}`}
                className={`bg-dark-4 flex-center h-12 px-5 gap-2 text-light-1 rounded-lg ${user.id !== currentUser?.$id && "hidden"}`}
              >
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            </div>
            <div className={`${user.id === id && 'hidden'}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
                onClick={() => {
                  setIsFollowed(!isFollowed);
                  if (currentUser) {
                    isFollowed ? localStorage.removeItem(currentUser.$id) : localStorage.setItem(currentUser.$id, 'followed');
                  }
                }}
              >
                {isFollowed ? 'Unfollow': 'Follow'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {currentUser?.$id === user.id && (
        <div className="flex w-full max-w-5xl">
          <Link to={`/profile/${id}`} className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && '!bg-dark-3'}`}>
            <img src="/assets/icons/posts.svg" alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link to={`/profile/${id}/liked-posts`} className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'}`}>
            <img src="/assets/icons/like.svg" alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}
      <Routes>
        <Route index element={<GridPostList posts={currentUser?.posts} showUser={false} />} />
        {currentUser?.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
}

export default Profile;

const StatBlock = ({ value, label }: { value: string | number, label: string }) => {
  return (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  )
}