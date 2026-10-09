const root = document.querySelector('#root');
let data, countdownInterval, retryTimer;
let soundtrack;
function startMusic() {
  if (!soundtrack) {
    soundtrack = new Audio('/api/music');
    soundtrack.loop = true; soundtrack.volume = 0.35; soundtrack.preload = 'none';
    const controls = document.createElement('div'); controls.className = 'music-controls';
    controls.innerHTML = '<span>♫ From The Start · Laufey</span><button type="button" id="music-toggle" aria-label="Putar musik">Putar lagu ♫</button><span id="music-status" class="music-status" role="status"></span>';
    document.body.append(controls);
    const toggle = controls.querySelector('button');
    const update = () => { toggle.textContent = soundtrack.paused ? 'Putar lagu ♫' : 'Jeda musik Ⅱ'; toggle.setAttribute('aria-label',soundtrack.paused ? 'Putar musik' : 'Jeda musik'); };
    soundtrack.addEventListener('play',update); soundtrack.addEventListener('pause',update);
    toggle.onclick = () => {
      if (!soundtrack.paused) soundtrack.pause();
      else playMusic();
    };
  }
  playMusic();
}
function playMusic() {
  document.querySelector('#music-status').textContent = '';
  soundtrack.play().catch(() => {document.querySelector('#music-status').textContent = 'Ketuk Putar lagu untuk mencoba lagi.';});
}
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recipientView = new URLSearchParams(location.search).get('view') === 'recipient';
const banner = () => data?.admin && !recipientView ? '<p class="preview-banner">Pratinjau pribadi · <a href="/?view=recipient">POV Nabila</a> · <a href="/admin">Edit kartu</a></p>' : '';
const bouquet = () => '<div class="bouquet" aria-hidden="true"><span class="stem flower-one"><i>🌸</i></span><span class="stem flower-two"><i>🌼</i></span><span class="stem flower-three"><i>🌷</i></span><span class="stem flower-four"><i>🌸</i></span><span class="stem flower-five"><i>🌼</i></span><span class="bouquet-wrap"></span><span class="bouquet-ribbon">♡</span></div>';
const photoCaptions = ['senyum dulu, bunganya lihat nih ♡', 'empat pose, tetap gemes semua 🤭', 'tim beruang juga ikut ngucapin 🧸', 'bunga kuning & hari yang manis 🌼', 'sibuk sebentar, cute-nya tetap jalan ✨', 'bunganya banyak, tokoh utamanya satu 🌷'];
const album = () => `<div class="photo-grid">${photoCaptions.map((caption,i) => `<figure class="polaroid photo-${i+1}"><span class="photo-tape" aria-hidden="true"></span><div class="photo-window ${i===1||i===2 ? 'screenshot-photo' : ''}"><img src="/api/photo?id=${i+1}" alt="Foto Nabila ${i+1}" loading="lazy" decoding="async" width="490" height="712"></div><figcaption>${caption}</figcaption><span class="photo-flower" aria-hidden="true">${['🌸','♡','🌼','🌷','♡','🌸'][i]}</span></figure>`).join('')}</div>`;
let revealObserver;
function animateCard() {
  revealObserver?.disconnect();
  const letter = root.querySelector('.letter-paper .letter');
  if (letter) letter.innerHTML = letter.textContent.split(/\n\s*\n/).map(text => `<span class="letter-paragraph">${escape(text)}</span>`).join('');
  const flowers = root.querySelector('.letter-flowers');
  if (flowers) flowers.innerHTML = ['🌷','🌸','🌼'].map(f => `<span>${f}</span>`).join(' ');
  if (!document.querySelector('.floating-garden')) {
    const garden = document.createElement('div'); garden.className = 'floating-garden'; garden.setAttribute('aria-hidden','true');
    garden.innerHTML = Array.from({length:12},(_,i) => `<span style="--x:${4+i*8}%;--duration:${12+i%4*3}s;--delay:-${i*2}s">${['♡','✿','🌸','♡','✨','🌼'][i%6]}</span>`).join('');
    document.body.prepend(garden);
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
  }), {threshold:0.08});
  root.querySelectorAll('.letter-paragraph,.polaroid').forEach((el,i) => {
    el.classList.add('reveal-item'); el.style.setProperty('--reveal-delay',`${i%2*120}ms`); revealObserver.observe(el);
  });
}
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
  } else if (step === 4) {
    root.innerHTML = banner() + `<section class="paper game-page"><p class="eyebrow">MISI 01 · TOKO BUNGA MINI</p><h1>Rakit buketmu 🌷</h1><p class="muted">Cari 6 bunga di kebun ini. Awan boleh diketuk juga, tapi nggak bisa masuk vas. 🤭</p><p id="game-score" class="game-score" role="status">Buket: 0 / 6 bunga</p><div class="flower-game" aria-label="Kebun bunga"></div><p id="game-feedback" class="game-feedback" role="status">Nggak pakai timer. Santai, ini ulang tahun, bukan ujian.</p><button class="secondary" id="reset-game">Acak kebunnya ↻</button><button id="next">Lanjut ke tebak-tebakan ✨</button></section>`;
    const reset = () => {
      let score = 0;
      document.querySelector('#game-score').textContent = 'Buket: 0 / 6 bunga';
      document.querySelector('#game-feedback').textContent = 'Nggak pakai timer. Santai, ini ulang tahun, bukan ujian.';
      const tiles = ['🌷','🌸','🌼','🌻','🌺','🌹','☁️','☁️','☁️','☁️','☁️','☁️'];
      for (let i=tiles.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [tiles[i],tiles[j]]=[tiles[j],tiles[i]]; }
      const grid = document.querySelector('.flower-game');
      grid.innerHTML = tiles.map((tile,i)=>`<button class="garden-tile" aria-label="${tile==='☁️'?'Awan':'Ambil bunga'} ${i+1}">${tile}</button>`).join('');
      grid.querySelectorAll('button').forEach((button,i)=> button.onclick = () => {
        if (tiles[i]==='☁️') { button.classList.remove('cloud-boop'); void button.offsetWidth; button.classList.add('cloud-boop'); document.querySelector('#game-feedback').textContent = 'Itu awan, hehe. Yang bikin melayang cukup obrolan kita aja. ☁️'; return; }
        score++; button.disabled=true; button.classList.add('picked'); button.textContent='♡';
        document.querySelector('#game-score').textContent=`Buket: ${score} / 6 bunga`;
        document.querySelector('#game-feedback').textContent = score===6 ? 'Buket lengkap! Bunganya cantik. Tapi yang ngerakit juga nggak kalah. 🤭🌷' : 'Satu bunga lagi buat hari yang lebih manis 🌸';
        if (score===6) confetti();
      });
    };
    reset(); document.querySelector('#reset-game').onclick=reset;
  } else if (step === 5) {
    root.innerHTML = banner() + `<section class="paper game-page"><p class="eyebrow">MISI 02 · KUIS RECEH</p><h1>Tebak dulu,<br><em>senyum kemudian.</em></h1><p class="muted">Tiga soal. Jawaban salah tetap dapat ucapan ulang tahun, kok.</p><div id="quiz-box"></div><p id="quiz-feedback" class="game-feedback" role="status"></p><button id="quiz-next" hidden>Soal berikutnya 🌼</button><button id="next" class="secondary">Lanjut ke kejutan kecil 💌</button></section>`;
    const questions = [
      ['Kenapa bunga di kartu ini nggak layu?', ['Karena virtual','Karena rajin olahraga','Karena minum kopi'],0,'Betul, virtual! Tapi niat bikinnya beneran kok. 🌷'],
      ['Apa yang paling sering bikin aku cek HP?', ['Ramalan cuaca','Notifikasi kamu','Promo panci'],1,'Notifikasi kamu. Promo panci belum bisa diajak ngobrol seru, soalnya. 🤭'],
      ['Hadiah paling cocok buat hari ini?', ['Tugas tambahan','Alarm jam lima','Bunga + doa baik'],2,'Bunga dan doa baik. Bonus: seseorang yang senang bisa kenal kamu. 🌸']
    ];
    let question=0, points=0;
    const renderQuestion = () => {
      const [title,choices,answer,reply]=questions[question];
      document.querySelector('#quiz-box').innerHTML=`<p class="tiny-note">Soal ${question+1} dari 3</p><h2 class="quiz-title">${title}</h2><div class="quiz-choices">${choices.map((text,i)=>`<button class="secondary" data-answer="${i}">${text}</button>`).join('')}</div>`;
      document.querySelector('#quiz-feedback').textContent=''; document.querySelector('#quiz-next').hidden=true;
      document.querySelectorAll('[data-answer]').forEach(button => button.onclick=()=>{
        const correct=Number(button.dataset.answer)===answer; if(correct)points++;
        document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===answer)b.classList.add('correct-answer');});
        document.querySelector('#quiz-feedback').textContent=(correct?'✨ ':'Hehe, jawabannya: ')+reply+(question===2?` Skor ${points}/3. Hadiahnya tetap sama: semoga kamu bahagia!`: '');
        document.querySelector('#quiz-next').hidden=question===2;
        if(question===2)confetti();
      });
    };
    renderQuestion(); document.querySelector('#quiz-next').onclick=()=>{question++;renderQuestion();};
  } else if (step === 6) {
    const notes = ['Kamu tuh kayak lagu favorit. Ngobrolnya sudah selesai, tapi masih kepikiran. 🎶','Bunga di sini ada enam macam. Tapi alasan aku senyum waktu buka chat, biasanya satu. 🤭','Aku nggak jago merangkai bunga. Jadi aku rangkai website dulu. Lumayan, niatnya kelihatan kan? 🌷'];
    root.innerHTML=banner()+`<section class="paper game-page"><p class="eyebrow">TIGA PESAN · SEDIKIT DEG-DEGAN</p><h1>Buka pelan-pelan 💌</h1><p class="muted">Isinya agak receh. Kalau senyum, anggap aja efek bunganya.</p><div class="little-notes">${notes.map((note,i)=>`<button class="note-card" aria-expanded="false"><span class="note-icon" aria-hidden="true">${['🌷','♡','💌'][i]}</span><span class="note-label">Buka pesan ${i+1}</span><span class="note-content" hidden>${escape(note)}</span></button>`).join('')}</div><button id="next">Sekarang, buat satu harapan 🌼</button></section>`;
    document.querySelectorAll('.note-card').forEach(button=>button.onclick=()=>{ const opened=button.getAttribute('aria-expanded')==='true'; button.setAttribute('aria-expanded',String(!opened));button.querySelector('.note-content').hidden=opened;button.querySelector('.note-label').textContent=opened?`Buka pesan ${Array.from(button.parentNode.children).indexOf(button)+1}`:'Tutup pesan'; });
  } else {
    root.innerHTML = banner() + `<section><p class="eyebrow">SEDIKIT BUNGA, BANYAK DOA BAIK</p>${bouquet()}<h1>Make a wish,<br><em>${escape(c.name)}.</em></h1><p class="letter centered">${escape(c.wish)}</p><button id="bloom">Terima bunganya 🌸</button><p id="bloom-message" class="muted bloom-message" role="status"></p><p class="signature">${escape(c.sender)}</p><button class="secondary" id="again">Baca lagi ↻</button></section>`;
    confetti(); document.querySelector('#again').onclick = () => show(0);
    document.querySelector('#bloom').onclick = () => {
      confetti(); document.querySelector('.bouquet').classList.add('bloomed');
      document.querySelector('#bloom-message').textContent = 'Bunga berhasil diterima! Sekarang senyum dulu, biar bunganya nggak minder. 🤭♡';
      document.querySelector('#bloom').textContent = 'Tambah bunga lagi? 🌼';
    };
  }
  const stageNames=['Paket kecil','Ulang tahun','Surat','Album foto','Kebun bunga','Kuis receh','Pesan kecil','Harapan'];
  root.querySelector('section').insertAdjacentHTML('afterbegin',`<p class="chapter-count">${step+1} / 8 · ${stageNames[step]}</p>`);
  if(step>0) {
    const back=document.createElement('button');back.className='secondary chapter-back';back.textContent='← Halaman sebelumnya';back.onclick=()=>{show(step-1);window.scrollTo({top:0,behavior:'instant'});};root.querySelector('section').append(back);
  }
  animateCard();
  const next = document.querySelector('#next'); if (next) next.onclick = () => { if(step===0) startMusic(); show(step+1); window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); };
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
