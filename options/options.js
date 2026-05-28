const shortcutInput = document.getElementById('shortcut');
const saveBtn = document.getElementById('save');
const statusEl = document.getElementById('status');

async function loadShortcut() {
  const commands = await browser.commands.getAll();
  const cmd = commands.find(c => c.name === 'save-tab-stash');
  if (cmd && cmd.shortcut) {
    shortcutInput.value = cmd.shortcut;
  }
}

saveBtn.addEventListener('click', async () => {
  const shortcut = shortcutInput.value.trim();
  try {
    await browser.commands.update({
      name: 'save-tab-stash',
      shortcut: shortcut || undefined
    });
    statusEl.textContent = 'Shortcut updated successfully.';
    statusEl.style.color = '#2e7d32';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message;
    statusEl.style.color = '#d32f2f';
  }
});

loadShortcut();
