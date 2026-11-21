"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";
import type { PageQuery } from "@/tina/__generated__/types";
import type { Listings } from "@/lib/data";
import { dayAndMonth, formatDate, formatTime, youtubeId } from "@/lib/format";

type Block = NonNullable<NonNullable<PageQuery["page"]["blocks"]>[number]>;
type B<T extends Block["__typename"]> = Extract<Block, { __typename: T }>;

/* ---------- small shared pieces ---------- */

export function Rich({ content, invert, className = "" }: { content?: TinaMarkdownContent | null; invert?: boolean; className?: string }) {
  if (!content) return null;
  return (
    <div className={`prose max-w-none prose-headings:font-display prose-a:font-semibold ${invert ? "prose-invert" : ""} ${className}`}>
      <TinaMarkdown content={content} />
    </div>
  );
}

function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string | null; className?: string }) {
  return (
    <section id={id || undefined} className={`mx-auto max-w-6xl px-4 py-8 md:py-10 ${className}`}>
      {children}
    </section>
  );
}

function Heading({ text, field, sub, subField }: { text?: string | null; field?: string; sub?: string | null; subField?: string }) {
  if (!text && !sub) return null;
  return (
    <div className="mb-6">
      {text && (
        <h2 data-tina-field={field} className="font-display text-3xl md:text-5xl">
          {text}
        </h2>
      )}
      {sub && (
        <p data-tina-field={subField} className="mt-2 text-lg font-semibold text-maroon">
          {sub}
        </p>
      )}
      <div className="mt-3 h-1 w-20 rounded bg-gold" />
    </div>
  );
}

const colorClass: Record<string, string> = {
  maroon: "bg-maroon text-white",
  ochre: "bg-ochre text-white",
  olive: "bg-olive text-white",
  gold: "bg-[#ecd08a] text-ink",
};

function SmartLink({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLAnchorElement>) {
  const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith(".pdf");
  if (external) {
    return (
      <a href={href} className={className} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/* ---------- blocks ---------- */

function Hero({ block }: { block: B<"PageBlocksHero"> }) {
  const slides = (block.slides ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksHero">["slides"]>[number]>[];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, paused]);
  if (!slides.length) return null;
  return (
    <section
      className="relative h-[70vh] min-h-[420px] max-h-[640px] overflow-hidden bg-maroon-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, n) => (
        <div
          key={n}
          className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={n !== i}
        >
          {s.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.image} alt="" data-tina-field={tinaField(s, "image")} className="h-full w-full object-cover object-[center_25%]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-16">
            <h1 data-tina-field={tinaField(s, "title")} className="font-display text-4xl text-white drop-shadow md:text-6xl">
              {s.title}
            </h1>
            {s.href && s.label && (
              <SmartLink
                href={s.href}
                data-tina-field={tinaField(s, "label")}
                className="mt-6 inline-block rounded bg-gold px-6 py-3 font-semibold text-maroon-dark shadow transition hover:bg-white"
              >
                {s.label}
              </SmartLink>
            )}
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Show slide ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-2.5 rounded-full transition-all ${n === i ? "w-8 bg-gold" : "w-2.5 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Text({ block }: { block: B<"PageBlocksText"> }) {
  const style = block.style || "plain";
  if (style === "highlight") {
    return (
      <section id={block.anchor || undefined} className="my-8 bg-maroon-dark py-12 text-white">
        <div className="mx-auto max-w-4xl px-4">
          {block.heading && (
            <h2 data-tina-field={tinaField(block, "heading")} className="font-display text-3xl text-white md:text-4xl">
              {block.heading}
            </h2>
          )}
          {block.subheading && (
            <p data-tina-field={tinaField(block, "subheading")} className="mt-2 text-lg font-semibold text-gold">
              {block.subheading}
            </p>
          )}
          <div data-tina-field={tinaField(block, "body")} className="mt-4">
            <Rich content={block.body} invert />
          </div>
        </div>
      </section>
    );
  }
  return (
    <Section id={block.anchor}>
      <div className={style === "card" ? "rounded-lg border-t-4 border-gold bg-white/90 p-6 shadow-sm md:p-10" : ""}>
        <Heading
          text={block.heading}
          field={tinaField(block, "heading")}
          sub={block.subheading}
          subField={tinaField(block, "subheading")}
        />
        <div data-tina-field={tinaField(block, "body")}>
          <Rich content={block.body} />
        </div>
      </div>
    </Section>
  );
}

/* Full-width card body: text before the first ### is an intro across the whole card;
   from the first ### on, each sub-heading starts a column (see .card-cols in globals.css). */
function WideBody({ content, invert, markerClass }: { content?: TinaMarkdownContent | null; invert?: boolean; markerClass: string }) {
  const root = content as unknown as { type: string; children?: { type: string }[] } | null | undefined;
  const children = root?.children ?? [];
  const first = children.findIndex((c) => c.type === "h3");
  // No sub-headings: text runs across the card; a bullet list is laid out in three columns on large screens
  if (first === -1) return <Rich content={content} invert={invert} className={`${markerClass} wide-plain`} />;
  if (first === 0) return <Rich content={content} invert={invert} className={`${markerClass} card-cols`} />;
  const intro = { ...root, children: children.slice(0, first) } as unknown as TinaMarkdownContent;
  const rest = { ...root, children: children.slice(first) } as unknown as TinaMarkdownContent;
  return (
    <>
      <Rich content={intro} invert={invert} className="mb-6" />
      <Rich content={rest} invert={invert} className={`${markerClass} card-cols`} />
    </>
  );
}

function Cards({ block }: { block: B<"PageBlocksCards"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksCards">["items"]>[number]>[];
  const cols = block.columns === "1" ? "" : block.columns === "2" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-6";
  // 3-column layout uses a 6-track grid so a leftover pair of cards can share a row half-and-half.
  // For each card: how many normal (non-wide) cards are in its run, and its position in that run.
  // When a section mixes full-width and normal cards, give every card the same (larger) title style
  const anyWide = items.some((i) => i.wide);
  const spanClass = items.map((item, n) => {
    if (item.wide) return "md:col-span-2 lg:col-span-6";
    if (block.columns === "1" || block.columns === "2") return "";
    let start = n;
    while (start > 0 && !items[start - 1].wide) start--;
    let end = n;
    while (end < items.length - 1 && !items[end + 1].wide) end++;
    const runLength = end - start + 1;
    const pos = n - start;
    const trailingPair = runLength % 3 === 2 && pos >= runLength - 2;
    return trailingPair ? "lg:col-span-3" : "lg:col-span-2";
  });
  // Long lists of linkable cards (e.g. the syllabus levels) get a "jump to" row; label = title before " - " or " | "
  const jumpLinks = items
    .filter((i) => i.anchor && i.title)
    .map((i) => ({ anchor: i.anchor as string, label: i.navLabel || (i.title as string).split(/\s[-|–]\s/)[0] }));
  return (
    <Section id={block.anchor}>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      {block.intro && (
        <div data-tina-field={tinaField(block, "intro")} className="mb-8 max-w-3xl">
          <Rich content={block.intro} />
        </div>
      )}
      {jumpLinks.length >= 5 && (
        <nav aria-label="Jump to" className="mb-8 flex flex-wrap gap-2">
          {jumpLinks.map((l) => (
            <a
              key={l.anchor}
              href={`#${l.anchor}`}
              className="rounded-full border border-maroon/30 bg-white/80 px-4 py-1.5 text-sm font-semibold text-maroon transition hover:bg-maroon hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
      <div className={`grid gap-6 ${cols}`}>
        {items.map((item, n) => {
          const colored = item.color ? colorClass[item.color] : null;
          const invert = !!colored && item.color !== "gold";
          return (
            <article
              key={n}
              id={item.anchor || undefined}
              data-tina-field={tinaField(item)}
              className={`flex flex-col overflow-hidden rounded-lg shadow-sm ${colored ?? "border-t-4 border-gold bg-white/90"} ${spanClass[n]}`}
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="aspect-[3/2] w-full object-cover" data-tina-field={tinaField(item, "image")} />
              )}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                {item.title && (
                  <h3
                    data-tina-field={tinaField(item, "title")}
                    className={`font-display text-2xl ${anyWide ? "mb-4 md:text-3xl" : ""} ${invert ? "text-white" : item.color === "gold" ? "text-maroon-dark" : "text-maroon"}`}
                  >
                    {item.href ? (
                      <SmartLink href={item.href} className="hover:underline">
                        {item.title}
                      </SmartLink>
                    ) : (
                      item.title
                    )}
                  </h3>
                )}
                <div data-tina-field={tinaField(item, "body")} className="mt-3 flex-1">
                  {item.wide ? (
                    <WideBody content={item.body} invert={invert} markerClass={item.color === "gold" ? "prose-li:marker:text-maroon" : ""} />
                  ) : (
                    <Rich content={item.body} invert={invert} className={item.color === "gold" ? "prose-li:marker:text-maroon" : ""} />
                  )}
                </div>
                {item.href && (
                  <SmartLink
                    href={item.href}
                    className={`mt-4 self-start text-sm font-semibold uppercase tracking-wide ${invert ? "text-gold hover:text-white" : "text-maroon hover:text-ochre"}`}
                  >
                    Learn more →
                  </SmartLink>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function Steps({ block }: { block: B<"PageBlocksSteps"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksSteps">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <ol className="space-y-6">
        {items.map((s, n) => (
          <li key={n} data-tina-field={tinaField(s)} className="flex gap-5 rounded-lg bg-white/90 p-6 shadow-sm">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold font-display text-2xl text-maroon-dark">
              {n + 1}
            </span>
            <div>
              <h3 data-tina-field={tinaField(s, "title")} className="font-display text-2xl">
                Step {n + 1} - {s.title}
              </h3>
              <div data-tina-field={tinaField(s, "body")} className="mt-2">
                <Rich content={s.body} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Team({ block }: { block: B<"PageBlocksTeam"> }) {
  const members = (block.members ?? [])
    .map((m) => m?.member)
    .filter((m): m is Extract<NonNullable<NonNullable<NonNullable<B<"PageBlocksTeam">["members"]>[number]>["member"]>, { __typename: "Team" }> => m?.__typename === "Team");
  return (
    <Section id={block.anchor}>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <article key={m.name} className="overflow-hidden rounded-lg bg-white/90 text-center shadow-sm">
            {m.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo} alt={m.name} className="aspect-[293/270] w-full object-cover object-top" />
            )}
            <div className="p-6">
              <h3 className="font-display text-2xl">{m.name}</h3>
              <p className="text-sm font-semibold uppercase tracking-wide text-ochre">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed">{m.bio}</p>
              <div className="mt-4 flex justify-center gap-3 text-sm">
                {m.facebook && <a className="text-maroon hover:underline" href={m.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                {m.youtube && <a className="text-maroon hover:underline" href={m.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
                {m.linkedin && <a className="text-maroon hover:underline" href={m.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Faq({ block }: { block: B<"PageBlocksFaq"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksFaq">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      {block.intro && (
        <div data-tina-field={tinaField(block, "intro")} className="mb-6 max-w-3xl">
          <Rich content={block.intro} />
        </div>
      )}
      <div className="divide-y divide-gold/40 overflow-hidden rounded-lg bg-white/90 shadow-sm">
        {items.map((q, n) => (
          <details key={n} className="group" data-tina-field={tinaField(q)}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-maroon hover:bg-cream">
              <span data-tina-field={tinaField(q, "question")}>{q.question}</span>
              <span className="text-xl text-ochre transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <div data-tina-field={tinaField(q, "answer")} className="px-6 pb-6">
              <Rich content={q.answer} />
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}

function Images({ block }: { block: B<"PageBlocksImages"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksImages">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((img, n) => (
          <figure key={n} data-tina-field={tinaField(img)}>
            {img.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.src} alt={img.alt ?? ""} className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm" />
            )}
            {img.caption && <figcaption className="mt-2 text-center text-sm text-ink/70">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Albums({ block }: { block: B<"PageBlocksAlbums"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksAlbums">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a, n) => (
          <a
            key={n}
            href={a.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            data-tina-field={tinaField(a)}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {a.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.cover} alt="" className="aspect-[3/2] w-full object-cover" />
            )}
            <div className="flex items-center justify-between p-4">
              <h3 className="font-semibold text-maroon">{a.title}</h3>
              <span className="text-ochre transition group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

function Videos({ block }: { block: B<"PageBlocksVideos"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksVideos">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((v, n) => {
          const id = youtubeId(v.youtube);
          return (
            <figure key={n} data-tina-field={tinaField(v)}>
              {id ? (
                <iframe
                  className="aspect-video w-full rounded-lg shadow-sm"
                  src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                  title={v.title || "Arpan video"}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-white/70 text-sm">Paste a YouTube link</div>
              )}
              {v.title && <figcaption className="mt-2 font-semibold">{v.title}</figcaption>}
            </figure>
          );
        })}
      </div>
    </Section>
  );
}

function Embed({ block }: { block: B<"PageBlocksEmbed"> }) {
  return (
    <Section id={block.anchor}>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      {block.src && (
        <iframe
          data-tina-field={tinaField(block, "src")}
          src={block.src}
          title={block.heading || "Embedded content"}
          className="w-full rounded-lg border-0 bg-white shadow-sm"
          style={{ height: block.height || 600 }}
          loading="lazy"
        />
      )}
    </Section>
  );
}

function Links({ block }: { block: B<"PageBlocksLinks"> }) {
  const items = (block.items ?? []).filter(Boolean) as NonNullable<NonNullable<B<"PageBlocksLinks">["items"]>[number]>[];
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((l, n) => (
          <SmartLink
            key={n}
            href={l.file || l.href || "#"}
            data-tina-field={tinaField(l)}
            className="group rounded-lg border-l-4 border-gold bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-display text-xl text-maroon group-hover:underline">
              {l.title} {l.file && <span className="text-sm font-sans text-ochre">(PDF)</span>}
            </h3>
            {l.description && <p className="mt-1 text-sm">{l.description}</p>}
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}

function Contact({ block, settings }: { block: B<"PageBlocksContact">; settings: ContactSettings }) {
  const tel = settings.phone?.replace(/[^\d+]/g, "");
  return (
    <Section>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-lg bg-white/90 p-8 shadow-sm">
          <div data-tina-field={tinaField(block, "intro")}>
            <Rich content={block.intro} />
          </div>
          {settings.email && (
            <p>
              <span className="block text-sm font-semibold uppercase tracking-wide text-ochre">Email</span>
              <a className="text-lg text-maroon hover:underline" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          )}
          {settings.phone && (
            <p>
              <span className="block text-sm font-semibold uppercase tracking-wide text-ochre">Phone / SMS / WhatsApp</span>
              <a className="text-lg text-maroon hover:underline" href={`tel:${tel}`}>
                {settings.phone}
              </a>
            </p>
          )}
          {settings.address && (
            <p>
              <span className="block text-sm font-semibold uppercase tracking-wide text-ochre">Studio</span>
              <span className="text-lg">{settings.address}</span>
            </p>
          )}
        </div>
        {block.mapEmbed && (
          <iframe
            data-tina-field={tinaField(block, "mapEmbed")}
            src={block.mapEmbed}
            title="Map"
            className="h-80 w-full rounded-lg border-0 shadow-sm md:h-full"
            loading="lazy"
          />
        )}
      </div>
    </Section>
  );
}

function ListIntro({ block }: { block: B<"PageBlocksEventsList" | "PageBlocksArangetramList" | "PageBlocksPostsList"> }) {
  return (
    <>
      <Heading text={block.heading} field={tinaField(block, "heading")} />
      {block.intro && (
        <div data-tina-field={tinaField(block, "intro")} className="mb-8 max-w-3xl">
          <Rich content={block.intro} />
        </div>
      )}
    </>
  );
}

function EventsList({ block, listings }: { block: B<"PageBlocksEventsList">; listings: Listings }) {
  const now = new Date().toISOString();
  const upcoming = listings.events.filter((e) => e.start >= now).reverse();
  const past = listings.events.filter((e) => e.start < now);
  const Row = ({ e }: { e: Listings["events"][number] }) => {
    const d = dayAndMonth(e.start);
    return (
      <Link
        href={`/topevent/events/${e.slug}`}
        className="group flex gap-5 rounded-lg bg-white/90 p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded bg-maroon-dark py-2 text-white">
          <span className="font-display text-3xl leading-none">{d.day}</span>
          <span className="text-xs uppercase tracking-wider text-gold">{d.month}</span>
          <span className="text-xs text-white/70">{d.year}</span>
        </div>
        {e.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.image} alt="" className="hidden h-24 w-32 shrink-0 rounded object-cover sm:block" />
        )}
        <div className="min-w-0">
          <h3 className="font-display text-xl text-maroon group-hover:underline">{e.title}</h3>
          <p className="text-sm text-ochre">
            {[e.venue, `${formatDate(e.start)} | ${formatTime(e.start)}`].filter(Boolean).join(" - ")}
          </p>
          {e.summary && <p className="mt-1 line-clamp-2 text-sm">{e.summary}</p>}
        </div>
      </Link>
    );
  };
  return (
    <Section>
      <ListIntro block={block} />
      <h3 className="mb-4 font-display text-2xl">Upcoming</h3>
      {upcoming.length ? (
        <div className="space-y-4">{upcoming.map((e) => <Row key={e.slug} e={e} />)}</div>
      ) : (
        <p className="rounded-lg bg-white/70 p-6 text-center">No upcoming events right now - check back soon!</p>
      )}
      {past.length > 0 && (
        <>
          <h3 className="mb-4 mt-12 font-display text-2xl">Past events</h3>
          <div className="space-y-4">{past.map((e) => <Row key={e.slug} e={e} />)}</div>
        </>
      )}
    </Section>
  );
}

function ArangetramList({ block, listings }: { block: B<"PageBlocksArangetramList">; listings: Listings }) {
  return (
    <Section>
      <ListIntro block={block} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {listings.arangetrams.map((a) => (
          <Link
            key={a.slug}
            href={`/topevent/arpan-arangetram/${a.slug}`}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {a.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.photo} alt={a.name} className="aspect-[4/5] w-full object-cover object-top" />
            )}
            <div className="p-5">
              <h3 className="font-display text-2xl text-maroon group-hover:underline">{a.name}</h3>
              <p className="text-sm font-semibold text-ochre">{formatDate(a.date, { weekday: undefined })}</p>
              {a.venue && <p className="text-sm">{a.venue}</p>}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function PostsList({ block, listings }: { block: B<"PageBlocksPostsList">; listings: Listings }) {
  return (
    <Section>
      <ListIntro block={block} />
      <div className="space-y-6">
        {listings.posts.map((p) => (
          <Link
            key={p.slug}
            href={`/about/blog/${p.slug}`}
            className="group flex flex-col gap-5 overflow-hidden rounded-lg bg-white/90 shadow-sm transition hover:shadow-md sm:flex-row"
          >
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" className="aspect-[3/2] w-full object-cover sm:w-56" />
            )}
            <div className="p-6">
              <h3 className="font-display text-2xl text-maroon group-hover:underline">{p.title}</h3>
              <p className="text-sm text-ochre">
                {[p.author, formatDate(p.date, { weekday: undefined })].filter(Boolean).join(" · ")}
              </p>
              {p.excerpt && <p className="mt-2 line-clamp-3">{p.excerpt}</p>}
              <span className="mt-3 inline-block text-sm font-semibold uppercase tracking-wide text-maroon">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------- dispatcher ---------- */

type ContactSettings = { email?: string | null; phone?: string | null; address?: string | null };

export default function Blocks({
  blocks,
  listings,
  settings,
}: {
  blocks?: PageQuery["page"]["blocks"];
  listings: Listings;
  settings: ContactSettings;
}) {
  return (
    <>
      {(blocks ?? []).map((block, i) => {
        if (!block) return null;
        const el = (() => {
          switch (block.__typename) {
            case "PageBlocksHero":
              return <Hero block={block} />;
            case "PageBlocksText":
              return <Text block={block} />;
            case "PageBlocksCards":
              return <Cards block={block} />;
            case "PageBlocksSteps":
              return <Steps block={block} />;
            case "PageBlocksTeam":
              return <Team block={block} />;
            case "PageBlocksFaq":
              return <Faq block={block} />;
            case "PageBlocksImages":
              return <Images block={block} />;
            case "PageBlocksAlbums":
              return <Albums block={block} />;
            case "PageBlocksVideos":
              return <Videos block={block} />;
            case "PageBlocksEmbed":
              return <Embed block={block} />;
            case "PageBlocksLinks":
              return <Links block={block} />;
            case "PageBlocksContact":
              return <Contact block={block} settings={settings} />;
            case "PageBlocksEventsList":
              return <EventsList block={block} listings={listings} />;
            case "PageBlocksArangetramList":
              return <ArangetramList block={block} listings={listings} />;
            case "PageBlocksPostsList":
              return <PostsList block={block} listings={listings} />;
            default:
              return null;
          }
        })();
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            {el}
          </div>
        );
      })}
    </>
  );
}
