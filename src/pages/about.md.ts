// /about.md — Markdown twin of the About page.
import type { APIRoute } from 'astro';
import { aboutMarkdown } from '@lib/llms';
import { mdResponse } from '@lib/markdown';

export const GET: APIRoute = () => mdResponse(aboutMarkdown());
