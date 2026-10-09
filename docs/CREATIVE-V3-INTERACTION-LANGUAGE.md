# EXIF interaction language — V3

Established before implementation. Preserve the original loader, split-color hero, photographic sequence, gallery controller, three cards, recognition, letter and page-transition system. The existing cream/deep-green palette and serif/sans families remain the vocabulary.

## Principles

Movement connects a decision to its consequence. No wheel interception, scroll normalization, full-page pinning, letter-by-letter headline reveal or new animation dependency. Text remains readable before JavaScript runs. Each section gets its own compositional job rather than one repeated entrance effect.

| Interaction | Intent and behavior | Responsive / accessible alternative |
| --- | --- | --- |
| Service folio | Three plainly named responsibilities form a typographic index. Selecting a folio changes the composition and opens the corresponding full explanation. Examination uses a reading line, direction emphasizes a chosen phrase, production sets that phrase into a different editorial format. | Native section links progressively enhance into tabs/tabpanel state with arrow/Home/End navigation. Rendering the index before enhancement preserves layout stability and no-JS navigation. At small widths the index is a vertical stack; no horizontal puzzle. Without JS every service is visible. |
| Process reading spine | A compact five-stage index follows the current reading; normal-scroll spreads connect context, evidence, priorities, work and review. Native disclosure exposes working material without hiding the core explanation. | Anchors remain anchors, with ordinary scroll and focus. Finite desktop sticky index only; mobile index flows normally. Keyboard/screen readers can traverse every chapter/details. |
| Hospitality-language study | One original sentence is examined, interpreted and edited. A direct three-way choice changes emphasis and explains why the editorial decision matters. | Textual example and explicit non-client attribution remain visible. Buttons work with touch/keyboard; no timed progression or privileged hover. |
| Home chapter framing | A short, bounded translation of an introductory rule establishes passage into the original image sequence. The existing photographic mechanics receive no writes/listeners from the new controller. | At reduced motion the rule is complete and the layout static. No chapter needs movement to be understood. |
| Drawer | The name stays large. A margin annotation interprets the focused/hovered route; a small lateral displacement follows intent, without replacing the title. | Focus uses the same annotation; touch routes are immediately tappable. Existing modal isolation, trap, close proxy and scroll restoration remain. |
| Correspondence | Required fields read as an introduction on a ruled letter spread. Focus puts ink on the active line; readiness indicates completeness without forcing stages. The accepted response becomes a reply slip. | Native form labels, validation, selects and required fields; all qualifications remain visible. Existing Formspree fallback, retry/pending/success logic remains authoritative. |
| Studio | A large opening, small author folio and direct letter anchor move from institutional context to the unchanged personal letter. | Original article is untouched. All text and navigation work without motion. |

## Timing and composition

- Pointer/focus feedback: 160–220ms, ease-out; never a delayed navigation or validation action.
- Folio change: 360ms `cubic-bezier(.22,1,.36,1)`, a small spatial displacement and editorial aperture. Titles never animate character by character. Inactive content becomes hidden/inert immediately; no overlapping readable panels.
- Process/current-reading changes: 220ms on a thin rule/annotation, not animated paragraph text.
- Scroll framing: passive scroll + one coalesced requestAnimationFrame, bounded 0–24px transform/scale on authored structural elements. It does not set scroll position. No continuously running RAF when settled/offscreen.
- Page transitions and loader retain their existing clocks and failure fallbacks.
- Responsive type uses clamped scales with explicit Spanish fit checks, not smaller universal body text.

## Reduced motion and fallbacks

`prefers-reduced-motion` removes new transforms, clipping transitions and scroll tracking movement; direct selections and native disclosure still work. Runtime preference changes apply immediately. IntersectionObserver/requestAnimationFrame/matchMedia failure leaves visible static reading and direct controls. A missing new script does not hide service descriptions or process chapters. No external API, animation library, WebGL, new typeface, photograph, analytics or calendar is required.

## Performance budget

Target under 12KB gzip for the new CSS+JS together, no new image requests, one passive/coalesced scroll handler for the process/frame signals, and no offscreen continuous animation. Existing gallery RAF remains its own controller. Browser QA records transferred local assets, CLS via PerformanceObserver where supported and idle/offscreen behavior; results are measurements, not a Lighthouse/Safari guarantee. Keep full-resolution review evidence outside active production asset paths; report browser/network limits honestly.

## Content boundary

The new study is original editorial language, labeled as an exercise. Existing photography stays in its original locations while publication rights remain unresolved. No commissioned property study, fabricated result, mandatory assessment, universal fee, calendar availability or completed booking is introduced. Scheduling/analytics configuration remains null.
