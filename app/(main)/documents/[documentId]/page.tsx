"use client";
import Cover from "@/components/Cover";
// import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { updateDocument, useDocumentById } from "@/lib/db/Document";
import dynamic from "next/dynamic";
import { notFound, useParams } from "next/navigation";
import React, { useMemo } from "react";

function Page() {
  const params = useParams();

  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  );
  const { document, loading } = useDocumentById(params.documentId as string);

  const onChange = (content: string) => {
    updateDocument(params.documentId as string, { content });
  };

  if (!loading && document === null) {
    // return <div>Not found</div>;
    notFound();
  }

  if (loading || document === null) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
}

export default Page;
