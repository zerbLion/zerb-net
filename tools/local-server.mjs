import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const redirectsPath = join(root, "redirects.json");
const redirects = existsSync(redirectsPath)
  ? JSON.parse(readFileSync(redirectsPath, "utf8"))
  : [];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject"
};

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0].split("#")[0]);
  const normalized = normalize(cleanUrl).replace(/^([/\\])+/, "");
  let file = resolve(join(root, normalized));

  if (!file.startsWith(root + sep) && file !== root) {
    return null;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  } else if (!existsSync(file) && existsSync(`${file}.html`)) {
    file = `${file}.html`;
  } else if (!existsSync(file) && existsSync(join(file, "index.html"))) {
    file = join(file, "index.html");
  }

  return file;
}

function normalizeRoute(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0].split("#")[0]);
  const route = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return route.endsWith("/") || route.endsWith(".html") ? route : `${route}/`;
}

createServer((req, res) => {
  const route = normalizeRoute(req.url || "/");
  const redirect = redirects.find((item) => normalizeRoute(item.source) === route);

  if (redirect) {
    res.writeHead(redirect.permanent ? 308 : 307, {
      Location: redirect.destination
    });
    res.end();
    return;
  }

  const file = resolvePath(req.url || "/");
  const fallback = join(root, "404.html");
  const target = file && existsSync(file) && statSync(file).isFile() ? file : fallback;

  if (!existsSync(target)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(target === fallback ? 404 : 200, {
    "Content-Type": types[extname(target).toLowerCase()] || "application/octet-stream"
  });
  createReadStream(target).pipe(res);
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
});
