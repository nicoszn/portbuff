import type { ReactNode } from "react";
import UserLayout from "@/components/layout/UserLayout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
