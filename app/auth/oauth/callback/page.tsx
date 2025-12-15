import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
      <CallbackClient />
    </Suspense>
  );
}
