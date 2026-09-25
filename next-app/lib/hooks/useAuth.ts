"use client";

import { useStore } from "@/lib/store/useStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Mirrors the SSR-safe pattern used in useStore.ts: state read from
// localStorage (currentUser) can only be trusted once we know we're
// running on the client past hydration. Until then, treat auth as
// "unknown" instead of acting on a value that may not match what
// the client will resolve to once localStorage is read.
function useHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
}

export function useRequireAuth() {
  const currentUser = useStore((s) => s.currentUser);
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return; // still loading
    if (currentUser === null) {
      router.replace(`/auth?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, currentUser, router, pathname]);

  return hasHydrated ? currentUser : null;
}

export function useRequireAdmin() {
  const currentUser = useStore((s) => s.currentUser);
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!currentUser || currentUser.role !== "admin") {
      router.replace(`/auth?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, currentUser, router, pathname]);

  return hasHydrated ? currentUser : null;
}

export function useGuestOnly() {
  const currentUser = useStore((s) => s.currentUser);
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (currentUser) {
      router.replace(
        currentUser.role === "admin" ? "/admin" : "/dashboard"
      );
    }
  }, [hasHydrated, currentUser, router]);

  return hasHydrated ? currentUser : null;
}
