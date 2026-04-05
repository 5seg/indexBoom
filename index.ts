import { detectDiff, handleDiff, loadData, saveData } from "./utils/diff";
import { extractor } from "./utils/parser";

const url = process.env.SITEMAP_URL;
if (!url) {
  console.error(new Error("SITEMAP_URL is not defined in .env"));
  process.exit(1);
}
if (!process.env.DATA_FILE_PATH) {
  console.error(new Error("DATA_FILE_PATH is not defined in .env"));
  process.exit(1);
}
if (!process.env.INDEXNOW_KEY) {
  console.error(new Error("INDEXNOW_KEY is not defined in .env"));
  process.exit(1);
}

const sitemap = await (await fetch(url)).text();
const newMap = await extractor(sitemap);

const prev = await loadData();
const diff = detectDiff(prev, newMap);
const result = await handleDiff(diff);
if (result) {
  await saveData(newMap);
  console.log("✅ Saved");
} else {
  console.log("ℹ️ Skipped saveData");
}
