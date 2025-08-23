import { ENV, URLS } from "@/config";
import type { TNews } from "@/types/news.type";
import { FileText, Globe, Image, Search, Tag } from "lucide-react";
import React from "react";

// SEO Section
export type TNewsArticleSEOSectionProps = {
  news?: TNews;
};

const NewsArticleSEOSection: React.FC<TNewsArticleSEOSectionProps> = ({
  news,
}) => {
  const image = news?.seo?.image
    ? URLS.news.seo.image + "/" + news.seo.image
    : news?.thumbnail
      ? URLS.news.thumbnail + "/" + news.thumbnail
      : "/images/thumbnail.png";
  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm">
        Search Engine Optimization settings for this article
      </div>

      {/* SEO Title */}
      <div>
        <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
          <Search className="mr-2 h-5 w-5" />
          SEO Title
        </h3>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-foreground">
            {news?.seo?.title || news?.title || "No SEO title set"}
          </p>
          <div className="text-muted-foreground mt-2 text-xs">
            Length: {(news?.seo?.title || news?.title || "").length} characters
            {(news?.seo?.title || news?.title || "").length > 60 && (
              <span className="text-destructive ml-2">
                ⚠ Too long (recommended: 50-60 chars)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Description */}
      <div>
        <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
          <FileText className="mr-2 h-5 w-5" />
          Meta Description
        </h3>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-foreground">
            {news?.seo?.description ||
              news?.description ||
              "No meta description set"}
          </p>
          <div className="text-muted-foreground mt-2 text-xs">
            Length: {(news?.seo?.description || news?.description || "").length}{" "}
            characters
            {(news?.seo?.description || news?.description || "").length >
              160 && (
              <span className="text-destructive ml-2">
                ⚠ Too long (recommended: 150-160 chars)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Keywords */}
      <div>
        <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
          <Tag className="mr-2 h-5 w-5" />
          Keywords
        </h3>
        <div className="bg-muted rounded-lg p-4">
          {news?.seo?.keywords && news.seo.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {news.seo.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No SEO keywords set</p>
          )}
        </div>
      </div>

      {/* SEO Image */}
      <div>
        <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
          <Image className="mr-2 h-5 w-5" />
          Social Media Image
        </h3>
        <div className="bg-muted rounded-lg p-4">
          {news?.seo?.image ? (
            <div className="space-y-3">
              <img
                src={image}
                alt="SEO Image"
                className="h-auto w-full max-w-md rounded-lg object-cover"
              />
              <p className="text-muted-foreground text-xs">
                This image will be used when the article is shared on social
                media platforms.
              </p>
            </div>
          ) : news?.thumbnail ? (
            <div className="space-y-3">
              <img
                src={news.thumbnail}
                alt="Fallback SEO Image"
                className="h-auto w-full max-w-md rounded-lg object-cover"
              />
              <p className="text-muted-foreground text-xs">
                Using article thumbnail as fallback for social media sharing.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No SEO image set</p>
          )}
        </div>
      </div>

      {/* SEO Preview */}
      <div>
        <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
          <Globe className="mr-2 h-5 w-5" />
          Search Engine Preview
        </h3>
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="text-primary cursor-pointer text-lg hover:underline">
            {news?.seo?.title || news?.title || "Article Title"}
          </div>
          <div className="mt-1 text-sm text-green-600 dark:text-green-400">
            {ENV.app_url}/news/{news?.slug || "article-slug"}
          </div>
          <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {news?.seo?.description ||
              news?.description ||
              "Article description will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsArticleSEOSection;
