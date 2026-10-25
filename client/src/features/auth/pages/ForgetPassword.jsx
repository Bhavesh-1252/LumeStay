import { useState } from "react";
import EmailForm from "../components/EmailForm";
import OtpForm from "../components/OtpForm";
import NewPasswordForm from "../components/NewPasswordForm";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FF385C]">
            Lumestay
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We'll help you get back to your next stay
          </p>
        </div>
        {step === 1 ? (
          <EmailForm
            onDone={(userEmail) => {
              setEmail(userEmail);
              setStep(2);
            }}
          />
        ) : step === 2 ? (
          <OtpForm
            email={email}
            onDone={(userOtp) => {
              setOtp(userOtp);
              setStep(3);
            }}
            onBack={() => {
              setStep(1);
            }}
          />
        ) : (
          <NewPasswordForm otp={otp} email={email} />
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
