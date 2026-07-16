import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "public/logo/dahora-mark.svg");
const svg = readFileSync(svgPath);

const sizes = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of sizes) {
  const out = join(root, "public/icons", file);
  await sharp(svg).resize(size, size).png().toFile(out);
  console.log("OK", file);
}

const maskableSize = 512;
const logoSize = Math.round(maskableSize * 0.62);
const logo = await sharp(svg).resize(logoSize, logoSize).png().toBuffer();
const maskable = await sharp({
  create: {
    width: maskableSize,
    height: maskableSize,
    channels: 4,
    background: { r: 194, g: 65, b: 12, alpha: 1 },
  },
})
  .composite([{ input: logo, gravity: "centre" }])
  .png()
  .toBuffer();

writeFileSync(join(root, "public/icons/icon-maskable-512.png"), maskable);
console.log("OK icon-maskable-512.png");

copyFileSync(svgPath, join(root, "public/favicon.svg"));
console.log("OK favicon.svg");
