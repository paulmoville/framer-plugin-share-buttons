# Changelog

All notable changes to Share Buttons are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Visual plates for each release live in [`docs/changelog/`](./docs/changelog/). HTML sources are there too if a plate needs to be re-rendered. Marketplace paste lives in [MARKETPLACE.md](./MARKETPLACE.md).

## [Unreleased]

## [1.1.1] - 2026-09-02

Same-day release: property panel reorganization plus dark-mode plugin UI. Inserted canvas color defaults are unchanged. Ships as 1.1.1 (includes the 1.1.0 panel work).

![1.1.0 canvas property panel](docs/changelog/1.1.0-panel.png)

### Changed

- Essentials stay visible: heading, platforms, appearance, look, direction, align, wrap.
- Spacing is a top-level control. Size, colors, hover, and typography are grouped objects.
- Size uses Framer’s radius control so pills can be Full instead of 999px.
- Plugin labels match the canvas: Look (Outline / Filled / Ghost / Brand) and Appearance (Icon / Icon + label / Label). The sizing group is titled Size so it does not collide with Appearance.

### Fixed

- More platforms heading no longer gets Framer’s dark-mode gray button pill. It matches the Popular heading.
- Ghost look swatch is fill-only in all states. Selected Ghost keeps the shared blue card chrome; the inner circle stays a readable fill-only ghost. Live preview ghost is fill-only too.
- Canvas property panel Colors and Hover object controls now use `icon: "object"` like Typography so they get the themed chip in dark mode. Re-insert or replace `ShareButtons.tsx` for that to show.
- Brand plugin preview in dark mode: near-black brand marks (X, Threads, Copy, Email, Print, Native, Xing) lift to the theme text color for icon, label, and outline. Bright brands stay brand-colored. Hover on inverted marks stays readable.

## [1.0.1] - 2026-08-31

Marketplace follow-up after Framer’s silent-overwrite review. Plugin id `b4c9e1`.

![1.0.1 insert confirm](docs/changelog/1.0.1-overwrite.png)

### Security

- Insert asks before replacing an existing `ShareButtons.tsx` (Keep existing / Replace file and insert / Cancel).

### Added

- Plugin menu and footer show version, Lebel Studio, and support email.

### Fixed

- Copy-status timer cleanup and page URL / canonical handling for share targets.

## [1.0.0] - 2026-08-30

First marketplace release. The plugin inserts a code component onto the canvas.

![1.0.0 plugin](docs/changelog/1.0.0-plugin.png)

![1.0.0 share bar](docs/changelog/1.0.0-bar.png)

### Added

- Canvas plugin that writes `ShareButtons.tsx` and places an instance.
- 22 platforms: Copy, Email, Facebook, X, Threads, Bluesky, LinkedIn, Pinterest, Reddit, WhatsApp, Telegram, LINE, Tumblr, VK, Weibo, Hacker News, Pocket, Buffer, Flipboard, Xing, Print, and Native share.
- Looks (Outline, Filled, Ghost, Brand) and appearance (Icon, Icon + label, Label).
- Presets Minimal / Social / Chat, live preview, and Apply to selection.
- Shares use the current page URL so Framer Page Settings and Open Graph stay in charge.
- Print builds a clean article sheet instead of dumping page chrome.
