import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useParams } from "next/navigation";
import { removeCover } from "@/lib/db/Document";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

function Cover({ url, preview }: CoverImageProps) {
  const params = useParams();
  const converImage = useCoverImage();
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-48",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={converImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={() => {
              removeCover(params.documentId as string);
            }}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.displayName = "Cover";

const CoverSkeleton = () => {
  return <Skeleton className="w-full h-[12vh]" />;
};
CoverSkeleton.displayName = "Cover.Skeleton";

Cover.Skeleton = CoverSkeleton;

export default Cover;
