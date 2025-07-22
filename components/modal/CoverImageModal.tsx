import { useCoverImage } from "@/hooks/useCoverImage";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import UploadCoverImage from "../UploadCoverImage";

function CoverImageModal() {
  const coverImage = useCoverImage();
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <UploadCoverImage />
      </DialogContent>
    </Dialog>
  );
}

export default CoverImageModal;
