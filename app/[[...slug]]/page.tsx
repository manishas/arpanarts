import type { Metadata } from "next";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";
import { getListings, getPagePaths, getSettings } from "@/lib/data";
import PageClient from "@/components/PageClient";

type Params = { slug?: string[] };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const paths = await getPagePaths();
  return paths.map((crumbs) => ({ slug: crumbs.join("/") === "home" ? [] : crumbs }));
}

const relativePath = (slug?: string[]) => `${slug?.length ? slug.join("/") : "home"}.md`;

async function load(slug?: string[]) {
  try {
    return await client.queries.page({ relativePath: relativePath(slug) });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await load(slug);
  if (!res) return {};
  const isHome = !slug?.length;
  return {
    title: isHome ? { absolute: res.data.page.title } : res.data.page.title,
    description: res.data.page.description ?? undefined,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const res = await load(slug);
  if (!res) notFound();
  const [listings, settings] = await Promise.all([getListings(), getSettings()]);
  return (
    <PageClient
      query={res.query}
      variables={res.variables}
      data={res.data}
      listings={listings}
      settings={{ email: settings.email, phone: settings.phone, address: settings.address }}
    />
  );
}
