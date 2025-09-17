import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import type { NewsFormData } from "@/pages/(common)/NewsArticlesAddPage";

const PublishSettings = () => {
  const { setValue, watch } = useFormContext<NewsFormData>();
  const status = watch("status");
  const publishedAt = watch("published_at");

  const handlePublishedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("published_at", value ? new Date(value) : undefined);
  };

  const handleExpiredAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("expired_at", value ? new Date(value) : undefined);
  };

  const formatDateTimeLocal = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Publish Settings</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_news_headline">
                News Headline
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Display at the top of news headline section
              </p>
            </div>
            <Switch
              id="is_news_headline"
              checked={watch("is_news_headline")}
              onChange={(checked) => setValue("is_news_headline", checked)}
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_news_break">
                News Break
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Display as news break
              </p>
            </div>
            <Switch
              id="is_news_break"
              checked={watch("is_news_break")}
              onChange={(checked) => setValue("is_news_break", checked)}
            />
          </div> */}

          {/* <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_premium">
                Premium
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Require subscription to view
              </p>
            </div>
            <Switch
              id="is_premium"
              checked={watch("is_premium")}
              onChange={(checked) => setValue("is_premium", checked)}
            />
          </div> */}

          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_featured">
                Featured
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Show in featured articles section
              </p>
            </div>
            <Switch
              id="is_featured"
              checked={watch("is_featured")}
              onChange={(checked) => setValue("is_featured", checked)}
            />
          </div>
          {watch("is_featured") && (
            <div className="grid grid-cols-2 items-center justify-between gap-4">
              <div>
                <FormControl.Label htmlFor="sequence">
                  Lead Order
                </FormControl.Label>
                <p className="text-muted-foreground text-sm">
                  Display order for featured articles
                </p>
              </div>
              <FormControl
                className="flex items-center justify-center px-0 text-center placeholder:px-2 placeholder:text-xs"
                min={0}
                max={5}
                as="input"
                type="number"
                id="sequence"
                placeholder="SEQUENCE"
                value={watch("sequence")}
                onChange={(e) => setValue("sequence", Number(e.target.value))}
              />
            </div>
          )}
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormControl.Label htmlFor="published_at">
              Publish Date
            </FormControl.Label>
            <FormControl
              as="input"
              className="w-full"
              id="published_at"
              type="datetime-local"
              value={formatDateTimeLocal(publishedAt)}
              onChange={handlePublishedAtChange}
            />
          </div>

          <div>
            <FormControl.Label htmlFor="expired_at">
              Expiry Date
            </FormControl.Label>
            <FormControl
              as="input"
              className="w-full"
              id="expired_at"
              type="datetime-local"
              min={formatDateTimeLocal(publishedAt)}
              onChange={handleExpiredAtChange}
            />
          </div>
        </div>
        <div>
          <FormControl.Label htmlFor="status">Status</FormControl.Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["draft", "published"].map((statusOption) => (
              <div
                key={statusOption}
                className={cn(
                  "cursor-pointer rounded-md border p-2 text-center",
                  status === statusOption
                    ? "border-primary bg-primary/10"
                    : "border-muted",
                )}
                onClick={() => setValue("status", statusOption as any)}
              >
                <div className="font-medium capitalize">{statusOption}</div>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PublishSettings;
