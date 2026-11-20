import type { Metadata } from "next";
import client from "@/tina/__generated__/client";
import { getArangetrams } from "@/lib/data";
import { ArangetramClient } from "@/components/DetailClients";

type Params = { slug: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArangetrams()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await client.queries.arangetram({ relativePath: `${slug}.md` });
  return { title: `Arangetram: ${res.data.arangetram.name}`, description: res.data.arangetram.intro ?? undefined };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const res = await client.queries.arangetram({ relativePath: `${slug}.md` });
  return <ArangetramClient query={res.query} variables={res.variables} data={res.data} />;
}
