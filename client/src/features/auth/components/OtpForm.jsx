import { useEffect, useRef, useState } from "react";
import { LuLoader } from "react-icons/lu";

const LENGTH = 6;
const RESEND_SECONDS = 60;

function OtpForm({ email, onBack, onVerify, onResend, title, submitLabel }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coolDown, setCoolDown] = useState(null);

  const focusAt = (i) => inputsRef.current[i]?.focus();

  const handleChange = (e, i) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const next = [...digits];
    next[i] = value.slice(-1);
    setDigits(next);

    if (i < LENGTH - 1) focusAt(i + 1);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[i]) {
        next[i] = "";
        setDigits(next);
      } else if (i > 0) {
        next[i - 1] = "";
        setDigits(next);
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusAt(i - 1);
    } else if (e.key === "ArrowRight" && i < LENGTH - 1) {
      focusAt(i + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);
    if (!pasted) return;

    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((d, idx) => (next[idx] = d));
    setDigits(next);
    focusAt(Math.min(pasted.length, LENGTH - 1));
  };

  // CoolDown Timer
  useEffect(() => {
    if (coolDown <= 0) return;
    const t = setTimeout(() => {
      setCoolDown(coolDown - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [coolDown]);

  const code = digits.join("");
  const isComplete = code.length === LENGTH;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    try {
      const response = await onVerify(code);
      if (!response.success) {
        setError(response.message);
        return;
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Yet Incomplete
  const handleResend = async () => {
    setError("");
    setDigits(Array(LENGTH).fill(""));
    focusAt(0);
    try {
      const response = await onResend(email);
      if (response && !response.success) {
        setError(response.message);
        return;
      }
      setCoolDown(RESEND_SECONDS);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">
        Enter the 6-digit code we sent to{" "}
        <span className="font-medium text-gray-700">
          {email || "your email"}
        </span>
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${i + 1}`}
              className="h-12 w-full min-w-0 rounded-xl border border-gray-300 text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 sm:h-14"
            />
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {/* {error} */}
          </div>
        )}

        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full flex justify-center items-center gap-2 rounded-xl cursor-pointer bg-[#FF385C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#E31C5F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!loading ? (
            submitLabel
          ) : (
            <>
              <LuLoader className="w-5 h-5 animate-spin" /> Verifying
            </>
          )}
        </button>
      </form>

      {/* Resend */}
      <p className="mt-5 text-center text-sm text-gray-600">
        Didn't get the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={coolDown > 0}
          className={`font-semibold ${coolDown> 0 ? "text-gray-600" : "cursor-pointer text-[#FF385C] hover:underline"}`}
        >
          {" "}
          {coolDown > 0 ? `Resend in ${coolDown}s` : "Resend"}
        </button>
      </p>

      {/* Back */}
      <p className="mt-2 text-center text-sm text-gray-600">
        Wrong email?{" "}
        <button
          onClick={onBack}
          type="button"
          className="cursor-pointer font-semibold text-[#FF385C] hover:underline"
        > Go back
        </button>
      </p>
    </div>
  );
}

export default OtpForm;
