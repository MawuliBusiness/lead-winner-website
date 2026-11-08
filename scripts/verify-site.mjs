import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
const html=readFileSync("dist/index.html","utf8");
assert.match(html,/Lead Winner/);
assert.match(html,/og-preview\.png/);
assert.doesNotMatch(html,/VAN DE|KLIMAATTECH|Offerte aanvragen.*Tom/);
console.log("Lead Winner homepage and OG metadata verified");
