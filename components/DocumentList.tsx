import { useUserDocuments } from "@/lib/db/Document";
import { Document } from "@/lib/type";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  data?: Document[];
}

function DocumentList({
  parentDocumentId,
  level = 1,
  data,
}: DocumentListProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const params = useParams();
  const router = useRouter();
  const { documents, loading } = useUserDocuments(parentDocumentId);

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const onRedirect = (documentId?: string) => {
    if (params.documentId === documentId) return;
    router.push(`/documents/${documentId}`);
  };

  if (loading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 12}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No page inside
      </p>
      {documents.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            onClick={() => onRedirect(doc._id)}
            label={doc.title}
            icon={FileIcon}
            active={params.documentId === doc._id}
            level={level}
            documentIcon={doc.icon}
            expanded={doc._id ? expanded[doc._id] : false}
            onExpand={() => doc._id && onExpand(doc._id)}
          />
          {doc._id && expanded[doc._id] && (
            <DocumentList
              parentDocumentId={doc._id}
              level={level + 1}
              data={data}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default DocumentList;
