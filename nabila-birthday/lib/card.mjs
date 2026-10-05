export const opensAt = '2026-10-10T00:00:00+07:00';
export const isOpen = (now = Date.now()) => now >= Date.parse(opensAt);
export const initialCard = {
  name: 'Nabila', sender: 'Dari aku, yang sayang kamu',
  title: 'Selamat ulang tahun, sayang.',
  intro: 'Hari ini dunia terasa sedikit lebih indah. Karena hari ini, kamu lahir.',
  message: 'Nabila, terima kasih sudah hadir dan jadi bagian paling hangat dalam hari-hariku.\n\nSemoga di usia yang baru ini, kamu selalu dikelilingi hal-hal baik, diberi kesehatan, dan dimudahkan setiap langkah menuju mimpi-mimpimu.\n\nAku mungkin belum bisa memberikan seluruh dunia, tapi aku ingin selalu ada untuk menemanimu menjalaninya. Tetap jadi kamu yang aku sayangi, ya.\n\nSelamat ulang tahun. Aku sayang kamu. ♡',
  wish: 'Semoga semua doa kecil yang kamu simpan diam-diam, satu per satu menemukan jalannya.'
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
