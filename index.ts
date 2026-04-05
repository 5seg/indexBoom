import { detectDiff, handleDiff, loadCache, saveCache } from "./utils/diff";
import { extractor } from "./utils/parser";

const url = process.env.SITEMAP_URL;
if (!url) {
  console.error(new Error("SITEMAP_URL is not defined in .env"));
  process.exit(1);
}
if (!process.env.CACHE_FILE_PATH) {
  console.error(new Error("CACHE_FILE_PATH is not defined in .env"));
  process.exit(1);
}

const sitemap = await (await fetch(url)).text();
const newMap = await extractor(sitemap);

const prev = await loadCache();
const diff = detectDiff(prev, newMap);
await handleDiff(diff);
await saveCache(newMap);
