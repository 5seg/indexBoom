import { detectDiff, handleDiff, loadData, saveData } from "./utils/diff";
import { extractor } from "./utils/parser";
import { indexNow } from "./utils/req";

const force = process.argv[2] === "--force";

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
const extracted = await extractor(sitemap);
if (force) {
  console.log("😈 Force mode detected");
  const urls = extracted.map((i) => i.url);
  const result = await indexNow({
    host: new URL(process.env.SITEMAP_URL!).hostname,
    key: process.env.INDEXNOW_KEY!,
    urlList: urls,
  });
  if (result.ok) {
    console.log(`Submitted ${urls.length} pages (${result.status})`);
  } else {
    console.log(`❌ Failed with ${result.status}`);
  }
  process.exit(0);
}
const newMap = extracted.filter(
  (item): item is { url: string; lastmod: string } => item.lastmod !== null,
);

const prev = await loadData();
const diff = detectDiff(prev, newMap);
const result = await handleDiff(diff);
if (result) {
  await saveData(newMap);
  console.log("✅ Saved");
} else {
  console.log("ℹ️ Skipped saveData");
}
