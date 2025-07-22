"use client";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import { Spinner } from "../spinner";
import Link from "next/link";
import UserButton from "../UserButton";
import { useAuth } from "@/context/UserAuthContext";

export const Navbar = () => {
  const { user, loading, signInWithGoogle } = useAuth();

  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 fixed bg-white dark:bg-[#1f1f1f] top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2 ">
        {loading && <Spinner />}
        {!user && !loading && (
          <>
            <Button variant="ghost" size="sm" onClick={signInWithGoogle}>
              Login
            </Button>
            <Button variant="default" size="sm" onClick={signInWithGoogle}>
              Get Notion free
            </Button>
          </>
        )}
        {user && !loading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Notion</Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
