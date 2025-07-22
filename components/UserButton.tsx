import React from "react";
import { useAuth } from "../context/UserAuthContext";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

function UserButton() {
  const { user, loading, signOutUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent focus:outline-none">
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="font-medium text-sm max-w-[120px] truncate">
            {user.displayName || user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={async () => {
            await signOutUser();
            window.location.href = "/";
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
