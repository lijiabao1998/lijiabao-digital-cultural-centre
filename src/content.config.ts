// Content model.
//
//   works  src/content/works/<area>/<slug>.md   one file per work; the folder is the area (films | games | archive | lab)
//   news   src/content/news/<yyyy-mm-dd>-<slug>.md   最新動態
//   blog   src/content/blog/<yyyy-mm-dd>-<slug>.md   文章；網址是 /blog/<slug>/（檔名去掉日期）
//
// Schemas are strict: an unknown or misspelled field fails the build instead of being silently ignored.
// How to add a work: see README.md.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const httpUrl = z.url({ protocol: /^https?$/ });

const works = defineCollection({
  loader: glob({ pattern: '{films,games,archive,lab}/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.strictObject({
      title: z.string().trim().min(1),
      titleEn: z.string().trim().min(1).optional(),
      /** 摘要：一到兩句，卡片、作品頁、llms.txt 與搜尋結果都用這一段 */
      summary: z.string().trim().min(1),
      summaryEn: z.string().trim().min(1).optional(),
      /** 作品的日期（公開或發表的那一天） */
      date: z.date(),
      updated: z.date().optional(),
      /** 類型，例如「短片」「3D 生存遊戲」 */
      kind: z.string().trim().min(1),
      /** 完成狀態 */
      status: z.enum(['complete', 'ongoing', 'prototype', 'experiment', 'production', 'planned']),
      statusNote: z.string().trim().min(1).optional(),
      cover: image().optional(),
      coverAlt: z.string().trim().min(1).optional(),
      /** 片長（影像），例如「1 分 02 秒」 */
      runtime: z.string().trim().min(1).optional(),
      tech: z.array(z.string().trim().min(1)).default([]),
      /** 觀看／遊玩／閱讀的入口 */
      launchUrl: httpUrl.optional(),
      repoUrl: httpUrl.optional(),
      /** 來源：作品頁最後的「來源」清單 */
      sources: z
        .array(
          z.strictObject({
            title: z.string().trim().min(1),
            url: httpUrl.optional(),
            note: z.string().trim().min(1).optional(),
          }),
        )
        .default([]),
      /** 相關作品的 id，例如 games/defendtaipei */
      related: z.array(z.string().trim().min(1)).default([]),
      /** 精選展覽的排序：數字越小越前面；不填就不在精選裡 */
      featured: z.number().int().positive().optional(),
      /** 草稿不會產生頁面，也不會出現在 sitemap、feed、llms.txt */
      draft: z.boolean().default(false),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.strictObject({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    date: z.date(),
    /** 相關連結（站內路徑或完整網址） */
    link: z.string().trim().min(1).optional(),
    linkLabel: z.string().trim().min(1).optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.strictObject({
      title: z.string().trim().min(1),
      /** 摘要：一到兩句，列表、搜尋結果、分享卡片與 llms.txt 都用這一段 */
      summary: z.string().trim().min(1),
      date: z.date(),
      updated: z.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().trim().min(1).optional(),
      /** 署名：誰寫的。不填就是站主。由 AI 撰寫的文章一定要在這裡寫明 */
      byline: z.string().trim().min(1).optional(),
      /** 系列或主題，例如「蒙太奇」。可以不填 */
      tags: z.array(z.string().trim().min(1)).default([]),
      /** 草稿不會產生頁面，也不會出現在 sitemap、feed、llms.txt */
      draft: z.boolean().default(false),
    }),
});

export const collections = { works, news, blog };
