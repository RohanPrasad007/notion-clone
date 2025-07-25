import React, { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadCover } from "@/lib/db/Document";
import { useParams } from "next/navigation";
import { useCoverImage } from "@/hooks/useCoverImage";

const UploadCoverImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const coverImage = useCoverImage();
  const documentId = params.documentId as string;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload to Firebase
      const result = await uploadCover(documentId, file);
      if (!result.success) {
        toast.error(result.error);
        setUploadedImage(null);
      } else {
        toast.success("Cover image uploaded successfully");
        coverImage.onClose();
      }
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error("Failed to upload cover image", error);
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative">
        {uploadedImage ? (
          <div className="relative group">
            <img
              src={uploadedImage}
              alt="Uploaded cover preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Uploading...
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={handleClick}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Upload
                  size={32}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Click or drag file to this area to upload
                </p>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadCoverImage;
