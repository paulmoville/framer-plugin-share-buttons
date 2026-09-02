# Share Buttons

A Framer plugin by **Lebel Studio** that inserts a customizable social share bar onto the canvas.

Visitors can copy a link, email it, or share to Facebook, X, LinkedIn, WhatsApp, and more. Social networks receive the **current page URL only**, so Framer Page Settings (title, description, social image) keep working for SEO and Open Graph.

**Version 1.1.1.** See [CHANGELOG.md](./CHANGELOG.md) for release history and visual plates.

## Use

1. In Framer: **Menu → Plugins → Share Buttons** (or **Development Plugin** while developing).
2. Choose platforms, content, and style, then **Insert on canvas**.
3. If the project already has `ShareButtons.tsx`, pick **Keep existing file**, **Replace file and insert**, or **Cancel**. Replacing is how a project picks up a new property panel.
4. Select the layer and edit in **Properties**. Native Framer Position, Size, Layout, and Effects stay in their own section.

**Apply to selection** updates an existing Share Buttons instance without writing the code file again.

## Properties

Always visible:

- Heading (Show / Hide) and Text
- Platforms
- Content (Icon, Icon + label, Label)
- Style (Outline, Filled, Ghost, Brand)
- Direction, Align, Wrap
- Spacing

Grouped objects:

- Appearance — Size, Icon, Radius (native Full), Stroke
- Colors — Fill, Icon color, Text color, Border color
- Hover — Background, Icon color, Text color
- Typography — Font, Buttons

## Develop

```bash
npm install
npm run dev
```

Then in Framer: **Menu → Plugins → Development Plugin**. After code-file changes, insert again and choose **Replace file and insert**.

## Pack for Marketplace

```bash
npm run pack
```

Upload the generated `plugin.zip`. Do not rename the zip. The listing name comes from `framer.json`.

See [MARKETPLACE.md](./MARKETPLACE.md) for listing copy, assets, and the submit checklist.

## Visual changelog

PNG plates and HTML sources for each release are in [`docs/changelog/`](./docs/changelog/). They are also embedded in [CHANGELOG.md](./CHANGELOG.md).

## Support

Email [hello@wearelebel.com](mailto:hello@wearelebel.com) with the subject “Share Buttons plugin”.
