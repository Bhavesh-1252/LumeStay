import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { BiLoaderCircle } from "react-icons/bi";

const Protected = ({ children }) => {
    const { user, authLoading } = useAuth()

    if (authLoading) {
        return(
            <div className="flex justify-center items-center">
                 <BiLoaderCircle className="w-10 h-10 animate-spin" />
            </div>
        )
    }

    if(!user) {
        <Navigate to={"/login"} />
    }

    return children;
}

export default Protected;