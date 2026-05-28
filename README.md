# Tab Stash — Firefox Extension

Quickly save tabs to a sidebar panel and come back to them later.

<!-- Replace with a screenshot of the sidebar -->
<!-- ![Tab Stash sidebar showing saved items](screenshot.png) -->

## Features

- **Save** the current page via:
  - Toolbar button click
  - Keyboard shortcut (default: `Ctrl+Shift+S` / `MacCtrl+Shift+S`)
  - Right-click context menu on any page, link, or tab
- **Duplicate detection**: saving the same URL again updates its timestamp and flashes a badge.
- **Sidebar panel** shows saved items sorted **latest first**.
- **Filter** items by page title or URL in real time.
- **Delete** individual items.
- **Export** your list to a dated JSON file.
- **Import** a previously exported JSON file (merges by URL).
- **Options page** to configure the keyboard shortcut.

## Install

### From Mozilla Add-ons (recommended)
<!-- Update this link once your AMO listing is live -->
Coming soon to [addons.mozilla.org]()

### From source (temporary)
1. Download or clone this repo
2. Open Firefox and go to `about:debugging`
3. Click **This Firefox**
4. Click **Load Temporary Add-on...**
5. Select `manifest.json`

## Build

No build step required — this is a plain WebExtension. To create the `.xpi` package:

```bash
zip -X -r tab-stash.xpi manifest.json background.js sidebar/ options/ icons/
```

## File Structure

```
├── manifest.json
├── background.js
├── sidebar/
│   ├── sidebar.html
│   ├── sidebar.css
│   └── sidebar.js
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    └── icon-48.png
```

## Data & Privacy

All data is stored locally in your browser using `browser.storage.local`. Nothing is transmitted or shared. See [PRIVACY.md](PRIVACY.md) for details.

## Data Format

Items are stored under the key `readLaterItems`:

```json
[
  {
    "id": "<uuid>",
    "url": "https://example.com",
    "title": "Example Page",
    "savedAt": "2026-05-28T19:31:56.696Z"
  }
]
```
