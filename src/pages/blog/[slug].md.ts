// /blog/<slug>.md — one post as Markdown.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, postSlug, type Post } from '@lib/blog';
import { mdResponse, postMarkdown } from '@lib/markdown';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getPosts()).map((post) => ({ params: { slug: postSlug(post) }, props: { post } }));

export const GET: APIRoute = ({ props }) => mdResponse(postMarkdown((props as { post: Post }).post));
