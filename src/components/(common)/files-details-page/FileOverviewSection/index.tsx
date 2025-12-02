import type { TFile } from "@/types/file.type";
import { FileText, Calendar, User, Tag, Link as LinkIcon } from "lucide-react";

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
};

export type TFileOverviewSectionProps = {
  file?: Partial<TFile>;
};

const FileOverviewSection: React.FC<TFileOverviewSectionProps> = ({ file }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      {file?.description && (
        <div>
          <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
            <FileText className="mr-2 h-5 w-5" />
            Description
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {file.description}
          </p>
        </div>
      )}

      {/* Caption */}
      {file?.caption && (
        <div>
          <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
            <Tag className="mr-2 h-5 w-5" />
            Caption
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {file.caption}
          </p>
        </div>
      )}

      {/* File Details */}
      <div>
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          File Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              File ID
            </div>
            <div className="text-foreground font-mono text-sm">
              {file?._id}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              File Name
            </div>
            <div className="text-foreground text-sm">
              {file?.file_name || "N/A"}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              File Type
            </div>
            <div className="text-foreground capitalize text-sm">
              {file?.type || "N/A"}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              File Size
            </div>
            <div className="text-foreground text-sm">
              {formatFileSize(file?.size)}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              Extension
            </div>
            <div className="text-foreground font-mono text-sm">
              {file?.extension || "N/A"}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm">
              MIME Type
            </div>
            <div className="text-foreground text-sm">
              {file?.mime_type || "N/A"}
            </div>
          </div>
          {file?.category && (
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1 text-sm">
                Category
              </div>
              <div className="text-foreground text-sm">
                {file.category}
              </div>
            </div>
          )}
          {file?.author && (
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1 text-sm flex items-center">
                <User className="mr-1 h-4 w-4" />
                Author
              </div>
              <div className="text-foreground text-sm">
                {file.author.name || file.author.email || "Unknown"}
              </div>
            </div>
          )}
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Created At
            </div>
            <div className="text-foreground text-sm">
              {formatDate(file?.created_at)}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground mb-1 text-sm flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Updated At
            </div>
            <div className="text-foreground text-sm">
              {formatDate(file?.updated_at)}
            </div>
          </div>
          {file?.url && (
            <div className="bg-muted col-span-2 rounded-lg p-4">
              <div className="text-muted-foreground mb-1 text-sm flex items-center">
                <LinkIcon className="mr-1 h-4 w-4" />
                File URL
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm break-all"
              >
                {file.url}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileOverviewSection;

