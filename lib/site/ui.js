// Bagian-bagian tampilan website (diport dari mockup desain v8).
// Semua fungsi mengembalikan string HTML; teks dari database selalu di-escape.
import { TOGGLE } from './theme';

export const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const MONO = "font-family: 'IBM Plex Mono', ui-monospace, monospace";
export const SORA = 'font-family: Sora, system-ui, sans-serif';
export const INK = '#F2F5FF', BODY = '#AFBCD9', DIM = '#8FA6D9', LINE = 'rgba(140,155,192,.2)';
export const WRAP = 'max-width: 1280px; margin: 0 auto; padding-left: clamp(20px, 4vw, 48px); padding-right: clamp(20px, 4vw, 48px); box-sizing: border-box';
export const A = { logo: '/assets/logo-white.png', logoBlue: '/assets/logo-blue.png', noglyph: '/assets/logo-white-noglyph.png', group: '/assets/group.webp' };
const dl = (i, step = 0.08) => (i * step).toFixed(2);
export const shortName = (n) => String(n || '').split(',')[0].replace(/\s+(S\.T\.|S\.Si\.|M\.T\.|Ph\.D\.|S\.Kom\.).*$/i, '').trim();
export const titleCase = (n) => String(n || '').toLowerCase().replace(/(^|[\s'(.-])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase()).replace(/\b(S\.t\.|M\.t\.|S\.si\.|Ph\.d\.|Dr\.|Ir\.)/gi, (m) => ({ 's.t.': 'S.T.', 'm.t.': 'M.T.', 's.si.': 'S.Si.', 'ph.d.': 'Ph.D.', 'dr.': 'Dr.', 'ir.': 'Ir.' }[m.toLowerCase()] || m));
// Nama dari database sering ditulis KAPITAL semua: ubah kata kapital (≥2 huruf) jadi Kapital Awal, gelar tetap.
export const nice = (n) => String(n || '').replace(/[A-Z][A-Z'’]+/g, (w) => (/^(S|M|T|D|PH)$/.test(w) ? w : w[0] + w.slice(1).toLowerCase()));
const isExt = (u) => /^https?:\/\//.test(u || '');

export function mono(text, color = DIM, size = 12, extra = '') {
  return `<p style="margin: 0; ${MONO}; font-size: ${size}px; letter-spacing: .18em; text-transform: uppercase; color: ${color}${extra}">${text}</p>`;
}
export function btn(label, href, kind = 'fill', arrow = true, big = false) {
  const h = big ? 58 : 54;
  const st = kind === 'fill' ? 'background-color: #FFFFFF; color: #03060F' : 'border: 1px solid rgba(232,238,255,.4); color: #E8EEFF; box-sizing: border-box';
  const cls = kind === 'fill' ? 'mag mag-fill' : 'mag mag-line';
  return `<a class="${cls}" data-mag="1" href="${e(href)}"${isExt(href) ? ' target="_blank" rel="noopener"' : ''} style="display: inline-flex; align-items: center; gap: 10px; min-height: ${h}px; padding: 0 28px; border-radius: 999px; ${st}; ${MONO}; font-size: 13px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; text-decoration: none">${e(label)}${arrow ? ' <span aria-hidden="true">→</span>' : ''}</a>`;
}

export const NAV = [['home', '/'], ['about', '/tentang'], ['achievement', '/pencapaian'], ['abdimas', '/abdimas'], ['recruitment', '/rekrutmen'], ['organigram', '/organigram'], ['projects', '/projects']];

export function header(c, active, { replay = false } = {}) {
  const links = NAV.map(([k, href]) => `<a href="${href}"${k === active ? ' aria-current="page"' : ''} style="color: ${k === active ? '#FFFFFF' : '#AFBCD9'}; text-decoration: none; display: inline-flex; align-items: center; min-height: 44px">${e(c('nav.' + k))}</a>`).join('');
  const rp = replay ? `<button type="button" data-replay="1" style="min-height: 36px; padding: 0 14px; background: transparent; color: #AFC6FF; border: 1px solid rgba(175,198,255,.35); border-radius: 999px; font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer">${e(c('nav.intro'))}</button>` : '';
  const all = [...NAV, ['people', '/tim'], ['lab', '/lab-activities']];
  const mlinks = all.map(([k, href], i) => `<a href="${href}" style="color: ${k === active ? '#FFFFFF' : '#AFBCD9'}; text-decoration: none; ${SORA}; font-weight: 700; font-size: 34px; letter-spacing: -.02em; transition-delay: ${(i * 0.04).toFixed(2)}s">${e(c('nav.' + k))}</a>`).join('');
  return `<header style="position: absolute; top: 0; left: 0; right: 0; z-index: 20">
<div style="${WRAP}; min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 8px 28px">
<a href="/" aria-label="SPIS Laboratory, ke Home" style="display: flex; align-items: center; min-height: 44px"><img src="${A.logo}" alt="SPIS Laboratory" style="height: 32px; width: auto; display: block"></a>
<nav class="nav-desk" aria-label="Menu utama" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 26px; ${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase">${links}${TOGGLE}${rp}</nav>
<div class="thm-mob" style="margin-left: auto; align-items: center">${TOGGLE}</div>
<button type="button" class="nav-burger" data-menu-open="1" aria-expanded="false" aria-label="Buka menu" style="min-width: 48px; min-height: 48px; align-items: center; justify-content: center; gap: 0; background: transparent; border: 1px solid rgba(232,238,255,.3); border-radius: 999px; color: #FFFFFF; cursor: pointer; padding: 0 16px; ${MONO}; font-size: 12px; letter-spacing: .14em">${e(c('nav.menu'))}</button>
</div>
</header>
<div data-menu="1" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 40; background: rgba(3,6,15,.97); display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 90px 28px 40px; box-sizing: border-box; overflow: auto">
${mlinks}
<button type="button" data-menu-open="1" aria-label="Tutup menu" style="position: absolute; top: 18px; right: 20px; min-width: 48px; min-height: 48px; background: transparent; border: 1px solid rgba(232,238,255,.3); border-radius: 999px; color: #FFFFFF; cursor: pointer; padding: 0 16px; ${MONO}; font-size: 12px; letter-spacing: .14em">${e(c('nav.close'))}</button>
</div>`;
}

export function footer(c) {
  const col = (title, items) => `<nav aria-label="${e(title)}" style="display: flex; flex-direction: column; gap: 2px; font-size: 14.5px"><span style="${MONO}; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #6F7FA6; margin-bottom: 8px">${e(title)}</span>`
    + items.map(([t, h]) => `<a href="${e(h)}"${isExt(h) ? ' target="_blank" rel="noopener"' : ''} style="color: #DCE4F7; text-decoration: none; min-height: 32px; display: flex; align-items: center">${e(t)}</a>`).join('') + '</nav>';
  const social = (Array.isArray(c('footer.social')) ? c('footer.social') : []).filter((s) => s && s.label).map((s) => [s.label, s.url || '#']);
  return `<footer style="position: relative; overflow: hidden; margin-top: 40px; background: linear-gradient(180deg, #08112A 0%, #050914 100%); border-top: 1px solid rgba(111,155,255,.3); border-radius: 36px 36px 0 0">
<span aria-hidden="true" style="position: absolute; top: 0; left: 8%; right: 8%; height: 1px; background: linear-gradient(90deg, rgba(61,123,255,0), #7FA4FF, rgba(61,123,255,0))"></span>
<span aria-hidden="true" style="position: absolute; top: -140px; left: 50%; width: 900px; height: 280px; transform: translateX(-50%); background: radial-gradient(ellipse at 50% 50%, rgba(61,123,255,.22), rgba(61,123,255,0) 70%); pointer-events: none"></span>
<img src="${A.logo}" alt="" aria-hidden="true" style="position: absolute; right: -3%; bottom: -12%; width: min(820px, 70%); height: auto; opacity: .045; pointer-events: none">
<div style="position: relative; ${WRAP}; padding-top: 64px; padding-bottom: 28px; display: flex; flex-direction: column; gap: 44px">
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr)); gap: 36px">
<div style="display: flex; flex-direction: column; gap: 16px"><img src="${A.logo}" alt="SPIS Laboratory" style="height: 30px; width: auto; align-self: flex-start"><p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${DIM}">${e(c('footer.desc'))}</p></div>
${col(c('footer.col_explore'), [[c('footer.l_about'), '/tentang'], [c('footer.l_achievement'), '/pencapaian'], [c('footer.l_abdimas'), '/abdimas'], [c('footer.l_recruitment'), '/rekrutmen'], [c('footer.l_lab'), '/lab-activities']])}
${col(c('footer.col_org'), [[c('footer.l_org'), '/organigram'], [c('footer.l_people'), '/tim'], [c('footer.l_projects'), '/projects'], [c('footer.l_login'), c('footer.login_url')]])}
${col(c('footer.col_social'), social)}
<div style="display: flex; flex-direction: column; gap: 6px; font-size: 14.5px; line-height: 1.55; color: #DCE4F7"><span style="${MONO}; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #6F7FA6; margin-bottom: 4px">${e(c('footer.col_contact'))}</span><span>${e(c('footer.building'))}</span><span style="color: ${DIM}">${e(c('footer.address'))}</span><span>${e(c('footer.phone'))}</span></div>
</div>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding-top: 22px; border-top: 1px solid ${LINE}; ${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #6F7FA6"><span>${e(c('footer.copyright'))}</span><span>${e(c('footer.hashtags'))}</span></div>
</div>
</footer>`;
}

export function pageHero(kicker, title, sub, extra = '', variant = 'field', minh = 560) {
  const bg = variant === 'field' ? '<canvas data-cv="field" data-lines="30" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block"></canvas>' : variant;
  return `<section style="position: relative; min-height: ${minh}px; display: flex; align-items: flex-end; overflow: hidden; background: radial-gradient(ellipse at 70% 40%, rgba(11,30,77,.95) 0%, rgba(11,30,77,0) 65%)">
${bg}
<div style="position: relative; z-index: 2; width: 100%; ${WRAP}; padding-top: 150px; padding-bottom: 72px; display: flex; flex-direction: column; gap: 22px">
<p data-reveal="1" style="margin: 0; display: flex; align-items: center; gap: 12px; ${MONO}; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: #8FA6D9"><span aria-hidden="true" style="width: 28px; height: 1px; background: #8FA6D9"></span>${e(kicker)}</p>
<h1 data-reveal="1" style="margin: 0; max-width: 980px; ${SORA}; font-weight: 800; font-size: clamp(40px, 6vw, 88px); line-height: .98; letter-spacing: -.04em; color: ${INK}">${e(title)}</h1>
${sub ? `<p data-reveal="1" style="margin: 0; max-width: 620px; font-size: 18px; line-height: 1.65; color: ${BODY}">${e(sub)}</p>` : ''}
${extra}
</div>
</section>`;
}

export function h2(html, sub = null, link = null) {
  const lk = link ? `<a href="${e(link[1])}" style="display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase">${e(link[0])} →</a>` : '';
  const sb = sub ? `<p style="margin: 0; flex: 0 1 380px; font-size: 16px; line-height: 1.7; color: ${BODY}">${e(sub)}</p>` : '';
  return `<div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px 64px"><h2 data-reveal="1" style="margin: 0; flex: 1 1 480px; ${SORA}; font-weight: 700; font-size: clamp(32px, 4.2vw, 60px); line-height: 1.02; letter-spacing: -.03em; color: ${INK}">${html}</h2>${sb}${lk}</div>`;
}

export function researchCards(items) {
  return items.map((r, i) => `<article class="spot" data-spot="1" data-card="1" data-reveal="1" style="position: relative; border: 1px solid ${LINE}; border-radius: 20px; background-color: #070C1A; overflow: hidden; display: flex; flex-direction: column; transition-delay: ${dl(i)}s">
<canvas data-mini="${e(r.visual || 'wave')}" aria-hidden="true" style="display: block; width: 100%; height: 220px"></canvas>
<div style="padding: 20px 24px 26px; display: flex; flex-direction: column; gap: 10px"><span style="${MONO}; font-size: 12px; letter-spacing: .14em; color: #7FA4FF">${e(r.label)}</span><h3 style="margin: 0; ${SORA}; font-weight: 600; font-size: 22px; color: ${INK}">${e(r.title)}</h3><p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: ${BODY}">${e(r.desc)}</p></div>
</article>`).join('');
}

export function pubRows(c, pubs, details = false) {
  return pubs.map((p) => {
    const venue = p.venue || '';
    const short = venue.includes('(') ? venue.split('(').pop().replace(/\)$/, '') : venue;
    const authors = p.authors || (p.authorNames || []).join(', ');
    if (details) {
      return `<details class="prow" data-tags="${e(p.type)} y${e(p.year)}" style="border-top: 1px solid ${LINE}">
<summary style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px 40px; padding: 30px 0">
<span style="flex: 0 0 150px; ${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #7FA4FF">${e(p.year || '')}${short ? ' · ' + e(short.slice(0, 18)) : ''}</span>
<span class="tt" style="flex: 1 1 520px; ${SORA}; font-weight: 500; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.4; color: #DCE4F7">${e(p.title)}</span>
<span class="ar" aria-hidden="true" style="font-size: 22px; color: #AFC6FF">→</span>
</summary>
<div style="display: flex; flex-wrap: wrap; gap: 18px 40px; padding: 0 0 34px">
<span style="flex: 0 0 150px"></span>
<div style="flex: 1 1 520px; display: flex; flex-direction: column; gap: 14px">
${authors ? `<p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #DCE4F7">${e(authors)}</p>` : ''}
${venue ? `<p style="margin: 0; ${MONO}; font-size: 12.5px; letter-spacing: .04em; color: ${DIM}">${e(venue)}</p>` : ''}
${p.description ? `<p style="margin: 0; font-size: 15px; line-height: 1.7; color: ${BODY}">${e(p.description)}</p>` : ''}
${p.link ? `<a href="${e(p.link)}" target="_blank" rel="noopener" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase">${e(c('ach.link'))} →</a>` : ''}
</div></div>
</details>`;
    }
    const first = authors.split(', ');
    return `<a class="prow" href="/pencapaian" style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px 48px; padding: 32px 0; border-top: 1px solid ${LINE}; text-decoration: none; color: inherit">
<span style="flex: 0 0 170px; ${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #7FA4FF">${e(p.year || '')}${short ? ' · ' + e(short.slice(0, 18)) : ''}</span>
<span class="tt" style="flex: 1 1 520px; ${SORA}; font-weight: 500; font-size: clamp(18px, 1.6vw, 22px); line-height: 1.4; color: #DCE4F7">${e(p.title)}</span>
<span style="flex: 0 0 200px; font-size: 14px; color: ${DIM}">${e(first.length > 1 ? first[0] + ' dkk.' : authors)}</span>
<span class="ar" aria-hidden="true" style="font-size: 22px; color: #AFC6FF">→</span>
</a>`;
  }).join('');
}

// ---------------------------------------------------------------- visual kartu rekrutmen
const SIL = '<svg viewBox="0 0 100 110" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"><defs><linearGradient id="silg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D7BFF" stop-opacity=".75"></stop><stop offset="1" stop-color="#1B2B55" stop-opacity=".9"></stop></linearGradient></defs><circle cx="50" cy="38" r="19" fill="url(#silg)"></circle><path d="M14 112 C14 82 30 66 50 66 C70 66 86 82 86 112 Z" fill="url(#silg)"></path><text x="50" y="46" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" opacity=".92">?</text></svg>';

export function rvMarkup(v, asisten = []) {
  if (v === 'id') {
    let wave = 'M0 10'; for (let x = 0; x <= 150; x += 3) wave += ` L${x} ${(10 + (x % 12 === 3 ? 6 : x % 12 === 9 ? -6 : 0) * (x > 30 && x < 120 ? 1 : 0.35)).toFixed(1)}`;
    return `<div class="rv-in rv-id" style="align-items: flex-start"><div class="idsway" style="position: relative; display: flex; flex-direction: column; align-items: center; margin-top: 0">
<span aria-hidden="true" style="width: 1.15em; height: 3.2em; background: repeating-linear-gradient(180deg, #3D7BFF 0 .9em, #2F63D6 .9em 1.8em); border-radius: 0 0 .2em .2em"></span>
<span aria-hidden="true" style="width: 2.2em; height: .9em; margin-top: -.15em; border-radius: .25em; background: linear-gradient(180deg, #DCE4F7, #8FA6D9)"></span>
<div class="idcard" data-tilt="1" style="position: relative; margin-top: -.25em; width: 13.6em; height: 19em; border-radius: 1em; overflow: hidden; background: linear-gradient(160deg, #12285F 0%, #0A1638 45%, #060D22 100%); border: 1px solid rgba(175,198,255,.4); box-shadow: 0 1.6em 3em rgba(0,0,0,.55); display: flex; flex-direction: column; gap: .7em; padding: 1.1em 1.1em 1em; box-sizing: border-box">
<div style="display: flex; align-items: center; justify-content: space-between; margin-top: .55em"><img src="${A.logo}" alt="" style="height: 1.15em; width: auto"><span style="${MONO}; font-size: .5em; letter-spacing: .16em; color: #AFC6FF">LAB ASSISTANT</span></div>
<div style="display: flex; gap: .8em; align-items: flex-end"><div style="position: relative; flex: 0 0 auto; width: 5.6em; height: 6.6em; border-radius: .6em; overflow: hidden; background: radial-gradient(ellipse at 50% 30%, #1B3D9C 0%, #0B1530 75%); border: 1px solid rgba(175,198,255,.35)">${SIL}<span class="scanl" aria-hidden="true" style="position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, rgba(175,198,255,0), #DCE8FF, rgba(175,198,255,0))"></span></div>
<div style="display: flex; flex-direction: column; gap: .35em; min-width: 0"><span style="${MONO}; font-size: .48em; letter-spacing: .14em; color: #8FA6D9">STATUS</span><span style="display: inline-flex; align-items: center; gap: .35em; ${MONO}; font-size: .62em; color: #DCE4F7"><span class="pulse" style="width: .5em; height: .5em; border-radius: 50%; background: #7FA4FF"></span>OPEN</span></div></div>
<div style="display: flex; flex-direction: column; gap: .25em"><span style="${SORA}; font-weight: 700; font-size: 1.12em; line-height: 1.15; color: #FFFFFF; white-space: nowrap"><span data-type='["Nama Kamu","Mahasiswa S1 / S2","Siapa berikutnya?"]'>Nama Kamu</span><span class="caret" aria-hidden="true"></span></span><span style="${MONO}; font-size: .56em; letter-spacing: .12em; color: #AFC6FF">ASISTEN RISET</span></div>
<svg viewBox="0 0 150 20" preserveAspectRatio="none" aria-hidden="true" style="width: 100%; height: 1.2em; margin-top: auto"><path d="${wave}" style="fill: none; stroke: #7FA4FF; stroke-width: 1.2"></path></svg>
<span class="idsheen" aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none"></span>
</div></div></div>`;
  }
  if (v === 'slots') {
    const list = asisten.slice(0, 11);
    let cells = list.map((a, i) => `<div class="slot" data-slot="${i}" style="position: relative; display: flex; justify-content: center"><span style="display: block; width: 4.2em; height: 4.2em; border-radius: 50%; overflow: hidden; border: 1px solid rgba(127,164,255,.55); background: #0B1530">${a.photo_url ? `<img src="${e(a.photo_url)}" alt="${e(nice(shortName(a.name)))}" style="width: 100%; height: 100%; object-fit: cover; object-position: top; display: block">` : ''}</span><span class="nm" style="position: absolute; left: 50%; top: 100%; margin-top: .35em; white-space: nowrap; ${MONO}; font-size: .5em; color: #DCE4F7; background: rgba(3,6,15,.85); padding: .3em .6em; border-radius: .4em; pointer-events: none; z-index: 3">${e(nice(shortName(a.name)).split(' ')[0])}</span></div>`).join('');
    cells += `<div data-slot="${list.length}" data-slot-target="1" style="position: relative; display: flex; flex-direction: column; align-items: center"><span class="glowp" style="position: relative; display: flex; align-items: center; justify-content: center; width: 4.2em; height: 4.2em; border-radius: 50%; background: radial-gradient(circle, rgba(61,123,255,.35), rgba(61,123,255,.05) 70%)"><span class="spin" aria-hidden="true" style="position: absolute; inset: 0; border-radius: 50%; border: 1.5px dashed rgba(232,238,255,.85)"></span><span style="${SORA}; font-weight: 800; font-size: 1.9em; color: #FFFFFF">?</span></span><span style="position: absolute; top: 100%; margin-top: .45em; ${MONO}; font-size: .55em; letter-spacing: .14em; color: #FFFFFF; white-space: nowrap">KAMU?</span></div>`;
    return `<div class="rv-in rv-slots" style="flex-direction: column; gap: 1.6em"><div data-slot-grid="1" style="position: relative; display: grid; grid-template-columns: repeat(6, 4.2em); gap: 1.7em 1.1em"><canvas data-cv="slotnet" aria-hidden="true" style="position: absolute; left: -1em; top: -1em; width: calc(100% + 2em); height: calc(100% + 2em); pointer-events: none; z-index: 0"></canvas>${cells}</div><span style="${MONO}; font-size: .6em; letter-spacing: .16em; color: #8FA6D9; margin-top: .8em">${list.length} ASISTEN · 1 KURSI KOSONG</span></div>`;
  }
  if (v === 'term') {
    const lines = ['$ ./scan --lab SPIS', '› memindai kandidat ........ ditemukan', '› filter: S1/S2 · minat signal processing / AI', '› kecocokan tertinggi ██████████ 99%', '› nama: **[ menunggu kamu ]**', '$ daftar --sekarang'];
    return `<div class="rv-in rv-term"><div style="width: 29em; border-radius: .9em; overflow: hidden; border: 1px solid rgba(175,198,255,.3); background: rgba(3,6,15,.82)"><div style="display: flex; align-items: center; gap: .45em; padding: .7em .9em; border-bottom: 1px solid rgba(175,198,255,.18)"><span style="width: .65em; height: .65em; border-radius: 50%; background: #FF8A8A"></span><span style="width: .65em; height: .65em; border-radius: 50%; background: #FFD27A"></span><span style="width: .65em; height: .65em; border-radius: 50%; background: #7FE0A8"></span><span style="margin-left: .6em; ${MONO}; font-size: .62em; color: #8FA6D9">spis@lab: ~/recruitment</span></div><div data-term='${e(JSON.stringify(lines))}' style="padding: 1em 1.1em .4em; min-height: 10.5em; ${MONO}; font-size: .74em; line-height: 1.75; color: #AFBCD9; white-space: pre-wrap"></div><canvas data-mini="wave" aria-hidden="true" style="display: block; width: 100%; height: 3.4em"></canvas></div></div>`;
  }
  return '<canvas data-cv="halo" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block"></canvas>';
}
export const rvStage = (v, h, asisten, extra = '') => `<div class="rv-stage" style="height: ${h}px; ${extra}">${rvMarkup(v, asisten)}</div>`;

export function ctaRecruit(c, rec, asisten) {
  if (!rec || (!rec.is_open && !c('home.cta.show_closed'))) return '';
  const v = rec.card_visual || 'halo';
  return `<section style="${WRAP}; padding-bottom: 120px">
<div style="position: relative; border-radius: 28px; overflow: hidden; background: radial-gradient(ellipse at 78% 40%, #0B1E4D 0%, #060D22 70%); border: 1px solid rgba(111,155,255,.28); display: flex; flex-wrap: wrap; align-items: stretch">
<div style="flex: 1.25 1 440px; padding: clamp(28px, 5vw, 60px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 18px">${mono(e(rec.is_open ? c('home.cta.kicker') : c('home.cta.kicker_closed')), '#AFC6FF')}
<h2 style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(30px, 3.3vw, 48px); line-height: 1.04; letter-spacing: -.035em; color: #FFFFFF">${e(rec.title)}</h2>
<p style="margin: 0; max-width: 460px; font-size: 16.5px; line-height: 1.65; color: #DCE4F7">${e(c('home.cta.sub'))}</p>
<div style="margin-top: 8px">${btn(c('home.cta.btn'), '/rekrutmen', 'fill', true, true)}</div></div>
<div style="flex: 1 1 420px; min-width: 0; padding: 24px clamp(16px, 3vw, 40px); box-sizing: border-box; display: flex; align-items: center">${rvStage(v, 380, asisten, 'width: 100%')}</div>
</div></section>`;
}

export const SKY = '<div data-sky="1" aria-hidden="true"><div data-sky-a="1"></div><div data-sky-b="1"></div><div data-sky-c="1"></div></div>';
const GLYPH_PATH = 'M2.5 42 L2.5 65 A6.0 6.0 0 0 0 14.5 65 L14.5 15 A6.0 6.0 0 0 1 26.5 15 L26.5 85 A5.5 5.5 0 0 0 37.5 85 L37.5 3 A6.0 6.0 0 0 1 49.5 3 L49.5 96 A6.0 6.0 0 0 0 61.5 96 L61.5 25 A6.0 6.0 0 0 1 73.5 25 L73.5 83 A6.0 6.0 0 0 0 85.5 83 L85.5 38 A5.5 5.5 0 0 1 96.5 38 L96.5 57';

export function introOverlay(c) {
  return `<div data-intro="1" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 60; background: #000000">
<canvas data-cv="intro" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; cursor: crosshair"></canvas>
<div data-flash="1" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none; background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #D6E2FF 30%, rgba(61,123,255,.35) 60%, rgba(3,6,15,0) 85%)"></div>
<div data-logo-box="1" style="position: absolute; left: 50%; top: 50%; width: min(560px, 74vw); aspect-ratio: 946 / 265; transform: translate(-50%, -50%); pointer-events: none">
<img data-word="1" src="${A.noglyph}" alt="SPIS Laboratory" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; opacity: 0">
<div data-glyph="1" aria-hidden="true" style="position: absolute; left: 63.14%; top: -1.03%; width: 7.76%; aspect-ratio: 1 / 1; opacity: 0"><svg viewBox="-4 -4 108 108" style="display: block; width: 100%; height: 100%; overflow: visible"><path data-glyph-path="1" d="${GLYPH_PATH}" style="fill: none; stroke: #FFFFFF; stroke-width: 6.4; stroke-linecap: round; stroke-linejoin: round"></path></svg></div>
</div>
<p data-intro-cap="1" style="position: absolute; left: 0; right: 0; bottom: 9%; margin: 0; text-align: center; ${MONO}; font-size: 12px; letter-spacing: .26em; text-transform: uppercase; color: #8FA6D9; opacity: 0">${e(c('intro.caption'))}</p>
<p style="position: absolute; left: 32px; bottom: 26px; margin: 0; ${MONO}; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #6F7FA6">${e(c('intro.tagline'))}</p>
<button type="button" data-skip="1" style="position: absolute; right: 24px; top: 20px; min-height: 44px; padding: 0 20px; background: transparent; color: #E8EEFF; border: 1px solid rgba(232,238,255,.35); border-radius: 999px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; cursor: pointer">${e(c('intro.skip'))}</button>
</div>`;
}

// ---------------------------------------------------------------- foto bersama
const DEFAULT_TAGS = [
  { match: 'ayu', x: 0.51, y: 0.347 }, { match: 'ichsan', x: 0.75, y: 0.134 }, { match: 'umar', x: 0.87, y: 0.158 }, { match: 'i putu', x: 0.69, y: 0.27 },
  { match: 'luthfi', x: 0.127, y: 0.128 }, { match: 'fahmida', x: 0.81, y: 0.347 }, { match: 'aprlia', x: 0.41, y: 0.412 }, { match: 'almekka', x: 0.43, y: 0.152 },
  { match: 'putri', x: 0.19, y: 0.335 }, { match: 'alika', x: 0.57, y: 0.235 }, { match: 'intan', x: 0.3, y: 0.211 },
];
export function resolveTags(c, members) {
  const raw = Array.isArray(c('group.tags')) && c('group.tags').length ? c('group.tags') : DEFAULT_TAGS;
  return raw.map((t) => {
    const m = t.member_id ? members.find((x) => x.id === t.member_id) : members.find((x) => String(x.name || '').toLowerCase().startsWith(t.match || '~'));
    return m ? { m, x: +t.x, y: +t.y } : null;
  }).filter(Boolean);
}
export const roleOf = (m) => (m.division && m.division !== 'Koordinator' ? m.division : m.position || '');

export function groupPhoto(c, members, titleKey, cta = true) {
  const photo = c('group.photo') || A.group;
  const hs = resolveTags(c, members).map(({ m, x, y }) => `<a class="hs" data-hs="1" href="/tim/${e(m.id)}" aria-label="${e(nice(shortName(m.name)))} — ${e(roleOf(m))}" style="position: absolute; left: ${(x * 100).toFixed(1)}%; top: ${(y * 100).toFixed(1)}%; width: 0; height: 0; text-decoration: none">
<span aria-hidden="true" style="position: absolute; left: calc(var(--u, 1) * -48px); top: calc(var(--u, 1) * -56px); width: calc(var(--u, 1) * 96px); height: calc(var(--u, 1) * 112px)"></span>
<span class="ring" aria-hidden="true" style="position: absolute; left: 0; top: calc(var(--u, 1) * -10px); width: calc(var(--u, 1) * 118px); height: calc(var(--u, 1) * 136px); border-radius: 50%; border: 1.5px solid rgba(175,198,255,.85); box-shadow: 0 0 24px rgba(61,123,255,.45), inset 0 0 18px rgba(61,123,255,.25); pointer-events: none"></span>
<span class="lbl" style="position: absolute; left: 0; top: calc(var(--u, 1) * -82px); white-space: nowrap; display: flex; flex-direction: column; align-items: center; pointer-events: none"><span style="padding: 8px 14px; border-radius: 12px; background: rgba(3,6,15,.82); border: 1px solid rgba(175,198,255,.4); backdrop-filter: blur(6px); display: flex; flex-direction: column; align-items: center; gap: 2px"><span style="${SORA}; font-weight: 600; font-size: 14px; color: #FFFFFF">${e(nice(shortName(m.name)))}</span><span style="${MONO}; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #AFC6FF">${e(roleOf(m))}</span></span><span style="width: 1px; height: calc(var(--u, 1) * 14px); background: linear-gradient(180deg, rgba(175,198,255,.8), rgba(175,198,255,0))"></span></span>
</a>`).join('');
  const cbtn = cta ? `<div style="display: flex; flex-wrap: wrap; gap: 12px; pointer-events: auto">${btn(c('group.btn1'), '/tim')}${btn(c('group.btn2'), '/organigram', 'line', false)}</div>` : '';
  return `<section style="position: relative"><div style="position: relative; width: 100%">
<div data-flash-photo="1" style="position: relative; width: 100%; aspect-ratio: 16 / 9; cursor: crosshair">
<div class="feather" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden">
<img class="gp-base" src="${e(photo)}" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 75%; filter: grayscale(.9) brightness(.5) contrast(1.08)">
<div class="gp-ov" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(11,30,77,.35) 0%, rgba(11,30,77,.15) 50%, rgba(3,6,15,.55) 100%); mix-blend-mode: multiply"></div>
<img class="flash-top" src="${e(photo)}" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 75%">
</div>
<span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%)">Foto bersama asisten riset SPIS Laboratory</span>
${hs}
</div>
<div class="gp-text" style="position: absolute; left: 0; right: 0; bottom: clamp(0px, 1vw, 16px); ${WRAP}; pointer-events: none; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px 40px">
<div style="display: flex; flex-direction: column; gap: 14px">${mono(e(c('group.kicker')), '#AFC6FF')}
<h2 style="margin: 0; max-width: 760px; ${SORA}; font-weight: 800; font-size: clamp(28px, 4.6vw, 68px); line-height: 1; letter-spacing: -.035em; color: #FFFFFF; text-shadow: 0 4px 30px rgba(3,6,15,.8)">${e(c(titleKey))}</h2></div>
${cbtn}
</div></div></section>`;
}

export const imgOf = (p) => (p.media_type === 'video' ? null : p.photo_url);

export function labCarousel(c, photos) {
  const pics = photos.filter(imgOf);
  if (!pics.length) return '';
  const items = pics.map((p, i) => `<a href="/lab-activities" style="flex: 0 0 auto; width: clamp(260px, 34vw, 480px); display: flex; flex-direction: column; gap: 12px; text-decoration: none; color: inherit">
<span style="display: block; aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}"><img src="${e(imgOf(p))}" alt="${e(p.title || 'Lab SPIS')}" draggable="false" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block"></span>
<span style="${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: ${DIM}">${e(p.title || c('home.lab.caption'))} · ${String(i + 1).padStart(2, '0')}/${String(pics.length).padStart(2, '0')}</span>
</a>`).join('');
  return `<section style="padding: 120px 0 110px">
<div style="${WRAP}; display: flex; flex-direction: column; gap: 40px">${h2(e(c('home.lab.title')), c('home.lab.sub'), [c('home.lab.link'), '/lab-activities'])}</div>
<div style="margin-top: 40px; overflow: hidden; padding-left: max(clamp(20px, 4vw, 48px), calc((100% - 1280px) / 2 + clamp(20px, 4vw, 48px)))">
<div data-drag-track="1" style="display: flex; gap: 18px; width: max-content; padding-right: 48px; cursor: grab; touch-action: pan-y; user-select: none">${items}</div>
</div></section>`;
}

export function avatar(m, size, extra = '') {
  return `<span style="flex: 0 0 auto; display: block; width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(127,164,255,.6); background: #1B2B55${extra}">${m.photo_url ? `<img src="${e(m.photo_url)}" alt="${e(nice(m.name))}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; object-position: top; display: block">` : `<span style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; ${SORA}; font-weight: 700; font-size: ${Math.round(size / 2.6)}px; color: #AFC6FF">${e(nice(m.name).slice(0, 1))}</span>`}</span>`;
}

export function personNode(m, key, parent, role, big = false) {
  const sz = big ? 120 : 84;
  return `<a class="node" data-node="${key}" data-parent="${parent}" href="/tim/${e(m.id)}" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; width: ${sz + 70}px; padding: 14px 8px 16px; border-radius: 18px; border: 1px solid ${LINE}; background-color: #070C1A; text-decoration: none; color: inherit; box-sizing: border-box">
${avatar(m, sz)}
<span style="${SORA}; font-weight: 600; font-size: ${big ? 15 : 13}px; line-height: 1.3; text-align: center; color: ${INK}">${e(nice(m.name))}</span>
<span style="${MONO}; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; text-align: center; color: #7FA4FF">${e(role)}</span>
</a>`;
}
