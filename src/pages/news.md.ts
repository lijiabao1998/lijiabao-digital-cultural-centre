// /news.md — Markdown twin of 最新動態.
import type { APIRoute } from 'astro';
import { mdResponse, newsMarkdown } from '@lib/markdown';
import { getNews } from '@lib/works';

export const GET: APIRoute = async () => mdResponse(newsMarkdown(await getNews()));
