import { deleteDocument, restoreDocumentRecursive } from "@/lib/db/Document";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import ConfirmModel from "./modal/ConfirmModel";

interface BannerPromps {
  documentId: string;
}

function Banner({ documentId }: BannerPromps) {
  const router = useRouter();
  const onRemove = async () => {
    const promise = deleteDocument(documentId);

    toast.promise(promise, {
      loading: "Deleting document permanently...",
      success: "Document deleted permanently!",
      error: "Failed to delete document.",
    });
    router.push("/documents");
  };

  const onRestore = async () => {
    const promise = restoreDocumentRecursive(documentId);

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored successfully!",
      error: "Failed to restore document.",
    });
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModel onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModel>
    </div>
  );
}

export default Banner;
