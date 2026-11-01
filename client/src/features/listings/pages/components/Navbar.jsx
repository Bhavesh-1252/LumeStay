import { Link, useNavigate } from "react-router";
import { FaRegCompass } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import { useAuth } from "../../../auth/hooks/useAuth";

const SearchBar = ({ className = " " }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/listings?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find destinations"
        className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/20"
      />

      <button
        type="submit"
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#fe424d] p-3 text-white transition hover:brightness-95"
      >
        <IoSearch className="w-5 h-5" />
      </button>
    </form>
  );
};

const menuItemClass =
  "block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-60";

const UserMenu = ({ isLoggedIn, onHost, onLogout, loggingOut }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key == "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const onclose = () => setOpen(false);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="cursor-pointer rounded-full bg-gray-200 p-2 text-gray-700 hover:text-black"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaRegUserCircle className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {isLoggedIn ? (
            <>
              <button
                className={`${menuItemClass} sm:hidden`}
                onClick={() => {
                  onclose();
                  onHost();
                }}
              >
                Host Listing
              </button>
              <button
                disabled={loggingOut}
                onClick={() => {
                  onclose();
                  onLogout();
                }}
                className={menuItemClass}
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onclose} className={menuItemClass}>
                Log in
              </Link>
              <Link to="/register" onClick={onclose} className={menuItemClass}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, handleLogout } = useAuth();
  const isLoggedIn = Boolean(true);

  const { showFlash } = useFlashMessage();
  const navigate = useNavigate();

  const handleHostListing = () => {
    navigate(isLoggedIn ? "/listings/new" : "/login");
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      const response = await handleLogout();
      showFlash(
        response.success ? response.message : "Logged out from this device",
        response.success ? "success" : "info",
      );
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white lg:px-18">
      <div className="mx-5 py-4">
        {/* Logo */}
        <div className="flex items-center gap-5">
          <Link to="/" className="text-2xl font-bold text-[#FF385C] flex gap-3">
            <FaRegCompass className="w-8 h-8" />
            LumeStay
          </Link>

          {/* Desktop search */}
          <SearchBar className="mx-auto hidden w-full max-w-xl md:flex" />

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <button
              onClick={handleHostListing}
              className="hidden cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:text-black sm:block"
            >
              Host listing
            </button>

            <UserMenu
              isLoggedIn={isLoggedIn}
              loggingOut={loggingOut}
              onHost={handleHostListing}
              onLogout={logout}
            />
          </div>
        </div>

        {/* Mobile search (second row) */}
        <SearchBar className="mt-4 md:hidden" />
      </div>
    </nav>
  );
};

export default Navbar;
