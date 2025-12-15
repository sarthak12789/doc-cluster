"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../lib/validations/signup.schema";
import { registerUser, sendOtp } from "../../lib/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "../button";
import Link from "next/link";
import SignupHeader from "../signupheader";
import { useState, useRef } from "react";
import { z } from "zod";
import { useFakeCursor } from "../../hooks/useFakeCursor";
import AnimatedInput from "../../AnimatedInput";
import google from "@/app/assets/google.svg"
import github from "@/app/assets/github.svg"
import { ChevronLeft } from "lucide-react";
import { googleOAuth, githubOAuth } from "@/app/lib/oauth";

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const {
    moveFakeCursor,
    moveCursorToClickPosition,
    pauseCursor,
    resumeCursor,
    syncCursorToInput, // <- destructure this
  } = useFakeCursor();


  // const moveCursorToClickPosition = (e: React.MouseEvent<HTMLInputElement>) => {
  //   const cursor = document.getElementById("fake-cursor");
  //   if (!cursor) return;

  //   const input = e.currentTarget;

  //   // ✅ Caret character index
  //   const caretIndex = input.selectionStart ?? input.value.length;

  //   const rect = input.getBoundingClientRect();
  //   const parentRect = input.offsetParent!.getBoundingClientRect();
  //   const font = window.getComputedStyle(input).font;

  //   // ✅ Measure only the text BEFORE the caret
  //   const textBeforeCaret = input.value.slice(0, caretIndex);
  //   const textWidth = measureTextWidth(textBeforeCaret, font);

  //   // ✅ INSTANT jump (no transition)
  //   cursor.classList.add("instant");
  //   cursor.classList.remove("paused");

  //   cursor.style.transform = `translate(
  //     ${rect.left - parentRect.left + 20 + textWidth + 2}px,
  //     ${rect.top - parentRect.top + 14}px
  //   )`;

  //   // ✅ Restore blinking after a short delay
  //   setTimeout(() => {
  //     cursor.classList.remove("instant");
  //   }, 50);
  // };


  //   const moveFakeCursor = (e: React.FocusEvent<HTMLInputElement>) => {
  //   const cursor = document.getElementById("fake-cursor");
  //   if (!cursor) return;

  //   const input = e.currentTarget;
  //   const rect = input.getBoundingClientRect();
  //   const parentRect = input.offsetParent!.getBoundingClientRect();

  //   const font = window.getComputedStyle(input).font;
  //   const textWidth = measureTextWidth(input.value, font);

  //   cursor.classList.remove("paused");
  //   cursor.classList.remove("instant"); // ✅ allow smooth movement

  //   // ✅ IF input has text → go to END
  //   // ✅ IF empty → stay at start padding
  //   const x =
  //     rect.left -
  //     parentRect.left +
  //     20 + // padding-left (px-5)
  //     (input.value ? textWidth + 2 : 0);

  //   cursor.style.transform = `translate(
  //     ${x}px,
  //     ${rect.top - parentRect.top + 14}px
  //   )`;
  // };

  // const measureTextWidth = (text: string, font: string) => {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   if (!ctx) return 0;

  //   ctx.font = font;
  //   return ctx.measureText(text).width;
  // };


  // const blinkTimeout = useRef<NodeJS.Timeout | null>(null);

  //  const pauseCursor = (e: React.FormEvent<HTMLInputElement>) => {
  //   const cursor = document.getElementById("fake-cursor");
  //   if (!cursor) return;

  //   cursor.classList.add("paused");
  //   cursor.classList.add("instant");

  //   const input = e.currentTarget;
  //   const rect = input.getBoundingClientRect();
  //   const parentRect = input.offsetParent!.getBoundingClientRect();
  //   const font = window.getComputedStyle(input).font;

  //   // ✅ TRUE caret position (not end of text!)
  //   const caretIndex = input.selectionStart ?? input.value.length;

  //   // ✅ Measure only text BEFORE caret
  //   const textBeforeCaret = input.value.slice(0, caretIndex);
  //   const textWidth = measureTextWidth(textBeforeCaret, font);

  //   cursor.style.transform = `translate(
  //     ${rect.left - parentRect.left + 20 + textWidth + 2}px,
  //     ${rect.top - parentRect.top + 14}px
  //   )`;

  //   if (blinkTimeout.current) clearTimeout(blinkTimeout.current);

  //   blinkTimeout.current = setTimeout(() => {
  //     cursor.classList.remove("paused");
  //     cursor.classList.remove("instant");
  //   }, 600);
  // };



  // const resumeCursor = () => {
  //   const cursor = document.getElementById("fake-cursor");
  //   if (!cursor) return;

  //   cursor.classList.remove("paused");
  //   cursor.classList.remove("instant");
  // };



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",          // 🔥 enables LIVE validation
    reValidateMode: "onChange" // 🔥 re-check on each keystroke
  });



  // ✅ SUBMIT HANDLER

  const router = useRouter();
const [oauthLoading, setOauthLoading] = useState(false);

const handleGoogleClick = () => {
  if (oauthLoading) return;
  setOauthLoading(true);
  googleOAuth();
};


  const onSubmit = async (data: SignupFormData) => {
    if (loading) return; // 🔒 hard guard

    try {
      setLoading(true);

      // 1️⃣ Register user
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      });

      // 2️⃣ Send OTP for REGISTER
      await sendOtp({
        email: data.email,
        purpose: "register",
      });

      toast.success("OTP sent to your email");
      sessionStorage.setItem("otp_email", data.email);
      sessionStorage.setItem("otp_purpose", "register");

      router.push("/auth/verifyotp");

      // 3️⃣ Redirect to verify OTP page
      router.push(
        `/auth/verifyotp`
      );

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full sm:w-[55.49%] flex flex-col pt-25 sm:pt-0  text-black box-border px-5 sm:pl-12 md:pl-16 lg:px-20  sm:pr-12 md:pr-16 lg:pr-30  mx-auto">

      <button className="absolute sm:hidden left-5 top-10.5 z-20 cursor-pointer">
        <ChevronLeft size={32} />
      </button>
      <SignupHeader />
      <h2 className="
        text-black

        md:text-[44px]
        sm:text-[36px]
        font-bold
        font-poppins
        mt-7.5
        hidden sm:block
      ">
        Get Started Now!
      </h2>

      {/* ✅ Subtitle */}
      <div className="mb-5 text-[#595959] font-poppins">
        {/* Desktop */}
        <p className="hidden sm:block md:text-[24px] sm:text-[20px] font-medium">
          Create your account here.
        </p>

        {/* Mobile */}
        <div className="sm:hidden flex flex-col items-center gap-1">
          <p className="text-[24px] font-bold text-black">
            Create an account
          </p>

          <p className="text-[15px] font-medium">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#018FFF] text-[12px] font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
        <div id="fake-cursor" className="fake-cursor" />


        {/* ✅ EMAIL */}
        {/* ✅ EMAIL (FIXED, SSR SAFE, FLOATING + MOVING INDICATOR) */}
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

        <AnimatedInput
          id="username"
          label="Enter Username"
          register={register("username")}
          error={errors.username?.message}
          moveFakeCursor={moveFakeCursor}
          pauseCursor={pauseCursor}
          resumeCursor={resumeCursor}
          moveCursorToClickPosition={moveCursorToClickPosition}
        />

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

        {/* ✅ TERMS */}
        <label className="flex gap-1 font-[poppins] text-sm mb-1 ">
          <input type="checkbox" className="w-7 h-7 accent-[#018FFF] cursor-pointer accent-border-r-9 " {...register("terms")} />
          <span className="pt-1 text-[14px] font-medium"> I agree with</span> <Link href="/terms" className="underline text-[#1A73E8] pt-1 text-[14px] font-medium">Terms & Policy</Link>
        </label>
        {errors.terms ? (
          <p className="text-sm text-red-500 mb-2">{errors.terms.message}</p>
        ) : <p className="min-h-2"> </p>}

        {/* ✅ SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className="hidden sm:block"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>


        {/* ✅ OAUTH */}
        <div className="flex items-center gap-3 text-gray-400">
          <span className="flex-1 h-px bg-gray-300" />
          Or Sign Up With
          <span className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="flex flex-col mb-6 items-center">
          <div className="flex w-full gap-4">

            {/* ✅ GOOGLE BUTTON */}
            <Button
  type="button"
  variant="outline"
  onClick={handleGoogleClick}
  disabled={oauthLoading}
  className="flex items-center justify-center gap-3 sm:gap-1 px-1"
>
  <img
    src={google.src}
    alt="Google"
    className="w-6 h-6 object-contain"
  />
  <span className="font-[poppins] text-[10px] sm:text-[15px] text-gray-600">
    Sign Up With Google
  </span>
</Button>


            {/* ✅ GITHUB BUTTON */}
            <Button  className="flex items-center justify-center gap-3 sm:gap-1 px-1" type="button"
  variant="outline"
  onClick={githubOAuth}>
              <img
                src={github.src}
                alt="GitHub"
                className="w-6 h-6 object-contain"
              />
              <span className="font-[poppins] text-[10px] sm:text-[16px] text-gray-600">
                Sign Up With Github
              </span>
            </Button>

          </div>

          {/* ✅ LOGIN LINK */}
          <div className="hidden sm:block mt-7.5 font-[poppins] text-[18px]">
            Already have an account?{" "}
            <Link
              href="/auth/login"

              className="text-[18px] text-[#018FFF] font-bold cursor-pointer"
            >
              Log In
            </Link>

          </div>
          <Button
            type="submit"
            disabled={loading}
            className="sm:hidden mt-34.5"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>


        </div>


      </form>

    </div>
  );
}
