import Runtime from './runtime';
import { wrap, rootProps } from '@/lib/site/render';

// Satu komponen untuk semua halaman: HTML dari lib/site/pages.js + runtime animasi.
export default function SitePage({ html, intro = false }) {
  return (
    <>
      <div {...rootProps()} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--body)', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'clip' }} dangerouslySetInnerHTML={{ __html: wrap(html) }} />
      <Runtime intro={intro} />
    </>
  );
}
