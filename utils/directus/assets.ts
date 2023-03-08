export const DIRECTUS_HOST = "http://127.0.0.1:8055";

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
