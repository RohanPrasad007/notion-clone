"use client";

import Navigation from "@/components/Navigation";
import SearchCommand from "@/components/SearchCommand";
import { Spinner } from "@/components/spinner";
import { useAuth } from "@/context/UserAuthContext";
import { redirect } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return redirect("/");
  }
  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <Navigation />
      <SearchCommand />
      <main className="w-full">{children}</main>
    </div>
  );
}
