import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

import { FileUploaderProps } from "@/types";



export const ProfileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);


    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [file])


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }
    });


    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} className="cursor-pointer" />
            <div className="flex-center gap-4 cursor-pointer">
                <img
                    src={fileUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-top object-cover"
                />
                <p className="text-primary-500 small-regular md:base-semibold">Change profile photo</p>
            </div>
        </div>
    );
}