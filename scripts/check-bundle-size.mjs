import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const LIMIT_BYTES = 200 * 1024;
const assetsDir = join(process.cwd(), "dist", "assets");
const files = readdirSync(assetsDir).filter((name) => name.endsWith(".js") || name.endsWith(".css"));

let total = 0;

for (const name of files) {
  const gzipped = gzipSync(readFileSync(join(assetsDir, name))).byteLength;
  total += gzipped;
  console.log(`${name}: ${(gzipped / 1024).toFixed(1)} KB gzip`);
}

console.log(`total assets: ${(total / 1024).toFixed(1)} KB gzip (limit 200 KB)`);

if (total > LIMIT_BYTES) {
  process.exit(1);
}
