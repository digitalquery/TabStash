# AMO Submission Guide

Go to [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) and follow these steps.

## Step 1: Submit the Add-on
- Click **Submit a New Add-on**
- Choose **"On this site"** (listed/public)
- Upload `read-later.xpi`

## Step 2: Details (copy-paste these)

**Name:** Tab Stash

**Summary:** Quickly save tabs to a sidebar panel and come back to them later.

**Description:**
```
Tab Stash lets you quickly save the current page to a sidebar panel so you can come back to it later.

Features:
- Save any page via toolbar button, keyboard shortcut (Ctrl+Shift+S), or right-click context menu
- Sidebar shows all saved items sorted by most recent first
- Real-time filter by page title or URL
- Delete individual items
- Export your list to JSON
- Import a previously exported JSON file
- Configurable keyboard shortcut in extension settings

Duplicate pages are automatically detected — saving the same URL again updates its timestamp instead of creating a duplicate.

All data is stored locally in your browser. No data is collected or transmitted.
```

**Categories:** Bookmarks, Search Tools

**Homepage:** (leave blank or link to your GitHub repo)

**Support email/site:** (leave blank or your email)

**Privacy Policy:** Paste the contents of `PRIVACY.md`

## Step 3: Images
- **Icon:** Already included in the extension
- **Screenshots:** Take 1-2 screenshots showing the sidebar with saved items
- **Promotional images:** Optional

## Step 4: Version Notes
```
Initial release.
```

## Step 5: Submit
Click **Submit Version** and wait for review. For a simple extension like this, approval usually takes a few hours to one business day.

Once approved, the extension will be live on addons.mozilla.org and you can install it permanently from there.
