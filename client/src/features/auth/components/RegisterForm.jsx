import { useState } from "react";
import { Link } from "react-router";
import { LuLoader } from "react-icons/lu";
import FormField from "./FormField";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("")
  const [errors, setErrors] = useState({});

  const { handleRegister } = useAuth();

  const validate = () => {
    let e = {};
    if (!username.trim()) e.username = "Username is required";
    else if (username.trim().length < 3) e.username = "Username must be at least 3 characters";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address";

    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters"

    return e;
  }

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (formError) setFormError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length) {  // Converts found object to array of object keys
      setErrors(found);
      return;
    }

    setLoading(true);
    setFormError("");
    try {
      const response = await handleRegister(username, email, password);
      if (!response.success) {
        setFormError(response.message);
        return;
      }

      onSuccess(email);
    }
    catch (error) {
      setFormError(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Create account
      </h2>
      <p className="text-sm text-gray-500">
        Join Lumestay and find your perfect stay
      </p>

      {formError && <div
        className={`flex items-center gap-3 rounded-lg border mt-2 px-4 py-3 text-sm font-medium bg-red-100 text-red-800 border-red-300`}
      >
        {formError}
      </div>}

      <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
        {/* Full Name */}
        {/* <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            value={username}
            placeholder="Enter your username"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
          />
        </div> */}
        <FormField
          id="username"
          label="Username"
          error={errors.username}
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            clearError("username")
          }}
          placeholder="Enter your username"
        />

        {/* Email */}
        {/* <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            value={email}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
          />
        </div> */}
        <FormField
          id="email"
          label="Email"
          error={errors.email}
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearError("email")
          }}
          placeholder="Enter your email"
        />

        {/* Password */}

        <FormField
          id="password"
          label="Password"
          error={errors.password}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            clearError("password")
          }}
          placeholder="Create a password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-xl cursor-pointer bg-[#FF385C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#E31C5F] active:scale-[0.99]"
        >
          {!loading ?
            "Create account" :
            <>
              <LuLoader className="w-5 h-5 animate-spin " /> Loading
            </>}
        </button>
      </form>
      {/* Divider */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400"> OR </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {/* Google Signup */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border cursor-pointer border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
      {/* Login */}
      <p className="mt-5 text-center text-sm text-gray-600">
        Already have an account?
        <Link
          to="/login"
          className="font-semibold text-[#FF385C] hover:underline"
        >
          {" "} Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
