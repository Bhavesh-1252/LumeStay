import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LuLoader } from "react-icons/lu";
import { useFlashMessage } from "../../../context/FlashMessage.context";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { showFlash } = useFlashMessage()

  const { user, loading, handleLogin } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setError("Email or username is required!")
      return;
    }
    if (!password) {
      setError("Password is required!")
      return;
    }

    const response = await handleLogin(identifier, password);

    if (!response.success) {
      showFlash(response.message, "error")
      return;
    }

    showFlash(response.message, "success");
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FF385C]">
            Lumestay
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back to your next stay
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Log in</h2>
          <p className="my-2 text-sm text-gray-500">
            Enter your details to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
              />
            </div>
            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-[#FF385C] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl cursor-pointer bg-[#FF385C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#E31C5F] active:scale-[0.99]"
            >
              {!loading ?
                "Log in" :
                <>
                  <LuLoader className="w-5 h-5 animate-spin " /> Loading
                </>}
            </button>
          </form>
          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          {/* Google */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
              />
              <path
                fill="#34A853"
                d="M12 21.99c2.63 0 4.84-.87 6.45-2.34l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.99z"
              />
              <path
                fill="#FBBC05"
                d="M6.53 14.09A5.85 5.85 0 0 1 6.23 12c0-.72.12-1.42.3-2.09V7.38H3.28A9.99 9.99 0 0 0 2 12c0 1.66.4 3.23 1.28 4.62l3.25-2.53z"
              />
              <path
                fill="#EA4335"
                d="M12 5.88c1.43 0 2.72.49 3.74 1.45l2.8-2.8C16.83 2.96 14.63 2 12 2a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 7.6 9.46 5.88 12 5.88z"
              />
            </svg>
            Continue with Google
          </button>
          {/* Signup */}
          <p className="mt-7 text-center text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="font-semibold text-[#FF385C] hover:underline"
            >
              {" "}
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
