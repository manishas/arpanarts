import Link from "next/link";
import type { SettingsQuery } from "@/tina/__generated__/types";

export default function Footer({ settings }: { settings: SettingsQuery["settings"] }) {
  const tel = settings.phone?.replace(/[^\d+]/g, "");
  return (
    <footer className="mt-16 border-t-4 border-gold bg-maroon-dark text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">{settings.siteName}</p>
          {settings.address && <p className="mt-2 text-sm">{settings.address}</p>}
        </div>
        <div className="space-y-1 text-sm">
          {settings.email && (
            <p>
              <a className="hover:text-gold" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          )}
          {settings.phone && (
            <p>
              <a className="hover:text-gold" href={`tel:${tel}`}>
                {settings.phone}
              </a>
            </p>
          )}
          <p>
            <Link className="hover:text-gold" href="/about/contact">
              Contact us
            </Link>
            {" · "}
            <Link className="hover:text-gold" href="/about/privacy">
              Privacy
            </Link>
          </p>
        </div>
        <div className="flex items-start gap-4 md:justify-end">
          {settings.facebook && (
            <a href={settings.facebook} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-gold hover:text-maroon-dark">
              Facebook
            </a>
          )}
          {settings.youtube && (
            <a href={settings.youtube} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-gold hover:text-maroon-dark">
              YouTube
            </a>
          )}
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {settings.footerText}
      </p>
    </footer>
  );
}
