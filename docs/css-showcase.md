# CSS Showcase

UI patterns published alongside the portfolio, each one shown next to the CSS
that makes it work. This document covers the URLs the showcase answers on, the
shape a pattern takes, and how to add one.

## URLs and language

Every page on this site lives under a locale segment, and `src/proxy.ts`
redirects anything without one. `/css` and `/css/hover-card` are therefore
**entry points, not pages**: a request for either is answered with a `307` to
the locale the visitor negotiated, and the reply carries
`Vary: Accept-Language, Cookie` because the destination depends on both the
`Accept-Language` header and the language the visitor picked with the switch.

| Request | Answer |
| --- | --- |
| `/css` | `307` → `/en/css` or `/ja/css` |
| `/css/hover-card` | `307` → `/en/css/hover-card` or `/ja/css/hover-card` |
| `/ja/css` | The listing |
| `/ja/css/hover-card` | The pattern |
| `/ja/css/not-a-pattern` | `404` |

The canonical URL is the prefixed one. `alternatesFor()` builds it together
with the `hreflang` links for both locales, the same way the rest of the site
does, so a pattern page passes `/css/<slug>` and the listing passes `/css`.

### Content language

Patterns are written in Japanese. English is optional on every piece of prose,
and `textFor()` falls back to the Japanese until a translation is written:

```ts
title: { ja: 'ホバーカード', en: 'Hover Card' },  // both
description: { ja: '……' },                        // Japanese only, for now
```

**A pattern is published in both locales either way.** Hiding the untranslated
half would contradict the `hreflang` links the page already advertises, and
would give a visitor a `404` on a page that exists. Fall back, do not hide.

## Adding a pattern

1. Write `src/content/css-showcase/<slug>.ts`:

   ```ts
   import { definePattern } from './pattern';

   export const hoverCard = definePattern({
     slug: 'hover-card',
     title: { ja: 'ホバーカード' },
     description: { ja: 'ポインタを乗せると浮き上がるカード。' },
     tags: ['transform', 'transition'],
     html: `<article class="card">…</article>`,
     css: `.card { … }`,
     explanations: [
       { heading: { ja: 'なぜ transform なのか' }, body: { ja: '……' } },
     ],
   });
   ```

2. List it in `src/content/css-showcase/index.ts`:

   ```ts
   import { hoverCard } from './hover-card';

   export const patterns: readonly CssPattern[] = [hoverCard];
   ```

That is the whole workflow. Nothing under `src/app` changes: the listing and
the detail template read whatever the registry hands them, so they render a
new pattern without being touched. `hover-card.ts` is the pattern to copy from:
it is the one the showcase ships with.

### Fields

| Field | What it is |
| --- | --- |
| `slug` | The URL segment. Lowercase letters, digits, single hyphens. |
| `title`, `description` | Shown on the listing and at the top of the detail page. |
| `tags` | The CSS features on show. Displayed only — the listing does not filter. |
| `html`, `css` | The pattern. Rendered in the preview *and* printed as the source. |
| `explanations` | The "How it works" walkthrough. At least one. |
| `preview.height` | Optional. The preview's height in pixels before it measures itself. |

## The detail page

Every pattern is rendered through `src/app/[lang]/css/[slug]/page.tsx`, in
reading order: what the pattern is, what it looks like, the two pieces of
source behind it, why they are written that way, and the CSS it rests on.

| Section | What renders it |
| --- | --- |
| Title and description | The template itself |
| Preview | `ShowcasePreview` (`preview.tsx`) |
| HTML | `CodeBlock` (`code-block.tsx`) |
| CSS | `CodeBlock` |
| How it works | The template, from `explanations` |
| CSS used in this pattern | `CssTagList` (`css-tag-list.tsx`) |

The page carries two widths. The preview and the code get the wider one
(1080px), so a pattern has room to behave the way it would in a real layout;
prose gets the narrower one (760px), because a line of text that runs the full
width is tiring to read. On a phone both collapse to the single column the
screen has.

One thing to know about the width: the layout's container
(`src/app/[lang]/layout.module.css`) is a grid item with `auto` margins, so it
wraps its content rather than filling the page. A percentage width on the page
inside it would resolve against whatever the longest line of code happened to
measure, which is why the template asks for its width outright and caps it
against the viewport.

### Code blocks

`CodeBlock` prints one piece of source. It labels the language, highlights it,
and gives it a copy control of its own, so the HTML and the CSS are copied
separately.

- **Highlighting** is `highlight.ts`, a tokenizer for these two languages and
  nothing else. It runs on the server, so the code is coloured on a page that
  never runs JavaScript, and it never throws: a pattern's source is content, so
  whatever is written is coloured as best it can be. Its one known limit is CSS
  nesting, where a nested selector is coloured as a declaration.
- **Copying** is the one client component here. It reports a failure as plainly
  as a success — the clipboard is missing outside a secure context and can be
  refused — because a control that claims a copy it never made leaves a visitor
  pasting whatever they had copied before. The outcome is announced from a live
  region beside the button rather than by renaming the button under anyone who
  reached it by keyboard.
- **Long code** scrolls inside the block, both ways, and the block stops at
  `60vh` so the explanation underneath stays within reach. The scrolling
  element carries a tab stop and a name, because a region that can only be
  scrolled with a pointer cannot be read without one.

`code-block.stories.tsx` holds the awkward cases — a line far wider than the
page, a word with nowhere to break, a sheet longer than a screen, source the
highlighter has to take as written, and nothing at all.

## How the preview stays honest

The preview is an `iframe` whose `srcdoc` is built from `html` and `css` — the
same two strings the page prints as the source. There is no second copy, so
the two cannot drift apart.

The frame is sandboxed with `allow-scripts` and **without**
`allow-same-origin`, which puts it on an opaque origin. A pattern's CSS cannot
reach the page around it, and anything scripted inside it cannot reach the page
at all. The one script we inject reports the rendered height back with
`postMessage`; the parent accepts that message only from the frame's own
`contentWindow`, because an opaque origin reports itself as `"null"`.

### Declaring a height

Measuring needs JavaScript. Until it runs — and anywhere it does not run at all
— the preview is as tall as `preview.height`, or 240px when the pattern leaves
it out. So:

- **A small demo** can leave it out.
- **Anything taller** should declare it. Otherwise the preview visibly jumps to
  size on load, and stays clipped at 240px where scripts are blocked.

A declared height is a starting point, not a cap; the measurement can grow or
shrink the frame from there.

The frame often finishes loading before the page hydrates, and a height nobody
was listening for is never announced again — the observer drops a height it has
already sent. So the parent asks: it posts a request into the frame as soon as
it starts listening, and again whenever the frame loads, and the frame answers
with the height as it stands. That is what makes the measurement independent of
which of the two finished first.

## What a broken registration looks like

`createRegistry()` checks every pattern while the module loads, and the pages
import it, so a mistake **fails the build** rather than reaching a visitor:

```
Error: css-showcase: the slug "hover-card" is registered twice, by
"ホバーカード" and by "カードのホバー". Both would answer on the same URL, so
rename one of them in src/content/css-showcase/.
```

It rejects a slug that would not survive a URL, a slug claimed twice, missing
Japanese prose, empty `html` or `css`, a `</style` inside the CSS that would
break out of the preview's style element, an empty `explanations`, a repeated
tag, and a preview height that is not a positive number. `src/app/[lang]/css/registry.test.ts` covers each one.

An **empty registry is valid**: the listing renders its empty state and no
detail routes are generated.

## Where things live

```
src/content/css-showcase/
  pattern.ts      The schema: CssPattern, LocalizedText, definePattern, textFor
  index.ts        The registration point
  <slug>.ts       One module per pattern

src/app/[lang]/css/
  page.tsx            The listing
  [slug]/page.tsx     The detail template, shared by every pattern
  registry.ts         createRegistry: validation and slug lookup
  preview.tsx         ShowcasePreview: the sandboxed preview frame
  preview-document.ts The document that frame renders
  code-block.tsx      CodeBlock: one piece of source, labelled and copyable
  copy-button.tsx     The copy control, and what it says about the outcome
  css-tag-list.tsx    CssTagList: the CSS tags, as labels
  highlight.ts        The tokenizer the code blocks colour with
```

The schema sits with the content because it changes for the same reason the
content does — a new field to write — rather than when the pages change. The
dependency runs one way: `src/app` reads `src/content`, never the reverse.
