// Halaman-halaman website publik (diport dari mockup desain v8).
// Setiap fungsi menerima c (teks dari Site Content) + data Supabase, lalu mengembalikan HTML.
import {
  e, MONO, SORA, INK, BODY, DIM, LINE, WRAP, A, mono, btn, header, footer, pageHero, h2, researchCards, pubRows,
  rvStage, ctaRecruit, SKY, introOverlay, groupPhoto, labCarousel, avatar, personNode, nice, shortName, roleOf, imgOf, photoOf, imgFit,
} from './ui';

const dl = (i, step = 0.08) => (i * step).toFixed(2);
const list = (v) => (Array.isArray(v) ? v : []);
const items = (v) => list(v).map((x) => (x && typeof x === 'object' && 'value' in x && Object.keys(x).length === 1 ? x.value : x));
const lines = (s) => String(s || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const asisten = (ms) => ms.filter((m) => m.category === 'asisten');
const dosen = (ms) => ms.filter((m) => m.category === 'dosen');
const isHead = (m) => /kepala/i.test(m.position || '');
const isCoord = (m) => m.division === 'Koordinator' || /koordinator/i.test(m.position || '');
const fmtDate = (d) => { if (!d) return ''; const t = new Date(d); return isNaN(t) ? String(d) : t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); };
const media = (g) => list(g).map((x) => (typeof x === 'string' ? { url: x, type: /\.(mp4|webm|mov)(\?|$)/i.test(x) ? 'video' : 'image' } : x)).filter((x) => x && x.url);
const chipBtn = (k, l, on) => `<button type="button" class="chip" data-filter="${e(k)}" aria-pressed="${on ? 'true' : 'false'}" style="min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(232,238,255,.25); background-color: transparent; color: #DCE4F7; ${MONO}; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(l)}</button>`;
const tabBtn = (k, l, sel) => `<button type="button" class="tab" data-tab="${k}" aria-selected="${sel}" style="min-height: 48px; padding: 0 22px; border-radius: 999px; border: 1px solid rgba(232,238,255,.25); background-color: transparent; color: #DCE4F7; ${MONO}; font-size: 12.5px; letter-spacing: .12em; text-transform: uppercase; cursor: pointer">${e(l)}</button>`;
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stat = (v, l, count = true) => `<div style="display: flex; flex-direction: column; gap: 4px"><span${count ? ` data-count="${e(v)}"` : ''} style="${SORA}; font-weight: 800; font-size: 56px; line-height: 1; color: ${INK}">${e(v)}</span><span style="${MONO}; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: ${DIM}">${e(l)}</span></div>`;
const range = (ys) => { const v = ys.filter(Boolean).map(Number).sort(); return v.length ? (v[0] === v[v.length - 1] ? String(v[0]) : `${v[0]}–${v[v.length - 1]}`) : '—'; };
const ph = (label) => `<div style="aspect-ratio: 1 / 1; border-radius: 14px; border: 1px dashed rgba(140,155,192,.35); background: repeating-linear-gradient(135deg, rgba(127,164,255,.06) 0 2px, transparent 2px 12px); display: flex; align-items: center; justify-content: center; ${MONO}; font-size: 11.5px; letter-spacing: .1em; color: #6F7FA6">${e(label)}</div>`;
const mediaTile = (m, alt, ratio = '1 / 1') => m.type === 'video'
  ? `<video src="${e(m.url)}" controls preload="metadata" playsinline style="width: 100%; aspect-ratio: ${ratio}; object-fit: cover; border-radius: 14px; display: block; background: #03060F"></video>`
  : `<a href="#" data-lb-src="${e(m.url)}" data-lb-cap="${e(alt)}" style="display: block; aspect-ratio: ${ratio}; border-radius: 14px; overflow: hidden; border: 1px solid ${LINE}; cursor: zoom-in"><img class="zoom" src="${e(m.url)}" alt="${e(alt)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block"></a>`;
const lightbox = (c) => `<div data-lb="1" role="dialog" aria-label="Pratinjau foto" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 70; background: rgba(3,6,15,.94); align-items: center; justify-content: center; flex-direction: column; gap: 16px; padding: 70px 24px 30px; box-sizing: border-box">
<button type="button" data-lb-close="1" style="position: absolute; top: 18px; right: 20px; min-height: 48px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(232,238,255,.35); background: transparent; color: #FFFFFF; ${MONO}; font-size: 12px; letter-spacing: .14em; cursor: pointer">${e(c('lab.close'))}</button>
<img data-lb-img="1" src="${A.logo}" alt="Pratinjau" style="max-width: min(1200px, 100%); max-height: 78vh; border-radius: 16px; display: block">
<div style="display: flex; align-items: center; gap: 16px"><button type="button" data-lb-prev="1" aria-label="Sebelumnya" style="min-width: 48px; min-height: 48px; border-radius: 50%; border: 1px solid rgba(232,238,255,.35); background: transparent; color: #FFFFFF; cursor: pointer">←</button><span data-lb-cap="1" style="${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: ${DIM}"></span><button type="button" data-lb-next="1" aria-label="Berikutnya" style="min-width: 48px; min-height: 48px; border-radius: 50%; border: 1px solid rgba(232,238,255,.35); background: transparent; color: #FFFFFF; cursor: pointer">→</button></div>
</div>`;
const withAuthors = (pubs, ms) => pubs.map((p) => ({ ...p, authorNames: list(p.achievement_members).map((l) => ms.find((m) => m.id === l.member_id)).filter(Boolean).map((m) => nice(m.name)) }));

// ================================================================ HOME
export function pHome(c, d) {
  const ms = d.members, as = asisten(ms), research = list(c('research.items'));
  const stats = [[dosen(ms).length, c('home.stat1')], [as.length, c('home.stat2')], [d.pubCount, c('home.stat3')], [research.length, c('home.stat4')]];
  const st = stats.map(([v, l], i) => `<div data-reveal="1" style="display: flex; flex-direction: column; gap: 8px; padding: 26px 0; border-top: 1px solid ${LINE}; transition-delay: ${dl(i)}s"><span data-count="${v}" style="${SORA}; font-weight: 800; font-size: clamp(44px, 5vw, 72px); line-height: 1; letter-spacing: -.04em; color: ${INK}">${v}</span><span style="${MONO}; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: ${DIM}">${e(l)}</span></div>`).join('');
  const intro = c('intro.enabled') ? introOverlay(c) : '';
  return SKY + intro + header(c, 'home', { replay: !!c('intro.enabled') }) + `
<section id="top" class="hero-sec" style="position: relative; min-height: 880px; display: flex; align-items: center">
<canvas data-cv="logo3d" data-src="${A.logo}" data-layout="right" class="hero-fade" role="img" aria-label="Logo SPIS dari partikel 3D: seret untuk memutar" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; cursor: grab; touch-action: pan-y"></canvas>
<div style="position: relative; z-index: 2; width: 100%; ${WRAP}; padding-top: 160px; padding-bottom: 120px; pointer-events: none">
<div style="max-width: 640px; display: flex; flex-direction: column; gap: 28px">
<p style="margin: 0; display: flex; align-items: center; gap: 12px; ${MONO}; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: #8FA6D9"><span aria-hidden="true" style="width: 28px; height: 1px; background: #8FA6D9"></span>${e(c('home.hero.kicker'))}</p>
<h1 style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(42px, 4.9vw, 72px); line-height: 1; letter-spacing: -.035em; color: ${INK}">${e(c('home.hero.title_before'))} <span style="color: #7FA4FF">${e(c('home.hero.title_highlight'))}</span> ${e(c('home.hero.title_after'))}</h1>
<p style="margin: 0; max-width: 500px; font-size: 18px; line-height: 1.65; color: ${BODY}">${e(c('home.hero.sub'))}</p>
<div style="display: flex; flex-wrap: wrap; gap: 14px; pointer-events: auto">${btn(c('home.hero.btn1'), c('home.hero.btn1_link') || '/tentang')}${btn(c('home.hero.btn2'), c('home.hero.btn2_link') || '/tim', 'line', false)}</div>
</div></div>
<p style="position: absolute; z-index: 2; left: 0; right: 0; bottom: 28px; margin: 0 auto; ${WRAP}; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #8FA6D9; pointer-events: none"><span>${e(c('home.hero.hint'))}</span><span class="hide-m">${e(c('home.hero.scroll'))}</span></p>
</section>

<section id="about" style="${WRAP}; padding-top: 110px; padding-bottom: 40px; display: flex; flex-wrap: wrap; gap: 48px 80px">
<div style="flex: 1 1 520px; display: flex; flex-direction: column; gap: 22px">
${mono(e(c('home.about.kicker')))}
<h2 data-reveal="1" style="margin: 0; ${SORA}; font-weight: 700; font-size: clamp(30px, 3.6vw, 52px); line-height: 1.08; letter-spacing: -.03em; color: ${INK}">${e(c('home.about.title'))}</h2>
<p data-reveal="1" style="margin: 0; max-width: 560px; font-size: 17px; line-height: 1.7; color: ${BODY}">${e(c('home.about.text'))}</p>
<a href="/tentang" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase">${e(c('home.about.link'))} →</a>
</div>
<div style="flex: 1 1 420px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px; align-content: start">${st}</div>
</section>

${research.length ? `<section id="research" style="${WRAP}; padding-top: 110px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 52px">
${h2(`${e(c('home.research.title'))}<br><span style="color: #6F7FA6">${e(c('home.research.title_dim'))}</span>`, c('home.research.sub'))}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 18px">${researchCards(research)}</div>
</section>` : ''}

<div style="height: 80px"></div>
${groupPhoto(c, as, 'group.title_home')}
${labCarousel(c, d.lab)}

${d.pubs.length ? `<section id="achievement" style="${WRAP}; padding-bottom: 120px; display: flex; flex-direction: column; gap: 40px">
${h2(e(c('home.pubs.title')), null, [c('home.pubs.link'), '/pencapaian'])}
<div style="display: flex; flex-direction: column; border-bottom: 1px solid ${LINE}">${pubRows(c, d.pubs)}</div>
</section>` : ''}
${ctaRecruit(c, d.rec, as)}
${footer(c)}`;
}

// ================================================================ ABOUT
export function pAbout(c, d) {
  const ab = d.about || {};
  const photo = c('about.photo') || A.group;
  const heroBg = `<div aria-hidden="true" style="position: absolute; top: -10%; left: 0; width: 100%; height: 120%"><img data-parallax="0.12" src="${e(photo)}" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: grayscale(.6) brightness(.45) contrast(1.05)"></div>
<div aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(3,6,15,.75) 0%, rgba(11,30,77,.45) 40%, rgba(3,6,15,1) 100%)"></div>`;
  const vis = items(c('about.values_visuals'));
  const values = [1, 2, 3].map((i) => [ab[`nilai_${i}_label`], ab[`nilai_${i}_desc`]]).filter(([t]) => t);
  const vals = values.map(([t, dd], i) => `<article class="spot" data-spot="1" data-card="1" data-reveal="1" style="border: 1px solid ${LINE}; border-radius: 22px; background-color: #070C1A; overflow: hidden; display: flex; flex-direction: column; transition-delay: ${dl(i)}s">
<canvas data-mini="${e(vis[i] || ['precision', 'collab', 'impact'][i])}" aria-hidden="true" style="display: block; width: 100%; height: 200px"></canvas>
<div style="padding: 22px 26px 30px; display: flex; flex-direction: column; gap: 10px"><span style="${MONO}; font-size: 12px; letter-spacing: .14em; color: #7FA4FF">0${i + 1}</span><h3 style="margin: 0; ${SORA}; font-weight: 700; font-size: 26px; color: ${INK}">${e(t)}</h3><p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BODY}">${e(dd)}</p></div></article>`).join('');
  const pics = d.lab.filter((p) => imgOf(p) && p.category !== 'kegiatan').slice(0, 3);
  const labs = pics.map((p, i) => `<a href="/lab-activities" data-reveal="1" style="display: block; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; aspect-ratio: 4 / 3; transition-delay: ${dl(i)}s"><img src="${e(imgOf(p))}" alt="${e(p.title || 'Fasilitas Lab SPIS')}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block"></a>`).join('');
  const rs = list(c('research.items')).map((r) => `<li data-reveal="1" style="display: flex; flex-wrap: wrap; gap: 8px 28px; align-items: baseline; padding: 24px 0; border-top: 1px solid ${LINE}"><span style="flex: 0 0 120px; ${MONO}; font-size: 12px; letter-spacing: .14em; color: #7FA4FF">${e(String(r.label || '').split(' / ')[0])}</span><span style="flex: 1 1 260px; ${SORA}; font-weight: 600; font-size: 22px; color: ${INK}">${e(r.title)}</span><span style="flex: 1 1 320px; font-size: 15px; line-height: 1.6; color: ${BODY}">${e(r.desc)}</span></li>`).join('');
  return header(c, 'about') + pageHero(c('about.kicker'), c('about.title'), null, '', heroBg, 640) + `
<section style="${WRAP}; padding-top: 90px; padding-bottom: 60px; display: flex; flex-wrap: wrap; gap: 40px 80px">
<p data-reveal="1" style="margin: 0; flex: 1 1 560px; ${SORA}; font-weight: 600; font-size: clamp(24px, 2.6vw, 36px); line-height: 1.3; letter-spacing: -.02em; color: ${INK}">${e(ab.intro_1 || '')}</p>
<div style="flex: 1 1 420px; display: flex; flex-direction: column; gap: 20px">${[ab.intro_2, ab.intro_3].filter(Boolean).map((t) => `<p data-reveal="1" style="margin: 0; font-size: 17px; line-height: 1.75; color: ${BODY}">${e(t)}</p>`).join('')}</div>
</section>
${vals ? `<section style="${WRAP}; padding-top: 70px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 44px">
${h2(e(c('about.values_title')))}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 18px">${vals}</div>
</section>` : ''}
${rs ? `<section style="${WRAP}; padding-top: 70px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 30px">
${h2(e(c('about.focus_title')))}
<ul style="margin: 0; padding: 0; list-style: none; border-bottom: 1px solid ${LINE}">${rs}</ul>
</section>` : ''}
<section style="${WRAP}; padding-top: 70px; padding-bottom: 70px">
<div data-reveal="1" style="position: relative; min-height: 540px; border-radius: 28px; overflow: hidden; border: 1px solid rgba(111,155,255,.28); background: radial-gradient(ellipse at 78% 40%, #0B1E4D 0%, #060D22 70%); display: flex; flex-wrap: wrap">
<canvas data-cv="beacon" data-label="${e(c('about.beacon'))}" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block"></canvas>
<div style="position: relative; flex: 1 1 520px; padding: clamp(28px, 5vw, 60px); display: flex; flex-direction: column; gap: 16px; pointer-events: none">${mono(e(c('about.naungan_kicker')), '#AFC6FF')}<h2 style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(30px, 3.6vw, 52px); line-height: 1.02; letter-spacing: -.03em; color: #FFFFFF">${e(ab.naungan_title || '')}</h2><p style="margin: 0; max-width: 560px; font-size: 17px; line-height: 1.7; color: #DCE4F7">${e(ab.naungan_text || '')}</p></div>
<div style="position: relative; flex: 1 1 300px; padding: clamp(28px, 5vw, 60px); display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; font-size: 15px; line-height: 1.6; color: #DCE4F7; pointer-events: none">${mono(e(c('about.location_kicker')), '#AFC6FF')}<span style="${SORA}; font-weight: 600; font-size: 20px; color: #FFFFFF">${e(c('about.building'))}</span><span>${e(c('about.address'))}</span><span>${e(c('about.phone'))}</span>${c('about.maps') ? `<a href="${e(c('about.maps'))}" target="_blank" rel="noopener" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; pointer-events: auto">${e(c('about.maps_label'))} ↗</a>` : ''}</div>
</div></section>
${labs ? `<section style="${WRAP}; padding-top: 50px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 36px">
${h2(e(c('about.fac_title')), null, [c('about.fac_link'), '/lab-activities'])}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 18px">${labs}</div>
</section>` : '<div style="height: 60px"></div>'}
${footer(c)}`;
}

// ================================================================ ACHIEVEMENT
export function pAch(c, d) {
  const pubs = withAuthors(d.pubs, d.members);
  const years = [...new Set(pubs.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a);
  const types = new Set(pubs.map((p) => p.type));
  const chips = [['all', c('ach.f_all')]].concat(types.has('publikasi') ? [['publikasi', c('ach.f_pub')]] : [], types.has('pendanaan') ? [['pendanaan', c('ach.f_fund')]] : [], years.map((y) => [`y${y}`, String(y)]));
  const extra = `<div data-reveal="1" style="display: flex; flex-wrap: wrap; gap: 40px; margin-top: 12px">${stat(pubs.length, c('ach.count_label'))}${stat(range(years), c('ach.range_label'), false)}</div>`;
  return header(c, 'achievement') + pageHero(c('ach.kicker'), c('ach.title'), c('ach.sub'), extra) + `
<section data-filter-scope="1" data-page="${Math.max(1, parseInt(c('ach.page'), 10) || 10)}" style="${WRAP}; padding-top: 60px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px">
<div role="group" aria-label="Filter" style="display: flex; flex-wrap: wrap; gap: 8px">${chips.map(([k, l], i) => chipBtn(k, l, i === 0)).join('')}</div>
<label style="position: relative; flex: 0 1 340px; display: flex"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%)">Cari publikasi</span><input class="fld" data-search="1" type="search" placeholder="${e(c('ach.search'))}" style="width: 100%; min-height: 48px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(232,238,255,.25); background: #070C1A; color: #FFFFFF; font: inherit; font-size: 15px; box-sizing: border-box"></label>
</div>
<p style="margin: 0; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: ${DIM}">${e(c('ach.shown'))} <span data-shown="1">${pubs.length}</span> ${e(c('ach.of'))} ${pubs.length}</p>
<div style="display: flex; flex-direction: column; border-bottom: 1px solid ${LINE}">${pubRows(c, pubs, true)}
<p data-empty="1" style="display: ${pubs.length ? 'none' : 'block'}; margin: 0; padding: 40px 0; text-align: center; color: ${DIM}">${e(c('ach.empty'))}</p></div>
<button type="button" data-more="1" data-fmt="${e(c('ach.more'))}" class="mag mag-line" data-mag="1" style="display: none; align-self: center; min-height: 54px; padding: 0 30px; border-radius: 999px; border: 1px solid rgba(232,238,255,.4); background: transparent; color: #E8EEFF; ${MONO}; font-size: 13px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(c('ach.more'))}</button>
</section>
${footer(c)}`;
}

// ================================================================ ABDIMAS
export function pAbd(c, d) {
  const rows = d.abdimas.map((a, i) => {
    const g = media(a.gallery);
    const gal = g.length ? g.slice(0, 6).map((m, j) => mediaTile(m, `${a.title} · ${j + 1}`)).join('') : [1, 2, 3].map((j) => ph(`FOTO ${j}`)).join('');
    return `<article data-reveal="1" style="position: relative; display: flex; flex-wrap: wrap; gap: 24px 48px; padding: 0 0 70px 56px">
<span aria-hidden="true" class="${i === 0 ? 'pulse' : ''}" style="position: absolute; left: 0; top: 6px; width: 18px; height: 18px; border-radius: 50%; background: ${i === 0 ? '#7FA4FF' : '#1B2B55'}; border: 3px solid #03060F; box-shadow: 0 0 0 1px rgba(127,164,255,.6)"></span>
<div style="flex: 1 1 380px; display: flex; flex-direction: column; gap: 14px">
<span style="${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #7FA4FF">${e(fmtDate(a.activity_date))}</span>
<h3 style="margin: 0; ${SORA}; font-weight: 700; font-size: clamp(24px, 2.6vw, 34px); line-height: 1.15; letter-spacing: -.02em; color: ${INK}">${e(a.title)}</h3>
${a.location ? `<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 15px; color: ${DIM}"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="flex: 0 0 auto"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" style="fill: none; stroke: #8FA6D9; stroke-width: 1.8"></path><circle cx="12" cy="9.5" r="2.5" style="fill: none; stroke: #8FA6D9; stroke-width: 1.8"></circle></svg>${e(a.location)}</p>` : ''}
${a.description ? `<p style="margin: 0; max-width: 520px; font-size: 16px; line-height: 1.7; color: ${BODY}; white-space: pre-line">${e(a.description)}</p>` : ''}
${a.link ? `<a href="${e(a.link)}" target="_blank" rel="noopener" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase">${e(c('abd.link'))} →</a>` : ''}
</div>
<div style="flex: 1 1 420px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">${gal}</div></article>`;
  }).join('');
  return header(c, 'abdimas') + pageHero(c('abd.kicker'), c('abd.title'), c('abd.sub')) + `
<section style="${WRAP}; padding-top: 80px; padding-bottom: 60px">
${rows ? `<div style="position: relative"><span aria-hidden="true" style="position: absolute; left: 8px; top: 10px; bottom: 60px; width: 2px; background: linear-gradient(180deg, #7FA4FF, rgba(127,164,255,.05))"></span>${rows}</div>` : `<p style="margin: 0; padding: 40px 0; text-align: center; color: ${DIM}">${e(c('abd.empty'))}</p>`}
</section>
${lightbox(c)}
${footer(c)}`;
}

// ================================================================ RECRUITMENT
function divisionsOf(c, as) {
  const names = items(c('org.divisions')).filter(Boolean);
  const out = names.map((dv) => [dv, as.filter((m) => m.division === dv)]).filter(([, m]) => m.length);
  const rest = as.filter((m) => !isCoord(m) && !names.includes(m.division));
  if (rest.length) out.push(['Asisten riset', rest]);
  return out;
}
export function pRec(c, d) {
  const r = d.rec, as = asisten(d.members);
  if (!r) return header(c, 'recruitment') + pageHero(c('rec.kicker'), c('rec.title'), c('rec.sub')) + `<section style="${WRAP}; padding: 60px 0 120px"><p style="color: ${DIM}">${e(c('rec.none'))}</p></section>` + footer(c);
  const req = lines(r.requirements).map((x, i) => `<li style="display: flex; gap: 16px; align-items: baseline; padding: 18px 0; border-top: 1px solid ${LINE}; font-size: 16.5px; line-height: 1.55; color: #DCE4F7"><span style="${MONO}; font-size: 12px; color: #7FA4FF">${String(i + 1).padStart(2, '0')}</span>${e(x)}</li>`).join('');
  const divs = divisionsOf(c, as).map(([dv, mem]) => `<article class="spot" data-spot="1" data-reveal="1" style="border: 1px solid ${LINE}; border-radius: 20px; background-color: #070C1A; padding: 26px; display: flex; flex-direction: column; gap: 18px">
<h3 style="margin: 0; ${SORA}; font-weight: 600; font-size: 21px; color: ${INK}">${e(dv)}</h3>
<div style="display: flex; align-items: center; padding-left: 12px">${mem.map((m) => avatar(m, 60, '; border: 2px solid #070C1A; margin-left: -12px')).join('')}</div>
<p style="margin: 0; font-size: 14px; color: ${DIM}">${mem.map((m) => e(nice(shortName(m.name)))).join(', ')}</p></article>`).join('');
  const hl = list(r.highlights).length ? list(r.highlights) : list(c('rec.highlights'));
  const fc = hl.map((h) => `<div data-reveal="1" style="display: flex; flex-direction: column; gap: 10px; padding-top: 22px; border-top: 1px solid ${LINE}"><span style="${SORA}; font-weight: 800; font-size: 30px; color: ${INK}">${e(h.title)}</span><p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BODY}">${e(h.text)}</p></div>`).join('');
  const open = !!r.is_open;
  const status = `<p data-reveal="1" style="margin: 6px 0 0; align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 16px; border-radius: 999px; background: rgba(127,164,255,.14); border: 1px solid rgba(127,164,255,.4); ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #DCE4F7"><span class="${open ? 'pulse' : ''}" aria-hidden="true" style="width: 9px; height: 9px; border-radius: 50%; background: ${open ? '#7FA4FF' : '#6F7FA6'}"></span>${e(open ? c('rec.open') : c('rec.closed'))}</p>`;
  const cta = open
    ? `${btn(c('rec.btn'), '/rekrutmen/daftar', 'fill', true, true)}<a href="/rekrutmen/status" style="display: inline-flex; align-items: center; min-height: 56px; padding: 0 8px; font-size: 15px">${e(c('rec.status_link'))} →</a>`
    : `<p style="margin: 0; max-width: 520px; font-size: 15.5px; line-height: 1.6; color: #AFC6FF">${e(c('rec.closed_text'))}</p><a href="/rekrutmen/status" style="display: inline-flex; align-items: center; min-height: 56px; padding: 0 8px; font-size: 15px">${e(c('rec.status_link'))} →</a>`;
  return header(c, 'recruitment') + pageHero(c('rec.kicker'), c('rec.title'), c('rec.sub'), status) + `
<section style="${WRAP}; padding-top: 80px; padding-bottom: 40px">
<div data-reveal="1" style="position: relative; border-radius: 28px; border: 1px solid rgba(111,155,255,.28); background: radial-gradient(ellipse at 75% 30%, #0B1E4D 0%, #060D22 70%); overflow: hidden; display: flex; flex-wrap: wrap">
<div style="flex: 1 1 520px; padding: clamp(28px, 5vw, 60px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 18px">${mono(e(c('rec.card_kicker')), '#AFC6FF')}
<h2 style="margin: 0; max-width: 620px; ${SORA}; font-weight: 800; font-size: clamp(30px, 3.8vw, 54px); line-height: 1.02; letter-spacing: -.03em; color: #FFFFFF">${e(r.title)}</h2>
${r.description ? `<p style="margin: 0; max-width: 520px; font-size: 17px; line-height: 1.7; color: #DCE4F7; white-space: pre-line">${e(r.description)}</p>` : ''}
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 10px">${cta}</div></div>
<div style="flex: 1 1 400px; min-width: 0; padding: 28px clamp(16px, 3vw, 44px); box-sizing: border-box; display: flex; align-items: center">${rvStage(r.card_visual || 'halo', 400, as, 'width: 100%')}</div>
${req ? `<div style="flex: 1 1 100%; padding: clamp(24px, 4vw, 44px) clamp(28px, 5vw, 60px); box-sizing: border-box; background: rgba(3,6,15,.55); border-top: 1px solid rgba(111,155,255,.2); display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px">${mono(e(c('rec.req_title')), '#AFC6FF')}${r.deadline ? `<p style="margin: 0; ${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: ${DIM}">${e(c('rec.deadline'))} · ${e(fmtDate(r.deadline))}</p>` : ''}</div>
<ul style="margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 0 32px">${req}</ul>
</div>` : ''}</div></section>
${fc ? `<section style="${WRAP}; padding-top: 80px; padding-bottom: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 32px">${fc}</section>` : ''}
${divs ? `<section style="${WRAP}; padding-top: 80px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 40px">
${h2(e(c('rec.div_title')), c('rec.div_sub'))}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 18px">${divs}</div>
</section>` : '<div style="height: 80px"></div>'}
${footer(c)}`;
}

// ---------------------------------------------------------------- formulir
const FI = 'class="fi" style="width: 100%; min-height: 50px; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(140,155,192,.35); background: #03060F; color: #FFFFFF; font: inherit; font-size: 15.5px; box-sizing: border-box"';
const ACC = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
function qfield(si, qi, q) {
  const qid = `q${si}-${qi}`, req = !!q.required, typ = q.type;
  const star = req ? '<span aria-hidden="true" style="color: #FF9B9B"> *</span>' : '';
  const rq = req ? ' data-req="1" required=""' : '';
  const dq = ` data-qid="${e(q.id)}"`;
  const help = q.help || '';
  const opts = list(q.options).map(String);
  const lab = `<label for="${qid}" data-qlabel="1" style="${SORA}; font-weight: 600; font-size: 16px; line-height: 1.4; color: ${INK}">${e(q.label)}${star}</label>`;
  const hn = help ? `<span style="font-size: 13px; color: ${DIM}">${e(help)}</span>` : '';
  const box = (inner, multi = false) => `<div class="q" data-q="1"${multi ? ' data-multi="1"' : ''} style="display: flex; flex-direction: column; gap: 10px; padding: 22px 24px; border-radius: 18px; border: 1px solid ${LINE}; background: #070C1A">${inner}<span class="err" style="font-size: 13px; color: #FF9B9B">Wajib diisi</span></div>`;
  if (typ === 'check') {
    return `<div class="q" data-q="1" style="padding: 4px 0"><label style="display: flex; align-items: flex-start; gap: 14px; min-height: 44px; cursor: pointer"><input id="${qid}" type="checkbox"${dq}${rq} style="flex: 0 0 auto; width: 22px; height: 22px; margin: 2px 0 0; accent-color: #3D7BFF"><span data-qlabel="1" style="font-size: 15.5px; line-height: 1.55; color: ${BODY}">${e(q.label)}${star}</span></label><span class="err" style="font-size: 13px; color: #FF9B9B">Wajib dicentang</span></div>`;
  }
  if (typ === 'radio' || typ === 'checkbox') {
    const t = typ === 'radio' ? 'radio' : 'checkbox';
    const ch = opts.map((o, i) => `<label style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(140,155,192,.25); cursor: pointer; font-size: 15px; color: #DCE4F7"><input type="${t}" name="${qid}" value="${e(o)}"${i === 0 ? ` id="${qid}"${dq}${rq}` : ''} style="width: 18px; height: 18px; margin: 0; accent-color: #3D7BFF">${e(o)}</label>`).join('');
    return box(`<span data-qlabel="1" style="${SORA}; font-weight: 600; font-size: 16px; line-height: 1.4; color: ${INK}">${e(q.label)}${star}</span>${hn}<div style="display: flex; flex-direction: column; gap: 8px">${ch}</div>`, true);
  }
  let ctl;
  if (typ === 'select') ctl = `<select id="${qid}"${dq} ${FI}${rq}><option value="">Pilih…</option>${opts.map((o) => `<option>${e(o)}</option>`).join('')}</select>`;
  else if (typ === 'paragraph') ctl = `<textarea id="${qid}"${dq} rows="5" ${FI.replace('min-height: 50px', 'min-height: 130px; resize: vertical')}${rq}></textarea>`;
  else if (typ === 'file') {
    const acc = String(q.accept || 'pdf,jpg,png').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
    const mime = [...new Set(acc.map((x) => ACC[x]).filter(Boolean))].join(',');
    ctl = `<label class="drop" data-file="1" style="position: relative; display: flex; align-items: center; gap: 16px; min-height: 76px; padding: 14px 18px; border-radius: 14px; border: 1.5px dashed rgba(127,164,255,.55); background: rgba(61,123,255,.06); cursor: pointer; box-sizing: border-box">
<input id="${qid}" type="file" data-fileinput="1"${dq}${rq} accept="${e(mime)}" data-accept="${e(acc.join(','))}" data-maxmb="${+q.max_mb || 5}" style="position: absolute; width: 1px; height: 1px; opacity: 0">
<span aria-hidden="true" style="flex: 0 0 44px; height: 44px; border-radius: 12px; background: rgba(61,123,255,.16); color: #7FA4FF; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"></path><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 3px; min-width: 0"><span data-fname="1" style="font-size: 15px; font-weight: 500; color: ${INK}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">Pilih file</span><span data-fmeta="1" style="font-size: 13px; color: ${DIM}">${e(help || acc.join(' / ').toUpperCase() + ' · maks ' + (+q.max_mb || 5) + ' MB')}</span></span>
<span data-fbtn="1" style="margin-left: auto; flex: 0 0 auto; ${MONO}; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: #AFC6FF">Unggah</span></label>`;
    return box(lab + ctl);
  } else {
    const t = { short: 'text', email: 'email', tel: 'tel', number: 'text', url: 'url', date: 'date' }[typ] || 'text';
    const im = typ === 'number' ? ' inputmode="decimal"' : '';
    ctl = `<input id="${qid}" type="${t}"${im}${help ? ` placeholder="${e(help)}"` : ''}${dq} ${FI}${rq}>`;
    return box(lab + ctl);
  }
  return box(lab + hn + ctl);
}
const panelHead = (k, n, title, desc) => `<div style="position: relative; overflow: hidden; padding: 26px 24px 22px; border-radius: 18px; border: 1px solid rgba(127,164,255,.35); background: #071233"><span aria-hidden="true" style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3D7BFF, #7FA4FF)"></span>${mono(`Bagian ${k} dari ${n}`, '#AFC6FF')}<h2 style="margin: 10px 0 6px; ${SORA}; font-weight: 700; font-size: 26px; letter-spacing: -.02em; color: ${INK}">${e(title)}</h2>${desc ? `<p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BODY}">${e(desc)}</p>` : ''}</div>`;
const prevBtn = (c) => `<button type="button" data-fprev="1" style="min-height: 50px; padding: 0 24px; border-radius: 999px; border: 1px solid rgba(232,238,255,.3); background: transparent; color: #E8EEFF; ${MONO}; font-size: 12.5px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(c('daftar.prev'))}</button>`;

export function pDaftar(c, d) {
  const r = d.rec, form = d.form;
  const top = (chips) => `<section style="position: relative; overflow: hidden; background: radial-gradient(ellipse at 70% 30%, rgba(11,30,77,.95) 0%, rgba(11,30,77,0) 65%)">
<div style="${WRAP}; padding-top: 140px; padding-bottom: 48px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px 48px">
<div style="display: flex; flex-direction: column; gap: 16px; max-width: 720px">${mono(e(c('daftar.kicker')), '#AFC6FF')}
<h1 style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(36px, 5vw, 68px); line-height: 1; letter-spacing: -.04em; color: ${INK}">${e(c('daftar.title'))}</h1>
<p style="margin: 0; font-size: 17px; line-height: 1.7; color: ${BODY}">${e(c('daftar.sub'))}</p></div>
<div style="display: flex; flex-wrap: wrap; gap: 10px">${chips.map((t) => `<span style="display: inline-flex; align-items: center; min-height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid rgba(140,155,192,.3); ${MONO}; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: #DCE4F7">${e(t)}</span>`).join('')}</div>
</div></section>`;
  if (!r || !r.is_open || !form.length) {
    return header(c, 'recruitment') + top([]) + `<section style="${WRAP}; padding-bottom: 120px"><div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 36px; border-radius: 24px; border: 1px solid ${LINE}; background: #070C1A"><h2 style="margin: 0; ${SORA}; font-weight: 700; font-size: 28px; color: ${INK}">${e(c('daftar.closed_title'))}</h2><p style="margin: 0; max-width: 560px; font-size: 16px; line-height: 1.65; color: ${BODY}">${e(c('rec.closed_text'))}</p><div style="display: flex; flex-wrap: wrap; gap: 12px">${btn(c('daftar.btn_status'), '/rekrutmen/status')}${btn(c('daftar.btn_home'), '/', 'line', false)}</div></div></section>` + footer(c);
  }
  const n = form.length + 1;
  const chips = [...(r.deadline ? [`Batas · ${fmtDate(r.deadline)}`] : []), ...items(c('daftar.chips'))];
  const steps = form.map((s) => [s.title, `${s.questions.length} pertanyaan`]).concat([[c('daftar.review_title'), 'Langkah terakhir']]).map(([t, cc], i) => `<li><button type="button" data-fgo="${i}" aria-current="${i === 0 ? 'step' : 'false'}" class="fstep" style="width: 100%; display: flex; align-items: center; gap: 14px; min-height: 52px; padding: 6px 12px; border: 0; border-radius: 12px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer"><span class="fnum" style="flex: 0 0 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(140,155,192,.45); display: flex; align-items: center; justify-content: center; ${MONO}; font-size: 12px; color: #AFBCD9">${i + 1}</span><span style="display: flex; flex-direction: column; gap: 2px"><span class="ftitle" style="font-size: 15px; font-weight: 500; color: #AFBCD9">${e(t)}</span><span style="${MONO}; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: ${DIM}">${e(cc)}</span></span></button></li>`).join('');
  const nextBtn = `<button type="button" data-fnext="1" style="min-height: 50px; padding: 0 28px; border-radius: 999px; border: 0; background: #FFFFFF; color: #03060F; ${MONO}; font-size: 12.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(c('daftar.next'))}</button>`;
  let panels = form.map((s, si) => {
    let body = s.questions.map((q, qi) => qfield(si, qi, q)).join('');
    if (s.questions.every((q) => q.type === 'check')) body = `<div style="display: flex; flex-direction: column; gap: 6px; padding: 22px 24px; border-radius: 18px; border: 1px solid ${LINE}; background: #070C1A">${body}</div>`;
    return `<div data-fstep="${si}"${si === 0 ? '' : ' hidden=""'} style="display: flex; flex-direction: column; gap: 14px">
${panelHead(si + 1, n, s.title, s.description)}
${body}
<p data-ferr="1" data-msg="${e(c('daftar.required_err'))}" hidden="" role="alert" style="margin: 0; padding: 14px 18px; border-radius: 12px; background: rgba(229,72,77,.1); border: 1px solid rgba(229,72,77,.4); font-size: 14.5px; color: #FF9B9B"></p>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 6px">${si === 0 ? '<span></span>' : prevBtn(c)}${nextBtn}</div>
</div>`;
  }).join('');
  const conf = (r.form_settings && r.form_settings.confirmation) || 'Terima kasih sudah mendaftar. Simpan nomor pendaftaran ini untuk mengecek status seleksi.';
  panels += `<div data-fstep="${n - 1}" hidden="" style="display: flex; flex-direction: column; gap: 14px">
${panelHead(n, n, c('daftar.review_title'), c('daftar.review_sub'))}
<div data-freview="1" style="display: flex; flex-direction: column; gap: 14px"></div>
<p data-fsubmit-err="1" hidden="" role="alert" style="margin: 0; padding: 14px 18px; border-radius: 12px; background: rgba(229,72,77,.1); border: 1px solid rgba(229,72,77,.4); font-size: 14.5px; color: #FF9B9B"></p>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 6px">${prevBtn(c)}<button type="button" data-fsubmit="1" style="min-height: 52px; padding: 0 30px; border-radius: 999px; border: 0; background: #3D7BFF; color: #FFFFFF; ${MONO}; font-size: 13px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(c('daftar.submit'))}</button></div>
</div>
<div data-fstep="done" hidden="" style="display: flex; flex-direction: column; align-items: center; gap: 18px; padding: clamp(36px, 6vw, 64px) 24px; border-radius: 24px; border: 1px solid rgba(127,164,255,.35); background: radial-gradient(ellipse at 50% 0%, #0B1E4D 0%, #070C1A 70%); text-align: center">
<svg viewBox="0 0 80 80" width="88" height="88" aria-hidden="true"><circle cx="40" cy="40" r="36" style="fill: none; stroke: #3D7BFF; stroke-width: 3; opacity: .35"></circle><circle class="dn-ring" cx="40" cy="40" r="36" style="fill: none; stroke: #7FA4FF; stroke-width: 3; stroke-dasharray: 227; stroke-dashoffset: 227; transform: rotate(-90deg); transform-origin: 40px 40px"></circle><path class="dn-chk" d="M25 41l10 10 20-22" style="fill: none; stroke: #FFFFFF; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 60; stroke-dashoffset: 60"></path></svg>
<h2 style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(28px, 3.4vw, 40px); letter-spacing: -.03em; color: ${INK}">${e(c('daftar.done_title'))}</h2>
<p style="margin: 0; max-width: 520px; font-size: 16px; line-height: 1.65; color: ${BODY}">${e(conf)}</p>
<div style="display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 22px; border-radius: 999px; border: 1px solid rgba(127,164,255,.45); background: #03060F"><span data-regno="1" style="${MONO}; font-size: 22px; letter-spacing: .08em; color: #FFFFFF">—</span><button type="button" data-copy="" style="min-height: 44px; padding: 0 18px; border-radius: 999px; border: 0; background: #FFFFFF; color: #03060F; ${MONO}; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">Salin</button></div>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 6px">${btn(c('daftar.btn_status'), '/rekrutmen/status', 'fill', true, true)}${btn(c('daftar.btn_home'), '/', 'line', false, true)}</div>
</div>`;
  return header(c, 'recruitment') + top(chips) + `<section style="${WRAP}; padding-bottom: 110px">
<div data-fsteps="1" data-total="${n}" style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 28px 40px">
<aside class="fside" style="flex: 0 1 300px; position: sticky; top: 24px; display: flex; flex-direction: column; gap: 18px; padding: 22px 16px; border-radius: 20px; border: 1px solid ${LINE}; background: #070C1A; box-sizing: border-box">
<div style="padding: 0 10px; display: flex; flex-direction: column; gap: 10px"><span data-fcount="1" style="${MONO}; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: ${DIM}">Bagian 1 dari ${n}</span><span style="display: block; height: 6px; border-radius: 999px; background: rgba(140,155,192,.2); overflow: hidden"><span data-fprog="1" style="display: block; height: 100%; width: ${Math.round(100 / n)}%; border-radius: 999px; background: linear-gradient(90deg, #3D7BFF, #7FA4FF); transition: width .5s cubic-bezier(.2,.8,.2,1)"></span></span></div>
<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px">${steps}</ol>
</aside>
<form data-fform="1" novalidate="" onsubmit="return false" style="flex: 1 1 560px; min-width: 0; display: flex; flex-direction: column">${panels}</form>
</div></section>
${footer(c)}`;
}

export function pStatus(c) {
  const tl = [['baru', c('status.s1'), ''], ['ditinjau', c('status.s2'), c('status.s2d')], ['wawancara', c('status.s3'), c('status.s3d')], ['hasil', c('status.s4'), c('status.s4d')]];
  const itemsHtml = tl.map(([k, t, dd], i) => `<li class="stl" data-st-step="${k}" data-state="${i === 0 ? 'done' : 'next'}" style="position: relative; display: flex; gap: 18px; padding-bottom: ${i === tl.length - 1 ? 0 : 26}px">${i === tl.length - 1 ? '' : '<span class="stl-line" aria-hidden="true" style="position: absolute; left: 15px; top: 34px; bottom: 0; width: 2px"></span>'}<span class="stl-dot" style="flex: 0 0 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px"><span class="stl-ok">✓</span><span class="stl-now pulse"></span></span><span style="display: flex; flex-direction: column; gap: 4px; padding-top: 4px"><span class="stl-t" style="${SORA}; font-weight: 600; font-size: 17px">${e(t)}</span><span data-st-date="1" style="font-size: 14px; color: ${DIM}">${e(dd)}</span></span></li>`).join('');
  return header(c, 'recruitment') + pageHero(c('rec.kicker'), c('status.title'), c('status.sub'), '', 'field', 480) + `<section style="${WRAP}; padding-top: 20px; padding-bottom: 120px; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 28px">
<form data-status-form="1" onsubmit="return false" style="flex: 1 1 360px; display: flex; flex-direction: column; gap: 18px; padding: 28px; border-radius: 22px; border: 1px solid ${LINE}; background: #070C1A">
<div style="display: flex; flex-direction: column; gap: 10px"><label for="st-no" style="${SORA}; font-weight: 600; font-size: 15.5px; color: ${INK}">${e(c('status.no'))}</label><input id="st-no" autocomplete="off" placeholder="OR26-0001" ${FI}></div>
<div style="display: flex; flex-direction: column; gap: 10px"><label for="st-nim" style="${SORA}; font-weight: 600; font-size: 15.5px; color: ${INK}">${e(c('status.nim'))}</label><input id="st-nim" inputmode="numeric" autocomplete="off" ${FI}></div>
<button type="button" data-status-check="1" style="min-height: 52px; border-radius: 999px; border: 0; background: #FFFFFF; color: #03060F; ${MONO}; font-size: 12.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; cursor: pointer">${e(c('status.btn'))}</button>
<p data-status-msg="1" hidden="" role="alert" style="margin: 0; padding: 12px 16px; border-radius: 12px; background: rgba(229,72,77,.1); border: 1px solid rgba(229,72,77,.4); font-size: 14px; color: #FF9B9B"></p>
<p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: ${DIM}">${e(c('status.hint'))}</p>
</form>
<div data-status-result="1" hidden="" style="flex: 2 1 480px; display: flex; flex-direction: column; gap: 22px; padding: 28px; border-radius: 22px; border: 1px solid rgba(127,164,255,.35); background: radial-gradient(ellipse at 90% 0%, #0B1E4D 0%, #070C1A 60%)">
<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px"><div style="display: flex; flex-direction: column; gap: 6px"><p data-st-meta="1" style="margin: 0; ${MONO}; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #AFC6FF"></p><h2 data-st-name="1" style="margin: 0; ${SORA}; font-weight: 700; font-size: 28px; letter-spacing: -.02em; color: ${INK}"></h2></div>
<span data-st-chip="1" data-status="baru" class="stchip" style="display: inline-flex; align-items: center; gap: 7px; min-height: 30px; padding: 0 12px; border-radius: 999px; ${MONO}; font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap"><span class="stchip-dot" style="width: 7px; height: 7px; border-radius: 50%"></span><span data-st-chip-text="1"></span></span></div>
<ol style="margin: 0; padding: 0; list-style: none">${itemsHtml}</ol>
</div>
</section>
${footer(c)}`;
}

// ================================================================ ORGANIGRAM
export function pOrg(c, d) {
  const ms = d.members, ds = dosen(ms), as = asisten(ms);
  const head = ds.find(isHead) || ds[0];
  const others = ds.filter((m) => m !== head);
  const coord = as.find(isCoord);
  const top = head ? personNode(head, 'head', '', head.position || 'Kepala Laboratorium', true) : '';
  const dcards = others.map((m) => `<a href="/tim/${e(m.id)}" class="dcard" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 6px 14px; border-radius: 14px; text-decoration: none; color: inherit; box-sizing: border-box">
${avatar(m, 68)}
<span style="${SORA}; font-weight: 600; font-size: 12.5px; line-height: 1.3; text-align: center; color: ${INK}">${e(nice(m.name))}</span>
<span style="${MONO}; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; text-align: center; color: #7FA4FF">${e(m.position || '')}</span></a>`).join('');
  const dnode = others.length ? `<div class="node" data-node="dosen" data-parent="head" style="position: relative; z-index: 2; flex: 1 1 640px; max-width: 780px; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px 18px; border-radius: 20px; border: 1px solid ${LINE}; background-color: #070C1A">
<span style="${MONO}; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #7FA4FF">${e(c('org.dosen'))} · ${others.length}</span>
<div style="width: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 4px">${dcards}</div></div>` : '';
  const cnode = coord ? personNode(coord, 'coord', 'head', c('org.coordinator_label') || coord.position, true) : '';
  const parent = coord ? 'coord' : 'head';
  const divs = divisionsOf(c, as).map(([dv, mem], i) => {
    const rows = mem.map((m) => `<a href="/tim/${e(m.id)}" style="display: flex; align-items: center; gap: 14px; min-height: 64px; text-decoration: none; color: inherit">${avatar(m, 56, '; border: 1px solid rgba(127,164,255,.5)')}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 15px; font-weight: 600; color: ${INK}">${e(nice(shortName(m.name)))}</span><span style="font-size: 13px; color: ${DIM}">${e([m.angkatan, String(m.jurusan || '').replace(/^S1 /, '').replace('Teknik ', 'T. ')].filter(Boolean).join(' · '))}</span></span></a>`).join('');
    return `<div class="node" data-node="div${i}" data-parent="${parent}" style="position: relative; z-index: 2; flex: 1 1 290px; max-width: 360px; display: flex; flex-direction: column; gap: 12px; padding: 20px 22px; border-radius: 18px; border: 1px solid ${LINE}; background-color: #070C1A"><span style="${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #7FA4FF">${e(dv)}</span>${rows}</div>`;
  }).join('');
  return header(c, 'organigram') + pageHero(c('org.kicker'), c('org.title'), c('org.sub')) + `
<section style="${WRAP}; padding-top: 70px; padding-bottom: 120px">
<div style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 70px">
<canvas data-cv="org" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 1; pointer-events: none"></canvas>
${top}
${dnode || cnode ? `<div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 40px 70px">${dnode}${cnode}</div>` : ''}
${divs ? `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 18px">${divs}</div>` : ''}
</div></section>
${footer(c)}`;
}

// ================================================================ DOSEN & ASISTEN
export function pPeople(c, d) {
  const ms = d.members, as = asisten(ms), ds = dosen(ms);
  const asis = as.map((m, i) => {
    const p = photoOf(m, 'card');
    const ph = !p.src ? '' : p.cut
      ? `<span aria-hidden="false" style="position: absolute; left: ${p.x}%; bottom: -30px; transform: translateX(-50%) translateY(${p.y}%) scale(${p.z}); transform-origin: bottom center"><img class="ph" src="${e(p.src)}" alt="${e(nice(m.name))}" loading="lazy" style="height: 360px; width: auto; max-width: none; transform-origin: bottom center; display: block"></span>`
      : `<span style="position: absolute; inset: 0; overflow: hidden"><img class="ph" src="${e(p.src)}" alt="${e(nice(m.name))}" loading="lazy" style="${imgFit(p)}"></span>`;
    return `<a class="lift" href="/tim/${e(m.id)}" data-reveal="1" style="position: relative; display: flex; flex-direction: column; border-radius: 22px; border: 1px solid ${LINE}; overflow: hidden; text-decoration: none; color: inherit; background: radial-gradient(ellipse at 50% 30%, #12285F 0%, #070C1A 70%); transition-delay: ${dl(i % 4, 0.06)}s">
<span style="display: block; height: 320px; overflow: hidden; position: relative">${ph}</span>
<span style="display: flex; flex-direction: column; gap: 6px; padding: 18px 22px 22px; border-top: 1px solid ${LINE}; background: #070C1A"><span style="${SORA}; font-weight: 600; font-size: 18px; color: ${INK}">${e(nice(m.name))}</span><span style="${MONO}; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: #7FA4FF">${e(roleOf(m))}</span><span style="font-size: 13.5px; color: ${DIM}">${e([m.angkatan, m.jurusan].filter(Boolean).join(' · '))}</span></span></a>`;
  }).join('');
  const dos = ds.map((m) => { const p = photoOf(m, 'card'); return `<a class="lift" href="/tim/${e(m.id)}" style="display: flex; flex-direction: column; border-radius: 22px; border: 1px solid ${LINE}; overflow: hidden; text-decoration: none; color: inherit; background: #070C1A">
<span class="ph-wrap" style="display: block; aspect-ratio: 1 / 1; overflow: hidden${p.cut ? '; background: radial-gradient(ellipse at 50% 30%, #12285F 0%, #070C1A 70%)' : ''}">${p.src ? `<img class="ph" src="${e(p.src)}" alt="${e(nice(m.name))}" loading="lazy" style="${imgFit(p, '150%')}">` : ''}</span>
<span style="display: flex; flex-direction: column; gap: 6px; padding: 18px 20px 22px"><span style="${SORA}; font-weight: 600; font-size: 16.5px; line-height: 1.3; color: ${INK}">${e(nice(m.name))}</span><span style="${MONO}; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: #7FA4FF">${e(m.position || '')}</span></span></a>`; }).join('');
  return header(c, 'people') + pageHero(c('people.kicker'), c('people.title'), c('people.sub'), '', 'field', 520) + `
<section data-tabs="1" style="${WRAP}; padding-top: 50px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 36px">
<div role="tablist" aria-label="Kategori" style="display: flex; flex-wrap: wrap; gap: 8px">${tabBtn('asisten', `${c('people.tab_asisten')} · ${as.length}`, 'true')}${tabBtn('dosen', `${c('people.tab_dosen')} · ${ds.length}`, 'false')}</div>
<div data-panel="asisten" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr)); gap: 18px">${asis}</div>
<div data-panel="dosen" hidden="" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(230px, 100%), 1fr)); gap: 18px">${dos}</div>
</section>
${groupPhoto(c, as, 'group.title_people', false)}
<div style="height: 60px"></div>
${footer(c)}`;
}

export function pProfile(c, d) {
  const m = d.member, pubs = d.pubs;
  const by = {};
  pubs.forEach((p) => { (by[p.year || '—'] = by[p.year || '—'] || []).push(p); });
  const tl = Object.keys(by).sort((a, b) => b - a).map((y) => `<div data-reveal="1" style="display: flex; flex-wrap: wrap; gap: 8px 32px; padding: 26px 0; border-top: 1px solid ${LINE}"><span style="flex: 0 0 90px; ${SORA}; font-weight: 800; font-size: 30px; color: #7FA4FF">${e(y)}</span><ul style="flex: 1 1 520px; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column">${by[y].map((p) => `<li class="row-h" style="display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; border-radius: 12px">${p.link ? `<a href="${e(p.link)}" target="_blank" rel="noopener" style="${SORA}; font-weight: 500; font-size: 17px; line-height: 1.4; color: #DCE4F7; text-decoration: none">${e(p.title)}</a>` : `<span style="${SORA}; font-weight: 500; font-size: 17px; line-height: 1.4; color: #DCE4F7">${e(p.title)}</span>`}${p.venue ? `<span style="${MONO}; font-size: 12px; color: ${DIM}">${e(p.venue)}</span>` : ''}</li>`).join('')}</ul></div>`).join('');
  const pf = photoOf(m, 'card');
  const role = m.category === 'asisten' ? [roleOf(m), m.angkatan, m.jurusan].filter(Boolean).join(' · ') : m.position || '';
  return header(c, 'people') + `
<section style="position: relative; overflow: hidden; background: radial-gradient(ellipse at 30% 60%, rgba(14,37,96,.9) 0%, rgba(14,37,96,0) 60%)">
<canvas data-cv="field" data-lines="26" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block"></canvas>
<div style="position: relative; z-index: 2; ${WRAP}; padding-top: 120px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 0 64px">
${pf.cut ? `<div style="flex: 0 1 460px; height: 600px; position: relative"><img data-reveal="1" src="${e(pf.src)}" alt="${e(nice(m.name))}" style="position: absolute; bottom: 0; left: ${pf.x}%; height: 600px; width: auto; max-width: none; transform: translateX(-50%) translateY(${pf.y}%) scale(${pf.z}); transform-origin: bottom center; display: block"></div>`
  : `<div data-reveal="1" class="ph-wrap" style="flex: 0 1 420px; aspect-ratio: 4 / 5; margin-bottom: 80px; border-radius: 28px; overflow: hidden; border: 1px solid rgba(127,164,255,.35); background: #1B2B55">${pf.src ? `<img src="${e(pf.src)}" alt="${e(nice(m.name))}" style="${imgFit(pf)}">` : ''}</div>`}
<div style="flex: 1 1 480px; padding-bottom: 80px; display: flex; flex-direction: column; gap: 18px">
<a href="/tim" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase">${e(c('profile.back'))}</a>
${mono(e(role), '#7FA4FF')}
<h1 data-reveal="1" style="margin: 0; ${SORA}; font-weight: 800; font-size: clamp(40px, 5vw, 76px); line-height: 1; letter-spacing: -.035em; color: ${INK}">${e(nice(m.name))}</h1>
<p data-reveal="1" style="margin: 0; max-width: 560px; font-size: 17px; line-height: 1.7; color: ${BODY}; white-space: pre-line">${e(m.bio || c('profile.no_bio'))}</p>
<div data-reveal="1" style="display: flex; flex-wrap: wrap; gap: 40px; margin-top: 10px">${stat(pubs.length, c('profile.pubs_label'))}${pubs.length ? stat(range(pubs.map((p) => p.year)), c('profile.range_label'), false) : ''}</div>
</div></div></section>
<section style="${WRAP}; padding-top: 90px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 30px">
${h2(e(c('profile.pubs_title')))}
${tl ? `<div style="border-bottom: 1px solid ${LINE}">${tl}</div>` : `<p style="margin: 0; color: ${DIM}">${e(c('profile.no_pubs'))}</p>`}
</section>
${footer(c)}`;
}

// ================================================================ PROJECTS
export function pProjects(c, d) {
  const ps = d.projects;
  const order = items(c('proj.categories')).filter(Boolean);
  const found = [...new Set(ps.map((p) => p.category).filter(Boolean))];
  const cats = order.length ? order.filter((x) => found.includes(x)).concat(found.filter((x) => !order.includes(x))) : found.sort();
  const chips = [['all', c('proj.all')]].concat(cats.map((x) => [slug(x), x]));
  const cards = ps.map((p) => {
    const cover = p.cover_image || (media(p.gallery).find((x) => x.type !== 'video') || {}).url;
    const med = cover ? `<img class="zoom" src="${e(cover)}" alt="${e(p.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block">` : '<canvas data-mini="wave" aria-hidden="true" style="display: block; width: 100%; height: 100%"></canvas>';
    return `<a class="tilt" data-tilt="1" data-card="1" data-tags="${e(slug(p.category))}" href="/projects/${e(p.slug)}" style="display: flex; flex-direction: column; border-radius: 24px; border: 1px solid ${LINE}; background-color: #070C1A; overflow: hidden; text-decoration: none; color: inherit">
<span style="display: block; aspect-ratio: 16 / 10; overflow: hidden; background: #0B1530">${med}</span>
<span style="display: flex; flex-direction: column; gap: 12px; padding: 24px 26px 28px">
<span style="${MONO}; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #7FA4FF">${e([p.category, p.year].filter(Boolean).join(' · '))}</span>
<span style="${SORA}; font-weight: 700; font-size: 21px; line-height: 1.3; color: ${INK}">${e(p.name)}</span>
${p.short_description ? `<span style="font-size: 15px; line-height: 1.6; color: ${BODY}">${e(p.short_description)}</span>` : ''}
<span style="${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #AFC6FF; margin-top: 4px">${e(c('proj.view'))} →</span>
</span></a>`;
  }).join('');
  return header(c, 'projects') + pageHero(c('proj.kicker'), c('proj.title'), c('proj.sub')) + `
<section data-filter-scope="1" style="${WRAP}; padding-top: 60px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 32px">
${cats.length > 1 ? `<div role="group" aria-label="Filter kategori" style="display: flex; flex-wrap: wrap; gap: 8px">${chips.map(([k, l], i) => chipBtn(k, l, i === 0)).join('')}</div>` : ''}
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(380px, 100%), 1fr)); gap: 20px">${cards}</div>
<p data-empty="1" style="display: ${ps.length ? 'none' : 'block'}; margin: 0; color: ${DIM}">${e(c('proj.empty'))}</p>
</section>
${footer(c)}`;
}

const kv = (x) => {
  if (x == null) return [];
  if (Array.isArray(x)) return x.map((it) => (typeof it === 'object' && it ? [it.label || it.key || it.name || it.title || '', it.value || it.desc || it.url || ''] : ['', String(it)]));
  if (typeof x === 'object') return Object.entries(x).map(([k, v]) => [k, String(v)]);
  return lines(x).map((l) => { const i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : ['', l]; });
};
const text = (x) => (Array.isArray(x) ? x.map((v) => (typeof v === 'object' && v ? v.title || v.value || v.label || '' : v)).filter(Boolean).join('\n') : x || '');
const statusLbl = { ongoing: 'Ongoing', selesai: 'Selesai', done: 'Selesai', completed: 'Selesai', prototype: 'Prototype', planned: 'Planned' };

export function pProject(c, d) {
  const p = d.project, cover = p.cover_image;
  const gal = (cover && !media(p.gallery).some((m) => m.url === cover) ? [{ url: cover, type: 'image' }] : []).concat(media(p.gallery));
  const meta = [[c('project.m_year'), p.year], [c('project.m_status'), statusLbl[String(p.status || '').toLowerCase()] || p.status], [c('project.m_dev'), text(p.developers)], [c('project.m_sup'), text(p.supervisor)]].filter(([, v]) => v);
  const metaH = meta.map(([a, b]) => `<div style="display: flex; flex-direction: column; gap: 6px; padding: 18px 0; border-top: 1px solid ${LINE}"><span style="${MONO}; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: ${DIM}">${e(a)}</span><span style="${SORA}; font-weight: 600; font-size: 17px; color: ${INK}; white-space: pre-line">${e(b)}</span></div>`).join('');
  const sec = (t, body) => `<section data-reveal="1" style="display: flex; flex-direction: column; gap: 14px; padding: 34px 0; border-top: 1px solid ${LINE}"><h2 style="margin: 0; ${SORA}; font-weight: 700; font-size: 28px; letter-spacing: -.02em; color: ${INK}">${e(t)}</h2>${body}</section>`;
  const para = (s) => `<p style="margin: 0; font-size: 17px; line-height: 1.8; color: ${BODY}; white-space: pre-line">${e(s)}</p>`;
  const ul = (arr) => `<ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 16.5px; line-height: 1.7; color: ${BODY}">${arr.map((x) => `<li>${e(x)}</li>`).join('')}</ul>`;
  let secs = '';
  if (p.overview) secs += sec(c('project.overview'), para(p.overview));
  if (p.purpose) secs += sec(c('project.purpose'), para(p.purpose));
  if (p.how_it_works) secs += sec(c('project.how'), para(text(p.how_it_works)));
  const appl = kv(p.applications).map(([a, b]) => (a ? `${a}: ${b}` : b)).filter(Boolean);
  if (appl.length) secs += sec(c('project.apps'), appl.length > 1 ? ul(appl) : para(appl[0]));
  const specs = kv(p.specifications).filter(([, b]) => b);
  if (specs.length) secs += sec(c('project.specs'), `<dl style="margin: 0; display: grid; grid-template-columns: minmax(140px, auto) 1fr; gap: 10px 24px; font-size: 15.5px">${specs.map(([a, b]) => `<dt style="color: ${DIM}">${e(a || '•')}</dt><dd style="margin: 0; color: #DCE4F7">${e(b)}</dd>`).join('')}</dl>`);
  const outs = kv(p.outputs).map(([a, b]) => (a ? `${a}: ${b}` : b)).filter(Boolean);
  if (outs.length) secs += sec(c('project.outputs'), outs.length > 1 ? ul(outs) : para(outs[0]));
  const rel = list(p.related_publications).map((x) => (typeof x === 'object' && x ? x : { title: String(x) })).filter((x) => x.title || x.url);
  if (rel.length) secs += sec(c('project.pubs'), `<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px">${rel.map((x) => `<li style="font-size: 16px; line-height: 1.6">${x.url ? `<a href="${e(x.url)}" target="_blank" rel="noopener">${e(x.title || x.url)} →</a>` : `<span style="color: #DCE4F7">${e(x.title)}</span>`}</li>`).join('')}</ul>`);
  const docs = gal.map((m, i) => mediaTile(m, `${p.name} · ${i + 1}`, '4 / 3')).join('');
  const heroBg = '<canvas data-cv="eeg" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; opacity: .9; cursor: crosshair"></canvas>';
  return header(c, 'projects') + `
<section style="position: relative; min-height: 680px; display: flex; align-items: flex-end; overflow: hidden">
${heroBg}
<div aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(3,6,15,.6) 0%, rgba(3,6,15,.1) 40%, rgba(3,6,15,1) 95%); pointer-events: none"></div>
<div style="position: relative; z-index: 2; width: 100%; ${WRAP}; padding-top: 150px; padding-bottom: 64px; display: flex; flex-direction: column; gap: 20px; pointer-events: none">
<a href="/projects" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; ${MONO}; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; pointer-events: auto">${e(c('project.back'))}</a>
${mono(e([p.category, p.year].filter(Boolean).join(' · ')), '#AFC6FF')}
<h1 style="margin: 0; max-width: 1000px; ${SORA}; font-weight: 800; font-size: clamp(36px, 5vw, 76px); line-height: 1; letter-spacing: -.035em; color: ${INK}">${e(p.name)}</h1>
${p.short_description ? `<p style="margin: 0; max-width: 620px; font-size: 18px; line-height: 1.65; color: #DCE4F7">${e(p.short_description)}</p>` : ''}
</div></section>
<div style="${WRAP}; padding-top: 50px; padding-bottom: 60px; display: flex; flex-wrap: wrap; gap: 40px 80px; align-items: flex-start">
<div style="flex: 999 1 560px; min-width: 0; border-bottom: 1px solid ${LINE}">${secs}</div>
${metaH ? `<aside style="flex: 1 1 280px; position: sticky; top: 30px; display: flex; flex-direction: column; border-bottom: 1px solid ${LINE}">${metaH}</aside>` : ''}
</div>
${docs ? `<section style="${WRAP}; padding-top: 40px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 30px">
${h2(e(c('project.docs')))}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 16px">${docs}</div>
</section>` : '<div style="height: 80px"></div>'}
${lightbox(c)}
${footer(c)}`;
}

// ================================================================ LAB
export function pLab(c, d) {
  const all = d.lab;
  const tile = (p, i, n) => p.media_type === 'video' && p.video_url
    ? `<div data-reveal="1" style="margin: 0 0 16px; break-inside: avoid; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}"><video src="${e(p.video_url)}" controls preload="metadata" playsinline style="width: 100%; height: auto; display: block; background: #03060F"></video></div>`
    : `<a href="#" data-lb-src="${e(p.photo_url)}" data-lb-cap="${e(p.title || (p.category === 'kegiatan' ? c('lab.tab_keg') : c('lab.tab_fas')))} · ${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}" data-reveal="1" style="display: block; margin: 0 0 16px; break-inside: avoid; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; cursor: zoom-in"><img class="zoom" src="${e(p.photo_url)}" alt="${e(p.title || 'Lab SPIS')}" loading="lazy" style="width: 100%; height: auto; display: block"></a>`;
  const grid = (arr) => (arr.length ? `<div style="column-width: 340px; column-gap: 16px">${arr.map((p, i) => tile(p, i, arr.length)).join('')}</div>` : `<div style="border: 1px dashed rgba(140,155,192,.35); border-radius: 24px; padding: 60px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center">
<canvas data-mini="wave" aria-hidden="true" style="display: block; width: 260px; height: 90px"></canvas>
<p style="margin: 0; ${SORA}; font-weight: 600; font-size: 22px; color: ${INK}">${e(c('lab.empty_title'))}</p>
<p style="margin: 0; max-width: 420px; font-size: 15px; line-height: 1.6; color: ${DIM}">${e(c('lab.empty_text'))}</p></div>`);
  const fas = all.filter((p) => p.category !== 'kegiatan' && (p.photo_url || p.video_url)), keg = all.filter((p) => p.category === 'kegiatan' && (p.photo_url || p.video_url));
  return header(c, 'lab') + pageHero(c('lab.kicker'), c('lab.title'), c('lab.sub')) + `
<section data-tabs="1" style="${WRAP}; padding-top: 50px; padding-bottom: 120px; display: flex; flex-direction: column; gap: 32px">
<div role="tablist" aria-label="Kategori" style="display: flex; flex-wrap: wrap; gap: 8px">${tabBtn('fas', `${c('lab.tab_fas')} · ${fas.length}`, 'true')}${tabBtn('keg', `${c('lab.tab_keg')} · ${keg.length}`, 'false')}</div>
<div data-panel="fas">${grid(fas)}</div>
<div data-panel="keg" hidden="">${grid(keg)}</div>
</section>
${lightbox(c)}
${footer(c)}`;
}

export function pNotFound(c) {
  return header(c, '') + pageHero('404', 'Halaman tidak ditemukan', 'Sinyalnya hilang. Coba kembali ke beranda.', `<div style="margin-top: 8px">${btn(c('daftar.btn_home'), '/')}</div>`) + footer(c);
}
