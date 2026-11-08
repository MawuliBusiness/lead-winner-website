import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const input = new URL("../site/", import.meta.url);
const output = new URL("../dist/", import.meta.url);
mkdirSync(output, { recursive: true });
for (const page of ["index.html", "privacy.html"]) {
  const source = new URL(page + ".gz", input);
  let html = gunzipSync(readFileSync(source)).toString("utf8");
  if (page === "index.html") {
    // De goede Lead Winner-productiesite blijft de bron. Alleen de CTA en
    // de bijbehorende proefperiode-teksten worden bij de build aangepast.
    const replacements = [
      ["7 dagen gratis <span", "Probeer een gratis demo <span"],
      ["Start je gratis proefperiode ↗", "Probeer een gratis demo ↗"],
      ["Wij richten jouw WhatsApp-assistent in. Daarna probeer je hem 7 dagen gratis, inclusief opvolging van gemiste oproepen.", "Ontdek in een gratis demo hoe Lead Winner klantvragen beantwoordt en aanvragen opvolgt."],
      ["Wij richten jouw WhatsApp-assistent in. Daarna probeer je hem 7 dagen gratis.", "Bekijk hoe Lead Winner voor jouw bedrijf kan werken met een gratis demo."],
      ["Hoe werkt de gratis proefperiode?", "Hoe werkt de gratis demo?"],
      ["Je vraagt de proefperiode aan via WhatsApp. We stemmen de assistent af op jouw bedrijf en testen de inrichting. Zodra de assistent werkt, starten jouw 7 gratis dagen, inclusief opvolging van gemiste oproepen. Vooraf bespreken we de kosten en voorwaarden voor gebruik na de proefperiode.", "Vraag de gratis demo aan via WhatsApp. We laten zien hoe Lead Winner voor jouw bedrijf klantvragen beantwoordt en aanvragen opvolgt. Je zit nergens aan vast."],
      ["Aanvragen via WhatsApp · De 7 dagen starten zodra je assistent werkt", "Vraag vrijblijvend je gratis demo aan via WhatsApp"],
      ["Hoi%2C%20ik%20wil%20graag%20de%20Lead%20Winner%20WhatsApp-assistent%207%20dagen%20gratis%20proberen.", "Hoi%2C%20ik%20wil%20graag%20een%20gratis%20demo%20van%20Lead%20Winner%20aanvragen."],
    ];
    for (const [before, after] of replacements) {
      if (!html.includes(before)) throw new Error("Verwachte tekst niet gevonden: " + before);
      html = html.replaceAll(before, after);
    }
    if (/7 dagen gratis|7 gratis dagen|gratis proefperiode/i.test(html)) {
      throw new Error("Verouderde proefperiode-tekst staat nog op de homepage");
    }
  }
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
