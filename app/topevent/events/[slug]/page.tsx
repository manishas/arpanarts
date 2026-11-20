import type { Metadata } from "next";
import client from "@/tina/__generated__/client";
import { getEvents } from "@/lib/data";
import { EventClient } from "@/components/DetailClients";

type Params = { slug: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await client.queries.event({ relativePath: `${slug}.md` });
  return { title: res.data.event.title, description: res.data.event.summary ?? undefined };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const res = await client.queries.event({ relativePath: `${slug}.md` });
  return <EventClient query={res.query} variables={res.variables} data={res.data} />;
}
