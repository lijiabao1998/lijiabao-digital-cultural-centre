// /llms-full.txt — the whole site as one Markdown document.
import type { APIRoute } from 'astro';
import { llmsFullTxt } from '@lib/llms';
import { textResponse } from '@lib/markdown';

export const GET: APIRoute = async () => textResponse(await llmsFullTxt());
