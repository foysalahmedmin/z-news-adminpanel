import { ENV } from "../env";

export const URLS = {
  app: ENV.app_url,
  api: ENV.api_url,
  user: `${ENV.api_url}/uploads/images/users`,
  news: {
    thumbnail: `${ENV.api_url}/uploads/news/thumbnails`,
    image: `${ENV.api_url}/uploads/news/images`,
    seo: {
      image: `${ENV.api_url}/uploads/news/seo/images`,
    },
  },
};
