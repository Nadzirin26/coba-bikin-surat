const root = document.querySelector('#root');
let data, countdownInterval, retryTimer;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recipientView = new URLSearchParams(location.search).get('view') === 'recipient';
const banner = () => data?.admin && !recipientView ? '<p class="preview-banner">Pratinjau pribadi · <a href="/?view=recipient">POV Nabila</a> · <a href="/admin">Edit kartu</a></p>' : '';
const bouquet = () => '<div class="bouquet" aria-hidden="true"><span class="stem flower-one"><i>🌸</i></span><span class="stem flower-two"><i>🌼</i></span><span class="stem flower-three"><i>🌷</i></span><span class="stem flower-four"><i>🌸</i></span><span class="stem flower-five"><i>🌼</i></span><span class="bouquet-wrap"></span><span class="bouquet-ribbon">♡</span></div>';
const photoCaptions = ['senyum dulu, bunganya lihat nih ♡', 'empat pose, tetap gemes semua 🤭', 'tim beruang juga ikut ngucapin 🧸', 'bunga kuning & hari yang manis 🌼', 'sibuk sebentar, cute-nya tetap jalan ✨', 'bunganya banyak, tokoh utamanya satu 🌷'];
const album = () => `<div class="photo-grid">${photoCaptions.map((caption,i) => `<figure class="polaroid photo-${i+1}"><span class="photo-tape" aria-hidden="true"></span><div class="photo-window ${i===1||i===2 ? 'screenshot-photo' : ''}"><img src="/api/photo?id=${i+1}" alt="Foto Nabila ${i+1}" loading="lazy" decoding="async" width="490" height="712"></div><figcaption>${caption}</figcaption><span class="photo-flower" aria-hidden="true">${['🌸','♡','🌼','🌷','♡','🌸'][i]}</span></figure>`).join('')}</div>`;
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 42; i++) {
    const bit = document.createElement('i'); bit.className = 'confetti';
    bit.setAttribute('aria-hidden', 'true');
    bit.textContent = ['♡', '🌸', '✿', '🌼'][i % 4];
    bit.style.setProperty('--fall-x', `${Math.random()*100}%`); bit.style.animationDelay = `${Math.random()}s`;
    bit.style.color = ['#bd7484','#e7baa2','#c7a46c'][i%3];
    document.body.append(bit); setTimeout(() => bit.remove(), 4500);
  }
}
function show(step = 0) {
  const c = data.card;
  if (step === 0) {
    root.innerHTML = banner() + `<section><p class="eyebrow">10 OKTOBER 2026 · SPECIAL DELIVERY</p><span class="sticker">buat kamu yang hari ini ulang tahun ♡</span><h1>Halo, ${escape(c.name)}!<br><em>Ada paket kecil.</em></h1><p class="muted">Isinya bunga, doa baik, dan sedikit keisengan.<br>Boleh dibuka. Nggak ada tagihan kok. 🤭</p>${bouquet()}<button id="next">Buka dulu, penasaran kan? 💌</button><p class="tiny-note">100% bebas ongkir · 200% niat bikinnya</p></section>`;
  } else if (step === 1) {
    root.innerHTML = banner() + `<section class="paper birthday-note"><p class="eyebrow">HARI INI KAMU TOKOH UTAMANYA</p><div class="cake" aria-hidden="true">🎂</div><h1>${escape(c.title)}</h1><p class="letter centered">${escape(c.intro)}</p><span class="sticker">level baru unlocked ✨</span><p class="muted">Oke, sekarang ada sedikit tulisan.<br>Tenang, bukan tugas kuliah.</p><button id="next">Baca surat kecilnya 💌</button></section>`;
    confetti();
  } else if (step === 2) {
    root.innerHTML = banner() + `<section class="paper letter-paper"><div class="letter-flowers" aria-hidden="true">🌷 🌸 🌼</div><p class="eyebrow">SEBUAH SURAT KECIL UNTUKMU</p><h2>Dear ${escape(c.name)}, ♡</h2><p class="letter">${escape(c.message)}</p><p class="signature">${escape(c.sender)}</p><button id="next">Masih ada bunga buatmu 🌷</button></section>`;
  } else if (step === 3) {
    root.innerHTML = banner() + `<section class="scrapbook"><p class="eyebrow">SOME LITTLE THINGS ABOUT YOU</p><span class="sticker">bukti kalau kamu & bunga itu satu tema ♡</span><h1>Enam foto,<br><em>banyak senyum.</em></h1><p class="muted">Album kecil buat tokoh utama hari ini.<br>Geser ke bawah, ada versi gemesnya juga. 🤭</p>${album()}<p class="album-note">PS: bunga boleh layu, foto-foto ini jangan. 🌷</p><button id="next">Sekarang, bunga buatmu 🌸</button></section>`;
  } else {
    root.innerHTML = banner() + `<section><p class="eyebrow">SEDIKIT BUNGA, BANYAK DOA BAIK</p>${bouquet()}<h1>Make a wish,<br><em>${escape(c.name)}.</em></h1><p class="letter centered">${escape(c.wish)}</p><button id="bloom">Terima bunganya 🌸</button><p id="bloom-message" class="muted bloom-message" role="status"></p><p class="signature">${escape(c.sender)}</p><button class="secondary" id="again">Baca lagi ↻</button></section>`;
    confetti(); document.querySelector('#again').onclick = () => show(0);
    document.querySelector('#bloom').onclick = () => {
      confetti(); document.querySelector('.bouquet').classList.add('bloomed');
      document.querySelector('#bloom-message').textContent = 'Bunga berhasil diterima! Sekarang senyum dulu, biar bunganya nggak minder. 🤭♡';
      document.querySelector('#bloom').textContent = 'Tambah bunga lagi? 🌼';
    };
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
