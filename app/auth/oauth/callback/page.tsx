"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeOAuthToken } from "@/app/lib/auth.api";
import { toast } from "sonner";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      toast.error("OAuth failed");
      router.replace("/auth/login");
      return;
    }

    const exchange = async () => {
      try {
        const res = await exchangeOAuthToken({
          tempOAuthToken: token,
        });

        // 🔐 TODO: store JWT / create session
        toast.success("Logged in successfully");

        router.replace("/dashboard");
      } catch {
        toast.error("OAuth login failed");
        router.replace("/auth/login");
      }
    };

    exchange();
  }, [params, router]);

  return <p>Signing you in...</p>;
}
