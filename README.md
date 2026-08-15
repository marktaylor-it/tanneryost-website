# tanneryost.com

A personal site for Tanner Yost — returned missionary, Tennessee Nashville Mission.

Hand-written HTML. **No framework, no build step, no npm, no CDN.** Seven pages, one
stylesheet, two small JavaScript files. It runs offline and it will still run in ten years.

```
index.html        Home — masthead, the four-way index, the invitation
story.html        My Story — six chapters. The centrepiece.
mission.html      The Mission — Tennessee Nashville, the record, the guitar clip
testimony.html    Testimony — the quietest page on the site
beliefs.html      What I Believe — plain-language summary + the invitation
mediator.html     The Great Mediator — the Instagram outreach account
connect.html      Connect — how to reach him
404.html          Not found (self-contained — see the note inside it)

assets/css/site.css   the entire design system
assets/js/theme.js    Auto → Light → Dark toggle
assets/js/reveal.js   the one scroll animation
assets/img/           photographs
```

## Running it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Edit an `.html` file, save, refresh. That is the whole loop.

---

## The two rules that will break the site if you ignore them

### 1. Every path stays relative

`assets/img/x.jpg`, `story.html` — never `/assets/img/x.jpg`. The site has to work both at
`<user>.github.io/<repo>/` and at the apex domain, and a root-absolute path works in local
preview but 404s on a project-page subpath. Check before every push:

```sh
grep -rE '(href|src)="/' index.html story.html mission.html \
     testimony.html beliefs.html mediator.html connect.html
# must print nothing
```

`404.html` is excluded on purpose and is the single documented exception — the reasoning is
written at the top of that file. Do not "fix" it to match the others.

### 2. Read the anti-drift rules before touching `site.css`

The first 30 lines of `assets/css/site.css` are the design spec: no border-radius above 2px,
no gradients, serif never bold, mono reserved for scripture references and dates, and so on.
They are what stop this decaying into a generic template. If one lapses, the design collapses.

**Dark mode is written twice** — once inside `@media (prefers-color-scheme: dark)` for
visitors following their OS, once under `:root[data-theme="dark"]` for visitors who used the
toggle. CSS cannot share a block between a media query and an attribute selector.
**Keep the two in sync.** The same duplication exists in `404.html`'s inline styles.

---

## Photographs

Currently in `assets/img/`, all taken August 2026, all with EXIF (including GPS) stripped:

| File | What it is | Used on |
|---|---|---|
| `tanner-portrait.jpg` + `@2x` | Tanner alone, Rexburg Idaho Temple grounds | `index.html` hero |
| `temple-rexburg.jpg` + `@2x` | Tanner and four friends, Rexburg Idaho Temple at dusk | `story.html` |
| `temple-idaho-falls.jpg` + `@2x` | Tanner and four friends in Sunday dress, Idaho Falls Idaho Temple | `beliefs.html` |

Temples were identified from the photographs' GPS coordinates and confirmed against the
published temple locations — Rexburg (43.8107, −111.7791) and Idaho Falls (43.4998, −112.0415).

**Two people-related things to settle before this goes public:** the two group photographs
show four other identifiable people who have not been asked. Either get their OK, or crop to
Tanner, or swap them for solo shots. Nothing on the site depends on them.

### Adding a photo

Keep originals **out of the repo** — put them in `source-photos/`, which is gitignored.
Generate the web versions with ImageMagick, and always `-strip` (phone photos carry GPS):

```sh
# vertical portrait (4:5), for a .portrait slot
magick SOURCE.heic -auto-orient -crop 1900x2375+118+650 +repage -strip \
  -resize 1200x -quality 82 assets/img/name.jpg
magick SOURCE.heic -auto-orient -crop 1900x2375+118+650 +repage -strip \
  -quality 82 assets/img/name@2x.jpg

# landscape (3:2), for a .feature slot
magick SOURCE.heic -auto-orient -crop 4032x2688+0+250 +repage -strip \
  -resize 1600x -quality 82 assets/img/name.jpg
magick SOURCE.heic -auto-orient -crop 4032x2688+0+250 +repage -strip \
  -resize 2400x -quality 82 assets/img/name@2x.jpg
```

`-crop WxH+X+Y` is width × height at offset. Adjust the offset to frame the subject.

Every `<img>` needs explicit `width`/`height` (stops layout shift), `decoding="async"`, and
`loading="lazy"` if it is below the fold. Two slot types exist:

- `.portrait` — vertical 4:5, squares off to 1:1 on mobile. One per page maximum.
- `.feature` — landscape 3:2. Use this for group shots and buildings; a landscape photo
  forced into a 4:5 slot crops the people at the edges straight out of frame.

### Placeholders

Empty image slots render as `<div class="ph">` — a dashed, correctly proportioned frame
saying what belongs there. To fill one, replace the whole `<div class="ph">…</div>` with an
`<img>`; the geometry is already right. Remaining ones are on `mission.html` (needs actual
Tennessee photos) and `mediator.html`.

---

## Unfilled facts

Anything not yet known ships as a visible `<span class="todo">[[TODO: …]]</span>` rather
than being invented. **See `CONTENT-QUESTIONS.md`** — that is the list to send Tanner.

```sh
grep -rn 'TODO:' *.html        # every unfilled field on the site
```

`story.html` also carries a visible draft notice (`<p class="notice">`). Delete that
paragraph once the page is filled in.

---

## Instagram embeds

`mediator.html` and `mission.html` load Instagram's official `embed.js`. **No other page
does**, so the rest of the site stays fully offline-capable. There is no API key, no
third-party widget service, and no account linking.

Each embed is a `<blockquote class="instagram-media">` that is styled to be a finished,
working link card on its own — if the script is blocked, the post is deleted, or Instagram
is down, nothing breaks. To swap a reel, change **both** the `data-instgrm-permalink` and
the `<a href>` to the new URL, and rewrite the fallback sentence to match.

Reels currently featured were captured in August 2026 and should be re-checked before
launch; a deleted post silently degrades to its link card.

Embeds load content from Meta, which sets its own cookies. That is disclosed in the
`.embed-note` line under each embed block.

---

## Deploying

GitHub Pages, "Deploy from a branch" → branch `main`, folder `/` (root). No GitHub Actions
needed, because there is nothing to build.

1. `git init && git add -A && git commit -m "..."`, create the repo, push `main`.
2. Repo → Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
3. `CNAME` already contains `tanneryost.com`. `.nojekyll` stops Pages running the files
   through Jekyll.
4. DNS at the registrar — four A records on the apex:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   plus the matching AAAA records (`2606:50c0:8000::153`, `…8001::153`, `…8002::153`,
   `…8003::153`), and a `CNAME` on `www` → `<user>.github.io`.
5. Settings → Pages → Custom domain → `tanneryost.com`, then **Enforce HTTPS** once the
   certificate issues (can take up to an hour).

---

## Before pushing anything

```sh
grep -rE '(href|src)="/' index.html story.html mission.html \
     testimony.html beliefs.html mediator.html connect.html   # must print nothing
grep -rn 'TODO:' *.html                                       # known gaps, expected
```

Then in a browser: click every page; toggle Auto / Light / Dark; turn JavaScript **off** and
confirm all content is still visible (the scroll reveal has a safety net for exactly this);
and check it at 390px wide.
