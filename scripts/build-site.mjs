import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const input = new URL("../site/", import.meta.url);
const output = new URL("../dist/", import.meta.url);
mkdirSync(output, { recursive: true });
for (const page of ["index.html", "privacy.html"]) {
  const source = new URL(page + ".gz", input);
  const html = gunzipSync(readFileSync(source));
  writeFileSync(new URL(page, output), html);
}
for (const asset of ["leadwinner-mark.webp", "og-preview.png"]) {
  copyFileSync(new URL(asset, input), new URL(asset, output));
}
const page = readFileSync(new URL("index.html", output), "utf8");
if (!page.includes('property="og:image"') || !page.includes("Lead Winner") ||
    page.includes("VAN DE") || page.includes("KLIMAATTECH")) {
  throw new Error("Lead Winner website validation failed");
}
console.log("Lead Winner static website built from production backup");
