# 家寶數位文化中心 — 給 Claude 的工作說明

這個 repo 是 <https://lijiabao.uk/> 的原始碼。沒有管理後台，網站由站主和 Claude 透過 GitHub 維護。操作方式見 `README.md`。

## 定位

- 這是一座文化機構的網站，不是個人履歷或作品集。文字用機構的口吻：簡潔、可信、不誇飾。
- 站名「家寶數位文化中心」、英文名與一句話簡介都定義在 `src/data/site.ts`。簡介是站主認可的原句，不要改寫。
- 四個展區固定：影像、遊戲、歷史與文獻、互動實驗。

## 內容規則

- 每件作品一個 Markdown 檔，一定要有摘要與完成狀態；有引用就寫進 `sources`。
- 作品的說明只寫站主自己的資料裡有的內容（企劃、README、repo 描述）。不要替作品補上評價、意義或沒有根據的細節。
- 尚未公開的作品不要放上網站。不確定是否已公開，先問站主。
- 尚未完成的作品不要標成 `complete`。

## 觀點分享（/blog/）

- 專區在網站上叫「觀點分享」，底層是一般的 blog（網址 `/blog/`、內容集合 `blog`），名稱在 `src/data/site.ts` 的 `BLOG`。
- 文章有兩種來源：站主自己寫的，Claude 只排版、校對，不改觀點、不加料；站主指定 Claude 撰寫的（2026-11-13 起），要在 `byline` 寫明是 Claude 寫的，不能掛成站主的文字。
- Claude 撰寫的文章：事實先查證、文末附來源連結；查不到的不寫，推測要標明是推測；不引用別人的大段原文；不替本中心的作品或站主本人說話。
- 一篇一個檔案，放在 `src/content/blog/`，做法在 `README.md` 的「新增一篇文章」。還沒要公開的寫 `draft: true`。
- 文章頁、列表、sitemap、feed、`llms.txt`、Markdown 版本都由 `src/lib/blog.ts` 的 `getPosts()` 出發；新增用到文章的地方時從那裡取，不要另外讀資料夾。

## 視覺

- 白底、黑色粗字、大量留白、淡紫色區塊；全部直角，沒有陰影。色票與字級在 `src/styles/global.css`。
- 風格參考 NatCen（natcen.ac.uk）的機構感，但標誌、文案、圖片、版面都是自己的，不要複製對方的內容。
- 下拉選單：白底、1px 黑框、直角、無陰影、粗體連結。
- 標誌是粗黑的 L（代表「李」）加一個淡紫色方塊，定義在 `src/components/Mark.astro`、`public/favicon.svg` 與 `scripts/og.mjs`，三處要一致。

## 對 AI 開放

`robots.txt` 全部允許，並提供 `llms.txt`、`llms-full.txt`、每頁的 `.md` 版本、`/api/works.json`、feed 與 sitemap。這些都由 `src/lib/` 產生，新增頁面類型時要一併接上 `src/lib/pages.ts`。

## 遊戲

- 遊戲由各自的 repo 發布；這個 repo 的 `gateway/` 只負責把它們接到 `lijiabao.uk/<展區>/<slug>/play/`，並在第一次進入時帶上舊網址的存檔。細節在 `README.md` 的「遊戲」。
- `gateway/src/games.js`、`gateway/wrangler.jsonc` 的路由、作品的 `launchUrl` 三處要一致，建置檢查會擋。
- `game.lijiabao.uk` 是閘道的自訂網域（舊網址轉址、存檔匯出頁、其餘頁面原樣轉送）；各遊戲的 GitHub Pages 在預設網址 `lijiabao1998.github.io/<repo>/`。不要把 GitHub Pages 的自訂網域設回去，也不要動這個網域的 DNS；要改先問站主。
- `games.js` 裡標 `keepOld` 的遊戲，舊網址必須原樣回應、不能轉址：那個 repo 自己的發佈驗證還在讀它。拿掉之前先確認那邊已經改好。
- 其他遊戲 repo 各有自己的流程（PR、任務卡、發布驗證），改之前先讀該 repo 的 `AGENTS.md` 或 `CLAUDE.md`。

## 改完之後

`npm run build` 必須通過（包含 `scripts/check-dist.mjs`）。推送到 `main` 會自動部署到正式網站。
