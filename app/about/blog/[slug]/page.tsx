import type { Metadata } from "next";
import client from "@/tina/__generated__/client";
import { getPosts } from "@/lib/data";
import { PostClient } from "@/components/DetailClients";

type Params = { slug: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await client.queries.post({ relativePath: `${slug}.md` });
  return { title: res.data.post.title, description: res.data.post.excerpt ?? undefined };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const res = await client.queries.post({ relativePath: `${slug}.md` });
  return <PostClient query={res.query} variables={res.variables} data={res.data} />;
}
