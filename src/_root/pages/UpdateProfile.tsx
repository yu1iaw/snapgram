import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ProfileValidation } from "@/lib/validation";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "@/components/shared/Loader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileUploader } from "@/components/shared/ProfileUploader";



const UpdateProfile = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const { data: currentUser } = useGetUserById(id || '');
  const { mutateAsync: updateUser, isLoading: isPendingUpdate } = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });


  if (!currentUser) {
    return (
      <div className="w-full h-full flex-center">
        <Loader />
      </div>
    )
  }

  async function handleUpdate(values: z.infer<typeof ProfileValidation>) {
    const updatedUser = await updateUser({
      ...values,
      userId: currentUser?.$id || '',
      imageUrl: currentUser?.imageUrl,
      imageId: currentUser?.imageId
    })

    if (!updatedUser) {
      return toast({ title: "Update user failed. Please tyr again." });
    }

    setUser({
      ...user,
      name: updatedUser.name,
      bio: updatedUser.bio,
      imageUrl: updatedUser.imageUrl
    })
    
    navigate(`/profile/${id}`);
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start justify-start w-full max-w-5xl gap-3">
          <img src="/assets/icons/edit.svg" alt="edit" width={36} height={36} className="invert-white" />
          <h2 className="h3-bold md:h2-bold w-full text-left">Edit Profile</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col w-full max-w-5xl mt-4 gap-7">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} disabled />                  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} disabled />                  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />                  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center gap-4">
              <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isPendingUpdate}>
                {isPendingUpdate ? <Loader /> : 'Update Profile'}
              </Button>
            </div>
       
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdateProfile;