// /robots.txt — everything is open, to search engines and to AI systems alike.
//
// `User-agent: *` already allows every crawler. The AI crawlers are also named one by one, because some
// operators only treat a site as opted in when their own agent is listed.
// `Content-Signal` states the three permissions explicitly (https://contentsignals.org/).
import type { APIRoute } from 'astro';
import { SITE } from '@data/site';

const AI_AGENTS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Google
  'Google-Extended',
  'GoogleOther',
  'Google-CloudVertexBot',
  // Microsoft
  'bingbot',
  // Apple
  'Applebot',
  'Applebot-Extended',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Meta
  'meta-externalagent',
  'meta-externalfetcher',
  'FacebookBot',
  // Amazon
  'Amazonbot',
  // Others
  'CCBot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Bytespider',
  'YouBot',
  'Kagibot',
  'PetalBot',
  'Diffbot',
  'Timpibot',
  'AI2Bot',
  'DeepSeekBot',
  'ChatGLM-Spider',
  'PanguBot',
];

export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE.name} (${SITE.nameEn})`,
    `# ${SITE.url}/`,
    '#',
    '# All public content on this site may be crawled, indexed, summarised, quoted,',
    '# used as input to AI systems, and used for AI training.',
    '# 本站公開內容歡迎搜尋引擎與 AI 讀取、索引、摘要、引用與訓練。',
    '#',
    `# Start here:  ${SITE.url}/llms.txt`,
    `# Full text:   ${SITE.url}/llms-full.txt`,
    `# Catalogue:   ${SITE.url}/api/works.json`,
    '',
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    'Allow: /',
    '',
    ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
