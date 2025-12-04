import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import FileSelectionModal from "@/components/ui/FileSelectionModal";
import useSetting from "@/hooks/states/useSetting";
import type { NewsFormData } from "@/pages/(common)/NewsArticlesEditPage";
import { createFile, fetchFile } from "@/services/file.service";
import { File, Image, Video } from "lucide-react";

const ContentEditor = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<NewsFormData>();
  const { setting } = useSetting();

  const contentValue = watch("content");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileModalType, setFileModalType] = useState<"image" | "video" | "all">(
    "all",
  );

  const blockNoteEditor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
    domAttributes: {
      editor: {
        style: "min-height: 350px; padding-top: 1rem; padding-bottom: 1rem;",
      },
    },
    // Upload file to backend and return URL
    uploadFile: async (file: File): Promise<string> => {
      try {
        // Create FormData with the file
        const formData = new FormData();
        formData.append("file", file);
        
        // Add category based on file type
        formData.append("category", "news-content");
        
        // Upload file to backend
        const response = await createFile(formData);
        
        // Return the file URL
        if (response.data?.url) {
          return response.data.url;
        }
        
        throw new Error("File upload failed: No URL returned");
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    },
  });

  const handleFileSelect = async (fileId: string | string[] | null) => {
    if (!fileId || Array.isArray(fileId)) return;

    try {
      const { data: fileData } = await fetchFile(fileId);
      if (!fileData) return;

      const file = fileData;
      const fileUrl = file.url;

      // Get the current block (where cursor is)
      const currentBlock = blockNoteEditor.getTextCursorPosition().block;

      // Insert image or video block based on file type
      if (file.type === "image") {
        blockNoteEditor.insertBlocks(
          [
            {
              type: "image",
              props: {
                url: fileUrl,
                caption: file.caption || "",
              },
            },
          ],
          currentBlock.id,
          "after",
        );
      } else if (file.type === "video") {
        // BlockNote doesn't have a native video block, so we'll insert an HTML block
        blockNoteEditor.insertBlocks(
          [
            {
              type: "paragraph",
              content: "",
            },
          ],
          currentBlock.id,
          "after",
        );
        // Then convert to HTML and insert video tag
        const videoHtml = `<video controls src="${fileUrl}" style="max-width: 100%; height: auto;"></video>`;
        const blocks = await blockNoteEditor.tryParseHTMLToBlocks(videoHtml);
        if (blocks.length > 0) {
          blockNoteEditor.insertBlocks(blocks, currentBlock.id, "after");
        }
      } else {
        // For other file types, insert a link
        blockNoteEditor.insertBlocks(
          [
            {
              type: "paragraph",
              content: [
                {
                  type: "link",
                  href: fileUrl,
                  content: file.name,
                },
              ],
            },
          ],
          currentBlock.id,
          "after",
        );
      }

      setIsFileModalOpen(false);
    } catch (error) {
      console.error("Error inserting file:", error);
    }
  };

  useEffect(() => {
    if (contentValue) {
      blockNoteEditor
        .blocksToHTMLLossy(blockNoteEditor.document)
        .then((currentHtml) => {
          if (currentHtml !== contentValue) {
            blockNoteEditor
              .tryParseHTMLToBlocks(contentValue)
              .then((blocks) => {
                blockNoteEditor.replaceBlocks(blockNoteEditor.document, blocks);
              });
          }
        });
    }
  }, [contentValue, blockNoteEditor]);

  return (
    <Card>
      <Card.Header className="border-b">
        <div className="flex items-center justify-between">
          <Card.Title>Content *</Card.Title>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFileModalType("image");
                setIsFileModalOpen(true);
              }}
            >
              <Image className="mr-2 h-4 w-4" />
              Insert Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFileModalType("video");
                setIsFileModalOpen(true);
              }}
            >
              <Video className="mr-2 h-4 w-4" />
              Insert Video
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFileModalType("all");
                setIsFileModalOpen(true);
              }}
            >
              <File className="mr-2 h-4 w-4" />
              Insert File
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="rounded-md border p-2">
          <BlockNoteView
            theme={setting?.theme === "dark" ? "dark" : "light"}
            editor={blockNoteEditor}
            onChange={() => {
              blockNoteEditor
                .blocksToHTMLLossy(blockNoteEditor.document)
                .then((html) => {
                  setValue("content", html);
                });
            }}
          />
        </div>
        {errors.content && (
          <p className="text-destructive mt-1 text-sm">
            {errors.content.message}
          </p>
        )}
      </Card.Content>

      <FileSelectionModal
        isOpen={isFileModalOpen}
        setIsOpen={setIsFileModalOpen}
        value={null}
        onChange={handleFileSelect}
        type={fileModalType}
        title={`Select ${fileModalType === "all" ? "File" : fileModalType === "image" ? "Image" : "Video"}`}
      />
    </Card>
  );
};
export default ContentEditor;
