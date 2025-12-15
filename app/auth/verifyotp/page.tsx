"use client";

import { useState, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Signupheader from "@/app/auth/signupheader";
import VerifyVector from "@/app/assets/verifyotp.svg";
import Button from "@/app/auth/button";
import {
  verifyOtp as verifyOtpApi,
  sendOtp
} from "@/app/lib/auth.api";

import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const INPUT_LENGTH = 6;
  const [timer, setTimer] = useState(0);   // 0 = active, >0 means countdown running

  const [otp, setOtp] = useState<string[]>(Array(INPUT_LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "success" | "error" | "empty">("idle");
  const router = useRouter();
const [loading, setLoading] = useState(false);

  


  const inputsRef = useRef<Array<HTMLInputElement | null>>(
    Array(INPUT_LENGTH).fill(null)
  );
  const resendOtp = async () => {
  if (timer > 0) return;

  const email = sessionStorage.getItem("otp_email");
  const purpose = sessionStorage.getItem(
    "otp_purpose"
  ) as "register" | "login" | "reset-password" | null;

  if (!email || !purpose) return;

  try {
    await sendOtp({ email, purpose });

    setTimer(30);
    setOtp(Array(INPUT_LENGTH).fill(""));
    setStatus("idle");

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch {
    // optional toast error
  }
};


  // ------------------- HANDLERS -------------------
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // only digit or empty

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    setStatus("idle");

    if (value && index < INPUT_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

 const handleVerifyOtp = async () => {
  if (loading) return;

  const code = otp.join("");

  if (!code) {
    setStatus("empty");
    return;
  }

  const email = sessionStorage.getItem("otp_email");
  const purpose = sessionStorage.getItem(
    "otp_purpose"
  ) as "register" | "login" | "reset-password" | null;

  if (!email || !purpose) {
    router.replace("/auth/login");
    return;
  }

  try {
    setLoading(true);
    setStatus("idle");

    await verifyOtpApi({
      email,
      otp: code,
      purpose,
    });

    setStatus("success");

    sessionStorage.removeItem("otp_purpose");

    if (purpose === "register") router.replace("/auth/login");
    if (purpose === "login") router.replace("/auth/resetpassword");
    if (purpose === "reset-password")
      router.replace("/auth/resetpassword");

  } catch {
    setStatus("error");
  } finally {
    setLoading(false);
  }
};




  // ------------------- UI -------------------
  return (
    <div className="w-full min-h-screen flex bg-white text-black">

      {/* LEFT PANEL */}
      <div className="w-[44.51%] bg-[#022B51] text-white flex flex-col items-center px-12">

        {/* Back Arrow */}
        <ChevronLeft size={32} className="absolute left-14.5 top-10 cursor-pointer" />

        <h2 className="text-[#BFBFBF] text-[32px] font-semibold text-center mt-40 w-[462px]">
          Almost there – verify to continue
        </h2>

        {/* Illustration */}
        <img src={VerifyVector.src} className="w-[380px] " />

        <h3 className="text-[24px] font-bold text-center mt-10">
          Let’s verify it’s really you!
        </h3>

        <p className="text-center text-[16px] mt-1.5 font-semibold px-18">
          Verify your identity to continue. Enter the OTP we’ve sent
          to your registered email.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col flex-1 pl-20 pr-30 relative">

        <Signupheader />

        <h1 className="text-[44px] font-[700] text-black mt-30">Verification</h1>

        <p className="text-[#999] text-[24px] font-medium ">Enter the OTP</p>

        {/* OTP BOXES ROW */}
        <div className="flex  flex-col mt-15">
          <div className=" flex flex-col mb-8.5">
            <div className="flex justify-between">{otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`
                w-[84px] h-[80px] text-center text-[28px] font-semibold rounded-[20px]
                bg-[#D9EEFF] outline-none transition-all duration-200

                ${digit && status === "idle" ? "border-b-[10px] border-[#0172CC]" : ""}
                ${status === "success" ? "border-b-[10px] border-[#01CC6A]" : ""}
                ${status === "error" ? "border-b-[10px] border-[#CC0101]" : ""}
              `}
              />
            ))}
            </div>
            <p
              className={`text-[16px] font-semibold mb-4 min-h-[25px]
    ${status === "error"
                  ? "text-red-600"
                  : status === "empty"
                    ? "text-red-600"
                    : "text-transparent"
                }
  `}
            >
              {status === "error"
                ? "OTP invalid, Try again"
                : status === "empty"
                  ? "Please enter OTP"
                  : " "}
            </p>

          </div>



          {/* VERIFY BUTTON */}
          <Button
  onClick={handleVerifyOtp}
  disabled={loading}
>
  {loading ? "Verifying..." : "Verify OTP"}
</Button>

                
        </div>
        {/* RESEND BUTTON */}
        <button
          onClick={resendOtp}
          disabled={timer > 0}
          className={`w-full h-[50px] mt-3 rounded-md font-bold text-[18px] border border-[#018FFF]
    ${timer > 0
              ? "border-gray-400 text-gray-400 cursor-not-allowed"
              : "border-[#018FFF] text-[#018FFF] cursor-pointer "
            }
  `}
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </button>

      </div>
    </div>
  );
}
