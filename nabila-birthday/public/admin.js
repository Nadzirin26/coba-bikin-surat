const loginPanel = document.querySelector('#login-panel'), editPanel = document.querySelector('#edit-panel');
const status = document.querySelector('#status'), edit = document.querySelector('#edit');
async function api(url, method = 'GET', body) {
  const response = await fetch(url, {method,headers:body ? {'Content-Type':'application/json'} : {},body:body ? JSON.stringify(body) : undefined,cache:'no-store'});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Permintaan gagal.');
  return result;
}
async function showEditor() {
  const {card} = await api('/api/card');
  Object.entries(card).forEach(([key,value]) => { if (edit.elements[key]) edit.elements[key].value = value; });
  loginPanel.hidden = true; editPanel.hidden = false;
}
document.querySelector('#login').onsubmit = async event => {
  event.preventDefault(); const button = event.submitter; button.disabled = true; status.textContent = 'Sedang masuk…';
  try { await api('/api/session','POST',{password:document.querySelector('#password').value}); document.querySelector('#password').value = ''; await showEditor(); status.textContent = ''; }
  catch(e) { status.textContent = e.message; } finally { button.disabled = false; }
};
edit.onsubmit = async event => {
  event.preventDefault(); const button = event.submitter; button.disabled = true; status.textContent = 'Menyimpan…';
  try { await api('/api/card','PUT',Object.fromEntries(new FormData(edit))); status.textContent = 'Tersimpan. Ucapan terbaru siap dilihat di kartu. ♡'; }
  catch(e) { status.textContent = e.message; } finally { button.disabled = false; }
};
document.querySelector('#logout').onclick = async () => {
  try { await api('/api/session','DELETE'); edit.reset(); editPanel.hidden = true; loginPanel.hidden = false; status.textContent = 'Kamu sudah keluar.'; }
  catch(e) { status.textContent = e.message; }
};
(async () => { try { const result = await api('/api/session'); if (result.authenticated) await showEditor(); } catch(e) { status.textContent = e.message; } })();
