import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";
import { useAuth } from "../hooks/useAuth";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { useNavigate } from "react-router";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const { handleVerifyEmail } = useAuth();
  const { showFlash } = useFlashMessage();
  const navigate = useNavigate();

  const handleRegistered = (registeredEmail) => {
    setEmail(registeredEmail);
    setStep(2);
  };
  // return <RegisterForm />;

  const onVerify = async (code) => {
    const response = await handleVerifyEmail(email, code);
    if (response.success) {
      showFlash(response.message, "success");
      navigate("/login");
    }
    return response;
  };

  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FF385C]">
            Lumestay
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create your account and start exploring
          </p>
        </div>
        {step === 1 ? (
          <RegisterForm onSuccess={handleRegistered} />
        ) : (
          <OtpForm
            email={email}
            onBack={() => setStep(1)}
            onVerify={onVerify}
            submitLabel={"Verify Email"}
            title={"Verify your email"}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
