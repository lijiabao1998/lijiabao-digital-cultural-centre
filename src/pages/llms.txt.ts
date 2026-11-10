// /llms.txt — the index for AI systems (https://llmstxt.org/).
import type { APIRoute } from 'astro';
import { llmsTxt } from '@lib/llms';
import { textResponse } from '@lib/markdown';

export const GET: APIRoute = async () => textResponse(await llmsTxt());
