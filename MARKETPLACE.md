# Marketplace listing

Status: Live at [https://www.framer.com/marketplace/plugins/share-buttons/](https://www.framer.com/marketplace/plugins/share-buttons/)
Plugin id: `c2f9e4` (`framer.json`; was `b4c9e1` on the deleted listing)
Author: Lebel Studio
Support: hello@wearelebel.com
Version: 1.1.1
Pricing: Free unless you choose otherwise before submit. Display any paid price in USD ($).
Changelog: [CHANGELOG.md](./CHANGELOG.md) (1.0.0, 1.0.1, 1.1.1). Visual plates: [`docs/changelog/`](./docs/changelog/). Paste the **1.1.1 version notes** below into the dashboard.

This product is a **Framer plugin** that inserts a **code component**. That is the correct Marketplace type for an editor insert tool. The live share bar itself is also eligible as a **Component** listing (Assets → right-click → Copy URL).

Do not delete the listing. Framer cannot restore a deleted listing or its history. A new submission needs a new `id` in `framer.json` and a fresh `plugin.zip`. Keep `c2f9e4` unless Marketplace support tells you to change it.

## Dashboard paste

Use these values in [Framer Marketplace → Plugins](https://www.framer.com/marketplace/dashboard/plugins/) on the existing listing.

**Name:** Share Buttons

**Author / creator:** Lebel Studio

**Support email:** hello@wearelebel.com

**Byline:** Customizable social share buttons that keep your page SEO and Open Graph tags.

**Description:**

Share Buttons adds a brandable share bar to any Framer page or CMS detail template.

Choose platforms, look, and appearance in the plugin, then insert on the canvas. On the selected layer, essentials stay in Properties (heading, platforms, appearance, look, direction, align, wrap, spacing). Size, colors, hover, and typography are grouped objects.

Visitors can copy the link, email it, print, use the device share sheet, or post to Facebook, X, Threads, Bluesky, LinkedIn, Pinterest, Reddit, WhatsApp, Telegram, and more.

Shares send the current page URL. They do not override title, description, or social image, so Framer Page Settings continue to drive SEO and link previews.

Official brand marks are included. No account, API key, or external service is required.

The plugin panel stays readable in Framer dark mode. Near-black library chips and Brand look marks lift to the theme text color; light mode stays black. Inserted canvas color defaults are unchanged.

**1.1.1 version notes** (dashboard changelog field):

Property panel: essentials stay visible (heading, platforms, appearance, look, direction, align, wrap); spacing is top-level; Size, colors, hover, and typography are grouped. Size uses Framer’s radius control (Full instead of 999px). Plugin labels match the canvas: Look (Outline / Filled / Ghost / Brand) and Appearance (Icon / Icon + label / Label). Dark-mode plugin UI: More platforms heading matches Popular. Ghost look is fill-only. Colors and Hover property chips use the object icon (re-insert or replace ShareButtons.tsx). Library chips and Brand look (Icon, Icon + label, Label) lift near-black marks (Copy, Email, X, Threads, Print, Native; Tumblr/Xing when they fail 3:1) to the theme text color. Light mode stays black. Canvas component colors are unchanged.

**Tags (select exactly 3):** SEO, Utilities, CMS

The plugin form allows only three tags, from: UI Kits, Assets, Integrations, Forms, CMS, Design Workflow, Developers, Utilities, AI, Localization, SEO, E-Commerce.

SEO is the product hook (page URL + Page Settings / OG). Utilities matches a share/copy bar. CMS matches use on CMS detail templates. Do not select Integrations — this is not a third-party integration. Sharing, Social, and Marketing are not in the form.

If the dashboard still has **Integrations**, change it to **CMS**.

**Thumbnail to upload:** `assets/thumbnail-1600x1200.png` (exactly 1600 × 1200).

**Plugin file:** `plugin.zip` from `npm run pack` (upload as-is; do not rename). Confirm `framer.json` still has `"id": "c2f9e4"` before packing.

**Sample remix project (optional listing / demo):** live [functional-learning-254409.framer.app](https://functional-learning-254409.framer.app/) · file [framer.com/projects/edhOHxEcPakY749DoZrN](https://framer.com/projects/edhOHxEcPakY749DoZrN). Enable Remix on that project in Framer if the dashboard asks for a remixable sample. Do not use the CIPUH client project.

## Update — Plugin

The listing is live: [https://www.framer.com/marketplace/plugins/share-buttons/](https://www.framer.com/marketplace/plugins/share-buttons/).

1. Test in a **fresh** Framer project (not only CIPUH). Reload the Development Plugin after packing if you still have `npm run dev` open.
2. Check the plugin UI in **light and dark** mode.
3. Keep `"id": "c2f9e4"` in `framer.json`. `npm run pack` in this folder. Upload `plugin.zip` as-is (do not rename).
4. Open [Marketplace dashboard → Plugins](https://www.framer.com/marketplace/dashboard/plugins/) and edit **Share Buttons**. Do not click New Plugin.
5. Paste the name, byline, description, tags, author, and support email above if those fields drifted. Set pricing (USD if paid).
6. Upload **`assets/thumbnail-1600x1200.png`** if the thumbnail changed (1600 × 1200, plugin panel + share bar, no extra branding).
7. Optionally attach the sample remix project and post to the Community feed.
8. Save. An automated scan may follow within hours.

If create fails with “Failed to create plugin,” the zip still has a reserved or deleted id. Do not delete this listing to recover. Change `id` only if Marketplace support asks you to republish from scratch.

## Submit — Component (optional second listing)

1. Insert Share Buttons in a dedicated preview project (the sample remix file above, not CIPUH).
2. Publish a live preview page with **one** instance, no ads or unrelated branding.
3. Assets panel → right-click the component → Copy URL.
4. Community → Post → Component. Paste the URL, preview URL, images, categories, pricing.

Do **not** publish from the CIPUH client project. Use a separate Framer file so client work is not the product source.

## Thumbnail

Ready to upload: **`assets/thumbnail-1600x1200.png`** (exactly 1600 × 1200).

- Light limestone studio: **real screenshots** of the two-column plugin panel plus the outline share bar
- Heading **Share**, outline pills, icon + label
- Platforms: Copy, Email, WhatsApp, Facebook, X, LinkedIn
- No extra marketing text or Lebel Studio wordmark
- Captures: run the capture Vite server, snapshot `scripts/capture.html`, then `python3 scripts/chroma-bar.py`
- Composite: `swift scripts/render-thumbnail.swift scripts/thumbnail.html assets/thumbnail-1600x1200.png`

Plugin icon is already 30×30 SVG at `public/icon.svg`.

## Other marketplaces

| Marketplace | Fit |
|---|---|
| Framer Plugins | Yes — live at [https://www.framer.com/marketplace/plugins/share-buttons/](https://www.framer.com/marketplace/plugins/share-buttons/) |
| Framer Components | Yes — Copy URL from a product project |
| Figma Community | No — this runs on the published site, not in Figma |
| Webflow | Would need a separate Webflow component |

## Support

Email hello@wearelebel.com. Reply to buyers promptly. Keep the plugin updated as Framer evolves.

## Live listing checklist

- [x] Live at [https://www.framer.com/marketplace/plugins/share-buttons/](https://www.framer.com/marketplace/plugins/share-buttons/)
- [x] Plugin id `c2f9e4` in `framer.json` and packed `plugin.zip`
- [x] Icon and name are final (`framer.json` name is Share Buttons)
- [x] 1600 × 1200 thumbnail (`assets/thumbnail-1600x1200.png`)
- [x] Visual plates in CHANGELOG.md and docs/changelog/
- [ ] Core insert / apply / share flows tested after republish
- [ ] Tested in a fresh project
- [ ] Light and dark plugin UI
- [ ] English UI only
- [ ] Pricing in USD if paid
- [ ] No auth required — none to disclose
- [ ] IP: original code; Simple Icons-style brand paths used as marks
- [ ] No ads inside the plugin
- [ ] Listing matches shipped features (Look / Appearance, grouped Properties, insert confirm)
- [ ] Author / support shown as Lebel Studio / hello@wearelebel.com
- [ ] Version notes for 1.1.1 pasted from this file
