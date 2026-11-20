import client from "@/tina/__generated__/client";

export async function getSettings() {
  const res = await client.queries.settings({ relativePath: "site.json" });
  return res.data.settings;
}

export type EventSummary = {
  slug: string;
  title: string;
  start: string;
  venue?: string | null;
  image?: string | null;
  summary?: string | null;
};
export type ArangetramSummary = {
  slug: string;
  name: string;
  date: string;
  photo?: string | null;
  years?: string | null;
  venue?: string | null;
  intro?: string | null;
};
export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  author?: string | null;
  image?: string | null;
  excerpt?: string | null;
};
export type Listings = {
  events: EventSummary[];
  arangetrams: ArangetramSummary[];
  posts: PostSummary[];
};

const nodes = <T,>(conn: { edges?: ({ node?: T | null } | null)[] | null }) =>
  (conn.edges ?? []).map((e) => e?.node).filter((n): n is T => !!n);

export async function getEvents(): Promise<EventSummary[]> {
  const res = await client.queries.eventConnection({ first: 1000 });
  return nodes(res.data.eventConnection)
    .map((n) => ({
      slug: n._sys.filename,
      title: n.title,
      start: n.start,
      venue: n.venue,
      image: n.image,
      summary: n.summary,
    }))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export async function getArangetrams(): Promise<ArangetramSummary[]> {
  const res = await client.queries.arangetramConnection({ first: 1000 });
  return nodes(res.data.arangetramConnection)
    .map((n) => ({
      slug: n._sys.filename,
      name: n.name,
      date: n.date,
      photo: n.photo,
      years: n.years,
      venue: n.venue,
      intro: n.intro,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPosts(): Promise<PostSummary[]> {
  const res = await client.queries.postConnection({ first: 1000 });
  return nodes(res.data.postConnection)
    .map((n) => ({
      slug: n._sys.filename,
      title: n.title,
      date: n.date,
      author: n.author,
      image: n.image,
      excerpt: n.excerpt,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getListings(): Promise<Listings> {
  const [events, arangetrams, posts] = await Promise.all([getEvents(), getArangetrams(), getPosts()]);
  return { events, arangetrams, posts };
}

export async function getPagePaths() {
  const res = await client.queries.pageConnection({ first: 1000 });
  return nodes(res.data.pageConnection).map((n) => n._sys.breadcrumbs);
}
