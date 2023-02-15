import { DIRECTUS_HOST } from "./transport.ts";

interface AssetsOptions {
  altUrl?: string;
  accessToken?: string;
}

export function assets(fileId: string | undefined, options: AssetsOptions) {
  if (fileId) {
    return DIRECTUS_HOST + "/assets/" + fileId +
      "?access_token=" + options.accessToken;
  }

  return options.altUrl;
}
