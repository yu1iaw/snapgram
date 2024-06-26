import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";



export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({ accountId: newAccount.$id, name: newAccount.name, email: newAccount.email, username: user.username, imageUrl: avatarUrl });
        return newUser;
    } catch (e) {
        console.log(e);
        return e;
        
    }
}

async function saveUserToDB(user: {accountId: string, email: string, name: string, imageUrl: URL, username?: string}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser;
    } catch (e) {
        console.log(e);
    }
    
}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (e) {
        console.log(e);
    }
    
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;
        
        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (e) {
        console.log(e);
        
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (e) {
        console.log(e);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        )
        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (e) {
        console.log(e);
    }
}

export async function removeFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        ) 
        return { status: "ok" };
    } catch (e) {
        console.log(e);
    }
}

export async function createPost(post: INewPost) {
    try {
        // upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        // get file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await removeFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post?.tags?.replace(/ /g, '').split(',') || [];

        // save post to db
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags
            }
        )

        if (!newPost) {
            await removeFile(uploadedFile.$id);
            throw Error;
        }
        return newPost;
    } catch (e) {
        console.log(e);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if (!posts) throw Error;

    return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (e) {
        console.log(e);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (e) {
        console.log(e);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )
        if (!statusCode) throw Error;

        return { status: "ok" };
    } catch (e) {
        console.log(e);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = { imageUrl: post.imageUrl, imageId: post.imageId };

        if (hasFileToUpdate) {
            // upload image to storage
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
            // get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if (!fileUrl) {
                await removeFile(uploadedFile.$id);
                throw Error;
            }

            image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        const tags = post?.tags?.replace(/ /g, '').split(',') || [];

        // save post to db
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                ...image,
                location: post.location,
                tags
            }
        )

        if (!updatedPost) {
            await removeFile(image.imageId);
            throw Error;
        }
        return updatedPost;
    } catch (e) {
        console.log(e);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if (!post) throw Error;
        
        return post;
    } catch (e) {
        console.log(e);
    }
}

export async function deletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) throw Error;

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if (!statusCode) throw Error;
        await removeFile(imageId);
        
        return { status: "ok" };
    } catch (e) {
        console.log(e);
    }
}

export async function getInfinitePosts({ pageParam = '' }) {
    const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error;

        return posts;
    } catch (e) {
        console.log(e);
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if (!posts) throw Error;

        return posts;
    } catch (e) {
        console.log(e);
    }
}

export async function getSavedPosts(userId?: string) {
    if (!userId) return;

    try {
        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal("user", userId), Query.orderDesc("$updatedAt")]
        )
        if (!savedPosts) throw Error;

        return savedPosts.documents;
    } catch (e) {
        console.log(e);
        
   }
}

export async function getUserPosts(userId?: string) {
    if (!userId) return;

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )
        if (!posts) throw Error;

        return posts;
    } catch (e) {
        console.log(e);
    }
}

export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit))
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )
        if (!users) throw Error;

        return users;
    } catch (e) {
        console.log(e);
    }
}

export async function getUserById(userId: string) {
    if (!userId) return;

    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )
        if (!user) throw Error;

        return user;
    } catch (e) {
        console.log(e);
    }
}

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;

    try {
        let image = { imageUrl: user.imageUrl, imageId: user.imageId };

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await removeFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                ...image
            }
        )
        if (!updatedUser) {
            if (hasFileToUpdate) {
                await removeFile(image.imageId);
            }
            throw Error;
        }
        if (user.imageId && hasFileToUpdate) {
            await removeFile(user.imageId);
        }

        return updatedUser;
    } catch (e) {
        console.log(e);
    }
}
