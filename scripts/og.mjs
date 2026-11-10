// Generates the raster brand images in public/ from the mark:
//   og.png (1200×630 social card), logo.png (512), apple-touch-icon.png (180), favicon.png (48)
//
// Run locally with `npm run og` and commit the results. It is NOT part of the build: the social card
// contains Chinese text, and build machines have no CJK font installed.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
mkdirSync(fileURLToPath(new URL('../public/', import.meta.url)), { recursive: true });

const INK = '#0b0b0d';
const LILAC = '#b79dea';
const CJK = `'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif`;

/** The mark on a square tile. `pad` is the margin as a fraction of the tile. */
const tile = (size, { bg = '#ffffff', pad = 0.16 } = {}) => {
  const s = size * (1 - pad * 2);
  const o = size * pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g transform="translate(${o} ${o}) scale(${s / 48})">
    <path d="M8 4h12v28h20v12H8z" fill="${INK}"/>
    <rect x="26" y="12" width="14" height="14" fill="${LILAC}"/>
  </g>
</svg>`;
};

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="760" y="0" width="440" height="630" fill="#e4d9f9"/>
  <rect x="1010" y="0" width="190" height="190" fill="#d1c0f3"/>
  <g transform="translate(800 120) scale(8.2)">
    <path d="M8 4h12v28h20v12H8z" fill="${INK}"/>
    <rect x="26" y="12" width="14" height="14" fill="#5b3fb5"/>
  </g>
  <text x="80" y="150" font-family="${CJK}" font-size="26" font-weight="700" fill="${INK}" letter-spacing="4">獨立 · 數位 · 全年開放</text>
  <text x="76" y="290" font-family="${CJK}" font-size="92" font-weight="900" fill="${INK}">家寶數位</text>
  <text x="76" y="400" font-family="${CJK}" font-size="92" font-weight="900" fill="${INK}">文化中心</text>
  <text x="80" y="478" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="${INK}" letter-spacing="3">JIABAO DIGITAL CULTURAL CENTRE</text>
  <rect x="80" y="520" width="600" height="4" fill="${INK}"/>
  <text x="80" y="566" font-family="${CJK}" font-size="27" font-weight="500" fill="#595964">影像 · 遊戲 · 歷史與文獻 · 互動實驗</text>
</svg>`;

await sharp(Buffer.from(card)).png().toFile(out('og.png'));
await sharp(Buffer.from(tile(512))).png().toFile(out('logo.png'));
await sharp(Buffer.from(tile(180, { pad: 0.18 }))).png().toFile(out('apple-touch-icon.png'));
await sharp(Buffer.from(tile(96, { pad: 0.06 }))).resize(48, 48).png().toFile(out('favicon.png'));

console.log('wrote public/og.png, logo.png, apple-touch-icon.png, favicon.png');
