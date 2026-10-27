import { useState } from "react";
import FormField from "./FormField";
import { LuLoader } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { useNavigate } from "react-router";


const NewPasswordForm = ({ email, otp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { handleResetPassword } = useAuth();
  const { showFlash } = useFlashMessage();
  const navigate = useNavigate();

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (formError) setFormError("");
  }

  const validate = () => {
    const e = {};
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters"

    if (!confirmPassword) e.confirmPassword = "Password is required";
    else if (confirmPassword.length < 8) e.confirmPassword = "Password must be at least 8 characters"

    return e;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Both password must match!");
      return;
    }

    setFormError("");
    setLoading(true);
    try {
      console.log(password)
      const response = await handleResetPassword(email, otp, password)
      if (!response.success) {
        setFormError(response.message);
        return;
      }

      showFlash(response.message, "success");
      navigate("/login");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Set a new password
      </h2>
      <p className="my-2 text-sm text-gray-500">
        Choose a strong password you haven't used before
      </p>

      {formError && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-lg border mt-2 px-4 py-3 text-sm font-medium bg-red-100 text-red-800 border-red-300"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <FormField
          id="password"
          label="New password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={errors.password}
          placeholder="Enter new password"
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
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

        <FormField
          id="confirm"
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          error={errors.confirmPassword}
          placeholder="Re-enter new password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearError("confirmPassword");
          }}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-xl cursor-pointer bg-[#FF385C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#E31C5F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!loading ? (
            "Reset password"
          ) : (
            <>
              <LuLoader className="w-5 h-5 animate-spin" /> Resetting
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
