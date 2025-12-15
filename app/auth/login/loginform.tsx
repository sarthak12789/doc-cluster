"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import AnimatedInput from "@/app/AnimatedInput";
import { useFakeCursor } from "@/app/hooks/useFakeCursor";
import Button from "@/app/auth/button";

import google from "@/app/assets/google.svg";
import github from "@/app/assets/github.svg";
import SignupHeader from "../signupheader";
import { loginUser } from "@/app/lib/auth.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ✅ SIMPLE LOGIN SCHEMA
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email id"),
  password: z.string().min(6, "Invalid password"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const {
    moveFakeCursor,
    moveCursorToClickPosition,
    pauseCursor,
    resumeCursor,
  } = useFakeCursor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

 const router = useRouter();

const onSubmit = async (data: LoginFormData) => {
  if (loading) return;

  try {
    setLoading(true);

    // 🔐 Login with email + password
    const res = await loginUser({
      emailOrPhoneOrUsername: data.email,
      password: data.password,
    });

    const user = res.data.data;

    toast.success("Logged in successfully");

    /**
     * 🚀 FUTURE READY (OTP LOGIN)
     *
     * When OTP login UI is ready:
     *
     * 1. await sendOtp({ email: user.email, purpose: "login" });
     * 2. sessionStorage.setItem("otp_email", user.email);
     * 3. sessionStorage.setItem("otp_purpose", "login");
     * 4. router.push("/auth/verify-otp");
     */

    // ✅ For now → direct login success
    router.replace("/dashboard");

  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Invalid email or password"
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="w-full sm:w-[55.49%] flex flex-col pt-25 sm:pt-0  text-black box-border px-5 sm:pl-12 md:pl-16 lg:px-20  sm:pr-12 md:pr-16 lg:pr-30  mx-auto">
      <SignupHeader/>
      {/* ✅ MAIN HEADING */}
      <h2
        className="
          font-[poppins]
          text-[44px]
          font-bold
          text-black
          mt-16
        "
      >
        Welcome Back
      </h2>

      {/* ✅ SUB HEADING */}
      <p
        className="
          font-[poppins]
          text-[24px]
          font-medium
          text-[#595959]
          mb-7.5
        "
      >
        Log In to your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">

        {/* ✅ FAKE CURSOR */}
        <div id="fake-cursor" className="fake-cursor" />

        {/* ✅ EMAIL */}
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

        {/* ✅ PASSWORD */}
        <AnimatedInput
          id="password"
          type="password"
          label="Enter Password"
          register={register("password")}
          error={errors.password?.message}
          moveFakeCursor={moveFakeCursor}
          pauseCursor={pauseCursor}
          resumeCursor={resumeCursor}
          moveCursorToClickPosition={moveCursorToClickPosition}
        />

        {/* ✅ REMEMBER + FORGOT */}
        <div className="flex items-center justify-between mt-1">

          <label className="flex items-center gap-2 font-[poppins] text-sm text-[#595959]">
            <input
              type="checkbox"
              {...register("remember")}
              className="accent-[#018FFF] w-7 h-7 cursor-pointer"
            />
            Remember Me
          </label>

          <a
            href="/auth/forgot-password"
            className="font-[poppins] text-sm text-[#595959] font-medium"
          >
            Forgot Password ?
          </a>
        </div>

        {/* ✅ LOGIN BUTTON */}
        <Button disabled={loading} type="submit" className="cursor-pointer">
          {loading ? "Logging In..." : "Log In"}
        </Button>

        {/* ✅ DIVIDER */}
        <div className="flex items-center gap-3 text-gray-400">
          <span className="flex-1 h-px bg-gray-300" />
          Or Log In With
          <span className="flex-1 h-px bg-gray-300" />
        </div>

        {/* ✅ OAUTH BUTTONS */}
         <div className="flex flex-col mb-6 items-center">
  <div className="flex w-full gap-4">

    {/* ✅ GOOGLE BUTTON */}
    <Button variant="outline" className="flex items-center justify-center gap-3">
      <img
        src={google.src}
        alt="Google"
        className="w-6 h-6 object-contain"
      />
      <span className="font-[poppins] text-[16px] text-gray-600">
        Sign Up With Google
      </span>
    </Button>

    {/* ✅ GITHUB BUTTON */}
    <Button variant="outline" className="flex items-center justify-center gap-3">
      <img
        src={github.src}
        alt="GitHub"
        className="w-6 h-6 object-contain"
      />
      <span className="font-[poppins] text-[16px] text-gray-600">
        Sign Up With Github
      </span>
    </Button>

  </div>

  {/* ✅ LOGIN LINK */}
  <div className="mt-7.5 font-[poppins] text-[18px]">
  Already have an account?{" "}
  <Link
    href="/auth/signup"
   
    className="text-[18px] text-[#018FFF] font-bold cursor-pointer"
  >
    Signup
  </Link>
</div>

</div>


      </form>
    </div>
  );
}
