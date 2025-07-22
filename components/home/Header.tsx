"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/UserAuthContext";
import { Spinner } from "../spinner";
import Link from "next/link";

export const Header = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text:6xl">
        Your Ideas, Documents, & Plans, Unified, Welcome to{" "}
        <span className="underline">Notion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where <br />
        better, fater work happens.
      </h3>
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {user && !loading && (
        <Button asChild>
          <Link href="/documents">
            Enter Notion
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}

      {!user && !loading && (
        <>
          <Button variant="ghost" size="sm" onClick={signInWithGoogle}>
            Get Notion for free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </>
      )}
    </div>
  );
};
