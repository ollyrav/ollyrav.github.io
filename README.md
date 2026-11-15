# Olly Ravilious – Portfolio

Static site (plain HTML, CSS and JavaScript): no build step, no dependencies. Hosted on GitHub Pages.

```
index.html                     home page
projects/<slug>.html           one page per project (4 so far)
templates/project-template.html  copy this to start a new project page
css/base.css                   shared: colours, nav, footer
css/home.css                   home page only
css/project.css                project pages only
js/content.js                  ALL content: projects, roles, testimonials
js/base.js                     shared: dark-mode switch, footer effect
js/home.js, js/project.js      build the pages from content.js
images/                        thumbnails, photos, footer gradient
404.html  .nojekyll            GitHub Pages housekeeping
```

## Day-to-day editing
Almost everything is edited in `js/content.js`.

- **Add a project:** copy an entry in `PROJECTS`, give it a new `slug`, then copy
  `templates/project-template.html` to `projects/<slug>.html` and change the three
  things marked `your-slug` / `Project title` / the description.
- **Hide a project:** `visible:false`. **Reorder:** change `order` (10, 20, 30...).
  The home grid and the "next project" links follow `order`.
- **Project page content:** each project has a `blocks` list (image, split, trio,
  cards, gallery, close). Add `src:"images/<project>/file.webp"` to show a real image
  instead of a placeholder. Reorder blocks by reordering the list.
- **PDF per project:** put the file in `pdf/` and set `pdf:"pdf/virgin-money.pdf"`.
  The "Download PDF" button only appears when this is set.
- **Colours / radii / spacing:** the colour tokens are at the top of `css/base.css`.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and
visit http://localhost:8000

## Deploy
Repo Settings > Pages > "Deploy from a branch" > `main` / `(root)`.
Every push to `main` updates the live site in about a minute.

## Custom domain (later)
1. Settings > Pages > Custom domain: enter the domain (GitHub creates a `CNAME` file).
2. At the domain registrar add DNS records as described in GitHub's "Managing a custom domain" docs.
3. Tick "Enforce HTTPS" once the certificate is ready.
4. Then add `<meta property="og:image" content="https://YOUR-DOMAIN/images/og.jpg">` to each page's head for link previews.

## Image tips
Export web images as WebP (about 1400px wide), keep each under ~150 KB, and name files in lower-case-with-dashes.
