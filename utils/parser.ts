export const extractor = async (sitemap: string) => {
  const splited = sitemap
    .replaceAll("\n", "")
    .split("<sitemap>")
    .map((line) => {
      if (line.trimStart().startsWith("<loc>")) {
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
    const lastmod = dateRegex ? dateRegex[1]! : null;
    return { url, lastmod };
  });
  return parsed;
};
