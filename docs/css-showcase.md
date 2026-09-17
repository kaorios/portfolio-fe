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

Leave the English out entirely rather than writing an empty string for it: a
blank translation is published as a blank, where a missing one falls back. The
registry rejects the blank, so this is a build failure rather than an empty
link on the English listing.

**A pattern is published in both locales either way.** Hiding the untranslated
half would contradict the `hreflang` links the page already advertises, and
would give a visitor a `404` on a page that exists. Fall back, do not hide.

Fallback text is marked with the language it is actually in. Japanese standing
in for a missing translation is rendered inside `<span lang="ja">`, so a screen
reader on the English page announces it with Japanese pronunciation rules
rather than English ones. Pages render prose through `<Localized>` for this;
`textFor()` is for the places that take a bare string, such as the page title
and description in `<head>`.

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
| `preview.height` | Optional. The preview's height in pixels before it measures itself, up to 1200. |

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
- **Copying** is the only part of a block that runs in the browser. It reports
  a failure as plainly
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

Scripts are enabled for that measurement, and the frame cannot tell our script
from a pattern's. **Patterns are CSS**, so registration rejects HTML carrying a
`<script>`, an inline `on…` handler or a `javascript:` URL, and the measurement
stays the only thing running in there. Reach for `:hover`, `:focus-visible` or
`:has()` instead.

The handler check reads the markup with quoted values blanked out, so a URL
like `src="/online=1"` is not mistaken for one, and it counts a solidus as an
attribute separator the way a parser does — `<svg/onload=…>` names a handler
just as `<svg onload=…>` does. It is a guard on content this repository
authors and reviews, not a sanitiser for anything arriving from outside.

### Declaring a height

Measuring needs JavaScript. Until it runs — and anywhere it does not run at all
— the preview is as tall as `preview.height`, or 240px when the pattern leaves
it out. So:

- **A small demo** can leave it out.
- **Anything taller** should declare it. Otherwise the preview visibly jumps to
  size on load, and stays clipped at 240px where scripts are blocked.

A declared height is where the frame starts, and the measurement grows or
shrinks it from there — within limits. The frame never grows past 1200px, and
a measurement resizes it at most four times.

Both limits exist for the same reason. A pattern sized against the viewport,
such as one with `min-height: 100vh`, measures taller than the frame holding
it: every height applied produces a taller measurement, and the frame would
climb the page without ever settling. Fonts and images settle in a round or
two, so four is room enough for the honest cases and short enough to stop that
one quickly.

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

It rejects a slug that would not survive a URL, a slug claimed twice, empty
`html` or `css`, a `<script>`, inline `on…` handler or `javascript:` URL in the
HTML, a closing style tag inside the CSS that would break out of the preview's
style element (in any casing, since HTML tag names are case-insensitive), an
empty `explanations`, a blank or repeated tag, and a preview height that is not
a positive number or that is past the 1200px ceiling.

Prose is checked wherever it appears, not only at the top level: a blank title
or description, and a blank explanation heading or body, are each rejected by
name — in the English as well as the Japanese. A list with an entry in it is not
the same as a list with something written in it, and the difference reaches a
visitor as a heading with nothing under it.

`src/app/[lang]/css/registry.test.ts` covers each rule.

An **empty registry is valid**: the listing renders its empty state and no
detail routes are generated.

## Where things live

```
src/locales.ts    The locales the site publishes, and the Locale type

src/content/css-showcase/
  pattern.ts      The schema: CssPattern, LocalizedText, definePattern, textFor
  index.ts        The registration point
  <slug>.ts       One module per pattern

src/app/[lang]/css/
  page.tsx            The listing
  [slug]/page.tsx     The detail template, shared by every pattern
  registry.ts         createRegistry: validation and slug lookup
  localized.tsx       Prose marked with the language it is actually in
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

`src/locales.ts` is what keeps that true. The content has to name the locales
it is written in, and taking `Locale` from `src/app/[lang]/dictionaries` would
have pointed the content back at the routing layer that reads it. Both layers
take it from there instead. `dictionaries.ts` re-exports it, so the rest of the
site can keep importing `Locale` from where it always has.
