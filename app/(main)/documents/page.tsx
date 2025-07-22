"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserAuthContext";
import { createDocument } from "@/lib/db/Document";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function page() {
  const { user } = useAuth();
  const router = useRouter();

  const onCreate = () => {
    const promise = createDocument("untitled").then((result) => {
      if (result.success) {
        router.push(`/documents/${result.id}`);
      }
    });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2>Welcom to {user?.displayName}&apos;s notion</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}

export default page;
