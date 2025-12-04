import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import useAlert from "@/hooks/ui/useAlert";
import { createFile, deleteFile, fetchFiles } from "@/services/file.service";
import type { TFile } from "@/types/file.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Image,
  File,
  FileText,
  Video,
  Music,
  Search,
  X,
  Upload,
  Trash,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

// Custom debounce function with cancel support
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
};

interface FileSelectionModalProps {
  // Control props
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  // Selection props
  value?: string | string[] | null; // Single _id or array of _ids
  onChange: (value: string | string[] | null) => void;
  isMultiple?: boolean; // Enable multiple selection

  // Filter props (from parent via props drilling)
  type?: string; // Optional filter by file type
  category?: string; // Optional filter by category

  // UI props
  className?: string;
  title?: string; // Default: "Select File(s)"

  // Optional callbacks
  onFileUploaded?: (file: TFile) => void;
  onFileDeleted?: (fileId: string) => void;
}

const FileSelectionModal = ({
  isOpen,
  setIsOpen,
  value,
  onChange,
  isMultiple = false,
  type,
  category,
  className,
  title,
  onFileUploaded,
  onFileDeleted,
}: FileSelectionModalProps) => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  // Internal state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("-created_at");
  const [typeFilter, setTypeFilter] = useState<string>(type || "all");
  const [categoryFilter, setCategoryFilter] = useState<string>(category || "");
  const [page, setPage] = useState(0);
  const [limit] = useState(24); // Grid-friendly
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  // Initialize selected files from value prop
  useEffect(() => {
    if (isMultiple) {
      setSelectedFiles(Array.isArray(value) ? value : value ? [value] : []);
    } else {
      setSelectedFiles(value ? [value as string] : []);
    }
  }, [value, isMultiple, isOpen]);

  // Debounce search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
        setPage(0);
      }, 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(search);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search, debouncedSetSearch]);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
      sort: sort || "-created_at",
    };
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    if (typeFilter !== "all") {
      params.type = typeFilter;
    }
    if (categoryFilter) {
      params.category = categoryFilter;
    }
    return params;
  }, [page, limit, debouncedSearch, sort, typeFilter, categoryFilter]);

  // Fetch files
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["files", queryParams],
    queryFn: () => fetchFiles(queryParams),
    enabled: isOpen,
  });

  const files = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await createFile(formData);
    },
    onSuccess: (response) => {
      const uploadedFile = response.data;
      toast.success(response?.message || "File uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      if (onFileUploaded && uploadedFile) {
        onFileUploaded(uploadedFile);
      }
      // Auto-select uploaded file if single mode
      if (!isMultiple && uploadedFile) {
        handleSelectFile(uploadedFile._id);
        setIsOpen(false);
      } else if (isMultiple && uploadedFile) {
        handleToggleSelection(uploadedFile._id);
      }
      setUploadFiles([]);
      setIsUploading(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to upload file",
      );
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: (data) => {
      toast.success(data?.message || "File deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      // Remove from selection if deleted file was selected
      setSelectedFiles((prev) => prev.filter((id) => id !== data.data?._id));
      if (onFileDeleted) {
        onFileDeleted(data.data?._id || "");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete file",
      );
    },
  });

  // File selection handlers
  const handleSelectFile = useCallback(
    (fileId: string) => {
      if (isMultiple) {
        // Toggle selection in multiple mode
        handleToggleSelection(fileId);
      } else {
        // Single selection
        const newValue = selectedFiles.includes(fileId) ? null : fileId;
        onChange(newValue as string | null);
        if (newValue) {
          setIsOpen(false);
        }
      }
    },
    [isMultiple, selectedFiles, onChange, setIsOpen],
  );

  const handleToggleSelection = useCallback(
    (fileId: string) => {
      setSelectedFiles((prev) => {
        if (prev.includes(fileId)) {
          return prev.filter((id) => id !== fileId);
        } else {
          return [...prev, fileId];
        }
      });
    },
    [],
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      setUploadFiles(fileArray);
      setIsUploading(true);

      // Upload files sequentially
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);
        await uploadMutation.mutateAsync(formData);
      }
    },
    [uploadMutation],
  );

  // Handle file delete
  const handleDeleteFile = useCallback(
    async (fileId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const ok = await confirm({
        title: "Delete File",
        message: "Are you sure you want to delete this file?",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      if (ok) {
        deleteMutation.mutate(fileId);
      }
    },
    [confirm, deleteMutation],
  );

  // Handle confirm selection (multiple mode)
  const handleConfirmSelection = useCallback(() => {
    if (isMultiple) {
      onChange(selectedFiles.length > 0 ? selectedFiles : null);
    }
    setIsOpen(false);
  }, [isMultiple, selectedFiles, onChange, setIsOpen]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Get file icon
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "pdf":
      case "doc":
      case "txt":
        return FileText;
      default:
        return File;
    }
  };

  // Get file preview
  const getFilePreview = (file: TFile) => {
    if (file.type === "image") {
      return file.url;
    }
    return null;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const modalTitle = title || (isMultiple ? "Select Files" : "Select File");

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      size="xl"
      className={className}
    >
      <Modal.Backdrop>
        <Modal.Content className="max-w-6xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <Modal.Header>
            <div className="flex items-center justify-between w-full">
              <Modal.Title>{modalTitle}</Modal.Title>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="file-upload-input"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="file-upload-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <Modal.Close />
              </div>
            </div>
          </Modal.Header>

          {/* Body */}
          <Modal.Body className="flex-1 overflow-y-auto space-y-4">
            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl
                  type="text"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex gap-4 flex-wrap">
                {/* Type Filter */}
                <div className="flex-1 min-w-[150px]">
                  <FormControl
                    as="select"
                    className="w-full"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setPage(0);
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Documents</option>
                    <option value="txt">Text</option>
                    <option value="file">Other Files</option>
                  </FormControl>
                </div>

                {/* Category Filter */}
                <div className="flex-1 min-w-[150px]">
                  <FormControl
                    type="text"
                    placeholder="Category filter..."
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>

                {/* Sort */}
                <div className="flex-1 min-w-[150px]">
                  <FormControl
                    as="select"
                    className="w-full"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="-name">Name Z-A</option>
                    <option value="size">Size Smallest</option>
                    <option value="-size">Size Largest</option>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Selected Files Section (Multiple mode only) */}
            {isMultiple && selectedFiles.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    Selected ({selectedFiles.length})
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFiles([]);
                      onChange(null);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {selectedFiles.map((fileId) => {
                    const file = files.find((f) => f._id === fileId);
                    // If file not in current page, show placeholder
                    if (!file) {
                      return (
                        <div
                          key={fileId}
                          className="relative group flex items-center gap-2 bg-background border rounded p-2"
                        >
                          <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                            <File className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm max-w-[100px] truncate text-muted-foreground">
                            {fileId.substring(0, 8)}...
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleSelection(fileId)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={fileId}
                        className="relative group flex items-center gap-2 bg-background border rounded p-2"
                      >
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                            {(() => {
                              const Icon = getFileIcon(file.type);
                              return <Icon className="h-6 w-6" />;
                            })()}
                          </div>
                        )}
                        <span className="text-sm max-w-[100px] truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSelection(fileId)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* File Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-muted-foreground">Failed to load files</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <File className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No files found</p>
                <label htmlFor="file-upload-input">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </span>
                  </Button>
                </label>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const Icon = getFileIcon(file.type);
                    const preview = getFilePreview(file);
                    const isSelected = selectedFiles.includes(file._id);

                    return (
                      <div
                        key={file._id}
                        className={cn(
                          "relative group aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all",
                          isSelected
                            ? "border-primary ring-2 ring-primary bg-primary/10"
                            : "border-muted hover:border-primary/50",
                        )}
                        onClick={() => handleSelectFile(file._id)}
                      >
                        {/* Preview/Icon */}
                        {preview ? (
                          <img
                            src={preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Icon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        {/* Delete Button (on hover) */}
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteFile(file._id, e)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>

                        {/* File Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="capitalize">{file.type}</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages} ({data?.meta?.total || 0}{" "}
                      files)
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </Modal.Body>

          {/* Footer */}
          <Modal.Footer>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {isMultiple ? (
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedFiles.length === 0}
              >
                Select {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}
              </Button>
            ) : (
              <Button onClick={handleCancel}>Close</Button>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default FileSelectionModal;

