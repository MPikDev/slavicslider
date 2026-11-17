# Slavic Sliders website

Drift team website with a built-in admin panel.

- **Website:** Next.js 15 (App Router, TypeScript)
- **Admin / CMS:** Payload CMS 3 at `/admin`, in the same app
- **Database:** PostgreSQL 16 in Docker
- **Photos:** stored on the server's disk (`./data/media`), auto-resized and compressed to WebP
- **Videos:** YouTube / Instagram links (embedded, never self-hosted)

The non-technical editor guide is in **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)**.

---

## Project layout

```
src/
  payload.config.ts          CMS config (collections, database, email)
  collections/               Drivers, Cars, Parts, Build Log, Photos, Videos, Tracks,
                             Events, Sponsors, Inquiries, Link Clicks, Users
  globals/SiteSettings.ts    Logo, tagline, socials, sponsor pitch, Merch toggle…
  access/                    Admin / Editor permissions
  components/site/           Website components (cards, gallery, lightbox, forms…)
  components/admin/          Admin add-ons (paint color picker, link-click report)
  app/(frontend)/            Website pages, /go/[id] click logger, sitemap, share images
  app/(frontend)/styles.css  The whole theme. Colors & fonts are CSS variables at the top
  app/(payload)/             Admin panel + API routes (Payload boilerplate)
  migrations/                Database migrations (generated, commit them to git)
  seed/index.ts              Placeholder content
seed/fifth-wheel-logo.png    Sponsor logo used by the seed script
scripts/                     docker-entrypoint.sh, backup.sh, restore.sh
```

---

## 1. Deploying on your home Linux server

You need Docker with the Compose plugin (`docker compose version` should work).

```bash
# 1. Get the code onto the server
git clone <your-repo-url> slavicslider && cd slavicslider

# 2. Create your settings file
cp .env.example .env
nano .env
```

In `.env`, set at least:

| Variable | What to put |
| --- | --- |
| `PAYLOAD_SECRET` | output of `openssl rand -hex 32` |
| `POSTGRES_PASSWORD` | any strong password |
| `DATABASE_URI` | `postgres://slavic:<same password>@db:5432/slavicsliders` |
| `SITE_URL` | `http://<server-ip>:3000` for now (e.g. `http://192.168.1.50:3000`) |

```bash
# 3. Build and start (first build takes a few minutes)
docker compose up -d --build

# 4. Watch it start
docker compose logs -f app
```

**On the very first start** the app has no database tables yet, so the startup script
creates the initial migration from the collection definitions (`src/migrations/…_initial.ts`)
and applies it. You'll see `[startup] No database migrations found: creating the initial migration…`.
That file lands in your project's `src/migrations/` folder on the server. **Commit it to git.**

When the logs say `Ready`, open **http://\<server-ip\>:3000**.

> Can't reach it from another device? Allow the port: `sudo ufw allow 3000/tcp` (if you use ufw).

### Load the placeholder content (optional, recommended)

```bash
docker compose exec app npm run seed
```

This adds Fifth Wheel LLC as Title sponsor (with logo), 4 placeholder drivers with their
cars and paint colors, one past car, a few parts with Amazon links, a track and an upcoming
event. All placeholder text is marked `[PLACEHOLDER]` or `[Driver 1 name]` so it's easy to find.
It skips itself if drivers already exist.

---

## 2. Creating the first admin user

1. Go to **http://\<server-ip\>:3000/admin**
2. The first visit shows **Create first user**. Enter your email and a password.
3. The first account is always an **Admin**.

## 3. Creating an Editor account for your teammate

1. In the admin, open **Settings → Team logins → Create new**
2. Enter their name, email and a temporary password
3. Leave **Role** on **Editor** and save
4. Send them the admin link, their login, and `ADMIN_GUIDE.md`

**Admins** can do everything. **Editors** can manage drivers, cars, parts, build log,
photos, videos, tracks, events, sponsors and the inbox, but can't see **Team logins**
or **Site Settings**. They can change their own password from their account page.

---

## 4. Updating the site

```bash
cd slavicslider
git pull
docker compose up -d --build
```

The startup script applies any new database migrations automatically.

### Changing the CMS fields (collections)

Payload needs a migration file whenever you add/change fields:

```bash
# after editing files in src/collections/ …
docker compose build app
docker compose run --rm app npx payload migrate:create describe-your-change
docker compose up -d
```

The new file appears in `src/migrations/` (mounted from the host). Commit it.
You can also run `npm run migrate:create describe-your-change` on your laptop.

---

## 5. Local development (laptop)

Requires Node 20.9+ (22 recommended).

```bash
npm install
cp .env.example .env
# In .env, use a SEPARATE dev database so dev schema changes don't clash with migrations:
#   DATABASE_URI=postgres://slavic:<password>@localhost:5432/slavicsliders_dev

docker compose up -d db                                   # just the database
docker compose exec db createdb -U slavic slavicsliders_dev  # once
npm run dev                                               # http://localhost:3000
npm run seed                                              # optional placeholder content
```

In dev mode Payload syncs the database schema automatically (no migrations needed).
Useful scripts:

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run generate:types` | Writes `src/payload-types.ts` (full TypeScript types for every collection) |
| `npm run typecheck` | TypeScript check (run `generate:types` first) |
| `npm run generate:importmap` | Rebuilds the admin component map (also runs automatically) |
| `npm run migrate:create <name>` | New database migration after changing collections |
| `npm run seed` | Placeholder content |

> `next build` is set to ignore TypeScript errors (`next.config.mjs`) so a typing nit never blocks a
> deploy on the server. Run `npm run generate:types && npm run typecheck` during development instead.

---

## 6. Backups & restore

`scripts/backup.sh` saves a database dump and a tarball of uploaded photos into `./backups`,
keeping the newest 14 of each.

```bash
chmod +x scripts/*.sh
./scripts/backup.sh           # try it once
crontab -e                    # then add a nightly run, e.g. 3:15am:
15 3 * * * /home/YOU/slavicslider/scripts/backup.sh >> /home/YOU/slavicslider/backups/backup.log 2>&1
```

Copy `./backups` somewhere off the server now and then (a USB drive, another computer,
cloud storage). A backup on the same disk won't survive a dead disk.

**Restore:**

```bash
./scripts/restore.sh backups/db_2026-10-20_0315.dump backups/media_2026-10-20_0315.tar.gz
```

It asks you to type `restore` before replacing anything.

---

## 7. Email notifications (optional)

Form submissions are always saved under **Inbox → Inquiries**. To also get an email,
fill in the `SMTP_*` values in `.env` (any SMTP provider works: Gmail with an app password,
Fastmail, Brevo, Mailgun…) and set `NOTIFY_EMAIL`. Then `docker compose up -d`.

Spam protection: a hidden honeypot field, a "submitted too fast" check, and a limit of
5 submissions per visitor per 15 minutes.

---

## 8. Adding a domain + Cloudflare Tunnel (later)

A Cloudflare Tunnel gives you HTTPS on your own domain without opening ports on your router.

1. Buy a domain and add it to a free Cloudflare account (change the nameservers to Cloudflare's).
2. In the Cloudflare dashboard: **Zero Trust → Networks → Tunnels → Create a tunnel**
   (type *Cloudflared*). Name it `slavicsliders`.
3. Pick **Docker** as the environment and copy the **token** (the long string after `--token`).
4. Add a **Public hostname**: `slavicsliders.com` (and/or `www`) → Service **HTTP** → URL **`app:3000`**.
5. In `.env`, set:
   ```
   CLOUDFLARE_TUNNEL_TOKEN=<the token>
   SITE_URL=https://slavicsliders.com
   ```
6. In `docker-compose.yml`, uncomment the `cloudflared` service.
7. `docker compose up -d`

Once the domain works you can stop exposing port 3000 on your LAN by changing
`"3000:3000"` to `"127.0.0.1:3000:3000"` in `docker-compose.yml`.

---

## Notes

- **Theme:** colors, fonts and spacing are CSS variables at the top of
  `src/app/(frontend)/styles.css`. Fonts load through `next/font` (Russo One, Barlow Condensed, Barlow).
- **Outbound links:** sponsor and store links go through `/go/<type>-<id>`, which logs the click and
  redirects. Links use `rel="sponsored nofollow noopener"` and open in a new tab. The report is at the
  top of **Inbox → Link Clicks** (clicks per link, last 30 days).
- **Amazon compliance:** the disclosure appears in the footer and above any parts list with store links.
  Product images are never pulled from Amazon. Parts use your own photos or none.
- **More stores later:** add an entry to `src/lib/affiliates.ts`. It shows up in the Parts "Store" dropdown.
- **Admin "Preview" buttons** open the matching page on the site (cars, parts and build-log posts jump to
  the right driver page).
- **iPhone photos:** HEIC files are converted to JPEG by iOS when picked in the browser. If a photo
  ever fails to upload, export it as JPEG first.
