#!/usr/bin/env node
/**
 * Optimizes PNG and JPEG images for web performance.
 * Run: node scripts/optimize-images.mjs [directory]
 * Default directory: src/img
 *
 * For best results, run this on your image assets (e.g. after adding new images).
 * You can also pass a custom path: node scripts/optimize-images.mjs /path/to/img
 */

import { readdir, stat } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_DIR = join(__dirname, "..", "src", "img");
// PNG: lossless – only better compression, no quality loss
// JPEG: quality 100 = no intentional quality sacrifice (max quality)
const OPTIONS = {
  png: {
    compressionLevel: 9,
    adaptiveFiltering: true,
  },
  jpeg: {
    quality: 100,
    mozjpeg: true,
  },
};

async function getImagePaths(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await getImagePaths(full, base)));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        paths.push(full);
      }
    }
  }
  return paths;
}

async function optimizeFile(path) {
  const ext = extname(path).toLowerCase();
  let pipeline = sharp(path);
  const meta = await pipeline.metadata();
  const format = meta.format;

  if (format === "png") {
    pipeline = pipeline.png({
      compressionLevel: OPTIONS.png.compressionLevel,
      adaptiveFiltering: OPTIONS.png.adaptiveFiltering,
    });
  } else if (format === "jpeg" || format === "jpg") {
    pipeline = pipeline.jpeg({
      quality: OPTIONS.jpeg.quality,
      mozjpeg: OPTIONS.jpeg.mozjpeg,
    });
  } else if (format === "webp") {
    pipeline = pipeline.webp({ quality: 100, effort: 6 });
  } else {
    return null;
  }

  const buffer = await pipeline.toBuffer({ resolveWithObject: true });
  const { default: fs } = await import("fs/promises");
  await fs.writeFile(path, buffer.data);
  return buffer.info.size;
}

async function main() {
  const dir = process.argv[2] || DEFAULT_DIR;
  console.log("Optimizing images in:", dir);

  let paths;
  try {
    paths = await getImagePaths(dir);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error("Directory not found:", dir);
      process.exit(1);
    }
    throw e;
  }

  if (paths.length === 0) {
    console.log("No PNG/JPEG/WebP files found.");
    return;
  }

  console.log("Found", paths.length, "image(s).");
  let totalSaved = 0;
  for (const path of paths) {
    try {
      const { default: fs } = await import("fs/promises");
      const before = (await stat(path)).size;
      const newSize = await optimizeFile(path);
      if (newSize != null) {
        const saved = before - newSize;
        totalSaved += saved;
        const rel = path.replace(join(__dirname, ".."), "").replace(/^\//, "");
        console.log("  ", rel, "–", (saved / 1024).toFixed(1), "KB saved");
      }
    } catch (err) {
      console.error("  Error:", path, err.message);
    }
  }
  console.log("Total saved:", (totalSaved / 1024).toFixed(1), "KB");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
