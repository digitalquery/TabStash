const STORAGE_KEY = 'readLaterItems';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

async function getItems() {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || [];
}

async function saveItems(items) {
  await browser.storage.local.set({ [STORAGE_KEY]: items });
}

async function saveCurrentTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tabs || !tabs.length) return;
  const tab = tabs[0];

  const items = await getItems();
  const existingIndex = items.findIndex(item => item.url === tab.url);

  const now = new Date().toISOString();
  let isDuplicate = false;

  if (existingIndex >= 0) {
    items[existingIndex].savedAt = now;
    items[existingIndex].title = tab.title || items[existingIndex].title;
    isDuplicate = true;
  } else {
    items.push({
      id: generateId(),
      url: tab.url,
      title: tab.title || tab.url,
      savedAt: now
    });
  }

  await saveItems(items);

  // Flash badge
  browser.browserAction.setBadgeText({ text: isDuplicate ? 'SAVED' : 'ADDED' });
  browser.browserAction.setBadgeBackgroundColor({ color: isDuplicate ? '#f39c12' : '#27ae60' });
  setTimeout(() => {
    browser.browserAction.setBadgeText({ text: '' });
  }, 2000);

  // Notify sidebar to refresh
  browser.runtime.sendMessage({ type: 'refresh' }).catch(() => {});
}

// Context menu
try {
  browser.contextMenus.create({
    id: 'tab-stash-save',
    title: 'Tab Stash',
    contexts: ['page', 'link', 'tab']
  });
} catch (e) {
  // Menu may already exist on extension reload
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'tab-stash-save') {
    saveCurrentTab();
  }
});

// Toolbar button
browser.browserAction.onClicked.addListener(() => {
  saveCurrentTab();
});

// Keyboard shortcut
browser.commands.onCommand.addListener((command) => {
  if (command === 'save-tab-stash') {
    saveCurrentTab();
  }
});
