// Membungkus HTML halaman: memetakan warna ke variabel tema, menukar logo terang/gelap,
// lalu memberi atribut yang dibaca runtime (URL & anon key Supabase untuk formulir).
import { themeTx, swapLogos } from './theme';
import { A } from './ui';

export function wrap(html) {
  return swapLogos(themeTx(html), A.logo, A.logoBlue);
}
export const rootProps = () => ({
  'data-root': '1',
  'data-sb-url': process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  'data-sb-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
});
