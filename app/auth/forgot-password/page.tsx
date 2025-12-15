"use client";

import AnimatedInput from "@/app/AnimatedInput";
import { useFakeCursor } from "@/app/hooks/useFakeCursor";
import Button from "@/app/auth/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Forgotpassword from "@/app/assets/forgot.svg";
import Link from "next/link";
import { toast } from "sonner";
import Signupheader from "@/app/auth/signupheader"
import { ChevronLeft } from "lucide-react";
import { sendOtp } from "@/app/lib/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { moveFakeCursor, moveCursorToClickPosition, pauseCursor, resumeCursor } =
    useFakeCursor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });
const [loading, setLoading] = useState(false);
const router = useRouter();

  const onSubmit = async (data: ForgotFormData) => {
  if (loading) return;

  try {
    setLoading(true);

    // 1️⃣ Send OTP for RESET PASSWORD
    await sendOtp({
      email: data.email,
      purpose: "login",
    });

    // 2️⃣ Store securely for verify-otp page
    sessionStorage.setItem("otp_email", data.email);
    sessionStorage.setItem("otp_purpose", "login");

    toast.success("OTP sent to your email");

    // 3️⃣ Redirect to OTP verification
    router.push("/auth/verifyotp");

  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-screen flex bg-white text-black">

      {/* LEFT STATIC PANEL */}
      <div className="w-[44.51%] bg-[#022B51] text-white flex flex-col items-center ">
        
        {/* Back Button */}
      <button className="absolute left-14.5 top-10 z-20 cursor-pointer">
                <ChevronLeft size={32} />
      </button>
         <h2 className="text-[32px] text-[#BFBFBF] font-semibold font-[Poppins] mt-30 ">
          Don’t Worry
        </h2>
        {/* Illustration */}
        <img
          src={Forgotpassword.src}
          alt="Forgot Password"
          className="mt-10 w-[380px] h-auto"
        />

        {/* Heading */}
        <h2 className="text-[24px] font-[700] font-[Poppins] mt-10"> 
          Forgot password
        </h2>

        {/* Subheading */}
        <p className="text-center text-[16px] font-[Poppins] mt-4 leading-[26px] px-20.5">
          Don’t worry it happens to the best of us.  
          Enter your email and we’ll help you securely reset it.
        </p>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1 pl-20  pr-30 relative ">

        

        {/* Logo */}
        <Signupheader/>

        {/* Main Heading */}
        <h2 className="text-[44px] font-[700] font-[Poppins] text-black mt-50.5">
          Forgot <span>Your Password?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#595959] text-[24px] font-[Poppins] font-medium mb-6">
          Enter your account’s email
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
            <div id="fake-cursor" className="fake-cursor" />
          <AnimatedInput
            id="email"
            label="Enter Email"
            register={register("email")}
            error={errors.email?.message}
            moveFakeCursor={moveFakeCursor}
            pauseCursor={pauseCursor}
            resumeCursor={resumeCursor}
            moveCursorToClickPosition={moveCursorToClickPosition}
          />

          <Button
  type="submit"
  disabled={loading}
  className="w-full h-[50px] bg-[#018FFF] text-white font-[Poppins] text-[16px] rounded-md"
>
  {loading ? "Sending OTP..." : "Verify Email"}
</Button>


        </form>
      </div>
    </div>
  );
}
