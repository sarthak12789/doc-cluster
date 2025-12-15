"use client";

import AnimatedInput from "@/app/AnimatedInput";
import { useFakeCursor } from "@/app/hooks/useFakeCursor";
import Button from "@/app/auth/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import ResetVector from "@/app/assets/reset.svg"; // your reset illustration
import Link from "next/link";
import { toast } from "sonner";
import Signupheader from "@/app/auth/signupheader"
import { resetPassword } from "@/app/lib/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const resetSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const password = data.password;
    if (password.trim().length === 0) return;
    // Show errors only when user typed something
    if (password.trim().length > 0) {
      if (password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain at least 6 characters",
        });
        return;
      }

      if (!/[0-9]/.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain at least 1 number",
        });
        return;
      }

      if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain an uppercase letter",
        });
        return;
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain a lowercase letter",
        });
        return;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain a special character",
        });
        return;
      }
    }

    // Confirm password check
    if (data.confirmPassword.length >= 0 &&
      data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Both the Passwords are not same",
      });
    }
  });


type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { moveFakeCursor, moveCursorToClickPosition, pauseCursor, resumeCursor } =
    useFakeCursor();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, submitCount },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });


  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ResetFormData) => {
    if (loading) return;

    const email = sessionStorage.getItem("otp_email");

    if (!email) {
      toast.error("Session expired. Please restart reset process.");
      router.replace("/auth/forgot-password");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        password: data.password,
      });

      // ✅ cleanup sensitive data
      sessionStorage.removeItem("otp_email");
      sessionStorage.removeItem("otp_purpose");

      toast.success("Password reset successfully");

      // ✅ redirect to login
      router.replace("/auth/login");

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen flex bg-white text-black">

      {/* LEFT PANEL */}
      <div className="w-[44.51%] bg-[#022B51] text-white flex flex-col items-center px-12 pt-10">

        {/* Back Arrow */}
        <button className="absolute left-14.5 top-10 z-20 cursor-pointer">
          <ChevronLeft size={32} />
        </button>

        {/* Top Heading */}
        <h2 className="text-[#BFBFBF] text-[32px] font-[Poppins] font-semibold text-center mt-10">
          Don’t worry, we’ve got you!
        </h2>

        {/* Illustration */}
        <img
          src={ResetVector.src}
          alt="Reset Password"
          className="mt-10 w-[380px] h-auto"
        />

        {/* Mid Heading */}
        <h3 className="text-[24px] font-[Poppins] font-[700] mt-10 text-center">
          Time for a fresh password!
        </h3>

        {/* Description */}
        <p className="mt-4 text-center text-[16px] font-[Poppins] font-[600] px-6 leading-[22px]">
          Create a new password to secure your account.
          Make sure it’s strong and easy for you to remember.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1 pl-20  pr-30 relative">

        {/* Fake Cursor */}


        {/* Logo */}
        <Signupheader />

        {/* Main Title */}
        <h2 className="text-[44px] font-[700] font-[Poppins] text-black mt-30">
          Reset Password
        </h2>

        {/* Subtitle */}
        <p className="text-[#595959] text-[24px] font-[Poppins] font-medium mb-6">
          Set a new password
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
          <div id="fake-cursor" className="fake-cursor" />
          <AnimatedInput
            id="password"
            type="password"
            label="Enter Password"
            register={register("password")}
            error={
              submitCount > 0 && !watch("password")
                ? "Please enter password"
                : errors.password?.message || ""
            }
            moveFakeCursor={moveFakeCursor}
            pauseCursor={pauseCursor}
            resumeCursor={resumeCursor}
            moveCursorToClickPosition={moveCursorToClickPosition}
          />



          <AnimatedInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            moveFakeCursor={moveFakeCursor}
            pauseCursor={pauseCursor}
            resumeCursor={resumeCursor}
            moveCursorToClickPosition={moveCursorToClickPosition}
          />

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#018FFF] text-white font-[Poppins] text-[16px] rounded-md"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

        </form>
      </div>
    </div>
  );
}
