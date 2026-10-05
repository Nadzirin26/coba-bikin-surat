export const opensAt = '2026-10-10T00:00:00+07:00';
export const isOpen = (now = Date.now()) => now >= Date.parse(opensAt);
export const initialCard = {
  name: 'Nabila', sender: 'Dari aku, teman ngobrol favoritmu (semoga) 🌷',
  title: 'Happy birthday, Nabila! 🌸',
  intro: 'Hari ini kamu boleh jadi pusat perhatian. Besok juga boleh sih, tapi hari ini ada kuenya. 🎂',
  message: 'Hai Nabila! 🌷\n\nSelamat ulang tahun buat orang yang akhir-akhir ini berhasil bikin notifikasi HP jadi lebih menarik. Iya, kamu. Jangan pura-pura nggak tahu, hehe.\n\nSemoga di umur yang baru ini kamu sehat terus, lebih sering ketawa, dan hal-hal yang kamu usahakan pelan-pelan jadi kenyataan. Semoga harimu penuh bunga, makanan enak, dan orang-orang yang bikin kamu nyaman.\n\nMakasih ya, udah jadi teman ngobrol yang selalu seru. Ngobrol sama kamu tuh kadang bikin lupa waktu… dan lupa kalau besok harus bangun pagi. Tapi nggak apa-apa, worth it kok. 😌\n\nAku titip satu permintaan kecil: jangan lupa bahagia. Kalau lagi capek, istirahat dulu. Bunga aja butuh disiram, masa kamu disuruh kuat terus?\n\nEnjoy your day, Nabila! Semoga senyummu hari ini lebih banyak daripada lilin di kue. Tenang, aku nggak akan nanya jumlahnya. 🤭',
  wish: 'Semoga semua doa baikmu mekar satu per satu. Kalau hari ini belum dapat bunga beneran, yang virtual dulu ya… nggak perlu disiram, anti layu! 🌼'
};
export function validateCard(data) {
  const limits = { name: 80, sender: 120, title: 160, intro: 500, message: 8000, wish: 1000 };
  const result = {};
  for (const [key, max] of Object.entries(limits)) {
    if (typeof data?.[key] !== 'string' || !data[key].trim() || data[key].length > max) throw new Error('Isi semua kolom sesuai batas panjangnya.');
    result[key] = data[key].trim();
  }
  return result;
}
