// /index.md — Markdown twin of the home page.
import type { APIRoute } from 'astro';
import { homeMarkdown } from '@lib/llms';
import { mdResponse } from '@lib/markdown';

export const GET: APIRoute = async () => mdResponse(await homeMarkdown());
