# Alodev — Studio thiết kế website & lập trình app

Production: **[https://alodev.vn](https://alodev.vn)**

Founder-led studio chuyên thiết kế website doanh nghiệp, lập trình app mobile (iOS/Android) và xây dựng hệ thống quản trị (CRM/ERP) cho doanh nghiệp Việt. 11+ sản phẩm vận hành thật, source code thuộc về khách hàng.

---

## Stack

- **Frontend** — Next.js 16 (static export), React 19, Tailwind v4, TypeScript
- **Backend** — Express + helmet (slim — chỉ phục vụ `/api/contact` + `/api/health`)
- **Hosting** — Cloudflare Tunnel → nginx → static `out/` + reverse-proxy API trên port 3014
- **Process manager** — PM2 (ecosystem.config.cjs)
- **Analytics** — Google Analytics 4 (env-driven, optional)
- **Notifications** — Telegram Bot khi có lead mới (env-driven, optional)
- **Font** — SVN-Gilroy (Vietnamese-extended Gilroy)

## Cấu trúc

```
public/                  Static assets — favicon, OG image, robots.txt, manifest, fonts
server/                  Slim Express backend (only /api/contact + /api/health)
  └ routes/contact.js    Form receiver + Telegram notify
src/
  ├ app/                 Next.js App Router pages
  │  ├ page.tsx          Homepage — keyword-targeted hero
  │  ├ dich-vu/          Service pages (overview + 3 detail pages)
  │  ├ bao-gia/          Quote calculator wizard (4-step)
  │  ├ du-an/            Portfolio listing + 9 case studies
  │  ├ ve-chung-toi/     About page
  │  ├ lien-he/          Contact form (with /bao-gia handoff)
  │  └ sitemap.ts        Auto-generated sitemap
  ├ components/          Icon library (39 SVG), Navbar, Footer, IntroAnimation,
  │                      CommandPalette ⌘K, QuoteChoice modal, etc.
  ├ data/                projects.ts (portfolio source of truth),
  │                      quote-features.ts (calculator pricing)
  └ lib/schema.ts        Schema.org JSON-LD generators
```

## Run locally

### Frontend (Next.js)

```bash
npm install
cp .env.example .env       # NEXT_PUBLIC_GA_ID etc.
npm run dev                # http://localhost:3000
# or
npm run build              # produces ./out/ for static export
```

### Backend (Express)

```bash
cd server
npm install
cp .env.example .env       # set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
npm start                  # listens on :3014
```

### Production

The static `out/` directory is served directly by nginx at `https://alodev.vn`.
The Express API on `:3014` is reverse-proxied via nginx for `/api/*` paths.
PM2 keeps the API alive — see `ecosystem.config.cjs`.

## Features

- **3 keyword-targeted service detail pages** for SEO (`/dich-vu/thiet-ke-website`, `/dich-vu/lap-trinh-app-mobile`, `/dich-vu/he-thong-quan-tri`)
- **Quote calculator wizard** at `/bao-gia` — 4 steps with preset templates
- **Cinematic intro animation** on first visit (12h cooldown via localStorage)
- **Dark mode** with cool slate + saffron accent palette
- **Command palette** (⌘K / Ctrl+K) with global search
- **Mobile-first** with safe-area, touch targets ≥44px, sticky bottom bars
- **Full SEO** — Schema.org LocalBusiness w/ geo, sitemap, OG, canonical, breadcrumbs, FAQ rich results
- **Performance** — static export, Brotli, HTTP/3, Tiered Caching, edge cache rules

## License

Proprietary — © Alodev Studio. Mọi sử dụng cần có sự đồng ý.

## Liên hệ

- Website: https://alodev.vn
- Email: hello@alodev.vn
- Zalo: 0364 234 936
