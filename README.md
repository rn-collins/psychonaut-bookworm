# The Psychonaut Bookworm — Research & Learning Library

Psychonaut Bookworm is an independent research and learning library across psychedelic literature: 454 published editorial objects drawn from a 1,664-record provenance ledger, with per-item source visibility, rights-review notes, and a saved research queue.

It is drafts and study material — not externally published, peer-reviewed, licensed or independently fact-checked work — and the site says so on every view. Five object types (quote cards, documents of the week, character profiles, passage spotlights, the geography series) are withheld in full pending excerpt rights review; [`/governance`](https://psychonaut-bookworm.vercel.app/governance) states the rule that decides it and links the ledger that records every decision.

**Live:** https://psychonaut-bookworm.vercel.app

## Repository contents

`api`, `app.js`, `build`, `data`, `governance.html`, `index.html`, `provenance`, `robots.txt`, `sitemap.xml`, `vercel.json`

## How the page is built

`index.html` is generated, and is committed. Regenerate it after any change to the library:

```sh
python3 build/build.py
```

| Path | What it is |
|---|---|
| `data/library.json` | The 454 published objects. The source of truth for the page. |
| `build/build.py` | Renders them into `index.html`. Standard library only, no dependencies. |
| `build/head.html`, `build/tail.html` | The document shell — head, metadata, forms, footer. |
| `app.js` | Progressive enhancement. It constructs nothing. |

Two rules the build enforces, rather than trusting anyone to remember:

* **Counts come from the data.** `verify()` aborts the build if a published count in the shell disagrees with `data/library.json`. A number on the page cannot drift away from the objects it counts.
* **Filter vocabularies come from the data.** Pills are generated from the records in each section, so a filter can never offer a value nothing carries, and never omit one that records do.

The word count shown against a draft is the length of the text published here, measured at build time. `data/library.json` also carries a `wordCount` field per piece; it is larger than every body it labels, so it is retained in the data and not displayed.

## Local development

Static site, no server-side code beyond the two API routes. Serve the directory with any static file server:

```sh
python3 -m http.server 8000
```

`/governance` resolves only under Vercel's `cleanUrls`; locally, open `/governance.html`.

## Deployment

Deployed on Vercel from `main`. Every push to `main` triggers a production build.

## Verification

The ship gate is [`estate_check.py`](https://github.com/rn-collins/rn-estate-tools):

```sh
python3 estate_check.py https://psychonaut-bookworm.vercel.app
```

## License

Apache-2.0 — see [LICENSE](LICENSE).
