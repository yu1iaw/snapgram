import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useAuth } from "@/context/AuthContext";



export const Topbar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const { user } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isSuccess) navigate(0);
        
    }, [isSuccess]);


    return (
        <section className="topbar">
            <div className="flex-between px-5 py-4">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
                </Link>
                <div className="flex gap-4">
                    <Button onClick={() => signOut()} variant="ghost" className="shad-button_ghost">
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img src={'/assets/icons/profile-placeholder.svg' || user.imageUrl} alt="profile" className="w-8 h-8 rounded-full" />
                    </Link>
                </div>
            </div>
        </section>
    );
}