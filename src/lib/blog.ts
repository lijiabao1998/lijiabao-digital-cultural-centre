// 文章（/blog/）: one Markdown file per post in src/content/blog/.
import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG, SITE } from '@data/site';

export type Post = CollectionEntry<'blog'>;

/** `2026-11-13-first-montage` → `first-montage`. The date in the file name only keeps the folder in order. */
export const postSlug = (p: Post): string => p.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
export const postPath = (p: Post): string => `${BLOG.path}${postSlug(p)}/`;
export const postUrl = (p: Post): string => new URL(postPath(p), SITE.url).href;
export const postMdPath = (p: Post): string => `${BLOG.path}${postSlug(p)}.md`;

/** Every published post, newest first. Drafts never leave this function. */
export async function getPosts(): Promise<Post[]> {
  const all = (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const seen = new Map<string, string>();
  for (const p of all) {
    const slug = postSlug(p);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`[blog] ${p.id}: 檔名（去掉日期後）只能用小寫英文、數字與連字號，它會成為網址`);
    }
    if (seen.has(slug)) throw new Error(`[blog] ${p.id} 與 ${seen.get(slug)} 的網址相同：/blog/${slug}/`);
    seen.set(slug, p.id);
  }
  return all;
}
