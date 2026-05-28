const STORAGE_KEY = 'readLaterItems';
const listEl = document.getElementById('list');
const filterEl = document.getElementById('filter');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');

let allItems = [];

async function getItems() {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || [];
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function render(items) {
  listEl.innerHTML = '';
  if (!items.length) {
    listEl.innerHTML = '<div class="empty">No items saved yet.<br>Use the toolbar button, shortcut, or right-click to stash a tab.</div>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';

    const title = document.createElement('a');
    title.className = 'item-title';
    title.href = item.url;
    title.textContent = item.title || item.url;
    title.title = item.title || item.url;
    title.target = '_blank';

    const url = document.createElement('div');
    url.className = 'item-url';
    url.textContent = item.url;
    url.title = item.url;

    const meta = document.createElement('div');
    meta.className = 'item-meta';
    meta.textContent = formatDate(item.savedAt);

    const del = document.createElement('button');
    del.className = 'item-delete';
    del.textContent = '×';
    del.title = 'Delete';
    del.addEventListener('click', async () => {
      if (!confirm('Delete this item?')) return;
      const current = await getItems();
      const updated = current.filter(i => i.id !== item.id);
      await browser.storage.local.set({ [STORAGE_KEY]: updated });
      refresh();
    });

    div.appendChild(title);
    div.appendChild(url);
    div.appendChild(meta);
    div.appendChild(del);
    listEl.appendChild(div);
  });
}

async function refresh() {
  allItems = await getItems();
  allItems.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  applyFilter();
}

function applyFilter() {
  const q = filterEl.value.trim().toLowerCase();
  if (!q) {
    render(allItems);
    return;
  }
  const filtered = allItems.filter(item =>
    (item.title || '').toLowerCase().includes(q) ||
    (item.url || '').toLowerCase().includes(q)
  );
  render(filtered);
}

filterEl.addEventListener('input', applyFilter);

exportBtn.addEventListener('click', async () => {
  const items = await getItems();
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `read-later-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('File must contain a JSON array');

    const valid = data.filter(item => item && typeof item.url === 'string' && typeof item.savedAt === 'string');
    if (!valid.length) throw new Error('No valid items found in file');

    const current = await getItems();
    const map = new Map(current.map(i => [i.url, i]));

    valid.forEach(item => {
      if (map.has(item.url)) {
        const existing = map.get(item.url);
        existing.savedAt = item.savedAt;
        existing.title = item.title || existing.title;
      } else {
        map.set(item.url, {
          id: item.id || generateId(),
          url: item.url,
          title: item.title || item.url,
          savedAt: item.savedAt
        });
      }
    });

    const merged = Array.from(map.values());
    await browser.storage.local.set({ [STORAGE_KEY]: merged });
    refresh();
    alert(`Imported ${valid.length} items.`);
  } catch (err) {
    alert('Import failed: ' + err.message);
  }
  importFile.value = '';
});

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[STORAGE_KEY]) {
    refresh();
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'refresh') {
    refresh();
  }
});

refresh();
