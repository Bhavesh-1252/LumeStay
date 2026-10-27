import { useState } from "react";
import { LuLoader } from "react-icons/lu";
import { Link } from "react-router";
import FormField from "./FormField";
import { useAuth } from "../hooks/useAuth";

const EmailForm = ({ onDone }) => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { handleForgotPasswordAndResend } = useAuth();

  const validate = () => {
    let e = "";
    if (!email.trim()) e = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e = "Enter a valid email address";
    return e;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldError = validate();
    if (fieldError) {
      setEmailError(fieldError);
      return;
    }

    setFormError("");
    setLoading(true);
    try {
      const response = await handleForgotPasswordAndResend(email);
      if (!response.success) {
        setFormError(response.message);
        return;
      }
      onDone(email.trim());
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-900">Forgot password?</h2>
      <p className="my-2 text-sm text-gray-500">
        Enter your email and we'll send you a 6-digit code to reset your
        password
      </p>

      {formError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border mt-2 px-4 py-3 text-sm font-medium bg-red-100 text-red-800 border-red-300"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <FormField
          id="email"
          type="email"
          label="Email"
          value={email}
          error={emailError}
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-xl cursor-pointer bg-[#FF385C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#E31C5F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!loading ? (
            "Send code"
          ) : (
            <>
              <LuLoader className="w-5 h-5 animate-spin" /> Sending
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-600">
        Remembered your password?
        <Link
          to="/login"
          className="font-semibold text-[#FF385C] hover:underline"
        >
          {" "}
          Log in
        </Link>
      </p>
    </div>
  );
};

export default EmailForm;
