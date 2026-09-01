# ekjohnson.dev

Personal portfolio site. Plain HTML, CSS and JavaScript — no build step, no
dependencies, no framework. GitHub Pages serves it straight from `main`.

```
index.html                 page structure only — headings are empty, filled at load
assets/css/site.css        all styling
assets/js/content.js       ← every word on the site lives here
assets/js/site.js          the interactive visuals (background, keyword space,
                           cluster, fleet, side-channel ring)
assets/pdf/                drop PDFs here (resume, showcase poster)
assets/img/mark.svg        favicon — EJ monogram (the tab icon only;
                           the header mark is the animated curve)
assets/img/mark-curve.svg  alternate favicon: the 24-harmonic Fourier
                           curve that traces "EJ" — swap the <link rel="icon">
                           in index.html to use it
CNAME                      custom domain
```

## Changing the words

Open **`assets/js/content.js`** and edit the text between the quotes. Save,
reload the page. That file holds every heading, description, bullet, label and
link on the site; nothing else needs touching.

A few conventions:

- Keep the quotes, commas and brackets where they are.
- Basic HTML works inside any string: `<b>bold</b>`, `<br>`, `<a href="…">`.
- A list written as `[ "one", "two" ]` renders one paragraph per entry, so you
  can add or remove bullets by adding or removing lines.
- An apostrophe inside a `"double quoted"` string is fine. A double quote inside
  one has to be written `\"like this\"`.

Where each block ends up:

| Key in `content.js` | What it controls |
| --- | --- |
| `site` | Browser tab title, meta description, footer |
| `links` | The GitHub and LinkedIn links, top right |
| `menu` | The drop-down behind the logo. `ratio` also sets the Lissajous figure the animated mark eases to for that section |
| `hero` | The opening block |
| `skills` | Keyword-space copy, and the `keywords` list itself |
| `resume` | Resume section (see below) |
| `hpc` | HPC internship — headings, aisle legend, the descriptions, the PDF slot |
| `it` | IT systems engineering — headings, lattice legend, descriptions |
| `research` | Hardware Trojan research — headings, descriptions, feature-space legend |

### Adding or removing keywords

In `skills.keywords`, each entry is `["the words on the pill", "cluster"]` and
the cluster is one of `hpc`, `it`, `research`. The 3-D layout re-solves itself
on load, so you can add or delete entries freely without adjusting anything.

### Adding a PDF

1. Put the file in `assets/pdf/`.
2. Point at it in `content.js`:

```js
resume: {
  filename: "resume.pdf",
  file:     "assets/pdf/resume.pdf",
  …
}
```

The section switches from an empty slot to an inline viewer. Setting `file`
back to `""` returns it to the slot. The same applies to `hpc.pdf` — the
reprovisioning poster already in this repo can be wired up with:

```js
file: "rapid-reprovisioning-with-virtual-switch-root-POSTER.pdf"
```

## Changing the look

`assets/css/site.css` starts with the palette and typefaces as custom
properties under `:root` — colours, the three font families, the rule and panel
tones. Changing a value there changes it everywhere, including the canvas
visuals, which read their colours from the same variables at load.

## Running it locally

Because the page loads three local files, opening `index.html` straight off
disk works in most browsers, but a local server is more reliable:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- Motion is one shared animation clock; every canvas pauses when it scrolls out
  of view, and everything respects `prefers-reduced-motion`.
- The three work sections have no controls to press. Each visual is driven by
  scroll position, with the pointer only used for hovering: the machine-room
  aisle runs its reprovision front on scroll, the config lattice runs the
  playbook front on scroll, and the feature space runs its detector on scroll.
  The feature space can also be turned by dragging, like the keyword space.
- The fleet grid in the IT section is illustrative and labelled as such — the
  host count is not from the role.
- No contact details, addresses or personal information appear anywhere on the
  page.
