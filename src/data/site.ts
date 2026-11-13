// Single source of truth for names, the four areas and navigation.
// Every page, feed, sitemap and llms.txt reads from here.

export const SITE = {
  url: 'https://lijiabao.uk',
  name: '家寶數位文化中心',
  nameEn: 'Jiabao Digital Cultural Centre',
  shortName: '家寶',
  locale: 'zh-Hant',
  /** The approved one-line introduction (do not reword). */
  tagline: '一座獨立的數位文化中心，呈現影像、遊戲、歷史研究與互動體驗。',
  taglineEn:
    'An independent digital cultural centre presenting films, games, historical research, and interactive experiences.',
  founder: '李家寶',
  founded: 2026,
  github: 'https://github.com/lijiabao1998',
  sisterSite: { name: 'lijiabao.dev', url: 'https://lijiabao.dev/' },
} as const;

export const AREA_IDS = ['films', 'games', 'archive', 'lab'] as const;
export type AreaId = (typeof AREA_IDS)[number];

export interface Area {
  id: AreaId;
  no: string;
  name: string;
  nameEn: string;
  /** One sentence shown on the home page, the area page and in llms.txt. */
  intro: string;
  introEn: string;
  /** What one item in this area is called. */
  unit: string;
  /** Label of the main action on a work page. */
  action: string;
}

export const AREAS: readonly Area[] = [
  {
    id: 'films',
    no: '01',
    name: '影像',
    nameEn: 'Films',
    intro: '短片與影像作品。每一部都附上題材、片長、完成狀態與參考來源。',
    introEn: 'Short films and moving-image works, each with its subject, runtime, status and sources.',
    unit: '部',
    action: '觀看影片',
  },
  {
    id: 'games',
    no: '02',
    name: '遊戲',
    nameEn: 'Games',
    intro: '可以直接在瀏覽器裡遊玩的遊戲。免安裝，手機和電腦都能玩。',
    introEn: 'Games playable in the browser. No install, on phone or desktop.',
    unit: '款',
    action: '開始遊玩',
  },
  {
    id: 'archive',
    no: '03',
    name: '歷史與文獻',
    nameEn: 'History & Documents',
    intro: '作品背後的歷史研究、原始文獻與來源整理。',
    introEn: 'The historical research, primary documents and source notes behind the works.',
    unit: '份',
    action: '閱讀文獻',
  },
  {
    id: 'lab',
    no: '04',
    name: '互動實驗',
    nameEn: 'Interactive Lab',
    intro: '仍在進行中的互動實驗與原型，公開過程，而不只是結果。',
    introEn: 'Interactive experiments and prototypes in progress — the process, not only the result.',
    unit: '項',
    action: '進入實驗',
  },
] as const;

export const areaById = (id: AreaId): Area => AREAS.find((a) => a.id === id)!;

/** Completion status of a work. Shown as a badge on cards and work pages. */
export const STATUS = {
  complete: { label: '已完成', labelEn: 'Complete' },
  ongoing: { label: '持續更新', labelEn: 'Ongoing' },
  prototype: { label: '原型', labelEn: 'Prototype' },
  experiment: { label: '實驗中', labelEn: 'Experimental' },
  production: { label: '製作中', labelEn: 'In production' },
  planned: { label: '籌備中', labelEn: 'Planned' },
} as const;
export type StatusId = keyof typeof STATUS;

/** 文章（/blog/）. Shown in the navigation once the first post is published. */
export const BLOG = {
  path: '/blog/',
  name: '文章',
  nameEn: 'Blog',
  intro: '本中心定期發表的文章。',
} as const;

/** Secondary links in the top-right of the header and in the footer. */
export const UTILITY_NAV = [
  { href: '/news/', label: '最新動態' },
  { href: '/collection/', label: '全部館藏' },
  { href: '/about/', label: '關於我們' },
] as const;
