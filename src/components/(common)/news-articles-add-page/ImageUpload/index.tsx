import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { FormControl } from "@/components/ui/FormControl";
import { cn } from "@/lib/utils";
import type { NewsFormData } from "@/pages/(common)/NewsArticlesAddPage";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  name: keyof NewsFormData | "seo.image";
  label: string;
  multiple?: boolean;
  className?: string;
}

const ImageUpload = ({
  name,
  label,
  multiple = false,
  className,
}: ImageUploadProps) => {
  const { setValue, watch } = useFormContext<NewsFormData>();
  const files = watch(name as any);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (multiple) {
        setValue(name as any, fileList);
      } else {
        setValue(name as any, fileList[0] || null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      if (multiple) {
        setValue(name as any, fileList);
      } else {
        setValue(name as any, fileList[0] || null);
      }
    }
  };

  const removeFile = (index?: number) => {
    if (multiple && Array.isArray(files)) {
      const newFiles = [...files];
      if (index !== undefined) {
        newFiles.splice(index, 1);
      }
      setValue(name as any, newFiles.length ? newFiles : null);
    } else {
      setValue(name as any, null);
    }
  };

  const generatePreviewUrl = (file: File) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      return "";
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <FormControl.Label>{label}</FormControl.Label>
      <div
        className={cn(
          "flex flex-1 cursor-pointer flex-col rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={name}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        {!files || (multiple && (!files || files.length === 0)) ? (
          <label
            htmlFor={name}
            className="flex size-full flex-1 cursor-pointer items-center justify-center"
          >
            <div>
              <Upload className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Drag & drop images here or click to browse
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {multiple ? "Multiple images allowed" : "Single image only"}
              </p>
            </div>
          </label>
        ) : (
          <div className="relative size-full flex-1">
            {multiple && Array.isArray(files) && (
              <div className="absolute inset-0 flex items-center justify-center">
                {files.map((file, index) => {
                  const previewUrl = generatePreviewUrl(file);
                  return previewUrl ? (
                    <div
                      key={index}
                      style={{
                        width: files.length > 1 ? "50%" : "100%",
                        height: files.length > 2 ? "50%" : "100%",
                      }}
                      className="group relative"
                    >
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="size-full rounded-md object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                      <button
                        type="button"
                        className="bg-destructive absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {!multiple &&
              files &&
              files instanceof File &&
              (() => {
                const previewUrl = generatePreviewUrl(files);
                return previewUrl ? (
                  <div className="absolute inset-0">
                    <div className="group relative size-full">
                      <img
                        src={previewUrl}
                        alt="Thumbnail preview"
                        className="size-full rounded-md object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                      <button
                        type="button"
                        className="bg-destructive absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeFile()}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : null;
              })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
