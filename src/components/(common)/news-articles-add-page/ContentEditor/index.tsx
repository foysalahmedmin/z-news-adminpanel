import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/Card";
import { URLS } from "@/config";
import useSetting from "@/hooks/states/useSetting";
import type { NewsFormData } from "@/pages/(common)/NewsArticlesAddPage";
import { uploadNewsFile } from "@/services/news.service";

const ContentEditor = () => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<NewsFormData>();
  const { setting } = useSetting();

  const blockNoteEditor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing your article...",
      },
    ],
    domAttributes: {
      editor: {
        style: "min-height: 350px; padding-top: 1rem; padding-bottom: 1rem;",
      },
    },
    uploadFile: async (file: File) => {
      let fileType: "image" | "video" | "audio" | "file" = "file";

      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";
      else if (file.type.startsWith("audio/")) fileType = "audio";

      const { data } = await uploadNewsFile(file, fileType);
      return data?.filename ? URLS.news_images + "/" + data?.filename : "";
    },
  });

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Content *</Card.Title>
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
    </Card>
  );
};

export default ContentEditor;
