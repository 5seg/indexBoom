import { existsSync } from "node:fs";
import { indexNow } from "./req";

type SitemapEntry = {
  url: string;
  lastmod: string;
};

type DiffResult = {
  added: SitemapEntry[];
  modified: SitemapEntry[];
  removed: SitemapEntry[];
};

const DATA_FILE = process.env.DATA_FILE_PATH!;

export const loadData = async (): Promise<SitemapEntry[]> => {
  if (!existsSync(DATA_FILE)) return [];
  const text = await Bun.file(DATA_FILE).text();
  return JSON.parse(text) as SitemapEntry[];
};

export const saveData = async (entries: SitemapEntry[]) => {
  await Bun.write(DATA_FILE, JSON.stringify(entries, null, 2));
};

export function detectDiff(
  prev: SitemapEntry[],
  next: SitemapEntry[],
): DiffResult {
  const prevMap = new Map(prev.map((e) => [e.url, e.lastmod]));
  const nextMap = new Map(next.map((e) => [e.url, e.lastmod]));

  const added: SitemapEntry[] = [];
  const modified: SitemapEntry[] = [];
  const removed: SitemapEntry[] = [];

  //? Detect added/updated entry
  for (const entry of next) {
    if (!prevMap.has(entry.url)) {
      added.push(entry);
    } else if (prevMap.get(entry.url) !== entry.lastmod) {
      modified.push(entry);
    }
  }

  //? Detect deleted entry
  for (const entry of prev) {
    if (!nextMap.has(entry.url)) {
      removed.push(entry);
    }
  }

  return { added, modified, removed };
}

export const handleDiff = async (diff: DiffResult) => {
  if (
    diff.added.length === 0 &&
    diff.modified.length === 0 &&
    diff.removed.length === 0
  ) {
    console.log("✅ No Changes");
    return false;
  }

  const urls: string[] = [];
  if (diff.added.length > 0) {
    console.log(`🆕 New Pages Found (${diff.added.length} Pages)`);
    for (const entry of diff.added) {
      console.log(`  + ${entry.url}`);
      console.log(`    lastmod: ${entry.lastmod}`);
      urls.push(entry.url);
    }
  }

  if (diff.modified.length > 0) {
    console.log(`✏️  Modified Pages Found (${diff.modified.length} Pages)`);
    for (const entry of diff.modified) {
      console.log(`  ~ ${entry.url}`);
      console.log(`    lastmod: ${entry.lastmod}`);
      urls.push(entry.url);
    }
  }

  if (diff.removed.length > 0) {
    console.log(`🗑️  Deleted Pages Found (${diff.removed.length} Pages)`);
    for (const entry of diff.removed) {
      console.log(`  - ${entry.url}`);
      //* Noting to do
    }
  }
  const hosturl = new URL(process.env.SITEMAP_URL!);
  const result = await indexNow({
    host: hosturl.hostname,
    key: process.env.INDEXNOW_KEY!,
    urlList: urls,
  });
  if (result.ok) {
    console.log(`✅ Submitted ${urls.length} pages (${result.status})`);
    return true;
  } else {
    console.log(`❌ Failed with ${result.status}`);
    return false;
  }
};
