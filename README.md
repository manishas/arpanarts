# Arpan Arts website

The website for Arpan Dance Theatre (arpanarts.org): a static site built with
[Next.js](https://nextjs.org) and edited with [TinaCMS](https://tina.io).

## Editing content (no code needed)

1. Open `/admin` on the site (locally: http://localhost:3000/admin/index.html).
2. Pick a page from the menu (☰), or click on the page preview to jump to the field you want to edit.
3. Change the text or images, then press **Save**.

What you can edit:

| In the editor | What it controls |
| --- | --- |
| **Pages** | Every page. Each page is a stack of *sections* (hero slideshow, text, cards, FAQ, photo albums, videos, calendar embed…) that you can add, remove and reorder. |
| **Events** | The Events list and each event's own page. Upcoming and past events are sorted automatically. |
| **Arangetrams** | The Arangetram page and each dancer's page. |
| **Blog posts** | The Blog page and each post. |
| **Team members** | People shown in the "Meet the Team" section. |
| **Site settings** | Logo, menu, contact email/phone/address, social links and footer. |

## Running it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Editor: http://localhost:3000/admin/index.html

In local mode, saving in the editor writes straight to the files in `content/`.

To build the static site without Tina Cloud:

```bash
npm run build:local   # outputs plain HTML to out/
npx serve out         # preview the built site
```

## Project layout

```
content/          all site content (Markdown/JSON, edited through Tina)
public/uploads/   images and documents (Tina's media library)
tina/config.ts    content model: what editors can change
app/              Next.js routes
components/       page sections and layout
public/_redirects old Joomla URLs → new URLs (Netlify / Cloudflare Pages)
```

## Going live (later)

1. Create a project at [app.tina.io](https://app.tina.io) linked to this GitHub repo, and invite editors.
2. Create a site on Netlify or Cloudflare Pages from this repo:
   - Build command: `npm run build`
   - Output directory: `out`
   - Environment variables: `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` (from Tina Cloud)
3. Point the arpanarts.org DNS at the host.

Once that's done, editors log in at `arpanarts.org/admin`. Each save becomes a commit
on GitHub, and the host rebuilds the site in about a minute.
