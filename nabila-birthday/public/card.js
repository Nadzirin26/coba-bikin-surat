const root = document.querySelector('#root');
let data, countdownInterval, retryTimer;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const banner = () => data?.admin ? '<p class="preview-banner">Pratinjau pribadi · <a href="/admin">Edit kartu</a></p>' : '';
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 42; i++) {
    const bit = document.createElement('i'); bit.className = 'confetti';
    bit.style.left = `${Math.random()*100}%`; bit.style.animationDelay = `${Math.random()}s`;
    bit.style.background = ['#bd7484','#e7baa2','#c7a46c'][i%3];
    document.body.append(bit); setTimeout(() => bit.remove(), 4500);
  }
}
function show(step = 0) {
  const c = data.card;
  if (step === 0) {
    root.innerHTML = banner() + `<section><p class="eyebrow">10 OKTOBER 2026 · HARI ISTIMEWAMU</p><h1>Untuk ${escape(c.name)},<br>dengan cinta.</h1><p class="muted">Ada sesuatu yang ingin aku sampaikan.<br>Dan hari ini, waktunya kamu membukanya.</p><div class="envelope" aria-hidden="true"></div><button id="next">Buka kejutanmu ♡</button></section>`;
  } else if (step === 1) {
    root.innerHTML = banner() + `<section><p class="eyebrow">HARI INI TENTANG KAMU</p><div class="seal" aria-hidden="true">♡</div><h1>${escape(c.title)}</h1><p class="letter">${escape(c.intro)}</p><button id="next">Ada surat untukmu →</button></section>`;
    confetti();
  } else if (step === 2) {
    root.innerHTML = banner() + `<section class="paper"><p class="eyebrow">SURAT KECIL, RASA YANG BESAR</p><h2>Sayang, ${escape(c.name)}.</h2><p class="letter">${escape(c.message)}</p><p class="signature">${escape(c.sender)}</p><button id="next">Satu doa lagi ♡</button></section>`;
  } else {
    root.innerHTML = banner() + `<section><p class="eyebrow">UNTUK SEMUA HARI YANG AKAN DATANG</p><div class="seal" aria-hidden="true">✧</div><h1>Make a wish,<br>${escape(c.name)}.</h1><p class="letter">${escape(c.wish)}</p><p class="signature">${escape(c.sender)} ♡</p><button id="again">Baca lagi ↻</button></section>`;
    confetti(); document.querySelector('#again').onclick = () => show(0);
  }
  const next = document.querySelector('#next'); if (next) next.onclick = () => { show(step+1); window.scrollTo({top:0,behavior:'smooth'}); };
}
function locked(info) {
  const offset = info.serverNow - Date.now();
  root.innerHTML = '<section><p class="eyebrow">SEBUAH KEJUTAN KECIL</p><div class="envelope" aria-hidden="true"></div><h1>Yang indah,<br>layak ditunggu.</h1><p class="muted">Ada hadiah kecil yang menunggu hari istimewamu.<br>Simpan tautan ini, ya. ♡</p><div class="countdown" aria-label="Hitung mundur"><div><strong id="days">–</strong><small>hari</small></div><div><strong id="hours">–</strong><small>jam</small></div><div><strong id="minutes">–</strong><small>menit</small></div><div><strong id="seconds">–</strong><small>detik</small></div></div><p class="date">10 Oktober 2026 · 00.00 WIB</p></section>';
  const tick = () => {
    const left = Math.max(0, Math.ceil((Date.parse(info.opensAt) - Date.now() - offset)/1000));
    [Math.floor(left/86400),Math.floor(left/3600)%24,Math.floor(left/60)%60,left%60].forEach((v,i) => document.getElementById(['days','hours','minutes','seconds'][i]).textContent = String(v).padStart(2,'0'));
    if (!left) { clearInterval(countdownInterval); retryTimer = setTimeout(load,1000); }
  };
  tick(); countdownInterval = setInterval(tick,1000);
  // Periodically resync with the server, including if the device clock changes.
  if (!retryTimer) retryTimer = setTimeout(load,60000);
}
async function load() {
  clearInterval(countdownInterval); clearTimeout(retryTimer); retryTimer = null;
  try {
    const response = await fetch('/api/card', { cache:'no-store' }); const info = await response.json();
    if (response.status === 423) return locked(info);
    if (!response.ok) throw new Error(info.error || 'Kartu belum bisa dibuka.');
    data = info; show();
  } catch {
    root.innerHTML = '<div class="seal">♡</div><h1>Sebentar, ya.</h1><p class="muted">Kartu belum bisa dimuat. Coba lagi sebentar.</p><button id="retry">Coba lagi</button>';
    document.querySelector('#retry').onclick = load;
  }
}
load();
