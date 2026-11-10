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
```

## 部署

Cloudflare Workers Builds 連接這個 repo：推送到 `main` 之後自動執行 `npm run build`，再執行 `npx wrangler deploy`。設定在 `wrangler.jsonc`：網域 `lijiabao.uk` 也宣告在裡面，`workers.dev` 位址已關閉。建置用的 Node 版本寫在 `.node-version`。
