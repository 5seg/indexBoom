export const extractor = async (sitemap: string) => {
  const splited = sitemap
    .replaceAll("\n", "")
    .split("<sitemap>")
    .map((line) => {
      if (line.trimStart().startsWith("<loc>") && line.includes("<lastmod>")) {
        return line
          .replaceAll(" ", "")
          .replace("</sitemap>", "")
          .replace("</sitemapindex>", "");
      }
    })
    .filter((line) => line);
  const parsed = splited.map((line) => {
    const urlRegex = line!.match(/<loc>(.*?)<\/loc>/);
    const dateRegex = line!.match(/<lastmod>(.*?)<\/lastmod>/);
    const url = urlRegex![1]!;
    const lastmod = dateRegex![1]!;
    return { url, lastmod };
  });
  return parsed;
};
