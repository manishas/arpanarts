"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SettingsQuery } from "@/tina/__generated__/types";

type Settings = SettingsQuery["settings"];

export default function Header({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  const nav = (settings.nav ?? []).filter(Boolean) as NonNullable<NonNullable<Settings["nav"]>[number]>[];
  const isActive = (href?: string | null) =>
    !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b-4 border-gold bg-maroon-dark text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          {settings.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo} alt={settings.siteName ?? "Arpan Arts"} className="h-14 w-auto" />
          )}
          <span className="sr-only">{settings.siteName}</span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const children = (item.children ?? []).filter(Boolean) as { label?: string | null; href?: string | null }[];
              const active = isActive(item.href) || children.some((c) => isActive(c.href));
              const base = `block rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                active ? "bg-gold text-maroon-dark" : "hover:bg-gold hover:text-maroon-dark"
              }`;
              if (!children.length) {
                return (
                  <li key={item.label}>
                    <Link href={item.href || "/"} className={base}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.label} className="group relative">
                  <button type="button" className={base} aria-haspopup="true">
                    {item.label} <span aria-hidden>▾</span>
                  </button>
                  <ul className="invisible absolute right-0 top-full min-w-56 rounded-b-md border-t-2 border-gold bg-white py-2 text-ink opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href || "/"}
                          className={`block px-4 py-2 text-sm hover:bg-cream hover:text-maroon ${
                            isActive(c.href) ? "font-semibold text-maroon" : ""
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded p-2 hover:bg-white/10 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 lg:hidden" aria-label="Main">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {nav.map((item) => {
              const children = (item.children ?? []).filter(Boolean) as { label?: string | null; href?: string | null }[];
              if (!children.length) {
                return (
                  <li key={item.label}>
                    <Link href={item.href || "/"} className="block py-3 font-semibold uppercase">
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === item.label;
              return (
                <li key={item.label} className="border-t border-white/10">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3 font-semibold uppercase"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : item.label ?? null)}
                  >
                    {item.label} <span aria-hidden>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <ul className="pb-2 pl-4">
                      {children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href || "/"} className="block py-2 text-white/90 hover:text-gold">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
