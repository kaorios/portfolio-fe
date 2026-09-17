import { definePattern } from './pattern';

/**
 * The card that opens the showcase. It is small on purpose: hover, focus and
 * reduced motion are three decisions every interactive card has to make, and
 * they fit in a page without a single rule that is there to look clever.
 */
export const hoverCard = definePattern({
  slug: 'hover-card',
  title: { ja: 'ホバーカード', en: 'Hover Card' },
  description: {
    ja: 'ポインタを乗せたときも、キーボードで辿り着いたときも、静かに浮き上がるリンクカード。',
    en: 'A link card that lifts when a pointer rests on it — and when a keyboard reaches it.',
  },
  tags: [
    'transform',
    'transition',
    'box-shadow',
    ':focus-visible',
    'prefers-reduced-motion',
  ],
  html: `<a class="hover-card" href="#">
  <span class="hover-card__eyebrow">Journal</span>
  <span class="hover-card__title">夜明けのコーヒー</span>
  <span class="hover-card__body">
    始発を待つ人だけが知っている、朝5時から開く喫茶店の話。
  </span>
  <span class="hover-card__more">Read more</span>
</a>`,
  css: `.hover-card {
  display: grid;
  gap: 8px;
  max-width: 360px;
  padding: 24px;
  border-radius: 16px;
  background: #fffdfa;
  box-shadow:
    0 1px 2px rgb(24 20 30 / 8%),
    0 6px 16px -12px rgb(24 20 30 / 40%);
  color: #221f29;
  text-decoration: none;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.hover-card:hover,
.hover-card:focus-visible {
  transform: translateY(-4px);
  box-shadow:
    0 2px 4px rgb(24 20 30 / 10%),
    0 18px 32px -20px rgb(24 20 30 / 55%);
}

.hover-card:focus-visible {
  outline: 3px solid #f8366e;
  outline-offset: 3px;
}

.hover-card__eyebrow {
  color: #8a8594;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hover-card__title {
  font-size: 20px;
  font-weight: 700;
}

.hover-card__body {
  color: #55505e;
  font-size: 14px;
  line-height: 1.8;
}

.hover-card__more {
  color: #f8366e;
  font-size: 14px;
  font-weight: 700;
}

.hover-card__more::after {
  content: "→";
  display: inline-block;
  margin-left: 6px;
  transition: translate 200ms ease;
}

.hover-card:hover .hover-card__more::after,
.hover-card:focus-visible .hover-card__more::after {
  translate: 4px 0;
}

/* The lift is decoration; for anyone who asked for less of it, it just stops. */
@media (prefers-reduced-motion: reduce) {
  .hover-card,
  .hover-card__more::after {
    transition: none;
  }
}`,
  explanations: [
    {
      heading: {
        ja: '動かすのは transform だけ',
        en: 'Move it with transform',
      },
      body: {
        ja: 'カードを浮かせるのに margin や top を動かすと、そのたびにブラウザはレイアウトを計算し直し、周りの要素まで押しのけてしまいます。transform: translateY() は合成の段階だけで完結するので、レイアウトは 1 ミリも動きません。box-shadow を一緒に濃くすると、持ち上がった分の影が伸びたように見えます。',
        en: 'Nudging a card with `margin` or `top` makes the browser lay the page out again on every frame, and pushes whatever sits beside the card. `transform: translateY()` is handled at composite time instead, so nothing around it moves. Deepening the `box-shadow` at the same time reads as the card having risen off the page.',
      },
    },
    {
      heading: {
        ja: 'ホバーで終わらせない',
        en: 'Do not stop at hover',
      },
      body: {
        ja: 'ホバーはポインタを持っている人だけのものです。カード全体が <a> なので、キーボードで Tab を押して辿り着いたときにも :focus-visible で同じ動きが起きます。:focus ではなく :focus-visible を使うと、クリックした直後にリングが残りません。outline はアウトラインのまま残し、ブラウザが出す焦点の輪郭を消さないことが大切です。',
        en: 'Hover belongs to whoever has a pointer. The whole card is one `<a>`, so `:focus-visible` gives the same lift to anyone who tabs to it. `:focus-visible` rather than `:focus` keeps the ring from lingering after a click, and the `outline` stays an outline: never remove the shape the browser draws around what has focus.',
      },
    },
    {
      heading: {
        ja: '動きを減らしたい人のために',
        en: 'For anyone who asked for less motion',
      },
      body: {
        ja: 'prefers-reduced-motion: reduce は、OS で「視差効果を減らす」を選んでいる人に届く問い合わせです。この指定を尊重して transition を切っても、色と影の変化は残るので、ホバーしていることはちゃんと伝わります。動きを消すのであって、フィードバックを消すのではありません。',
        en: '`prefers-reduced-motion: reduce` carries a preference the visitor set in their operating system. Dropping the transition still leaves the shadow and the colour change, so the card is as clearly hovered as before: what goes is the movement, not the feedback.',
      },
    },
  ],
  preview: { height: 240 },
});
