"use client";

import Link from "next/link";
import { tinaField, useTina } from "tinacms/dist/react";
import type {
  ArangetramQuery,
  ArangetramQueryVariables,
  EventQuery,
  EventQueryVariables,
  PostQuery,
  PostQueryVariables,
} from "@/tina/__generated__/types";
import { formatDate, formatTime } from "@/lib/format";
import { Rich } from "./Blocks";

function Back({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm font-semibold uppercase tracking-wide text-maroon hover:text-ochre">
      ← {label}
    </Link>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ochre">{label}</dt>
      <dd className="text-lg">{children}</dd>
    </div>
  );
}

export function EventClient(props: { query: string; variables: EventQueryVariables; data: EventQuery }) {
  const { data } = useTina(props);
  const e = data.event;
  const time = [formatTime(e.start), e.end ? formatTime(e.end) : null].filter(Boolean).join(" - ");
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Back href="/topevent/events" label="All events" />
      <h1 data-tina-field={tinaField(e, "title")} className="mt-4 font-display text-4xl md:text-5xl">
        {e.title}
      </h1>
      <div className="mt-3 h-1 w-20 rounded bg-gold" />
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          {e.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={e.image} alt="" data-tina-field={tinaField(e, "image")} className="w-full rounded-lg shadow-sm" />
          )}
          <dl className="space-y-4 rounded-lg bg-white/90 p-6 shadow-sm">
            <Meta label="Date">
              <span data-tina-field={tinaField(e, "start")}>{formatDate(e.start)}</span>
            </Meta>
            <Meta label="Time">{time}</Meta>
            {e.venue && (
              <Meta label="Venue">
                <span data-tina-field={tinaField(e, "venue")}>{e.venue}</span>
                {e.address && <span className="block text-base text-ink/70">{e.address}</span>}
              </Meta>
            )}
            {e.link && (
              <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-block rounded bg-gold px-4 py-2 font-semibold text-maroon-dark hover:bg-maroon hover:text-white">
                More info
              </a>
            )}
          </dl>
        </div>
        <div data-tina-field={tinaField(e, "body")} className="rounded-lg bg-white/90 p-6 shadow-sm md:p-8">
          <Rich content={e.body} />
        </div>
      </div>
    </article>
  );
}

export function ArangetramClient(props: { query: string; variables: ArangetramQueryVariables; data: ArangetramQuery }) {
  const { data } = useTina(props);
  const a = data.arangetram;
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <Back href="/topevent/arpan-arangetram" label="All arangetrams" />
      <div className="mt-6 grid gap-8 md:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          {a.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.photo} alt={a.name} data-tina-field={tinaField(a, "photo")} className="w-full rounded-lg shadow-md" />
          )}
          <dl className="space-y-4 rounded-lg bg-maroon-dark p-6 text-white shadow-sm [&_dt]:text-gold">
            <Meta label="Date">{formatDate(a.date)}</Meta>
            {a.time && <Meta label="Time">{a.time}</Meta>}
            {a.venue && <Meta label="Venue">{a.venue}</Meta>}
            {a.facebook && (
              <a href={a.facebook} target="_blank" rel="noopener noreferrer" className="inline-block text-gold underline hover:text-white">
                Facebook event
              </a>
            )}
          </dl>
        </div>
        <div>
          <h1 data-tina-field={tinaField(a, "name")} className="font-display text-4xl md:text-6xl">
            {a.name}
          </h1>
          {a.years && (
            <p data-tina-field={tinaField(a, "years")} className="mt-2 font-semibold text-ochre">
              {a.years}
            </p>
          )}
          <div className="mt-3 h-1 w-20 rounded bg-gold" />
          {a.intro && (
            <p data-tina-field={tinaField(a, "intro")} className="mt-6 text-xl leading-relaxed">
              {a.intro}
            </p>
          )}
          <div data-tina-field={tinaField(a, "body")} className="mt-6">
            <Rich content={a.body} />
          </div>
          {a.invite && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.invite} alt={`Invitation for ${a.name}'s arangetram`} data-tina-field={tinaField(a, "invite")} className="mt-8 w-full rounded-lg shadow-md" />
          )}
        </div>
      </div>
    </article>
  );
}

export function PostClient(props: { query: string; variables: PostQueryVariables; data: PostQuery }) {
  const { data } = useTina(props);
  const p = data.post;
  const bodyHasImage = JSON.stringify(p.body ?? "").includes(p.image ?? "\u0000");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Back href="/about/blog" label="All posts" />
      <h1 data-tina-field={tinaField(p, "title")} className="mt-4 font-display text-4xl md:text-5xl">
        {p.title}
      </h1>
      <p className="mt-2 text-ochre">{[p.author, formatDate(p.date, { weekday: undefined })].filter(Boolean).join(" · ")}</p>
      <div className="mt-3 h-1 w-20 rounded bg-gold" />
      {p.image && !bodyHasImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt="" data-tina-field={tinaField(p, "image")} className="mt-8 w-full rounded-lg shadow-sm" />
      )}
      <div data-tina-field={tinaField(p, "body")} className="mt-8 rounded-lg bg-white/90 p-6 shadow-sm md:p-10">
        <Rich content={p.body} className="prose-lg" />
      </div>
    </article>
  );
}
