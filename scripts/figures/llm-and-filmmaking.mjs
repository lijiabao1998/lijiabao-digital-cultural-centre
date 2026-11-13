// Figures for the post "語言成了片場的介面" (src/content/blog/2026-11-13-llm-and-filmmaking.md).
//
// Run locally:  node scripts/figures/llm-and-filmmaking.mjs
// Not part of the build: the figures contain Chinese text and build machines have no CJK font.
// The PNG files it writes to src/assets/blog/ are committed.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../../src/assets/blog/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const INK = '#0b0b0d';
const PAPER = '#ffffff';
const L100 = '#f0eafc';
const L200 = '#e4d9f9';
const L400 = '#b79dea';
const VIOLET = '#5b3fb5';
const CJK = `'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif`;
const W = 1600;
const H = 900;

const svg = (body, bg = PAPER) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${body}</svg>`;
const save = (name, markup) => sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(OUT + name);
const text = (x, y, s, size, weight = 700, fill = INK, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${CJK}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${s}</text>`;

// ---------- cover: a clapperboard whose slate is lines of text ----------
{
  const x = 360;
  const y = 250;
  const w = 880;
  const h = 500;
  // lines of "text": [row, start, width, colour]
  const rows = [
    [0, 0, 300, INK], [0, 330, 180, L400], [0, 540, 220, INK],
    [1, 0, 180, INK], [1, 210, 360, INK], [1, 600, 160, VIOLET],
    [2, 0, 420, INK], [2, 450, 120, INK], [2, 600, 160, L400],
    [3, 0, 140, VIOLET], [3, 170, 260, INK], [3, 460, 300, INK],
    [4, 0, 260, INK], [4, 290, 200, L400], [4, 520, 240, INK],
    [5, 0, 520, INK], [5, 550, 110, INK],
  ];
  const lines = rows
    .map(([r, s, len, c]) => `<rect x="${x + 60 + s}" y="${y + 70 + r * 64}" width="${len}" height="26" fill="${c}"/>`)
    .join('');
  // the hinged arm, with its diagonal stripes
  const stripes = Array.from({ length: 8 }, (_, i) => {
    const sx = x + i * 124;
    return `<polygon points="${sx},${y - 150} ${sx + 62},${y - 150} ${sx + 14},${y - 60} ${sx - 48},${y - 60}" fill="${PAPER}"/>`;
  }).join('');
  const body = `
    <rect x="0" y="0" width="${W}" height="${H}" fill="${L100}"/>
    <rect x="1180" y="0" width="420" height="330" fill="${L200}"/>
    <g transform="rotate(-9 ${x} ${y - 60})">
      <rect x="${x}" y="${y - 150}" width="${w}" height="90" fill="${INK}"/>
      <clipPath id="arm"><rect x="${x}" y="${y - 150}" width="${w}" height="90"/></clipPath>
      <g clip-path="url(#arm)">${stripes}</g>
    </g>
    <rect x="${x}" y="${y - 44}" width="${w}" height="64" fill="${INK}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}" stroke="${INK}" stroke-width="12"/>
    ${lines}
    <rect x="${x + 60}" y="${y + 70 + 6 * 64}" width="26" height="26" fill="${VIOLET}"/>`;
  await save('llm-film-cover.png', svg(body, L100));
}

// ---------- figure 1: how deep language models reach into each stage ----------
{
  const stages = [
    ['開發', 4, '審讀、摘要、比較劇本'],
    ['前製', 4, '拆解、排程的前端、分鏡草稿'],
    ['拍攝', 1, '筆記整理、翻譯、現場文件'],
    ['後製', 3, '逐字稿搜尋、聲音修飾、對嘴型'],
    ['發行', 5, '字幕、配音稿、文案、資料欄位'],
  ];
  const left = 110;
  const top = 250;
  const rowH = 112;
  const cell = 86;
  const rows = stages
    .map(([name, depth, note], i) => {
      const y = top + i * rowH;
      const cells = Array.from({ length: 5 }, (_, k) => {
        const on = k < depth;
        return `<rect x="${left + 250 + k * (cell + 10)}" y="${y}" width="${cell}" height="64" fill="${on ? (k === depth - 1 ? VIOLET : INK) : L100}"/>`;
      }).join('');
      return `${text(left, y + 48, name, 46, 900)}${cells}${text(left + 250 + 5 * (cell + 10) + 40, y + 43, note, 30, 600)}
        <rect x="${left}" y="${y + 88}" width="${W - 2 * left}" height="2" fill="${L200}"/>`;
    })
    .join('');
  const body = `
    ${text(left, 120, '語言模型在製作各階段介入的深淺', 54, 900)}
    ${text(left, 176, '格子越多，表示這個階段的日常工作越依賴文字，也越早被語言模型接手', 28, 600)}
    <rect x="${left}" y="208" width="${W - 2 * left}" height="6" fill="${INK}"/>
    ${rows}
    ${text(left, H - 44, '作者依文中所引報導做的定性判斷，不是量測數據。家寶數位文化中心繪製。', 24, 600)}`;
  await save('llm-film-stages.png', svg(body));
}

// ---------- figure 2: timeline 2023–2026 ----------
{
  const events = [
    ['2023 年 5–11 月', '編劇與演員先後罷工，AI 條款第一次寫進合約'],
    ['2024 年 9 月', '獅門影業與 Runway 合作；加州簽署數位複製品法律'],
    ['2025 年 4 月', '影藝學院：用或不用 AI，都不影響入圍'],
    ['2025 年 5 月', '《Watch the Skies》以視覺配音在美國上映'],
    ['2025 年 7 月', 'Netflix 表示首次在成片中使用生成畫面'],
    ['2025 年 9 月', 'Sora 第二代推出；AI「女演員」引發演員工會聲明'],
    ['2025 年 12 月', '迪士尼與 OpenAI 宣布 Sora 角色授權協議'],
    ['2026 年 3 月', 'OpenAI 宣布結束 Sora'],
    ['2026 年 4 月', '編劇工會新約通過，新增訓練授權的通知義務'],
    ['2026 年 7 月', '演員工會新約生效，收緊合成表演者的使用'],
  ];
  const left = 110;
  const top = 196;
  const rowH = 62;
  const axis = left + 330;
  const rows = events
    .map(([when, what], i) => {
      const y = top + i * rowH;
      const turn = i === 7; // the shutdown: the one event that runs against the others
      return `${text(left, y + 30, when, 28, 800)}
        <rect x="${axis - 11}" y="${y + 8}" width="22" height="22" fill="${turn ? VIOLET : INK}"/>
        ${text(axis + 44, y + 30, what, 30, turn ? 800 : 600, turn ? VIOLET : INK)}`;
    })
    .join('');
  const body = `
    ${text(left, 104, '2023–2026：從禁止到透明', 54, 900)}
    <rect x="${left}" y="140" width="${W - 2 * left}" height="6" fill="${INK}"/>
    <rect x="${axis - 2}" y="${top + 8}" width="4" height="${(events.length - 1) * rowH + 22}" fill="${INK}"/>
    ${rows}
    ${text(left, H - 36, '日期依文末所列來源。家寶數位文化中心繪製。', 24, 600)}`;
  await save('llm-film-timeline.png', svg(body));
}

console.log('figures written to src/assets/blog/');
