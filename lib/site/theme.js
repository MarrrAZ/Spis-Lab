// Tema gelap/terang: warna gelap ditulis apa adanya di markup, lalu dipetakan ke
// CSS variable supaya tombol bulan/matahari bisa mengganti semuanya sekaligus.
export const DARK = {
  bg: '#03060F', surface: '#070C1A', surface2: '#050A18', 'surface-hover': '#0B1530', card: '#071233', 'card-deep': '#060D22', 'card-mid': '#0A1638',
  glow: '#0B1E4D', glow2: '#0E2560', glow3: '#1B3D9C', 'brand-deep': '#12285F', ph: '#1B2B55', 'chip-on': '#E8EEFF', 'btn-bg': '#FFFFFF', 'btn-ink': '#03060F',
  foot1: '#08112A', foot2: '#050914',
  'ink-strong': '#FFFFFF', ink: '#F2F5FF', body2: '#DCE4F7', body: '#AFBCD9', 'accent-ink': '#AFC6FF', dim: '#8FA6D9', accent: '#7FA4FF', dim2: '#6F7FA6', danger: '#FF9B9B',
  'bg-rgb': '3,6,15', 'glow-rgb': '11,30,77', 'line-rgb': '140,155,192', 'tint-rgb': '175,198,255', 'ink-rgb': '232,238,255', 'hi-rgb': '255,255,255', 'shadow-rgb': '0,0,0',
};
// Tema terang terpilih: "Putih bersih + biru SPIS"
export const LIGHT = {
  bg: '#FFFFFF', surface: '#F4F7FD', surface2: '#F6F8FD', 'surface-hover': '#EAF0FC', card: '#EEF3FD', 'card-deep': '#FFFFFF', 'card-mid': '#F2F6FE',
  glow: '#DCE7FD', glow2: '#D2E0FB', glow3: '#C6D7FA', 'brand-deep': '#E3ECFC', ph: '#DCE5F7', 'chip-on': '#0B1A44', 'btn-bg': '#0B1A44', 'btn-ink': '#FFFFFF',
  foot1: '#F1F5FD', foot2: '#E6EDFB',
  'ink-strong': '#08122E', ink: '#0F1B3D', body2: '#26324F', body: '#46526E', 'accent-ink': '#2453C9', dim: '#5D6A88', accent: '#2F63D6', dim2: '#6F7C99', danger: '#C0392B',
  'bg-rgb': '255,255,255', 'glow-rgb': '214,226,252', 'line-rgb': '70,90,140', 'tint-rgb': '47,99,214', 'ink-rgb': '10,21,48', 'hi-rgb': '10,21,48', 'shadow-rgb': '20,40,90',
};

const decl = (m) => Object.entries(m).map(([k, v]) => `--${k}:${v}`).join(';');
const L = (sel) => `[data-root][data-theme="light"] ${sel},html[data-theme="light"] [data-root] ${sel}`;

export function themeCss() {
  return [
    `[data-root],[data-root] [data-intro]{${decl(DARK)}}`,
    `[data-root][data-theme="light"],html[data-theme="light"] [data-root]{${decl(LIGHT)};color-scheme:light}`,
    `${L('[data-intro]')}{${decl(DARK)}}`,
    `${L('canvas:not([data-cv="logo3d"])')}{filter:invert(1) hue-rotate(180deg)}`,
    `${L('[data-intro] canvas')}{filter:none}`,
    `${L('[data-sky]>div')}{filter:invert(1) hue-rotate(180deg);opacity:.7}`,
    `.lg-l{display:none!important}${L('.lg-d')}{display:none!important}${L('.lg-l')}{display:block!important}${L('[data-intro] .lg-d')}{display:block!important}${L('[data-intro] .lg-l')}{display:none!important}`,
    `${L('.gp-base')}{filter:grayscale(1) brightness(1.06) contrast(.9)!important;opacity:.9}${L('.gp-ov')}{opacity:.25}`,
    `${L('.ph-wrap')}{background:var(--ph)}`,
    `html[data-theme="light"] body{background:${LIGHT.bg}}`,
    '[data-root]{transition:background-color .5s,color .5s}',
    '.thm{position:relative;display:inline-flex;align-items:center;gap:0;min-height:44px;min-width:84px;padding:4px;border-radius:999px;border:1px solid rgba(var(--tint-rgb),.4);background:rgba(var(--hi-rgb),.04);cursor:pointer;box-sizing:border-box}',
    '.thm .k{position:absolute;top:4px;left:4px;width:36px;height:34px;border-radius:999px;background:var(--btn-bg);transition:transform .45s cubic-bezier(.2,.8,.2,1),background-color .4s}',
    `${L('.thm .k')}{transform:translateX(38px)}`,
    '.thm .i{position:relative;z-index:1;width:38px;height:34px;display:flex;align-items:center;justify-content:center;color:var(--body);transition:color .35s}',
    `.thm .i-m{color:var(--btn-ink)}${L('.thm .i-m')}{color:var(--body)}${L('.thm .i-s')}{color:var(--btn-ink)}`,
    '.thm svg{width:17px;height:17px}.thm:hover{border-color:rgba(var(--tint-rgb),.8)}',
  ].join('\n');
}

export const TOGGLE = '<button type="button" class="thm" data-theme-toggle="1" aria-label="Ganti tema terang atau gelap" aria-pressed="false" title="Tema terang / gelap">'
  + '<span class="k" aria-hidden="true"></span>'
  + '<span class="i i-m" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"></path></svg></span>'
  + '<span class="i i-s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"></path></svg></span>'
  + '</button>';

const RGBA = { '3,6,15': 'bg-rgb', '11,30,77': 'glow-rgb', '14,37,96': 'glow-rgb', '140,155,192': 'line-rgb', '175,198,255': 'tint-rgb', '232,238,255': 'ink-rgb', '255,255,255': 'hi-rgb', '0,0,0': 'shadow-rgb' };
const C_COLOR = { '#FFFFFF': 'ink-strong', '#FFF': 'ink-strong', '#F2F5FF': 'ink', '#E8EEFF': 'ink', '#E6EEFF': 'ink', '#D6E2FF': 'ink', '#DCE4F7': 'body2', '#AFBCD9': 'body', '#AFC6FF': 'accent-ink', '#8FA6D9': 'dim', '#7FA4FF': 'accent', '#6F7FA6': 'dim2', '#5F72A0': 'dim2', '#03060F': 'btn-ink', '#FF9B9B': 'danger' };
const C_BG = { '#FFFFFF': 'btn-bg', '#FFF': 'btn-bg', '#03060F': 'bg', '#070C1A': 'surface', '#050A18': 'surface2', '#0B1530': 'surface-hover', '#071233': 'card', '#060D22': 'card-deep', '#0A1638': 'card-mid', '#0B1E4D': 'glow', '#0E2560': 'glow2', '#1B3D9C': 'glow3', '#12285F': 'brand-deep', '#1B2B55': 'ph', '#E8EEFF': 'chip-on', '#08112A': 'foot1', '#050914': 'foot2' };
const C_BORDER = { '#E8EEFF': 'ink', '#03060F': 'bg', '#FFFFFF': 'ink-strong' };
const HEX = /#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g;
const RG = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([.\d]+)\s*\)/g;

function mapDecl(prop, val) {
  const p = prop.trim().toLowerCase();
  if (p.startsWith('--')) return val;
  val = val.replace(RG, (m, a, b, c, al) => { const k = RGBA[`${a},${b},${c}`]; return k ? `rgba(var(--${k}),${al})` : m; });
  let table = null;
  if (p === 'color' || p === 'fill' || p === 'stroke' || p === 'caret-color') table = C_COLOR;
  else if (p.startsWith('background')) table = C_BG;
  else if (p.startsWith('border') || p.startsWith('outline')) table = C_BORDER;
  if (!table) return val;
  return val.replace(HEX, (m) => (table[m.toUpperCase()] ? `var(--${table[m.toUpperCase()]})` : m));
}
function txDecls(body) {
  return body.split(';').map((d) => { const i = d.indexOf(':'); if (i < 0) return d; return d.slice(0, i) + ':' + mapDecl(d.slice(0, i), d.slice(i + 1)); }).join(';');
}
export function themeTx(html) {
  return html.replace(/style="([^"]*)"/g, (m, s) => `style="${txDecls(s)}"`);
}
export function themeTxCss(css) {
  return css.replace(/\{([^{}]*)\}/g, (m, b) => `{${txDecls(b)}}`);
}
export function swapLogos(html, white, blue) {
  const re = new RegExp(`<img src="${white.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g');
  return html.replace(re, (tag) => {
    if (tag.includes('lg-d')) return tag;
    const d = tag.replace('<img ', '<img class="lg-d" ');
    const l = tag.replace(white, blue).replace('<img ', '<img class="lg-l" aria-hidden="true" ').replace(' alt="SPIS Laboratory"', ' alt=""');
    return d + l;
  });
}
