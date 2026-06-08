import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = resolve(new URL("..", import.meta.url).pathname.slice(1));
const reportsDir = join(root, "reports");
const sharpModuleRoot =
  process.env.SHARP_MODULE_ROOT ||
  "D:/net/.tools/media/node_modules/sharp";
const ffmpegModuleRoot =
  process.env.FFMPEG_INSTALLER_ROOT ||
  "D:/net/.tools/ffmpeg/node_modules/@ffmpeg-installer/ffmpeg";

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    return createRequire(`${sharpModuleRoot}/package.json`)("sharp");
  }
}

function loadFfmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  return require(ffmpegModuleRoot).path;
}

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(file));
    else out.push(file);
  }
  return out;
}

function webPath(file) {
  return `/${relative(root, file).replaceAll("\\", "/")}`;
}

function encodedWebPath(file) {
  return webPath(file).split("/").map((part, index) => index === 0 ? part : encodeURIComponent(part)).join("/");
}

async function updateTextReferences(replacements) {
  const textExts = new Set([".html", ".xml", ".json", ".md", ".css", ".js"]);
  const files = (await walk(root)).filter((file) => {
    if (file.includes("\\reports\\") || file.includes("/reports/")) return false;
    return textExts.has(extname(file).toLowerCase());
  });
  const changed = [];

  for (const file of files) {
    let content = await readFile(file, "utf8");
    let next = content;
    for (const item of replacements) {
      next = next
        .replaceAll(item.oldPath, item.newPath)
        .replaceAll(item.oldEncodedPath, item.newEncodedPath);
    }
    if (next !== content) {
      await writeFile(file, next, "utf8");
      changed.push(relative(root, file));
    }
  }

  return changed;
}

async function optimizeImages() {
  const sharp = loadSharp();
  const imageDir = join(root, "media", "images");
  const files = (await walk(imageDir)).filter((file) => [".jpg", ".jpeg"].includes(extname(file).toLowerCase()));
  const replacements = [];
  const results = [];

  for (const file of files) {
    const before = (await stat(file)).size;
    const target = file.replace(/\.(jpe?g)$/i, ".webp");
    const temp = `${target}.tmp`;

    await sharp(file)
      .rotate()
      .webp({ quality: 88, effort: 6 })
      .toFile(temp);

    const after = (await stat(temp)).size;
    if (after < before) {
      await rm(file);
      await rename(temp, target);
      replacements.push({
        oldPath: webPath(file),
        oldEncodedPath: encodedWebPath(file),
        newPath: webPath(target),
        newEncodedPath: encodedWebPath(target)
      });
      results.push({ file: relative(root, target), before, after, saved: before - after, converted: true });
    } else {
      await rm(temp);
      results.push({ file: relative(root, file), before, after: before, saved: 0, converted: false });
    }
  }

  const changedTextFiles = await updateTextReferences(replacements);
  return { results, changedTextFiles };
}

function run(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("close", (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(stderr.trim() || `${command} exited with ${code}`));
    });
  });
}

async function optimizeVideos() {
  const ffmpeg = loadFfmpegPath();
  const videoDir = join(root, "media", "videos");
  const files = (await walk(videoDir)).filter((file) => extname(file).toLowerCase() === ".mp4");
  const results = [];

  for (const file of files) {
    const before = (await stat(file)).size;
    const temp = `${file}.tmp.mp4`;

    await run(ffmpeg, [
      "-y",
      "-i", file,
      "-map_metadata", "0",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-c:a", "aac",
      "-b:a", "128k",
      temp
    ]);

    const after = (await stat(temp)).size;
    if (after < before * 0.98) {
      await rm(file);
      await rename(temp, file);
      results.push({ file: relative(root, file), before, after, saved: before - after, overwritten: true });
    } else {
      await rm(temp);
      results.push({ file: relative(root, file), before, after: before, saved: 0, overwritten: false });
    }
  }

  return results;
}

function mb(bytes) {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

await mkdir(reportsDir, { recursive: true });

const imageRun = await optimizeImages();
const videoResults = await optimizeVideos();
const allResults = [...imageRun.results, ...videoResults];
const saved = allResults.reduce((sum, item) => sum + item.saved, 0);
const before = allResults.reduce((sum, item) => sum + item.before, 0);
const convertedImages = imageRun.results.filter((item) => item.converted).length;
const overwrittenVideos = videoResults.filter((item) => item.overwritten).length;

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    beforeMB: mb(before),
    savedMB: mb(saved),
    afterMB: mb(before - saved),
    convertedImages,
    totalImagesChecked: imageRun.results.length,
    overwrittenVideos,
    totalVideosChecked: videoResults.length,
    changedTextFiles: imageRun.changedTextFiles
  },
  images: imageRun.results.map((item) => ({ ...item, beforeMB: mb(item.before), afterMB: mb(item.after), savedMB: mb(item.saved) })),
  videos: videoResults.map((item) => ({ ...item, beforeMB: mb(item.before), afterMB: mb(item.after), savedMB: mb(item.saved) }))
};

await writeFile(join(reportsDir, "optimize-media-results.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report.summary, null, 2));
