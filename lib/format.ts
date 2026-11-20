const TZ = "America/Los_Angeles";

export function formatDate(iso?: string | null, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  }).format(new Date(iso));
}

export function formatTime(iso?: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function dayAndMonth(iso: string) {
  const d = new Date(iso);
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...o }).format(d);
  return { day: f({ day: "2-digit" }), month: f({ month: "short" }), year: f({ year: "numeric" }) };
}

export function youtubeId(input?: string | null) {
  if (!input) return null;
  const m = input.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(input.trim()) ? input.trim() : null;
}
