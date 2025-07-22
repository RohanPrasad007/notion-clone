"use client";

import { useAuth } from "@/context/UserAuthContext";
import { archiveDocumentRecursive } from "@/lib/db/Document";
import { MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

interface MenuPromps {
  documentId: string;
}
function Menu({ documentId }: MenuPromps) {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const deleteDocument = () => {
    const promise = archiveDocumentRecursive(documentId);
    toast.promise(promise, {
      loading: "Deleting document...",
      success: "Document deleted successfully",
      error: "Failed to delete document",
    });
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
        <div className="group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="start"
        side="right"
        forceMount
      >
        <DropdownMenuItem onClick={deleteDocument} className="cursor-pointer">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div>Last edited by: {user?.displayName}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

Menu.displayName = "Menu";

const MenuSkeleton = () => {
  return <Skeleton className="h-10 w-10" />;
};

MenuSkeleton.displayName = "Menu.Skeleton";
Menu.Skeleton = MenuSkeleton;
export default Menu;
