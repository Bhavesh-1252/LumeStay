import { Link, useNavigate } from "react-router"
import { FaRegCompass, } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMenu, IoSearch } from "react-icons/io5";
import { useState } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import { useAuth } from "../../../auth/hooks/useAuth";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const { handleLogout } = useAuth();
    const { showFlash } = useFlashMessage();
    const navigate = useNavigate();

    const logout = async () => {
        setLoading(true);
        try {
            const response = await handleLogout();
            showFlash(
                response.success ? response.message : "Logged out from this device",
                response.success ? "success" : "info",
            );
        } finally {
            setLoading(false);
            navigate("/login", { replace: true });
        }
    };

    const hostListing = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            navigate("/listings/new");
        }
    }

    const userProfile = () => {
        if(!isLoggedIn) {
            navigate("/login");
            return;
        }


    }

    // const

    return (
        <nav className="sticky top-0 z-50 w-full lg:px-18 border-b border-gray-200 bg-white">
            <div className="mx-5 flex py-5 items-center">


                {/* Navbar Content */}
                <div
                    id="navbar-content"
                    className=" w-full items-center flex gap-5"
                >

                    {/* Explore */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold text-[#FF385C] flex gap-3"
                        >
                            <FaRegCompass className="w-8 h-8" />
                            LumeStay
                        </Link>
                    </div>

                    <button
                        className="ml-auto rounded-md text-gray-600 md:hidden"
                        type="button"
                    >
                        <IoMenu className="w-5 h-5" />
                    </button>

                    {/* Search */}
                    <form className="mx-auto flex sm:w-1/2 items-center">

                        <input
                            type="text"
                            placeholder="Find destinations"
                            className="mr-2 w-full rounded-full border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-4 transition-all focus:ring-blue-300/65 hidden sm:block"
                        />

                        <button
                            type="submit"
                            className="flex shrink-0 items-center justify-center rounded-full bg-[#fe424d] p-3 text-white transition hover:bg-[#fe424d]"
                        >
                            <IoSearch className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Authentication Links */}
                    <div className="flex items-center gap-5 md:ml-auto">

                        <button
                            onClick={hostListing}
                            className="whitespace-nowrap cursor-pointer px-3 py-2 text-base text-gray-700 hover:text-black"
                        >
                            Host listing
                        </button>


                        <button onClick={userProfile} className="p-2 bg-gray-200 rounded-full cursor-pointer">
                            <FaRegUserCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={logout}
                            className="px-3 py-2 text-gray-700 hover:text-black"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;