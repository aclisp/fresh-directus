export function redirectToLogin(req: Request): Response {
  const { pathname, search, hash } = new URL(req.url);
  let location = "/login";
  if (pathname) {
    location += "?redirect=" + encodeURIComponent(pathname + search + hash);
  }
  return new Response(`Redirecting to ...`, {
    headers: { "Location": location },
    status: 303,
  });
}
