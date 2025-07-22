import { Document } from "@/lib/type";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateDocument } from "@/lib/db/Document";
import { Skeleton } from "./ui/skeleton";

interface TitleProps {
  initialData: Document;
}
function Title({ initialData }: TitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitile] = useState(initialData.title || "Untitled");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitile(initialData.title);
  }, [initialData]);

  const enableInput = () => {
    setTitile(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitile(event.target.value);
    if (initialData._id) {
      updateDocument(initialData._id, {
        title: event.target.value || "Untitled",
      });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </div>
  );
}
Title.displayName = "Title";

const TitleSkeleton = () => {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};

TitleSkeleton.displayName = "Title.Skeleton";

Title.Skeleton = TitleSkeleton;

export default Title;
