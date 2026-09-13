import { Suspense } from "react";
import AuthPage from "@/components/user/AuthPage";

export default function AuthPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-xl bg-navy-900/60 border border-[rgba(255,215,120,0.12)] px-6 py-4 text-sm text-navy-300">
            Loading…
          </div>
        </div>
      }
    >
      <AuthPage />
    </Suspense>
  );
}
