// /blog.md — the list of posts as Markdown.
import type { APIRoute } from 'astro';
import { getPosts } from '@lib/blog';
import { blogMarkdown, mdResponse } from '@lib/markdown';

export const GET: APIRoute = async () => mdResponse(blogMarkdown(await getPosts()));
