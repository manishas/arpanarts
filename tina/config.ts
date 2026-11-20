import { defineConfig, type Template, type TinaField } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

/* ---------- shared field helpers ---------- */

const linkFields: TinaField[] = [
  { type: "string", name: "label", label: "Button text" },
  { type: "string", name: "href", label: "Link (e.g. /classes/schedule or https://…)" },
];

const anchorField: TinaField = {
  type: "string",
  name: "anchor",
  label: "Anchor ID (optional)",
  description: "Lets other pages link straight to this section, e.g. /classes/syllabus#level1",
};

const colorField: TinaField = {
  type: "string",
  name: "color",
  label: "Colour",
  options: [
    { value: "maroon", label: "Maroon" },
    { value: "ochre", label: "Ochre" },
    { value: "olive", label: "Olive" },
    { value: "gold", label: "Gold" },
  ],
};

/* ---------- page blocks ---------- */

const heroBlock: Template = {
  name: "hero",
  label: "Hero slideshow",
  ui: { defaultItem: { slides: [] } },
  fields: [
    {
      type: "object",
      name: "slides",
      label: "Slides",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Slide" }) },
      fields: [
        { type: "image", name: "image", label: "Background image" },
        { type: "string", name: "title", label: "Title" },
        ...linkFields,
      ],
    },
  ],
};

const textBlock: Template = {
  name: "text",
  label: "Text section",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "subheading", label: "Sub-heading" },
    { type: "rich-text", name: "body", label: "Text" },
    {
      type: "string",
      name: "style",
      label: "Style",
      options: [
        { value: "plain", label: "Plain" },
        { value: "card", label: "Card (white box)" },
        { value: "highlight", label: "Highlight (coloured band)" },
      ],
    },
    anchorField,
  ],
};

const cardsBlock: Template = {
  name: "cards",
  label: "Cards / features",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "intro", label: "Intro text" },
    {
      type: "string",
      name: "columns",
      label: "Columns",
      options: ["1", "2", "3"],
    },
    {
      type: "object",
      name: "items",
      label: "Cards",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Card" }) },
      fields: [
        { type: "image", name: "image", label: "Image (optional)" },
        { type: "string", name: "title", label: "Title" },
        { type: "rich-text", name: "body", label: "Text" },
        { type: "string", name: "href", label: "Link (optional)" },
        colorField,
        anchorField,
      ],
    },
    anchorField,
  ],
};

const stepsBlock: Template = {
  name: "steps",
  label: "Numbered steps",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Steps",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Step" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "rich-text", name: "body", label: "Text" },
      ],
    },
  ],
};

const teamBlock: Template = {
  name: "team",
  label: "Team members",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "members",
      label: "Members",
      list: true,
      fields: [
        {
          type: "reference",
          name: "member",
          label: "Person",
          collections: ["team"],
        },
      ],
    },
    anchorField,
  ],
};

const faqBlock: Template = {
  name: "faq",
  label: "Questions & answers",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "intro", label: "Intro text" },
    {
      type: "object",
      name: "items",
      label: "Questions",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.question || "Question" }) },
      fields: [
        { type: "string", name: "question", label: "Question" },
        { type: "rich-text", name: "answer", label: "Answer" },
      ],
    },
  ],
};

const imagesBlock: Template = {
  name: "images",
  label: "Image row",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Images",
      list: true,
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Description (for screen readers)" },
        { type: "string", name: "caption", label: "Caption" },
      ],
    },
  ],
};

const albumsBlock: Template = {
  name: "albums",
  label: "Photo albums",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Albums",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Album" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "image", name: "cover", label: "Cover image" },
        { type: "string", name: "url", label: "Album link" },
      ],
    },
  ],
};

const videosBlock: Template = {
  name: "videos",
  label: "YouTube videos",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Videos",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || item?.youtube || "Video" }) },
      fields: [
        { type: "string", name: "title", label: "Title (optional)" },
        {
          type: "string",
          name: "youtube",
          label: "YouTube link or video ID",
          description: "Paste the full YouTube URL, e.g. https://www.youtube.com/watch?v=GHdQt5SwNNM",
        },
      ],
    },
  ],
};

const embedBlock: Template = {
  name: "embed",
  label: "Embed (calendar, map, form…)",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "src", label: "Embed URL" },
    { type: "number", name: "height", label: "Height in pixels" },
    anchorField,
  ],
};

const linksBlock: Template = {
  name: "links",
  label: "Link buttons",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Links",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Link" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description" },
        { type: "string", name: "href", label: "Link" },
        { type: "image", name: "file", label: "…or upload a file (PDF)" },
      ],
    },
  ],
};

const contactBlock: Template = {
  name: "contact",
  label: "Contact details & map",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "intro", label: "Intro" },
    { type: "string", name: "mapEmbed", label: "Google Maps embed URL" },
  ],
};

const listingBlock = (name: string, label: string): Template => ({
  name,
  label,
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "intro", label: "Intro text" },
  ],
});

/* ---------- config ---------- */

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },

  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "md",
        ui: {
          router: ({ document }) => {
            const p = document._sys.breadcrumbs.join("/");
            return p === "home" ? "/" : `/${p}`;
          },
        },
        fields: [
          { type: "string", name: "title", label: "Page title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Search engine description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "blocks",
            label: "Sections",
            list: true,
            templates: [
              heroBlock,
              textBlock,
              cardsBlock,
              stepsBlock,
              teamBlock,
              faqBlock,
              imagesBlock,
              albumsBlock,
              videosBlock,
              embedBlock,
              linksBlock,
              contactBlock,
              listingBlock("eventsList", "List of events"),
              listingBlock("arangetramList", "List of arangetrams"),
              listingBlock("postsList", "List of blog posts"),
            ],
          },
        ],
      },
      {
        name: "event",
        label: "Events",
        path: "content/events",
        format: "md",
        ui: { router: ({ document }) => `/topevent/events/${document._sys.filename}` },
        defaultItem: () => ({ start: new Date().toISOString() }),
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "start", label: "Starts", ui: { timeFormat: "h:mm a" }, required: true },
          { type: "datetime", name: "end", label: "Ends", ui: { timeFormat: "h:mm a" } },
          { type: "string", name: "venue", label: "Venue" },
          { type: "string", name: "address", label: "Address" },
          { type: "image", name: "image", label: "Image" },
          { type: "string", name: "summary", label: "Short summary (for the events list)", ui: { component: "textarea" } },
          { type: "string", name: "link", label: "More info link (optional)" },
          { type: "rich-text", name: "body", label: "Details", isBody: true },
        ],
      },
      {
        name: "arangetram",
        label: "Arangetrams",
        path: "content/arangetrams",
        format: "md",
        ui: { router: ({ document }) => `/topevent/arpan-arangetram/${document._sys.filename}` },
        fields: [
          { type: "string", name: "name", label: "Dancer's name", isTitle: true, required: true },
          { type: "image", name: "photo", label: "Photo" },
          { type: "string", name: "years", label: "Years at Arpan", description: "e.g. Arpanite 2008 to 2026" },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "string", name: "time", label: "Time", description: "e.g. 3:30 pm to 7:30 pm" },
          { type: "string", name: "venue", label: "Venue" },
          { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
          { type: "image", name: "invite", label: "Invitation image" },
          { type: "string", name: "facebook", label: "Facebook event link" },
          { type: "rich-text", name: "body", label: "Details", isBody: true },
        ],
      },
      {
        name: "post",
        label: "Blog posts",
        path: "content/posts",
        format: "md",
        ui: { router: ({ document }) => `/about/blog/${document._sys.filename}` },
        defaultItem: () => ({ date: new Date().toISOString() }),
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "author", label: "Author" },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "image", name: "image", label: "Image" },
          { type: "string", name: "excerpt", label: "Excerpt (for the blog list)", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "Post", isBody: true },
        ],
      },
      {
        name: "team",
        label: "Team members",
        path: "content/team",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Role" },
          { type: "image", name: "photo", label: "Photo" },
          { type: "string", name: "bio", label: "Short bio", ui: { component: "textarea" } },
          { type: "string", name: "facebook", label: "Facebook link" },
          { type: "string", name: "youtube", label: "YouTube link" },
          { type: "string", name: "linkedin", label: "LinkedIn link" },
        ],
      },
      {
        name: "settings",
        label: "Site settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "siteName", label: "Site name" },
          { type: "image", name: "logo", label: "Logo" },
          { type: "string", name: "email", label: "Contact email" },
          { type: "string", name: "phone", label: "Phone" },
          { type: "string", name: "address", label: "Studio address" },
          { type: "string", name: "facebook", label: "Facebook page" },
          { type: "string", name: "youtube", label: "YouTube channel" },
          {
            type: "object",
            name: "nav",
            label: "Menu",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Menu item" }) },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Link (leave empty for a dropdown)" },
              {
                type: "object",
                name: "children",
                label: "Dropdown items",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "Item" }) },
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
            ],
          },
          { type: "string", name: "footerText", label: "Footer text" },
        ],
      },
    ],
  },
});
