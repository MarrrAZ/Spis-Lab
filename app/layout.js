import './globals.css';
import { loadContent } from '@/lib/site/data';

export const revalidate = 0;

export async function generateMetadata() {
  const c = await loadContent();
  return {
    title: { default: `${c('seo.site')} — Signal Processing for Intelligent System | Telkom University`, template: `${c('seo.site')} — %s` },
    description: c('seo.description'),
  };
}

export default async function RootLayout({ children }) {
  const c = await loadContent();
  const def = c('theme.default') === 'light' ? 'light' : 'dark';
  // Tema dipasang sebelum halaman tampil supaya tidak berkedip.
  const boot = `(function(){try{var t=localStorage.getItem('spis-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:'${def}')}catch(e){document.documentElement.setAttribute('data-theme','${def}')}})()`;
  return (
    <html lang="id" data-theme={def} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
