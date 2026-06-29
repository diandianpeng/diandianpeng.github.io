# diandianpeng.github.io

Personal academic homepage of **Diandian Peng** — geodynamicist studying how mantle
convection shapes plate tectonics, subduction, and the Earth's surface.

🌐 **Live site:** https://diandianpeng.github.io

A hand-built **static website** — plain HTML and CSS, no framework and no build
step. Hosted on GitHub Pages and served exactly as written.

## Structure

```
index.html              Home (intro, research highlights, about)
publications/index.html Publications (peer-reviewed journal articles)
talks/index.html        Talks & seminars
cv/index.html           CV
assets/style.css        All styles
images/                 Photo, research figures, favicon
files/                  CV and paper PDFs
sitemap.xml, robots.txt SEO
```

## Editing

- **Add a publication:** open `publications/index.html` and copy an existing
  `<article class="pub"> … </article>` block, then edit the title, venue, year,
  citation, and PDF link.
- **Add a talk:** copy a `<div class="talk"> … </div>` block in `talks/index.html`.
- **Update the CV:** edit `cv/index.html` (and replace `files/CV.pdf`).
- Shared header/footer markup is repeated in each page — if you change the nav,
  update it on every page.

## Preview locally

No build needed. Either open `index.html` in a browser, or serve the folder so
that the root-relative paths (`/assets/...`, `/images/...`) resolve:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Push to `master`; GitHub Pages publishes the repository root as-is.

## License

See [`LICENSE`](LICENSE). Content © Diandian Peng.
