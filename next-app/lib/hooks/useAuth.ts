"use client";

import { useStore } from "@/lib/store/useStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const currentUser = useStore((s) => s.currentUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (currentUser === undefined) return; // still loading
    if (currentUser === null) {
      router.replace(`/auth?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, router, pathname]);

  return currentUser;
}

export function useRequireAdmin() {
  const currentUser = useStore((s) => s.currentUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentUser || currentUser.role !== "admin") {
      router.replace(`/auth?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, router, pathname]);

  return currentUser;
}

export function useGuestOnly() {
  const currentUser = useStore((s) => s.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace(
        currentUser.role === "admin" ? "/admin" : "/dashboard"
      );
    }
  }, [currentUser, router]);

  return currentUser;
}
