import { URLS } from "@/config";
import { parseYouTubeUrl } from "./youtubeUrlUtils";

export const getThumbnail = (thumbnail?: string, youtube?: string): string => {
  const { thumbnails } = youtube ? parseYouTubeUrl(youtube || "") : {};

  const result = thumbnail
    ? URLS.news.thumbnail + "/" + thumbnail
    : thumbnails?.default || "/images/thumbnail.png";

  return result;
};
