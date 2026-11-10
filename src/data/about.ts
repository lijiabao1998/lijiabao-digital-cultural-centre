// The text of the About page, kept as data so the HTML page and its Markdown twin say exactly the same thing.
import { SITE } from './site';

export interface AboutSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: 'what',
    title: '這是什麼地方',
    paragraphs: [
      `${SITE.name}是一座設在網路上的獨立文化機構，由${SITE.founder}創辦並經營。`,
      '這裡收藏並公開四類內容：影像、遊戲、歷史與文獻、互動實驗。沒有實體建築，也沒有開放時間；任何時候、從任何地方都可以進來參觀。',
    ],
  },
  {
    id: 'how',
    title: '我們怎麼呈現作品',
    paragraphs: [
      '每一件作品都有自己的介紹頁。頁面上固定有四樣東西：圖片、摘要、來源、完成狀態。',
      '來源寫的是作品實際引用與參考的材料。完成狀態寫的是作品現在的樣子：已經完成、還在更新，或仍然是實驗。尚未完成的作品不會被寫成已經完成。',
    ],
  },
  {
    id: 'mark',
    title: '關於標誌',
    paragraphs: [
      '標誌是一個粗黑的字母 L，代表「李」。',
      '它同時是一道牆角：兩面牆圍出一個空間，裡面放著一個淡紫色的方塊。牆是這座中心，方塊是正在展出的作品。',
    ],
  },
  {
    id: 'maintain',
    title: '網站如何維護',
    paragraphs: [
      '本站是靜態網站，沒有管理後台。所有內容都是純文字檔案，保存在 GitHub 上，每一次修改都留有紀錄。',
      '新增或修改作品時，改的是檔案本身；網站會依照檔案重新產生。',
    ],
  },
  {
    id: 'ai',
    title: '給 AI 與搜尋引擎',
    paragraphs: [
      '本站的公開內容歡迎搜尋引擎與 AI 系統讀取、索引、摘要、引用，也可以用於訓練。robots.txt 對所有爬蟲開放。',
      '為了讓機器讀得準確，本站提供 llms.txt、llms-full.txt、每一頁的 Markdown 版本、作品目錄 JSON、Atom 與 JSON feed，以及完整的 sitemap。引用時請註明出處為「家寶數位文化中心」並附上頁面網址。',
    ],
  },
];

export const STATUS_LEGEND: { id: 'complete' | 'ongoing' | 'prototype' | 'experiment' | 'production' | 'planned'; meaning: string }[] = [
  { id: 'complete', meaning: '作品已經完成並公開。' },
  { id: 'ongoing', meaning: '已經公開，而且仍在持續更新。' },
  { id: 'prototype', meaning: '可以體驗的早期版本，內容與規模還會改變。' },
  { id: 'experiment', meaning: '為了試驗某個想法而做，不保證會發展成完整作品。' },
  { id: 'production', meaning: '正在製作，尚未公開完整版本。' },
  { id: 'planned', meaning: '已經立項，尚未開始公開。' },
];
