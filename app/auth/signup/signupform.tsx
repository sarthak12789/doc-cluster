"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../lib/validations/signup.schema";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import Button from "../button";
import Link from "next/link";
import SignupHeader from "../signupheader";
import { useState,useRef } from "react";
import { z } from "zod";
import { useFakeCursor } from "../../hooks/useFakeCursor";
import AnimatedInput from "../../AnimatedInput";
import google from "@/app/assets/google.svg"
import github from "@/app/assets/github.svg"
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
const {
  moveFakeCursor,
  moveCursorToClickPosition,
  pauseCursor,
  resumeCursor,
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
  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);

      await api.post("/signup", data);

      toast.success("Account created successfully!");

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[980px] flex flex-col  justify-center text-black ml-20 mr-30 box-border">


      <SignupHeader />
       <h2 className="
        text-black
        text-[44px]
        font-bold
        font-poppins
        mt-7.5
      ">
        Get Started Now!
      </h2>

      {/* ✅ Subtitle */}
      <p className="
        text-[#595959]
        text-[24px]
        font-medium
        font-poppins
        mb-5
      ">
        Create your account here.
      </p>
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
         <span className="pt-1"> I agree with</span> <a href="/terms" className="underline text-[#1A73E8] pt-1">Terms & Policy</a>
        </label>
         {errors.terms ? (
          <p className="text-sm text-red-500 mb-2">{errors.terms.message}</p>
        ):<p className="min-h-2"> </p>}

        {/* ✅ SUBMIT */}
        <Button disabled={loading}>
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
    href="/auth/login"
   
    className="text-[18px] text-[#018FFF] font-bold cursor-pointer"
  >
    Log In
  </Link>
</div>

</div>

        
      </form>

    </div>
  );
}
