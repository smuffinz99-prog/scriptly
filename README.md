# Scriptly

**Viral script generator for TikTok, Instagram Reels, and YouTube Shorts.**

Enter your niche + topic → pick a hook style → get 3 complete scripts with hooks, outlines, CTAs, and hashtags.

## Live URL
https://smuffinz99-prog.github.io/scriptly/

## Files
- `index.html` — landing page
- `app.html` + `app.js` — the script generator tool
- `pricing.js` — Stripe checkout (paste Payment Link here)
- `tiktok-script-generator.html` — SEO page
- `viral-hook-generator.html` — SEO page
- `youtube-shorts-script-generator.html` — SEO page
- `sitemap.xml` / `robots.txt` — SEO infrastructure

## Monetisation
- Free: 3 scripts/day (no account needed)
- Pro: $9/month — unlimited + saved library

## To go live with payments
1. Create a Stripe account at stripe.com
2. New Product: "Scriptly Pro" → $9/month recurring
3. Create a Payment Link, set redirect to `app.html?pro=success`
4. Paste the Payment Link URL into `app.js` → `PRO_CHECKOUT_URL`

## Deploy
Push to a GitHub repo named `scriptly` on the `smuffinz99-prog` account.
Enable GitHub Pages → deploy from root of `main` branch.

## TikTok marketing angles
- "Watch me write 30 days of TikTok content in 5 minutes" (show the tool live)
- "I never run out of video ideas anymore — here's why" (reveal Scriptly)
- "Copy this exact hook structure that gets me views every time" (show a generated hook)
- "POV: You finally have a system for creating content" (relatable creator pain)
