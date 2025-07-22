"use client";
import { useDocumentById } from "@/lib/db/Document";
import { useParams } from "next/navigation";
import React from "react";
import { MenuIcon } from "lucide-react";
import Title from "./Title";
import Banner from "./Banner";
import Menu from "./Menu";
import Publish from "./Publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const params = useParams();
  const { document, loading } = useDocumentById(params.documentId as string);

  if (loading) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && document._id && (
        <Banner documentId={document._id} />
      )}
    </>
  );
}

export default Navbar;
