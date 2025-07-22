"use client";
import {
  deleteDocument,
  useArchivedDocuments,
  restoreDocumentRecursive,
} from "@/lib/db/Document";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Spinner } from "./spinner";
import { toast } from "sonner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "./ui/input";
import ConfirmModel from "./modal/ConfirmModel";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const [search, setSearch] = useState("");
  const { documents, loading } = useArchivedDocuments();

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (id: string) => {
    router.push(`/documents/${id}`);
  };

  const onRestore = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    const promise = restoreDocumentRecursive(id);

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored successfully!",
      error: "Failed to restore document.",
    });
  };

  const onRemove = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();

    const promise = deleteDocument(id);

    toast.promise(promise, {
      loading: "Deleting document permanently...",
      success: "Document deleted permanently!",
      error: "Failed to delete document.",
    });

    if (params.documentId === id) {
      router.push("/documents");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredDocuments.length === 0 ? (
          <p className="text-xs text-center text-muted-foreground pb-2">
            No documents found.
          </p>
        ) : (
          // Render your document list here
          filteredDocuments.map((doc) => (
            <div
              role="button"
              key={doc._id}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between"
              onClick={() => doc._id && onClick(doc._id)}
            >
              <span className="truncate pl-2">{doc.title}</span>
              <div className="flex items-center">
                <button
                  onClick={(e) => doc._id && onRestore(e, doc._id)}
                  className="p-1 hover:bg-neutral-200 rounded-sm"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </button>
                <ConfirmModel
                  onConfirm={(e) => {
                    if (doc._id) {
                      void onRemove(e, doc._id);
                    }
                  }}
                >
                  <div className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-sm text-red-600">
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModel>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TrashBox;
