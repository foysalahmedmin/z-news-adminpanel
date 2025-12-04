import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import FileSelectionModal from "@/components/ui/FileSelectionModal";
import { fetchFile } from "@/services/file.service";
import type { TFile } from "@/types/file.type";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Image, File, Video, Music, X, FolderOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileFieldSelectorProps {
  value?: string | string[] | null; // File _id or array of _ids
  onChange: (value: string | string[] | null) => void;
  label?: string;
  className?: string;
  type?: "image" | "video" | "audio" | "file" | "pdf" | "doc" | "txt" | "all";
  category?: string;
  isMultiple?: boolean;
  accept?: string;
}

const FileFieldSelector = ({
  value,
  onChange,
  label = "Select File",
  className,
  type = "all",
  category,
  isMultiple = false,
  accept,
}: FileFieldSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch selected file(s) for preview
  const selectedFileId = isMultiple
    ? null
    : (value as string | null | undefined);
  const selectedFileIds = isMultiple
    ? (value as string[] | null | undefined) || []
    : [];

  const { data: singleFileData } = useQuery({
    queryKey: ["file", selectedFileId],
    queryFn: () => fetchFile(selectedFileId!),
    enabled: !!selectedFileId && !isMultiple,
  });

  const selectedFile = singleFileData?.data;

  // Fetch multiple files for preview - fetch individually using useQueries
  const multipleFilesQueries = useQueries({
    queries: isMultiple
      ? selectedFileIds.map((fileId) => ({
          queryKey: ["file", fileId],
          queryFn: () => fetchFile(fileId),
          enabled: !!fileId,
        }))
      : [],
  });

  const multipleFiles = multipleFilesQueries
    .map((query) => query.data?.data)
    .filter((file): file is TFile => !!file);

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return File;
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const handleRemoveMultiple = (fileId: string) => {
    if (Array.isArray(value)) {
      const newValue = value.filter((id) => id !== fileId);
      onChange(newValue.length > 0 ? newValue : null);
    }
  };

  // Single file mode
  if (!isMultiple) {
    return (
      <div className={cn("flex flex-col", className)}>
        <FormControl.Label>{label}</FormControl.Label>
        {selectedFile ? (
          <div className="relative group border-2 border-dashed rounded-lg p-4">
            <div className="flex items-center gap-4">
              {selectedFile.type === "image" ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-muted rounded">
                  {(() => {
                    const Icon = getFileIcon(selectedFile.type);
                    return <Icon className="h-8 w-8 text-muted-foreground" />;
                  })()}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFile.type} •{" "}
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                Change File
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Select File
          </Button>
        )}

        <FileSelectionModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          value={value as string | null}
          onChange={(fileId) => onChange(fileId as string | null)}
          type={type}
          category={category}
          title={`Select ${label}`}
        />
      </div>
    );
  }

  // Multiple files mode
  return (
    <div className={cn("flex flex-col", className)}>
      <FormControl.Label>{label}</FormControl.Label>
      {selectedFileIds.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedFileIds.map((fileId) => {
              const file = multipleFiles.find((f) => f._id === fileId);
              const Icon = getFileIcon(file?.type);

              return (
                <div
                  key={fileId}
                  className="relative group border rounded-lg p-2"
                >
                  {file ? (
                    <>
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center bg-muted rounded">
                          <Icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs mt-1 truncate">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-full aspect-square flex items-center justify-center bg-muted rounded">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-xs mt-1 truncate">
                        {fileId.substring(0, 8)}...
                      </p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMultiple(fileId)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Add More Files
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
            >
              Clear All
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Select Files
        </Button>
      )}

      <FileSelectionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        value={value as string[] | null}
        onChange={(fileIds) => onChange(fileIds as string[] | null)}
        isMultiple={true}
        type={type}
        category={category}
        title={`Select ${label}`}
      />
    </div>
  );
};

export default FileFieldSelector;

