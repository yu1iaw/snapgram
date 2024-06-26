import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";



const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  return(
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
          <>
            <section className="flex flex-1 flex-col justify-center items-center py-10">
              <Outlet />
            </section>
            <img
              src="/assets/images/side-img.svg"
              alt="logo"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            />
          </>
      )}
    </>
  );
}

export default AuthLayout;