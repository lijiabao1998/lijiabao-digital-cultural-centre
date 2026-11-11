# 家寶數位文化中心 · Jiabao Digital Cultural Centre

> An independent digital cultural centre presenting films, games, historical research, and interactive experiences.
>
> 一座獨立的數位文化中心，呈現影像、遊戲、歷史研究與互動體驗。

網站：<https://lijiabao.uk/>

靜態網站，用 [Astro](https://astro.build/) 7 建置，部署在 Cloudflare Workers（靜態資源）。沒有管理後台：內容就是這個 repo 裡的 Markdown 檔案。

## 指令

| 指令 | 作用 |
| --- | --- |
| `npm install` | 安裝依賴 |
| `npm run dev` | 本機預覽，<http://localhost:4321/> |
| `npm run build` | 建置到 `dist/`，結束後自動執行 `scripts/check-dist.mjs` 檢查 |
| `npm run check` | TypeScript 與 Astro 型別檢查 |
| `npm run og` | 重新產生 `public/` 裡的社群圖與圖示（改了標誌才需要） |

需要 Node 22.18 以上。

## 四個展區

| 資料夾 | 網址 | 展區 |
| --- | --- | --- |
| `src/content/works/films/` | `/films/` | 01 影像 |
| `src/content/works/games/` | `/games/` | 02 遊戲 |
| `src/content/works/archive/` | `/archive/` | 03 歷史與文獻 |
| `src/content/works/lab/` | `/lab/` | 04 互動實驗 |

## 新增一件作品

在對應展區的資料夾裡新增一個 `.md` 檔。檔名就是網址：`src/content/works/games/defendtaipei.md` → `/games/defendtaipei/`。

```md
---
title: 作品名稱
titleEn: English title            # 選填
summary: 一到兩句的摘要。卡片、作品頁、搜尋結果與 llms.txt 都用這一段。
date: 2026-11-10                   # 作品公開的日期
kind: 短片                         # 類型
status: complete                   # 完成狀態，見下表
statusNote: 補充說明               # 選填
cover: ../../../assets/covers/檔名.jpg   # 選填；不填會自動產生一張幾何封面
coverAlt: 圖片內容的文字描述       # 有 cover 就要寫
runtime: 1 分 02 秒                # 選填，影像用
tech: [three.js, TypeScript]       # 選填
launchUrl: https://…               # 選填；觀看／遊玩／閱讀的入口
repoUrl: https://github.com/…      # 選填
sources:                           # 選填；作品頁最後的「來源」清單
  - title: 來源名稱
    url: https://…
    note: 補充說明
related: [games/另一件作品]         # 選填
featured: 1                        # 選填；填了就進首頁「精選展覽」，數字小的在前
draft: false                       # true 的話不會產生頁面
---

內文用 Markdown 寫。
```

欄位寫錯或多寫，建置會直接失敗並指出是哪一個檔案。

### 完成狀態

| `status` | 顯示 | 意思 |
| --- | --- | --- |
| `complete` | 已完成 | 作品已經完成並公開 |
| `ongoing` | 持續更新 | 已經公開，仍在更新 |
| `prototype` | 原型 | 可以體驗的早期版本 |
| `experiment` | 實驗中 | 為了試驗某個想法而做 |
| `production` | 製作中 | 正在製作，尚未公開完整版本 |
| `planned` | 籌備中 | 已經立項，尚未公開 |

尚未完成的作品不要標成 `complete`。

## 新增一則最新動態

在 `src/content/news/` 新增 `YYYY-MM-DD-簡短英文.md`：

```md
---
title: 標題
summary: 一句話說明。
date: 2026-11-10
link: /games/defendtaipei/   # 選填
linkLabel: 前往作品          # 選填
---

選填的補充內文。
```

## 自動產生的東西

新增作品之後不需要另外維護下面這些，建置時會一起更新：

- 導覽列的下拉選單、首頁、展區頁、全部館藏、網站地圖
- `/sitemap.xml`、`/robots.txt`
- `/llms.txt`、`/llms-full.txt`，以及每一頁的 Markdown 版本（網址後面加 `.md`）
- `/api/works.json`、`/feed.xml`、`/feed.json`
- 每一頁的 schema.org 結構化資料（JSON-LD）
- 中文字型的子集：只下載全站實際用到的字

## 目錄

```
src/
  content/works/<展區>/<slug>.md   作品
  content/news/                    最新動態
  content.config.ts                內容欄位定義
  data/site.ts                     站名、四個展區、狀態、導覽
  data/about.ts                    「關於我們」的文字
  components/                      標誌、頁首（下拉選單）、頁尾、卡片
  layouts/Base.astro               共用版面與 <head>
  lib/                             讀取作品、結構化資料、Markdown 版本、llms.txt
  pages/                           所有頁面與機器可讀端點
  styles/global.css                視覺系統
public/                            圖示、社群圖、_headers
scripts/og.mjs                     產生社群圖與圖示
scripts/check-dist.mjs             建置後檢查
gateway/                           遊戲閘道（獨立的 Worker，見下方「遊戲」）
```

## 部署

Cloudflare Workers Builds 連接這個 repo：推送到 `main` 之後自動執行 `npm run build`，再執行 `npx wrangler deploy`。設定在 `wrangler.jsonc`：網域 `lijiabao.uk` 也宣告在裡面，`workers.dev` 位址已關閉。建置用的 Node 版本寫在 `.node-version`。

## 遊戲

遊戲不放在這個 repo 裡。每款遊戲仍由自己的 repo 建置、發布到 GitHub Pages；`gateway/` 是一個獨立的 Cloudflare Worker，把它們接到主網域：

- `lijiabao.uk/games/defendtaipei/` 是作品頁（這個網站）。
- `lijiabao.uk/games/defendtaipei/play/` 是遊戲本身（閘道把該 repo 發布的檔案原樣轉送過來）。

閘道只回應 `gateway/wrangler.jsonc` 列出的網址，網站其餘部分仍是純靜態檔案。Cloudflare 上它是另一個專案（`lijiabao-games-gateway`，根目錄 `/gateway`），同樣是推送到 `main` 就自動部署。

**新增一款可以在主網域遊玩的遊戲**，三處要一起改，`npm run build` 會檢查它們是否一致：

1. `gateway/src/games.js`：加一行（遊玩網址、repo 名稱）。
2. `gateway/wrangler.jsonc`：加一條對應的路由。
3. 作品的 Markdown：`launchUrl` 寫成 `https://lijiabao.uk/<展區>/<slug>/play/`。

**存檔**放在玩家的瀏覽器裡（localStorage 與 IndexedDB），綁在網址上。瀏覽器第一次進入任何一個遊玩網址時，閘道會先送它到 `…/play/__saves`：這一頁向舊網址 `game.lijiabao.uk/save-export.html` 要來存檔，把這裡還沒有的複製進來，再進入遊戲。舊網址的資料不會被刪除，這裡已有的存檔不會被覆蓋。`gateway/save-export.html` 是那一頁的原稿，實際發布在 `lijiabao1998.github.io` 這個 repo。

**限制**：閘道每轉送一個檔案算一次 Worker 請求，Cloudflare 免費方案每天十萬次（全帳號合計）。超過之後當天遊戲會打不開，網站本身不受影響。

### 舊網域 game.lijiabao.uk（2026-11-11 已切換）

`game.lijiabao.uk` 現在是閘道的自訂網域（`gateway/wrangler.jsonc`），由 `gateway/src/old-host.js` 回應：

- 已搬的遊戲 301 到新的遊玩網址，網址後面的路徑與參數照帶。
- `/save-export.html` 由閘道提供（原稿是 `gateway/save-export.html`），新網址靠它把舊存檔帶過來。
- 其餘頁面原樣轉送 GitHub Pages 的內容：隱私權政策、使用條款、圖片，以及沒有放進文化中心的作品。
- 舊版遊戲留在玩家瀏覽器裡的 service worker，會被一支自我註銷的腳本接手，下一次造訪才到得了轉址。

GitHub Pages 這邊，使用者站 `lijiabao1998.github.io` 已經沒有自訂網域，各遊戲發佈在 `lijiabao1998.github.io/<repo>/`，閘道從那裡取檔（`games.js` 的 `PAGES_ORIGIN`）。**不要再把自訂網域設回去**：設回去 GitHub 會把預設網址轉走，所有遊玩網址都會壞。

**還剩一步**：微光小鎮的舊網址 `game.lijiabao.uk/glimmertown/` 目前原樣回 200、不轉址（`games.js` 裡標了 `keepOld`），因為 `lijiabao1998/glimmertown` main 上的發佈工具還在讀這個網址。等它的 T721（PR #88）合併、main 那一輪的部署與驗證都綠了，把 `keepOld` 拿掉，它的舊網址才開始轉址。

**切換時學到的**：

- 把一個已經有 DNS 紀錄的網域接到 Worker 之前，要先在 Cloudflare 把那筆紀錄刪掉。自動建置的 wrangler 不會覆蓋它，部署會失敗（`already has externally managed DNS records`）。
- 刪 DNS 紀錄要登入 Cloudflare 儀表板，先確認登入還在再開始。這次少了這一步，舊網址因此停了約二十分鐘。
- GitHub 拿掉自訂網域時會連憑證一起刪，設回去要重新簽發，所以切到一半只能往前修。
