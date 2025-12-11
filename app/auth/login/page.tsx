"use client";

import LeftAuthSection from "./loginleftsection";
import SignupForm from "./loginform";

export default function LoginPage() {

  return (
    <div className="w-full flex min-h-screen bg-white">

      {/* ✅ LEFT SLIDER */}
      <LeftAuthSection />

     
        <SignupForm />

    </div>
  );
}
