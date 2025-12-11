"use client";

import LeftAuthSection from "@/app/auth/signup/LeftAuthSection";
import SignupForm from "./signupform";

export default function SignupPage() {

  return (
    <div className="w-full flex min-h-screen bg-white">

      {/* ✅ LEFT SLIDER */}
      <LeftAuthSection />

     
        <SignupForm />

    </div>
  );
}
