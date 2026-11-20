import { useEffect, useState } from "react";
import EmailForm from "../components/EmailForm";
import OtpForm from "../components/OtpForm";
import NewPasswordForm from "../components/NewPasswordForm";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { LuArrowLeft } from "react-icons/lu";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { handleVerifyOtp, handleForgotPasswordAndResend } = useAuth();

  const navigate = useNavigate();
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate("/");
  })


  const onVerify = async (userOtp) => {
    const response = await handleVerifyOtp(email, userOtp);
    if (response.success) {
      setOtp(userOtp);
      setStep(3);
    }
    return response;
  }

  const onResend = async (userEmail) => {
    const response = await handleForgotPasswordAndResend(userEmail);
    return response;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:left-6 sm:top-6"
        >
          <LuArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FF385C]">
            Lumestay
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We'll help you get back to your next stay
          </p>
        </div>
        {step === 1 && <EmailForm
          onDone={(userEmail) => {
            setEmail(userEmail);
            setStep(2);
          }}
        />}

        {step === 2 && <OtpForm
          email={email}
          onVerify={onVerify}
          onBack={() => {
            setStep(1);
          }}
          title={"Verify your email"}
          submitLabel={"Verify OTP"}
          onResend={onResend}
        />}

        {step === 3 && < NewPasswordForm otp={otp} email={email} />}
      </div>
    </div>
  );
};

export default ForgotPassword;
