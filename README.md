# diandianpeng.github.io

Personal academic homepage of **Diandian Peng** — geodynamicist studying how mantle
convection shapes plate tectonics, subduction, and the Earth's surface.

🌐 **Live site:** https://diandianpeng.github.io

A hand-built **static website** — plain HTML and CSS, no framework and no build
step. Hosted on GitHub Pages and served exactly as written.

## Structure

```
index.html              Home (intro, research + model animations, about)
research/index.html     Research (the four projects in detail)
publications/index.html Publications (peer-reviewed journal articles + book)
talks/index.html        Talks & seminars
cv/index.html           CV (timeline layout)
404.html                Custom not-found page
assets/style.css        All styles (one content width: the --page-max variable)
images/                 Photo, research figures, favicon, social-share banner
media/                  Model-animation videos (H.264 mp4) + poster frames
files/                  CV and paper PDFs
sitemap.xml, robots.txt SEO
```

## Editing

- **Add a publication:** open `publications/index.html` and copy an existing
  `<article class="pub"> … </article>` block, then edit the title, venue, year,
  citation, and PDF link.
- **Add a talk:** copy a `<div class="talk"> … </div>` block in `talks/index.html`.
- **Update the CV:** edit `cv/index.html` (and replace `files/CV.pdf`).
- **Add/replace a model animation:** browsers only play **H.264** in `<video>`, so
  re-encode the clip and drop it in `media/`, then add a `<figure class="video-fig">`
  block in `index.html`. Example:
  ```bash
  ffmpeg -i in.mp4 -an -vf scale=960:-2 -c:v libx264 -pix_fmt yuv420p -crf 26 -movflags +faststart media/out.mp4
  ```
- All pages share one content width — the `--page-max` variable in `assets/style.css`.
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
