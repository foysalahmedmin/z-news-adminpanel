import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { fetchFiles } from "@/services/file.service";
import type { TFile } from "@/types/file.type";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Image, File, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface FileSelectorProps {
  value?: string | null; // File ID
  onChange: (fileId: string | null) => void;
  label?: string;
  className?: string;
  type?: "image" | "video" | "audio" | "file" | "pdf" | "doc" | "txt" | "all";
  accept?: string;
}

const FileSelector = ({
  value,
  onChange,
  label = "Select File",
  className,
  type = "all",
  accept,
}: FileSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
      sort: "-created_at",
    };
    if (search) {
      params.search = search;
    }
    if (type !== "all") {
      params.type = type;
    }
    return params;
  }, [page, limit, search, type]);

  const { data, isLoading } = useQuery({
    queryKey: ["files", queryParams],
    queryFn: () => fetchFiles(queryParams),
    enabled: isOpen,
  });

  const files = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  // Get selected file
  const selectedFile = files.find((f) => f._id === value) || null;

  // Navigation handlers
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (page > 0) {
      setPage(page - 1);
      setSelectedIndex(limit - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < files.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (page < totalPages - 1) {
      setPage(page + 1);
      setSelectedIndex(0);
    }
  };

  const handleSelect = (file: TFile) => {
    onChange(file._id);
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return Image;
      default:
        return File;
    }
  };

  const getFilePreview = (file: TFile) => {
    if (file.type === "image") {
      return file.url;
    }
    return null;
  };

  const currentFile = files[selectedIndex] || null;

  return (
    <div className={cn("flex flex-col", className)}>
      <FormControl.Label>{label}</FormControl.Label>
      
      {/* Selected File Preview */}
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
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedFile.type} • {(selectedFile.size / 1024).toFixed(2)} KB
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
              onClick={() => setIsOpen(true)}
            >
              Change File
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          Select File
        </Button>
      )}

      {/* File Selection Modal */}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl">
        <Modal.Backdrop>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Select File</Modal.Title>
              <Modal.Close />
            </Modal.Header>

            <Modal.Body className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl
                  type="text"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pl-10"
                />
              </div>

              {/* File Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">No files found</p>
                </div>
              ) : (
                <>
                  {/* Main Preview with Navigation */}
                  {currentFile && (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          disabled={page === 0 && selectedIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <p className="font-medium">{currentFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedIndex + 1} of {files.length} (Page {page + 1} of {totalPages})
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={
                            page === totalPages - 1 &&
                            selectedIndex === files.length - 1
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Preview */}
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        {currentFile.type === "image" ? (
                          <img
                            src={currentFile.url}
                            alt={currentFile.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <File className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">{currentFile.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">
                            {(currentFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        {currentFile.description && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Description</p>
                            <p className="font-medium">{currentFile.description}</p>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleSelect(currentFile)}
                        className="w-full"
                      >
                        Select This File
                      </Button>
                    </div>
                  )}

                  {/* File Grid */}
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => {
                      const Icon = getFileIcon(file.type);
                      const preview = getFilePreview(file);
                      const isSelected = file._id === value;

                      return (
                        <button
                          key={file._id}
                          type="button"
                          onClick={() => {
                            setSelectedIndex(index);
                          }}
                          onDoubleClick={() => handleSelect(file)}
                          className={cn(
                            "relative aspect-square rounded-lg border-2 overflow-hidden transition-all",
                            isSelected
                              ? "border-primary ring-2 ring-primary"
                              : "border-muted hover:border-primary/50",
                            index === selectedIndex && "ring-2 ring-primary"
                          )}
                        >
                          {preview ? (
                            <img
                              src={preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Icon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <X className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page + 1} of {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default FileSelector;

