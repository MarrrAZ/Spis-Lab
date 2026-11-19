/* eslint-disable */
// SPIS Lab — runtime motion graphic & interaksi (logo 3D, intro, kanvas sinyal, filter, formulir, tema).
// Dipasang sekali per halaman oleh components/runtime.jsx. Semua elemen dicari lewat atribut data-*.
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(o) { Object.assign(this.state, o); if (this.onState) this.onState(); }
}

class Component extends DCLogic {
  state = { introOn: false };

  skip = () => { this.introReq = 0; if (this.intro) this.endIntro(true); else if (this.state.introOn) this.setState({ introOn: false }); };
  replay = () => { if (this.reduced) return; this.killIntro(); this.introReq = performance.now(); if (!this.state.introOn) this.setState({ introOn: true }); };

  componentDidMount() {
    this.binds = []; this.bound = new WeakSet(); this.minis = []; this.fields = []; this.fc = 0; this.drags = []; this.counts = []; this.paras = [];
    try { this.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { this.reduced = false; }
    if (this.state.introOn) { if (this.reduced || this.props.intro === false) this.setState({ introOn: false }); else this.introReq = performance.now(); }
    this.last = performance.now();
    const tick = (now) => {
      if (this.dead) return;
      try { this.frame(now); } catch (err) { if (!this.errLogged) { this.errLogged = true; console.error('[SPIS]', err); } }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
  componentWillUnmount() {
    this.dead = true; cancelAnimationFrame(this.raf);
    (this.binds || []).forEach((b) => b[0].removeEventListener(b[1], b[2]));
    if (this.io) this.io.disconnect();
    this.killIntro();
    if (this.logo && this.logo.renderer) this.logo.renderer.dispose();
  }

  T() { return typeof window !== 'undefined' ? window.THREE : null; }
  on(el, type, fn, opt) { el.addEventListener(type, fn, opt); this.binds.push([el, type, fn]); }
  still() { return this.props.motion === false || this.reduced; }
  once(el) { if (this.bound.has(el)) return false; this.bound.add(el); return true; }
  visible(el) { const r = el.getBoundingClientRect(), vh = window.innerHeight || 100000; return r.bottom > -60 && r.top < vh + 60 && r.width > 0; }
  ease(a, b, t) { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); }
  ctxFor(cv) {
    const w = Math.max(1, cv.clientWidth), h = Math.max(1, cv.clientHeight), dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { ctx, w, h };
  }

  /* ------------------------------------------------------------ wiring */
  ensure() {
    const d = document, q = (s) => d.querySelector(s), qa = (s) => Array.from(d.querySelectorAll(s));
    const root = q('[data-root]');
    if (root && this.once(root)) root.classList.add('rv-on');
    if (root && !root.__thm) { root.__thm = 1; let t = null; try { t = localStorage.getItem('spis-theme'); } catch (e) {} if (!t) t = document.documentElement.getAttribute('data-theme') || root.getAttribute('data-theme-init'); if (t === 'light' || t === 'dark') this.applyTheme(t, false); }
    qa('[data-theme-toggle]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { const r = q('[data-root]'); this.applyTheme(r && r.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true); }); });
    const sky = q('[data-sky]');
    if (sky && this.once(sky)) this.buildSky(sky);
    const iv = q('[data-intro]');
    if (iv && this.introReq && (!this.intro || this.intro.el !== iv)) this.startIntro(iv);
    const lc = q('canvas[data-cv="logo3d"]');
    if (lc && (!this.logo || this.logo.cv !== lc)) this.startLogo(lc);
    qa('canvas[data-mini]').forEach((cv) => {
      if (!this.once(cv)) return;
      const host = cv.closest('[data-card]') || cv.parentElement;
      const m = { cv, kind: cv.getAttribute('data-mini'), hot: 0, hover: false, t: Math.random() * 10, state: null };
      this.minis.push(m);
      this.on(host, 'pointerenter', () => { m.hover = true; });
      this.on(host, 'pointerleave', () => { m.hover = false; });
    });
    qa('canvas[data-cv="field"]').forEach((cv) => {
      if (!this.once(cv)) return;
      const F = { cv, t: Math.random() * 5, mx: 0.7, my: 0.4, tx: 0.7, ty: 0.4, lines: +(cv.getAttribute('data-lines') || 34), tone: cv.getAttribute('data-tone') || 'blue' };
      const host = cv.parentElement; this.fields.push(F);
      this.on(host, 'pointermove', (e) => { const r = host.getBoundingClientRect(); F.tx = (e.clientX - r.left) / r.width; F.ty = (e.clientY - r.top) / r.height; });
    });
    qa('canvas[data-cv="recruit"], canvas[data-cv="beacon"]').forEach((cv) => {
      if (!this.once(cv)) return;
      const host = cv.parentElement, R = { cv, kind: cv.getAttribute('data-cv'), v: cv.getAttribute('data-variant') || 'net', t: Math.random() * 3, mx: -1, my: -1, inside: false, st: null, ripples: [], lastRip: 0 };
      this.recs = this.recs || []; this.recs.push(R);
      this.on(host, 'pointermove', (e) => { const r = cv.getBoundingClientRect(); R.mx = e.clientX - r.left; R.my = e.clientY - r.top; R.inside = true; });
      this.on(host, 'pointerleave', () => { R.inside = false; });
    });
    qa('[data-type]').forEach((el) => { if (!this.once(el)) return; let w = []; try { w = JSON.parse(el.getAttribute('data-type')); } catch (e) {} this.types = this.types || []; this.types.push({ el, w, wi: 0, ci: w[0] ? w[0].length : 0, ph: 'hold', tm: 2.2 }); });
    qa('[data-term]').forEach((el) => { if (!this.once(el)) return; let L = []; try { L = JSON.parse(el.getAttribute('data-term')); } catch (e) {} this.terms = this.terms || []; this.terms.push({ el, L, li: 0, ci: 0, tm: 0.6, done: false }); });
    qa('canvas[data-cv="slotnet"]').forEach((cv) => { if (!this.once(cv)) return; this.slotnets = this.slotnets || []; this.slotnets.push({ cv, grid: cv.parentElement, t: 0, pulses: [] }); });
    qa('canvas[data-cv="halo"]').forEach((cv) => { if (!this.once(cv)) return; const H = { cv, t: 0, mx: -999, my: -999, inside: false, mask: null }; this.halos = this.halos || []; this.halos.push(H); this.on(cv.parentElement, 'pointermove', (e) => { const r = cv.getBoundingClientRect(); H.mx = e.clientX - r.left; H.my = e.clientY - r.top; H.inside = true; }); this.on(cv.parentElement, 'pointerleave', () => { H.inside = false; }); });
    qa('[data-fsteps]').forEach((W) => { if (this.once(W)) this.initForm(W); });
    qa('[data-copy]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { try { navigator.clipboard.writeText(b.getAttribute('data-copy')); } catch (e) {} const t = b.textContent; b.textContent = 'Tersalin ✓'; setTimeout(() => { b.textContent = t; }, 1600); }); });
    qa('[data-status-check]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => this.checkStatus(b)); });
    qa('[data-export]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { const t = q('[data-toast]'); if (!t) return; t.textContent = '⤓ ' + b.getAttribute('data-export') + ' — 37 pendaftar, semua jawaban + link berkas (contoh di mockup)'; t.setAttribute('data-show', '1'); clearTimeout(this.toastT); this.toastT = setTimeout(() => t.removeAttribute('data-show'), 3200); }); });
    qa('[data-toggle-chip]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')); });
    qa('[data-qb]').forEach((B) => { if (!this.once(B)) return; this.on(B.parentElement, 'click', (ev) => {
      const t = ev.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-qdel')) { const c = t.closest('[data-qcard]'); if (c) c.remove(); }
      else if (t.hasAttribute('data-qdup')) { const c = t.closest('[data-qcard]'); if (c) { const n = c.cloneNode(true); c.after(n); } }
      else if (t.hasAttribute('data-qadd') || t.hasAttribute('data-qaddsec')) { const tpl = B.querySelector('template[data-qtpl]'), secs = B.querySelectorAll('[data-qsec]'), last = secs[secs.length - 1]; if (!tpl || !last) return; const n = tpl.content.firstElementChild.cloneNode(true); last.appendChild(n); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); const inp = n.querySelector('input'); if (inp) { inp.focus(); inp.select(); } this.ensure(); }
    }); });
    const eeg = q('canvas[data-cv="eeg"]');
    if (eeg && this.once(eeg)) { this.eeg = { cv: eeg, t: 0, hx: null }; this.on(eeg, 'pointermove', (e) => { const r = eeg.getBoundingClientRect(); this.eeg.hx = (e.clientX - r.left) / r.width; }); this.on(eeg, 'pointerleave', () => { this.eeg.hx = null; }); }
    const org = q('canvas[data-cv="org"]');
    if (org && this.once(org)) this.startOrg(org);
    qa('[data-mag]').forEach((el) => {
      if (!this.once(el)) return;
      this.on(el, 'pointermove', (e) => { if (this.still()) return; const r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.38).toFixed(1) + 'px)'; });
      this.on(el, 'pointerleave', () => { el.style.transform = ''; });
    });
    qa('[data-spot]').forEach((el) => {
      if (!this.once(el)) return;
      this.on(el, 'pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });
    qa('[data-tilt]').forEach((el) => {
      if (!this.once(el)) return;
      this.on(el, 'pointermove', (e) => {
        if (this.still()) return;
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 8).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 10).toFixed(2) + 'deg) translateZ(0)';
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      this.on(el, 'pointerleave', () => { el.style.transform = ''; });
    });
    qa('[data-flash-photo]').forEach((el) => {
      if (!this.once(el)) return;
      const P = { el, x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, r: 0, tr: 0, hs: Array.from(el.querySelectorAll('[data-hs]')) };
      this.flashes = this.flashes || []; this.flashes.push(P);
      this.on(el, 'pointermove', (e) => { const r = el.getBoundingClientRect(); P.tx = (e.clientX - r.left) / r.width; P.ty = (e.clientY - r.top) / r.height; P.tr = 1; P.inside = true; });
      this.on(el, 'pointerleave', () => { P.tr = 0; P.inside = false; });
    });
    qa('[data-drag-track]').forEach((tr) => {
      if (!this.once(tr)) return;
      const D = { tr, x: 0, v: 0, drag: false, moved: 0, last: 0 };
      this.drags.push(D);
      this.on(tr, 'pointerdown', (e) => { D.drag = true; D.moved = 0; D.px = e.clientX; D.v = 0; tr.style.cursor = 'grabbing'; try { tr.setPointerCapture(e.pointerId); } catch (_) {} });
      this.on(tr, 'pointermove', (e) => { if (!D.drag) return; const dx = e.clientX - D.px; D.px = e.clientX; D.x += dx; D.v = dx; D.moved += Math.abs(dx); });
      const up = () => { D.drag = false; tr.style.cursor = 'grab'; };
      this.on(tr, 'pointerup', up); this.on(tr, 'pointercancel', up);
      this.on(tr, 'click', (e) => { if (D.moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    });
    qa('[data-tabs]').forEach((g) => {
      if (!this.once(g)) return;
      const btns = Array.from(g.querySelectorAll('[data-tab]')), panels = Array.from(g.querySelectorAll('[data-panel]'));
      const pick = (k) => { btns.forEach((b) => b.setAttribute('aria-selected', b.getAttribute('data-tab') === k ? 'true' : 'false')); panels.forEach((p) => { p.hidden = p.getAttribute('data-panel') !== k; }); if (this.orgState) this.orgState.dirty = true; };
      btns.forEach((b) => this.on(b, 'click', () => pick(b.getAttribute('data-tab'))));
    });
    qa('[data-filter-scope]').forEach((s) => {
      if (!this.once(s)) return;
      const chips = Array.from(s.querySelectorAll('[data-filter]')), items = Array.from(s.querySelectorAll('[data-tags]')), search = s.querySelector('[data-search]'), empty = s.querySelector('[data-empty]'), countEl = s.querySelector('[data-shown]');
      let cur = 'all', text = '';
      const apply = () => {
        let n = 0;
        items.forEach((it) => {
          const tags = ' ' + it.getAttribute('data-tags') + ' ';
          const ok = (cur === 'all' || tags.indexOf(' ' + cur + ' ') >= 0) && (!text || it.textContent.toLowerCase().indexOf(text) >= 0);
          if (it.__disp === undefined) it.__disp = it.style.display; it.style.display = ok ? it.__disp : 'none'; if (ok) n++;
        });
        if (empty) empty.style.display = n ? 'none' : '';
        if (countEl) countEl.textContent = String(n);
      };
      chips.forEach((c) => this.on(c, 'click', () => { cur = c.getAttribute('data-filter'); chips.forEach((x) => x.setAttribute('aria-pressed', x === c ? 'true' : 'false')); apply(); }));
      if (search) this.on(search, 'input', () => { text = search.value.trim().toLowerCase(); apply(); });
    });
    const lb = q('[data-lb]');
    if (lb && this.once(lb)) {
      const img = lb.querySelector('[data-lb-img]'), cap = lb.querySelector('[data-lb-cap]');
      const items = qa('[data-lb-src]'); let idx = 0;
      const show = (i) => { idx = (i + items.length) % items.length; const it = items[idx]; img.setAttribute('src', it.getAttribute('data-lb-src')); if (cap) cap.textContent = it.getAttribute('data-lb-cap') || ''; lb.setAttribute('data-open', '1'); };
      items.forEach((it, i) => this.on(it, 'click', (e) => { e.preventDefault(); show(i); }));
      const close = () => lb.removeAttribute('data-open');
      lb.querySelectorAll('[data-lb-close]').forEach((b) => this.on(b, 'click', close));
      const pv = lb.querySelector('[data-lb-prev]'), nx = lb.querySelector('[data-lb-next]');
      if (pv) this.on(pv, 'click', () => show(idx - 1)); if (nx) this.on(nx, 'click', () => show(idx + 1));
    }
    qa('[data-drawer-open]').forEach((b) => {
      if (!this.once(b)) return;
      this.on(b, 'click', () => { const dr = q('[data-drawer="' + b.getAttribute('data-drawer-open') + '"]'); if (dr) dr.setAttribute('data-open', '1'); });
    });
    qa('[data-drawer-close]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { const dr = b.closest('[data-drawer]'); if (dr) dr.removeAttribute('data-open'); }); });
    qa('[data-menu-open]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { const m = q('[data-menu]'); if (m) { const open = m.getAttribute('data-open') === '1'; if (open) m.removeAttribute('data-open'); else m.setAttribute('data-open', '1'); b.setAttribute('aria-expanded', open ? 'false' : 'true'); } }); });
    qa('[data-toggle]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')); });
    qa('[data-pw-toggle]').forEach((b) => { if (!this.once(b)) return; this.on(b, 'click', () => { const inp = q('#' + b.getAttribute('data-pw-toggle')); if (!inp) return; const show = inp.getAttribute('type') === 'password'; inp.setAttribute('type', show ? 'text' : 'password'); b.textContent = show ? 'Hide' : 'Show'; }); });
    qa('[data-count]').forEach((el) => { if (!this.once(el)) return; this.counts.push({ el, to: +el.getAttribute('data-count'), t: -1 }); });
    qa('[data-parallax]').forEach((el) => { if (!this.once(el)) return; this.paras.push({ el, f: +el.getAttribute('data-parallax') }); });
    if (!this.io && typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); this.io.unobserve(en.target); } }), { threshold: 0.12 });
    }
    qa('[data-reveal]').forEach((el) => { if (!this.once(el)) return; if (this.io && !this.still()) this.io.observe(el); else el.classList.add('in'); });
  }

  frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000)); this.last = now;
    if (this.fc++ % 20 === 0) this.ensure();
    if (this.fc % 15 === 0) { const vh = window.innerHeight || 900; const pend = document.querySelectorAll('[data-reveal]:not(.in)'); for (let i = 0; i < pend.length; i++) { const r = pend[i].getBoundingClientRect(); if (r.top < vh * 0.94 && r.bottom > 0) pend[i].classList.add('in'); } }
    if (this.intro) this.stepIntro(now, dt);
    if (this.intro && this.intro.cover) return;
    if (this.logo) this.stepLogo(now, dt);
    for (let i = 0; i < this.minis.length; i++) this.stepMini(this.minis[i], dt);
    for (let i = 0; i < this.fields.length; i++) this.stepField(this.fields[i], dt);
    if (this.eeg) this.stepEeg(dt);
    if (this.orgState) this.stepOrg(dt);
    if (this.flashes) this.flashes.forEach((P) => this.stepFlash(P, dt));
    if (this.types) this.types.forEach((T) => this.stepType(T, dt));
    if (this.terms) this.terms.forEach((T) => this.stepTerm(T, dt));
    if (this.slotnets) this.slotnets.forEach((N) => this.stepSlotNet(N, dt));
    if (this.halos) this.halos.forEach((H) => this.stepHalo(H, dt));
    if (this.recs) for (let i = 0; i < this.recs.length; i++) { const R = this.recs[i]; if (R.kind === 'beacon') this.stepBeacon(R, dt); else this.stepRecruit(R, dt); }
    for (let i = 0; i < this.drags.length; i++) this.stepDrag(this.drags[i], dt);
    for (let i = 0; i < this.counts.length; i++) this.stepCount(this.counts[i], dt);
    if (!this.still()) for (let i = 0; i < this.paras.length; i++) { const p = this.paras[i], r = p.el.parentElement.getBoundingClientRect(), vh = window.innerHeight || 900; if (r.bottom < 0 || r.top > vh) continue; p.el.style.transform = 'translate3d(0,' + (((r.top + r.height / 2) - vh / 2) * p.f).toFixed(1) + 'px,0)'; }
  }

  initForm(W) {
    const panels = Array.from(W.querySelectorAll('[data-fstep]')), total = +W.getAttribute('data-total'), go = Array.from(W.querySelectorAll('[data-fgo]'));
    const prog = W.querySelector('[data-fprog]'), cnt = W.querySelector('[data-fcount]'), side = W.querySelector('.fside');
    let cur = 0, maxOk = 0;
    const show = (k, scroll) => {
      panels.forEach((p) => { p.hidden = p.getAttribute('data-fstep') !== String(k); });
      if (k === 'done') { if (side) side.style.display = 'none'; } else { cur = k; go.forEach((g, i) => { g.setAttribute('aria-current', i === k ? 'step' : 'false'); if (i < k) g.setAttribute('data-done', '1'); }); if (prog) prog.style.width = ((k + 1) / total * 100) + '%'; if (cnt) cnt.textContent = (cnt.getAttribute('data-fmt') || 'Bagian {n} dari {t}').replace('{n}', k + 1).replace('{t}', total); }
      if (k === total - 1) this.buildReview(W);
      if (scroll) { const top = W.getBoundingClientRect().top + window.scrollY - 30; window.scrollTo({ top, behavior: 'smooth' }); }
    };
    const valid = (k) => {
      const p = panels[k]; if (!p) return true; let bad = 0, first = null;
      p.querySelectorAll('[data-q]').forEach((qq) => {
        const el = qq.querySelector('[data-req]'); if (!el) return;
        let ok;
        if (qq.hasAttribute('data-multi')) ok = !!qq.querySelector('input:checked'); else if (el.type === 'checkbox') ok = el.checked; else if (el.type === 'file') ok = (el.files && el.files.length) || el.closest('[data-file]').getAttribute('data-filled') === '1'; else ok = String(el.value || '').trim().length > 0;
        if (ok) qq.removeAttribute('data-invalid'); else { qq.setAttribute('data-invalid', '1'); bad++; if (!first) first = qq; }
      });
      const er = p.querySelector('[data-ferr]'); if (er) { er.hidden = !bad; er.textContent = bad ? (er.getAttribute('data-msg') || 'Masih ada pertanyaan wajib yang belum diisi.') + ' (' + bad + ')' : ''; }
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return !bad;
    };
    W.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-fnext')) { if (valid(cur)) { maxOk = Math.max(maxOk, cur + 1); show(cur + 1, true); } }
      else if (b.hasAttribute('data-fprev')) show(Math.max(0, cur - 1), true);
      else if (b.hasAttribute('data-fgo')) { const k = +b.getAttribute('data-fgo'); if (k <= maxOk) show(k, true); else if (k === cur + 1 && valid(cur)) { maxOk = k; show(k, true); } }
      else if (b.hasAttribute('data-fsubmit')) this.submitForm(W, b, () => show('done', true));
      else if (b.hasAttribute('data-demo-fill')) { this.demoFill(W); maxOk = total - 1; }
    });
    W.addEventListener('change', (ev) => {
      const f = ev.target;
      if (f.matches && f.matches('[data-fileinput]') && f.files && f.files[0]) {
        const L = f.closest('[data-file]'), file = f.files[0], max = +(f.getAttribute('data-maxmb') || 5), acc = (f.getAttribute('data-accept') || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
        const ext = (file.name.split('.').pop() || '').toLowerCase().replace('jpeg', 'jpg');
        const qq = f.closest('[data-q]'), er = qq && qq.querySelector('.err');
        if (file.size > max * 1048576 || (acc.length && acc.indexOf(ext) < 0)) {
          f.value = ''; L.removeAttribute('data-filled'); if (qq) qq.setAttribute('data-invalid', '1');
          if (er) er.textContent = file.size > max * 1048576 ? 'Ukuran file melebihi ' + max + ' MB' : 'Format harus ' + acc.join(' / ').toUpperCase();
          return;
        }
        if (er) er.textContent = 'Wajib diisi';
        this.setFile(L, file.name, (file.size / 1048576).toFixed(1) + ' MB');
      }
      const qq = f.closest && f.closest('[data-q]'); if (qq) qq.removeAttribute('data-invalid');
    });
    W.addEventListener('input', (ev) => { const qq = ev.target.closest && ev.target.closest('[data-q]'); if (qq) qq.removeAttribute('data-invalid'); });
    show(0, false);
  }
  setFile(L, name, size) {
    if (!L) return; L.setAttribute('data-filled', '1');
    const n = L.querySelector('[data-fname]'), m = L.querySelector('[data-fmeta]'), b = L.querySelector('[data-fbtn]');
    if (n) n.textContent = name; if (m) m.textContent = size + ' · siap dikirim'; if (b) b.textContent = '✓ Ganti';
  }
  demoFill(W) {
    const vals = { 'q0-0': 'Raka Pradipta', 'q0-1': '1101223041', 'q0-2': 'raka.pradipta@student.telkomuniversity.ac.id', 'q0-3': '0812 3456 4471', 'q0-6': '5', 'q0-7': '3.71', 'q2-0': '@rakapradipta', 'q2-2': 'https://www.instagram.com/p/C9xK2abc/' };
    Object.keys(vals).forEach((k) => { const el = W.querySelector('#' + k); if (el) el.value = vals[k]; });
    W.querySelectorAll('select[data-req]').forEach((sel) => { if (sel.options.length > 1) sel.selectedIndex = 1; });
    const files = ['CV_Raka_Pradipta.pdf', 'Transkrip_1101223041.pdf', 'KTM_Raka.jpg', 'Pasfoto_Raka.jpg', 'Motivation_Letter_Raka.pdf', 'Portofolio_Raka.pdf', 'Twibbon_Raka.png', 'Story_Oprec_Raka.png'];
    W.querySelectorAll('[data-file]').forEach((L, i) => this.setFile(L, files[i] || 'File.pdf', (0.3 + (i % 4) * 0.6).toFixed(1) + ' MB'));
    W.querySelectorAll('input[type="checkbox"][data-req]').forEach((c) => { c.checked = true; });
    W.querySelectorAll('[data-invalid]').forEach((x) => x.removeAttribute('data-invalid'));
    W.querySelectorAll('[data-ferr]').forEach((x) => { x.hidden = true; });
  }
  buildReview(W) {
    const R = W.querySelector('[data-freview]'); if (!R) return;
    const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let h = '';
    W.querySelectorAll('[data-fstep]').forEach((p) => {
      const k = p.getAttribute('data-fstep'); if (k === 'done' || !p.querySelector('[data-q]')) return;
      const title = (p.querySelector('h2') || {}).textContent || '';
      let rows = '';
      p.querySelectorAll('[data-q]').forEach((qq) => {
        const lab = (qq.querySelector('[data-qlabel]') || {}).textContent || ''; const el = qq.querySelector('input, select, textarea'); let v = '';
        if (!el) return;
        if (qq.hasAttribute('data-multi')) v = Array.from(qq.querySelectorAll('input:checked')).map((x) => x.value).join(', ') || '—'; else if (el.type === 'checkbox') v = el.checked ? '✓ Disetujui' : '—'; else if (el.type === 'file') { const L = el.closest('[data-file]'); v = L && L.getAttribute('data-filled') === '1' ? '📎 ' + L.querySelector('[data-fname]').textContent : '—'; } else v = el.value || '—';
        rows += '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 18px;padding:10px 0;border-top:1px solid rgba(var(--line-rgb),.2);font-size:14px"><span style="color:var(--dim);flex:1 1 220px">' + esc(lab.replace(/ \*$/, '')) + '</span><span style="color:var(--ink);flex:1 1 220px;text-align:right;overflow-wrap:anywhere">' + esc(v) + '</span></div>';
      });
      h += '<div style="padding:18px 22px;border-radius:16px;border:1px solid rgba(var(--line-rgb),.2);background:var(--surface)"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px"><span style="font-family:Sora,sans-serif;font-weight:600;font-size:17px;color:var(--ink)">' + esc(title) + '</span><button type="button" data-fgo="' + k + '" style="min-height:36px;padding:0 14px;border-radius:999px;border:1px solid rgba(var(--ink-rgb),.25);background:transparent;color:var(--body2);font:inherit;font-size:12.5px;cursor:pointer">Ubah</button></div>' + rows + '</div>';
    });
    R.innerHTML = h;
  }
  api() { const r = document.querySelector('[data-root]'); return { url: (r && r.getAttribute('data-sb-url')) || '', key: (r && r.getAttribute('data-sb-key')) || '' }; }
  async rpc(fn, body) {
    const A = this.api();
    const res = await fetch(A.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: A.key, Authorization: 'Bearer ' + A.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const txt = await res.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!res.ok) throw new Error((data && (data.message || data.error)) || 'Gagal menghubungi server');
    return data;
  }
  async submitForm(W, btn, done) {
    if (btn.disabled) return;
    const box = W.querySelector('[data-fsubmit-err]'), label = btn.textContent, A = this.api();
    const setErr = (m) => { if (box) { box.hidden = !m; box.textContent = m || ''; } };
    setErr('');
    const answers = {}, uploads = [];
    W.querySelectorAll('[data-q]').forEach((qq) => {
      const el = qq.querySelector('[data-qid]'); if (!el) return; const id = el.getAttribute('data-qid');
      if (qq.hasAttribute('data-multi')) { const vs = Array.from(qq.querySelectorAll('input:checked')).map((x) => x.value); if (vs.length) answers[id] = el.type === 'radio' ? vs[0] : vs.join(', '); }
      else if (el.type === 'checkbox') { if (el.checked) answers[id] = 'Ya'; }
      else if (el.type === 'file') { if (el.files && el.files[0]) uploads.push({ id, el, file: el.files[0], label: (qq.querySelector('[data-qlabel]') || {}).textContent || '' }); }
      else if (String(el.value || '').trim()) answers[id] = String(el.value).trim();
    });
    btn.disabled = true;
    try {
      const files = [];
      for (let i = 0; i < uploads.length; i++) {
        const u = uploads[i];
        btn.textContent = 'Mengunggah berkas ' + (i + 1) + '/' + uploads.length + '…';
        const safe = u.file.name.replace(/[^A-Za-z0-9._-]+/g, '_').slice(-80);
        const rid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
        const path = rid + '/' + safe;
        const res = await fetch(A.url + '/storage/v1/object/applications/' + path, { method: 'POST', headers: { apikey: A.key, Authorization: 'Bearer ' + A.key, 'Content-Type': u.file.type || 'application/octet-stream', 'x-upsert': 'false' }, body: u.file });
        if (!res.ok) { let m = ''; try { m = (await res.json()).message; } catch (e) {} throw new Error('Gagal mengunggah "' + u.label.replace(/ \*$/, '') + '"' + (m ? ': ' + m : '')); }
        files.push({ question_id: u.id, label: u.label.replace(/ \*$/, ''), path, name: u.file.name, size: u.file.size, type: u.file.type });
      }
      btn.textContent = 'Mengirim…';
      const reg = await this.rpc('submit_application', { p_answers: answers, p_files: files });
      const R = document.querySelector('[data-regno]'); if (R) R.textContent = reg;
      const C = document.querySelector('[data-fsteps] [data-copy], [data-copy]'); if (C) C.setAttribute('data-copy', reg);
      done();
    } catch (err) {
      setErr(String(err && err.message ? err.message : err));
    } finally { btn.disabled = false; btn.textContent = label; }
  }
  async checkStatus(btn) {
    const no = (document.getElementById('st-no') || {}).value || '', nim = (document.getElementById('st-nim') || {}).value || '';
    const out = document.querySelector('[data-status-result]'), msg = document.querySelector('[data-status-msg]');
    const say = (m) => { if (msg) { msg.hidden = !m; msg.textContent = m || ''; } };
    say(''); if (!no.trim() || !nim.trim()) { say('Isi nomor pendaftaran dan NIM.'); return; }
    btn.disabled = true; const t = btn.textContent; btn.textContent = 'Mengecek…';
    try {
      const r = await this.rpc('check_application', { p_reg: no, p_nim: nim });
      if (!r) { if (out) out.hidden = true; say('Data tidak ditemukan. Periksa lagi nomor pendaftaran dan NIM.'); return; }
      const lbl = { baru: 'Berkas diterima', ditinjau: 'Ditinjau', wawancara: 'Wawancara', diterima: 'Diterima', ditolak: 'Tidak lolos' };
      const set = (sel, v) => { const el = out.querySelector(sel); if (el) el.textContent = v; };
      set('[data-st-name]', r.name || '—'); set('[data-st-meta]', (r.reg_no || '') + ' · ' + nim.trim());
      const chip = out.querySelector('[data-st-chip]'); if (chip) { chip.setAttribute('data-status', r.status); const tx = chip.querySelector('[data-st-chip-text]'); if (tx) tx.textContent = lbl[r.status] || r.status; }
      const order = ['baru', 'ditinjau', 'wawancara', 'hasil'], cur = r.status === 'diterima' || r.status === 'ditolak' ? 3 : Math.max(0, order.indexOf(r.status));
      out.querySelectorAll('[data-st-step]').forEach((li) => {
        const k = order.indexOf(li.getAttribute('data-st-step')); li.setAttribute('data-state', k < cur || (k === 3 && cur === 3) ? 'done' : k === cur ? 'now' : 'next');
        if (k === 0) { const d = li.querySelector('[data-st-date]'); if (d && r.created_at) d.textContent = new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
        if (k === 3 && cur === 3) { const d = li.querySelector('[data-st-date]'); if (d) d.textContent = r.status === 'diterima' ? 'Selamat, kamu diterima sebagai asisten riset!' : 'Terima kasih sudah mendaftar. Tetap semangat!'; }
      });
      out.hidden = false; out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) { say(String(err && err.message ? err.message : err)); }
    finally { btn.disabled = false; btn.textContent = t; }
  }
  applyTheme(t, save) {
    const r = document.querySelector('[data-root]'); if (!r) return;
    r.setAttribute('data-theme', t); document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false'));
    if (save) { try { localStorage.setItem('spis-theme', t); } catch (e) {} }
  }

  /* ------------------------------------------------------------ page sky (stars like the hero) */
  buildSky(el) {
    const tile = (size, n, rMin, rMax, aMin, aMax) => {
      const c = document.createElement('canvas'); c.width = size; c.height = size; const x = c.getContext('2d');
      for (let i = 0; i < n; i++) { const r = rMin + Math.random() * (rMax - rMin), a = aMin + Math.random() * (aMax - aMin), px = Math.random() * size, py = Math.random() * size; x.fillStyle = 'rgba(170,190,240,' + a.toFixed(2) + ')'; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); }
      return 'url(' + c.toDataURL('image/png') + ')';
    };
    try {
      const a = el.querySelector('[data-sky-a]'), b = el.querySelector('[data-sky-b]'), c = el.querySelector('[data-sky-c]');
      if (a) a.style.backgroundImage = tile(700, 150, 0.4, 0.9, 0.18, 0.5);
      if (b) b.style.backgroundImage = tile(1100, 40, 0.8, 1.4, 0.35, 0.8);
      if (c) c.style.backgroundImage = tile(900, 30, 0.7, 1.3, 0.3, 0.75);
    } catch (e) {}
  }

  /* ------------------------------------------------------------ intro */
  startIntro(el) {
    const T = this.T(), cv = el.querySelector('canvas[data-cv="intro"]');
    this.killIntro();
    const path = el.querySelector('[data-glyph-path]');
    let len = 600; try { len = path.getTotalLength(); } catch (e) {}
    const I = { el, cv, start: performance.now(), cover: true, flash: el.querySelector('[data-flash]'), box: el.querySelector('[data-logo-box]'), glyph: el.querySelector('[data-glyph]'), path, len, word: el.querySelector('[data-word]'), cap: el.querySelector('[data-intro-cap]'), ending: 0, mx: 0, my: 0, mxs: 0, mys: 0 };
    this.intro = I;
    el.style.transition = 'none'; el.style.opacity = '1'; el.style.pointerEvents = '';
    if (path) { path.style.strokeDasharray = len + ' ' + len; path.style.strokeDashoffset = String(len); }
    if (I.word) I.word.style.opacity = '0';
    if (!T || !cv) { I.fallback = true; return; }
    try {
      const renderer = new T.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setClearColor(0x000000, 1);
      const scene = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, 0.05, 200); cam.position.set(0, 0, 9);
      const N = 26000, g = new T.BufferGeometry();
      const pos = new Float32Array(N * 3), u = new Float32Array(N), r = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { u[i] = Math.random(); r[i * 3] = Math.random(); r[i * 3 + 1] = Math.random(); r[i * 3 + 2] = Math.random(); }
      g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aU', new T.BufferAttribute(u, 1)); g.setAttribute('aR', new T.BufferAttribute(r, 3));
      const mat = new T.ShaderMaterial({
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        uniforms: { uT: { value: 0 }, uReveal: { value: 0 }, uW: { value: 0 }, uH: { value: 0 }, uMouse: { value: new T.Vector2(99, 99) }, uPR: { value: renderer.getPixelRatio() }, uFade: { value: 1 } },
        vertexShader: [
          'attribute float aU; attribute vec3 aR; uniform float uT, uReveal, uW, uH, uPR; uniform vec2 uMouse; varying float vA; varying vec3 vC;',
          'void main(){',
          '  float x = (aU*2.0-1.0)*7.0; float env = 1.0 - pow(abs(x)/7.0, 4.0);',
          '  vec3 pL = vec3(x, (aR.y-0.5)*0.025, (aR.z-0.5)*0.025);',
          '  float amp = 1.35*uW; float ph = x*1.15 - uT*3.2;',
          '  vec3 pW = vec3(x, amp*env*sin(ph) + (aR.y-0.5)*0.22*uW, (aR.z-0.5)*0.9*uW + amp*0.35*cos(ph)*env);',
          '  float ang = aU*6.2831853*7.0 + uT*0.9 + aR.x*0.25; float rad = 1.3 + aR.x*1.1;',
          '  vec3 pH = vec3(cos(ang)*rad, sin(ang)*rad, (0.5-aU)*48.0 - 4.0);',
          '  float hs = uH*uH*(3.0-2.0*uH); vec3 p = mix(mix(pL, pW, uW), pH, hs);',
          '  vec2 d = p.xy - uMouse; float dl = length(d); float push = exp(-dl*dl*1.4)*(1.0-hs)*1.1;',
          '  p.xy += (d/(dl+0.0001))*push; p.z += push*0.8;',
          '  vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;',
          '  gl_PointSize = (1.2 + aR.z*2.4)*(1.0 + push*1.5)*uPR*(9.0/max(0.3, -mv.z));',
          '  float rev = smoothstep(uReveal*1.02, uReveal*1.02-0.12, abs(aU*2.0-1.0));',
          '  vA = rev*(0.55 + 0.45*aR.y)*(1.0 + push*1.4); vC = mix(vec3(0.20,0.42,1.0), vec3(0.78,0.86,1.0), pow(aR.y,2.0)+push*0.6);',
          '}'
        ].join('\n'),
        fragmentShader: 'uniform float uFade; varying float vA; varying vec3 vC; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC*a*vA*uFade, a*vA*uFade); }'
      });
      const pts = new T.Points(g, mat); pts.frustumCulled = false; scene.add(pts);
      Object.assign(I, { renderer, scene, cam, mat, geo: g });
      this.on(el, 'pointermove', (e) => { const r2 = cv.getBoundingClientRect(); I.mx = ((e.clientX - r2.left) / r2.width) * 2 - 1; I.my = -(((e.clientY - r2.top) / r2.height) * 2 - 1); I.hasMouse = true; });
      this.on(el, 'pointerleave', () => { I.hasMouse = false; });
    } catch (err) { I.fallback = true; console.error('[SPIS intro]', err); }
  }
  stepIntro(now, dt) {
    const I = this.intro; if (!I) return;
    let t = (now - I.start) / 1000; if (I.fallback) t = Math.max(t, 2.9);
    const E = (a, b) => this.ease(a, b, t);
    if (I.renderer && t < 3.6) {
      const w = Math.max(1, I.cv.clientWidth), h = Math.max(1, I.cv.clientHeight);
      if (I.w !== w || I.h !== h) { I.w = w; I.h = h; I.renderer.setSize(w, h, false); I.cam.aspect = w / h; I.cam.updateProjectionMatrix(); }
      const u = I.mat.uniforms;
      u.uT.value = t; u.uReveal.value = E(0.0, 0.8); u.uW.value = E(0.5, 1.5); u.uH.value = E(1.55, 2.75);
      const fly = E(1.7, 2.9); I.cam.position.z = 9 - fly * fly * 17; I.cam.fov = 50 + fly * 34; I.cam.updateProjectionMatrix(); I.cam.rotation.z = fly * 0.9;
      I.mxs += ((I.hasMouse ? I.mx : 0) - I.mxs) * 0.12; I.mys += ((I.hasMouse ? I.my : 0) - I.mys) * 0.12;
      const halfH = Math.tan(25 * Math.PI / 180) * 9;
      u.uMouse.value.set(I.hasMouse ? I.mxs * halfH * I.cam.aspect : 99, I.hasMouse ? I.mys * halfH : 99);
      u.uFade.value = 1 - E(2.75, 3.1);
      I.renderer.render(I.scene, I.cam);
    } else if (I.renderer && !I.cleared) { I.cleared = true; I.renderer.clear(); }
    if (I.flash) I.flash.style.opacity = String(Math.max(0, E(2.45, 2.85) - E(2.95, 3.5)));
    // the wave glyph (the dot of the i) draws itself big, then flies into the wordmark
    if (I.path) I.path.style.strokeDashoffset = String(I.len * (1 - E(3.05, 4.15)));
    if (I.glyph) {
      const fly = E(4.35, 5.05), gW = I.glyph.offsetWidth || 40, gH = I.glyph.offsetHeight || 40;
      const dx0 = I.box.offsetWidth / 2 - (I.glyph.offsetLeft + gW / 2), dy0 = I.box.offsetHeight / 2 - (I.glyph.offsetTop + gH / 2);
      const s = 3.4 + (1 - 3.4) * fly, pulse = t > 4.15 && t < 4.4 ? 1 + 0.05 * Math.sin((t - 4.15) * 25) : 1;
      I.glyph.style.opacity = String(E(2.95, 3.1));
      I.glyph.style.transform = 'translate(' + (dx0 * (1 - fly)).toFixed(2) + 'px,' + (dy0 * (1 - fly)).toFixed(2) + 'px) scale(' + (s * pulse).toFixed(3) + ')';
      I.glyph.style.filter = 'drop-shadow(0 0 ' + (14 * (1 - fly) + 4).toFixed(1) + 'px rgba(127,164,255,.9))';
    }
    if (I.word) { const wr = E(4.6, 5.3); I.word.style.opacity = String(wr); I.word.style.clipPath = 'inset(' + ((1 - wr) * 100).toFixed(1) + '% 0 0 0)'; I.word.style.transform = 'translateY(' + ((1 - wr) * 16).toFixed(1) + 'px)'; }
    if (I.cap) I.cap.style.opacity = String(E(5.0, 5.4));
    if (t > 3.0) I.cover = false;
    if (t > 6.1 && !I.ending) this.endIntro(false);
  }
  endIntro(fast) {
    const I = this.intro; if (!I || I.ending) return;
    I.ending = 1; I.cover = false; this.introReq = 0;
    if (this.logo) this.logo.assembleAt = performance.now();
    I.el.style.transition = 'opacity ' + (fast ? '.35s' : '.8s') + ' ease'; I.el.style.opacity = '0'; I.el.style.pointerEvents = 'none';
    setTimeout(() => { if (this.intro === I) { this.killIntro(); if (!this.dead) this.setState({ introOn: false }); } }, fast ? 380 : 850);
  }
  killIntro() {
    const I = this.intro; if (!I) return;
    try { if (I.geo) I.geo.dispose(); if (I.mat) I.mat.dispose(); if (I.renderer) { I.renderer.dispose(); const gl = I.renderer.getContext(); const ext = gl && gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); } } catch (e) {}
    this.intro = null;
  }

  /* ------------------------------------------------------------ 3D particle logo */
  startLogo(cv) {
    const T = this.T();
    const L = { cv, ok: false, t: 0, rotX: 0, rotY: 0, vX: 0, vY: 0, drag: false, moved: 0, inside: false, mx: 0, my: 0, mAmt: 0, assembleAt: 0, lastBlast: -10, lastAuto: 0 };
    this.logo = L;
    if (!T) { this.logo = null; return; }
    const img = new Image();
    img.onload = () => { try { this.buildLogo(L, img); } catch (err) { console.error('[SPIS logo]', err); } };
    img.src = cv.getAttribute('data-src');
  }
  buildLogo(L, img) {
    const T = this.T(), cv = L.cv;
    const SW = 900, SH = Math.round(SW * img.height / img.width);
    const oc = document.createElement('canvas'); oc.width = SW; oc.height = SH;
    const octx = oc.getContext('2d'); octx.drawImage(img, 0, 0, SW, SH);
    const data = octx.getImageData(0, 0, SW, SH).data, cand = [];
    for (let y = 0; y < SH; y += 1) for (let x = 0; x < SW; x += 1) if (data[(y * SW + x) * 4 + 3] > 140) cand.push(x, y);
    const N = Math.min(17000, cand.length / 2), worldW = 6.2, worldH = worldW * SH / SW;
    const gx0 = SW * 596 / 946, gx1 = SW * 672 / 946, gy1 = SH * 72 / 265;
    const pos = new Float32Array(N * 3), rnd = new Float32Array(N * 4), glyph = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const k = Math.floor(Math.random() * (cand.length / 2)), x = cand[k * 2] + Math.random(), y = cand[k * 2 + 1] + Math.random();
      pos[i * 3] = (x / SW - 0.5) * worldW; pos[i * 3 + 1] = -(y / SH - 0.5) * worldH; pos[i * 3 + 2] = (Math.random() - 0.5) * 0.28;
      rnd[i * 4] = Math.random(); rnd[i * 4 + 1] = Math.random(); rnd[i * 4 + 2] = Math.random(); rnd[i * 4 + 3] = Math.random();
      glyph[i] = (x > gx0 && x < gx1 && y < gy1) ? 1 : 0;
    }
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(38, 1, 0.1, 100); cam.position.set(0, 0, 11);
    const world = new T.Group(), group = new T.Group(); scene.add(world); world.add(group);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aR', new T.BufferAttribute(rnd, 4)); g.setAttribute('aG', new T.BufferAttribute(glyph, 1));
    const uni = { uL: { value: 0 }, uT: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uM: { value: new T.Vector3(99, 99, 0) }, uMA: { value: 0 }, uBT: { value: -10 }, uBP: { value: new T.Vector3() }, uAs: { value: 0 }, uHW: { value: worldW / 2 } };
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: uni,
      vertexShader: [
        'attribute vec4 aR; attribute float aG;',
        'uniform float uT, uPR, uMA, uBT, uAs, uHW; uniform vec3 uM, uBP;',
        'varying float vB; varying float vG; varying float vA;',
        'void main(){',
        '  vec3 p = position;',
        '  p.y += aG * 0.07 * sin(uT*5.5 + p.x*24.0);',
        '  p.z += 0.05 * sin(uT*1.3 + p.x*1.7 + aR.x*6.0);',
        '  float sweep = smoothstep(0.86, 1.0, sin(p.x*0.9 - uT*1.4));',
        '  vec2 d = p.xy - uM.xy; float dl = length(d); float f = exp(-dl*dl*3.2) * uMA;',
        '  p.xy += (d/(dl+0.0001)) * f * 0.42; p.z += f * (0.6 + aR.y*0.9);',
        '  float age = uT - uBT; float bl = 0.0;',
        '  if (age > 0.0 && age < 3.2) {',
        '    vec3 dir = normalize(vec3(aR.x-0.5, aR.y-0.5, aR.z-0.5)*1.4 + vec3(p.xy - uBP.xy, 0.25)*1.3);',
        '    float k = exp(-age*1.7) * (1.0 - smoothstep(1.4, 3.2, age));',
        '    float ring = exp(-pow((length(p.xy - uBP.xy) - age*4.5)*2.2, 2.0));',
        '    p += dir * k * (1.2 + aR.w*2.2) * (0.35 + ring); bl = k;',
        '  }',
        '  float a = clamp(uAs*1.5 - aR.w*0.5, 0.0, 1.0); a = a*a*(3.0-2.0*a);',
        '  vec3 sc = vec3((aR.x-0.5)*uHW*3.4, (aR.y-0.5)*6.0, (aR.z-0.5)*8.0 + 2.0);',
        '  p = mix(sc, p, a);',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;',
        '  vB = clamp(sweep*0.9 + f*1.5 + bl*0.8 + (1.0-a)*0.4, 0.0, 1.6); vG = aG; vA = 0.35 + 0.65*a;',
        '  gl_PointSize = (2.0 + aR.z*1.9) * (1.0 + vB*0.7 + aG*0.3) * uPR * (11.0 / -mv.z);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uL; varying float vB; varying float vG; varying float vA;',
        'void main(){',
        '  float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.05, d);',
        '  vec3 c = mix(vec3(0.45,0.64,1.0), vec3(0.72,0.83,1.0), vG);',
        '  c = mix(c, vec3(0.94,0.97,1.0), smoothstep(0.2, 1.2, vB));',
        '  float al = a * (0.92 + vB*0.35 + vG*0.2) * vA;',
        '  if (uL > 0.5) { vec3 lc = mix(vec3(0.16,0.38,0.88), vec3(0.06,0.14,0.42), vG * 0.7); lc = mix(lc, vec3(0.24,0.48,1.0), smoothstep(0.2, 1.2, vB)); gl_FragColor = vec4(lc, min(1.0, al * 0.85)); return; }',
        '  gl_FragColor = vec4(c*al, al);',
        '}'
      ].join('\n')
    });
    const pts = new T.Points(g, mat); pts.frustumCulled = false; group.add(pts);
    const RW = 3, RN = 2200, rp = new Float32Array(RW * RN * 3), ra = new Float32Array(RW * RN * 3);
    for (let s2 = 0; s2 < RW; s2++) for (let i = 0; i < RN; i++) { const k = (s2 * RN + i) * 3; ra[k] = i / (RN - 1); ra[k + 1] = s2; ra[k + 2] = Math.random(); }
    const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(rp, 3)); rg.setAttribute('aW', new T.BufferAttribute(ra, 3));
    const wuni = { uL: { value: 0 }, uT: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uE: { value: 0 }, uMX: { value: 0 }, uMA: { value: 0 }, uY: { value: -1.78 } };
    const ring = new T.Points(rg, new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: wuni,
      vertexShader: [
        'attribute vec3 aW; uniform float uT, uPR, uE, uMX, uMA, uY; varying float vA; varying float vC;',
        'void main(){',
        '  float u = aW.x, s = aW.y, x = (u - 0.5) * 12.0;',
        '  float env = pow(sin(3.14159 * u), 1.6);',
        '  float bump = exp(-pow(x - uMX, 2.0) * 0.9) * uMA;',
        '  float amp = (0.22 + uE * 0.5 + bump * 0.38) * env;',
        '  float k = 2.1 + s * 0.55, w = 1.5 + s * 0.35, ph = s * 2.094;',
        '  float y = uY + amp * sin(x * k - uT * w + ph) + 0.05 * env * sin(x * 9.0 + uT * 3.0 + s) + (aW.z - 0.5) * 0.025;',
        '  float z = 0.35 * cos(x * k - uT * w + ph) * env - 0.4;',
        '  vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0); gl_Position = projectionMatrix * mv;',
        '  float crest = abs(sin(x * k - uT * w + ph));',
        '  vA = env * (0.45 + 0.55 * crest) * (0.75 + bump * 0.6 + uE * 0.5); vC = crest * env + bump * 0.5;',
        '  gl_PointSize = (1.6 + aW.z * 1.6) * (1.0 + bump * 0.8) * uPR * (11.0 / -mv.z);',
        '}'
      ].join('\n'),
      fragmentShader: 'uniform float uL; varying float vA; varying float vC; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.05, d) * vA; vec3 c = mix(vec3(0.3,0.5,1.0), vec3(0.86,0.92,1.0), clamp(vC,0.0,1.0)); if (uL > 0.5) { gl_FragColor = vec4(mix(vec3(0.3,0.5,0.95), vec3(0.1,0.25,0.75), clamp(vC,0.0,1.0)), min(1.0, a * 0.9)); return; } gl_FragColor = vec4(c*a, a); }'
    }));
    ring.frustumCulled = false; world.add(ring);
    const BN = 220, bp = new Float32Array(BN * 3);
    for (let i = 0; i < BN; i++) { bp[i * 3] = (i / (BN - 1) - 0.5) * 12; bp[i * 3 + 1] = -1.78; bp[i * 3 + 2] = -0.4; }
    const bgm = new T.BufferGeometry(); bgm.setAttribute('position', new T.BufferAttribute(bp, 3));
    const base = new T.Points(bgm, new T.PointsMaterial({ color: 0x6f9bff, size: 0.018, transparent: true, opacity: 0.35, depthWrite: false, blending: T.AdditiveBlending }));
    world.add(base);
    const whit = new T.Mesh(new T.PlaneGeometry(40, 20), new T.MeshBasicMaterial({ visible: false, side: T.DoubleSide })); whit.position.z = -0.4; world.add(whit);
    const S = 700, sp = new Float32Array(S * 3);
    for (let i = 0; i < S; i++) { sp[i * 3] = (Math.random() - 0.5) * 60; sp[i * 3 + 1] = (Math.random() - 0.5) * 36; sp[i * 3 + 2] = -10 - Math.random() * 30; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    const stars = new T.Points(sg, new T.PointsMaterial({ color: 0x9fb4e8, size: 0.06, transparent: true, opacity: 0.45, depthWrite: false }));
    scene.add(stars);
    const glow = new T.Mesh(new T.PlaneGeometry(11, 6), new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uE: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform float uE; varying vec2 vUv; void main(){ vec2 q = (vUv-0.5)*vec2(1.0,1.8); float d = length(q)*2.0; float a = pow(max(0.0,1.0-d),2.2)*(0.45+uE*0.4); gl_FragColor = vec4(vec3(0.15,0.33,0.95)*a, a); }'
    }));
    glow.position.z = -1.4; world.add(glow);
    const hit = new T.Mesh(new T.PlaneGeometry(worldW * 1.1, worldH * 1.6), new T.MeshBasicMaterial({ visible: false, side: T.DoubleSide }));
    group.add(hit);
    Object.assign(L, { ok: true, renderer, scene, cam, world, group, uni, ring, wuni, whit, stars, glow, hit, pts, base, light: false, ray: new T.Raycaster(), ndc: new T.Vector2() });
    if (!this.intro) L.assembleAt = performance.now();
    this.on(cv, 'pointermove', (e) => {
      const r = cv.getBoundingClientRect(); L.mx = ((e.clientX - r.left) / r.width) * 2 - 1; L.my = -(((e.clientY - r.top) / r.height) * 2 - 1); L.inside = true;
      if (L.drag) { const dx = e.clientX - L.px, dy = e.clientY - L.py; L.px = e.clientX; L.py = e.clientY; L.moved += Math.abs(dx) + Math.abs(dy); L.vY = dx * 0.006; L.vX = dy * 0.004; L.rotY += L.vY; L.rotX += L.vX; }
    });
    this.on(cv, 'pointerleave', () => { L.inside = false; });
    this.on(cv, 'pointerdown', (e) => { L.drag = true; L.moved = 0; L.px = e.clientX; L.py = e.clientY; cv.style.cursor = 'grabbing'; try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
    const up = () => { if (!L.drag) return; L.drag = false; cv.style.cursor = 'grab'; };
    this.on(cv, 'pointerup', up); this.on(cv, 'pointercancel', up);
  }
  blast(p) { const L = this.logo; if (!L || !L.ok) return; L.uni.uBT.value = L.t; L.uni.uBP.value.copy(p); L.lastBlast = L.t; L.energy = 1; }
  logoTheme(L) {
    const r = document.querySelector('[data-root]'), light = !!(r && r.getAttribute('data-theme') === 'light' && !L.cv.closest('[data-intro]'));
    if (light === L.light) return; L.light = light;
    const T = this.T(), bl = light ? T.NormalBlending : T.AdditiveBlending;
    [L.pts.material, L.ring.material, L.base.material].forEach((m) => { m.blending = bl; m.needsUpdate = true; });
    L.uni.uL.value = light ? 1 : 0; L.wuni.uL.value = light ? 1 : 0;
    L.base.material.color.setHex(light ? 0x2f63d6 : 0x6f9bff); L.stars.material.color.setHex(light ? 0x7f95c9 : 0x9fb4e8); L.glow.visible = !light;
  }
  stepLogo(now, dt) {
    const L = this.logo; if (!L || !L.ok || !this.visible(L.cv)) return;
    const w = Math.max(1, L.cv.clientWidth), h = Math.max(1, L.cv.clientHeight), still = this.still();
    if (L.w !== w || L.h !== h) { L.w = w; L.h = h; L.renderer.setSize(w, h, false); L.cam.aspect = w / h; L.cam.updateProjectionMatrix(); }
    if ((this.fc & 15) === 0 || L.light === false && L.lt === undefined) { L.lt = 1; this.logoTheme(L); }
    if (!still) L.t += dt;
    const as = still ? 1 : (L.assembleAt ? Math.min(1, (now - L.assembleAt) / 2400) : 0);
    L.uni.uAs.value = as;
    const mode = L.cv.getAttribute('data-layout') || 'right', wide = w / h > 1.25 && w > 760;
    const tx = mode === 'center' || !wide ? 0 : 3.45, ty = mode === 'center' ? 0.1 : (wide ? 0.1 : -2.75), ts = mode === 'center' ? Math.min(0.9, (w / h) * 0.82) : (wide ? 0.76 : Math.min(0.85, (w / h) * 1.05));
    L.world.position.x += (tx - L.world.position.x) * 0.08; L.world.position.y += (ty - L.world.position.y) * 0.08;
    const sc = L.world.scale.x + (ts - L.world.scale.x) * 0.08; L.world.scale.setScalar(sc);
    const baseY = mode === 'center' || !wide ? 0 : -0.2;
    if (!L.drag) { L.vY *= Math.exp(-dt * 3); L.vX *= Math.exp(-dt * 3); L.rotY += L.vY; L.rotX += L.vX; L.rotY += (baseY + (still ? 0 : Math.sin(L.t * 0.45) * 0.2) - L.rotY) * (1 - Math.exp(-dt * 1.6)); L.rotX += ((still ? 0 : Math.sin(L.t * 0.33) * 0.07) - L.rotX) * (1 - Math.exp(-dt * 1.6)); }
    L.group.rotation.set(L.rotX, L.rotY, 0);
    L.cam.position.x += ((L.inside ? L.mx * 0.35 : 0) - L.cam.position.x) * 0.05; L.cam.position.y += ((L.inside ? L.my * 0.25 : 0) - L.cam.position.y) * 0.05; L.cam.lookAt(0, 0, 0);
    L.scene.updateMatrixWorld();
    let hitLocal = null;
    if (L.inside) { L.ndc.set(L.mx, L.my); L.ray.setFromCamera(L.ndc, L.cam); const hs = L.ray.intersectObject(L.hit, false); if (hs.length) hitLocal = L.group.worldToLocal(hs[0].point.clone()); }
    L.hitLocal = hitLocal;
    let wx = null;
    if (L.inside) { const wh = L.ray.intersectObject(L.whit, false); if (wh.length) wx = L.world.worldToLocal(wh[0].point.clone()).x; }
    if (wx !== null) L.wuni.uMX.value += (wx - L.wuni.uMX.value) * 0.2;
    L.wuni.uMA.value += ((wx !== null && !L.drag ? 1 : 0) - L.wuni.uMA.value) * 0.06;
    if (hitLocal) L.uni.uM.value.lerp(hitLocal, 0.3);
    L.mAmt += ((hitLocal && !L.drag ? 1 : 0) - L.mAmt) * 0.1; L.uni.uMA.value = L.mAmt;
    L.energy = (L.energy || 0) * Math.exp(-dt * 1.4); L.glow.material.uniforms.uE.value = L.energy + L.mAmt * 0.3;
    L.uni.uT.value = L.t; L.wuni.uT.value = L.t; L.wuni.uE.value = Math.min(1, L.energy + (1 - as) * 0.6);
    L.renderer.render(L.scene, L.cam);
  }

  /* ------------------------------------------------------------ small 2D visuals */
  stepMini(m, dt) {
    if (!this.visible(m.cv)) return;
    const still = this.still();
    m.hot += ((m.hover ? 1 : 0) - m.hot) * Math.min(1, dt * 6);
    if (!still) m.t += dt * (1 + m.hot * 1.6);
    const g = this.ctxFor(m.cv), ctx = g.ctx, W = g.w, H = g.h;
    ctx.clearRect(0, 0, W, H);
    const k = m.kind;
    if (k === 'radar') this.drawRadar(ctx, W, H, m);
    else if (k === 'ecg') this.drawEcg(ctx, W, H, m);
    else if (k === 'spec') this.drawSpec(ctx, W, H, m, dt, still);
    else if (k === 'net') this.drawNet(ctx, W, H, m, dt, still);
    else if (k === 'precision') this.drawPrecision(ctx, W, H, m);
    else if (k === 'collab') this.drawCollab(ctx, W, H, m);
    else if (k === 'impact') this.drawImpact(ctx, W, H, m);
    else if (k === 'wave') this.drawWaveMini(ctx, W, H, m);
  }
  drawRadar(ctx, W, H, m) {
    const cx = W / 2, cy = H / 2 + 6, R = Math.min(W, H) * 0.42, a = m.t * 1.6;
    ctx.strokeStyle = 'rgba(111,155,255,.22)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / 3, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    for (let k = 0; k < 28; k++) { const aa = a - k * 0.035; ctx.fillStyle = 'rgba(61,123,255,' + (0.3 * (1 - k / 28) * (0.6 + m.hot * 0.6)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, aa - 0.04, aa); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = '#AFC6FF'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
    if (!m.state) { m.state = []; for (let i = 0; i < 6; i++) m.state.push({ ang: Math.random() * Math.PI * 2, rr: 0.25 + Math.random() * 0.7, sp: (Math.random() - 0.5) * 0.15 }); }
    m.state.forEach((b) => {
      const ba = b.ang + m.t * b.sp, bx = cx + Math.cos(ba) * R * b.rr, by = cy + Math.sin(ba) * R * b.rr;
      let since = (a - ba) % (Math.PI * 2); if (since < 0) since += Math.PI * 2;
      const lit = Math.exp(-since * 1.4);
      ctx.fillStyle = 'rgba(214,226,255,' + (0.15 + lit * 0.85).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(bx, by, 2 + lit * 3, 0, Math.PI * 2); ctx.fill();
      if (lit > 0.3) { ctx.strokeStyle = 'rgba(175,198,255,' + (lit * 0.6).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(bx, by, 6 + (1 - lit) * 14, 0, Math.PI * 2); ctx.stroke(); }
    });
  }
  ecgAt(u) { const G = (c, w, a) => a * Math.exp(-0.5 * Math.pow((u - c) / w, 2)); return G(0.2, 0.03, 0.12) + G(0.375, 0.008, -0.14) + G(0.4, 0.011, 1) + G(0.43, 0.01, -0.3) + G(0.66, 0.05, 0.28); }
  drawEcg(ctx, W, H, m) {
    ctx.strokeStyle = 'rgba(111,155,255,.12)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    const head = (m.t * 120) % (W + 60), mid = H * 0.62, A = H * 0.42, period = 150;
    ctx.lineWidth = 2; ctx.lineJoin = 'round';
    for (let x = 0; x < W; x += 2) {
      let age = head - x; if (age < 0) age += W + 60; if (age > W * 0.95) continue;
      const fade = Math.pow(1 - age / (W * 0.95), 1.4);
      const y0 = mid - this.ecgAt((((x - 2) / period) % 1 + 1) % 1) * A, y1 = mid - this.ecgAt(((x / period) % 1 + 1) % 1) * A;
      ctx.strokeStyle = 'rgba(175,198,255,' + (fade * (0.75 + m.hot * 0.25)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(x - 2, y0); ctx.lineTo(x, y1); ctx.stroke();
    }
    const hx = Math.min(W, head), hy = mid - this.ecgAt(((hx / period) % 1 + 1) % 1) * A;
    const grd = ctx.createRadialGradient(hx, hy, 0, hx, hy, 18); grd.addColorStop(0, 'rgba(230,238,255,.95)'); grd.addColorStop(1, 'rgba(61,123,255,0)');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(hx, hy, 18, 0, Math.PI * 2); ctx.fill();
  }
  drawSpec(ctx, W, H, m, dt, still) {
    const cols = 84, rows = 42;
    if (!m.state) { m.state = { cols: [], acc: 0 }; for (let i = 0; i < cols; i++) m.state.cols.push(this.specCol(i * 0.05, rows)); }
    const S = m.state;
    if (!still) { S.acc += dt * (1 + m.hot * 1.6); while (S.acc > 0.05) { S.acc -= 0.05; S.cols.shift(); S.cols.push(this.specCol(m.t, rows)); } }
    const cw = W / cols, rh = (H - 8) / rows;
    for (let i = 0; i < cols; i++) { const col = S.cols[i]; for (let j = 0; j < rows; j++) { const v = col[j]; if (v < 0.06) continue; const b = Math.min(1, v * (0.9 + m.hot * 0.4)); ctx.fillStyle = b > 0.7 ? 'rgba(230,238,255,' + b.toFixed(2) + ')' : 'rgba(' + Math.round(30 + b * 60) + ',' + Math.round(70 + b * 110) + ',255,' + (b * 0.95).toFixed(2) + ')'; ctx.fillRect(i * cw, H - 4 - (j + 1) * rh, cw + 0.5, rh + 0.5); } }
  }
  specCol(t, rows) {
    const f0 = 3.2 + 1.1 * Math.sin(t * 0.9) + 0.4 * Math.sin(t * 2.3), voiced = Math.sin(t * 0.7) > -0.6, F1 = 9 + 3 * Math.sin(t * 0.5), F2 = 24 + 5 * Math.sin(t * 0.33 + 1);
    const col = new Float32Array(rows);
    for (let j = 0; j < rows; j++) { const env = Math.exp(-Math.pow((j - F1) / 4, 2)) + 0.8 * Math.exp(-Math.pow((j - F2) / 5, 2)) + 0.15; let harm = 0; if (voiced) { const ph = (j / f0) % 1; harm = Math.exp(-Math.pow(Math.min(ph, 1 - ph) / 0.12, 2)); } col[j] = env * (voiced ? harm : 0.25 * Math.random()) + 0.04 * Math.random(); }
    return col;
  }
  drawNet(ctx, W, H, m, dt, still) {
    if (!m.state) {
      const Ls = [4, 6, 6, 3], nodes = [], edges = [];
      Ls.forEach((c, l) => { for (let i = 0; i < c; i++) nodes.push({ l, x: 0.14 + l * 0.24, y: (i + 1) / (c + 1), glow: 0 }); });
      for (let a = 0; a < nodes.length; a++) for (let b = 0; b < nodes.length; b++) if (nodes[b].l === nodes[a].l + 1) edges.push([a, b]);
      m.state = { nodes, edges, pulses: [], acc: 0 };
    }
    const S = m.state;
    if (!still) {
      S.acc += dt * (1 + m.hot * 2.2);
      while (S.acc > 0.09) { S.acc -= 0.09; const starts = S.edges.filter((e) => S.nodes[e[0]].l === 0); S.pulses.push({ e: starts[Math.floor(Math.random() * starts.length)], p: 0 }); }
      S.pulses.forEach((p) => { p.p += dt * (1.6 + m.hot); });
      const nxt = [];
      S.pulses.forEach((p) => { if (p.p < 1) { nxt.push(p); return; } const to = p.e[1]; S.nodes[to].glow = 1; const outs = S.edges.filter((e) => e[0] === to); if (outs.length && Math.random() < 0.85) nxt.push({ e: outs[Math.floor(Math.random() * outs.length)], p: 0 }); });
      S.pulses = nxt.slice(-60); S.nodes.forEach((n) => { n.glow *= Math.exp(-dt * 3); });
    }
    const X = (n) => n.x * W, Y = (n) => 14 + n.y * (H - 28);
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(111,155,255,.16)';
    S.edges.forEach((e) => { const a = S.nodes[e[0]], b = S.nodes[e[1]]; ctx.beginPath(); ctx.moveTo(X(a), Y(a)); ctx.lineTo(X(b), Y(b)); ctx.stroke(); });
    S.pulses.forEach((p) => { const a = S.nodes[p.e[0]], b = S.nodes[p.e[1]]; ctx.fillStyle = '#D6E2FF'; ctx.beginPath(); ctx.arc(X(a) + (X(b) - X(a)) * p.p, Y(a) + (Y(b) - Y(a)) * p.p, 2.2, 0, Math.PI * 2); ctx.fill(); });
    S.nodes.forEach((n) => { ctx.fillStyle = '#0B1530'; ctx.strokeStyle = 'rgba(111,155,255,' + (0.45 + n.glow * 0.55).toFixed(2) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(n), Y(n), 6 + n.glow * 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (n.glow > 0.05) { ctx.fillStyle = 'rgba(175,198,255,' + n.glow.toFixed(2) + ')'; ctx.beginPath(); ctx.arc(X(n), Y(n), 3, 0, Math.PI * 2); ctx.fill(); } });
  }
  drawPrecision(ctx, W, H, m) {
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.4, cyc = (m.t * 0.35) % 1, conv = Math.pow(Math.min(1, cyc / 0.75), 1.6);
    ctx.strokeStyle = 'rgba(111,155,255,.25)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / 4, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - R * 1.15, cy); ctx.lineTo(cx + R * 1.15, cy); ctx.moveTo(cx, cy - R * 1.15); ctx.lineTo(cx, cy + R * 1.15); ctx.stroke();
    if (!m.state) { m.state = []; for (let i = 0; i < 26; i++) m.state.push({ a: Math.random() * Math.PI * 2, r: 0.25 + Math.random() * 0.75 }); }
    m.state.forEach((p) => { const rr = p.r * R * (1 - conv * 0.94), x = cx + Math.cos(p.a + m.t * 0.2) * rr, y = cy + Math.sin(p.a + m.t * 0.2) * rr; ctx.fillStyle = 'rgba(175,198,255,' + (0.35 + conv * 0.6).toFixed(2) + ')'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = 'rgba(230,238,255,' + (0.3 + conv * 0.7).toFixed(2) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 6 + (1 - conv) * 18, 0, Math.PI * 2); ctx.stroke();
  }
  drawCollab(ctx, W, H, m) {
    if (!m.state) { const cs = [[0.24, 0.35], [0.76, 0.35], [0.5, 0.75]], n = []; cs.forEach((c, ci) => { for (let i = 0; i < 6; i++) n.push({ c: ci, x: c[0] + (Math.random() - 0.5) * 0.18, y: c[1] + (Math.random() - 0.5) * 0.22, ph: Math.random() * 6 }); }); m.state = n; }
    const n = m.state, X = (p) => (p.x + 0.012 * Math.sin(m.t + p.ph)) * W, Y = (p) => (p.y + 0.015 * Math.cos(m.t * 0.8 + p.ph)) * H;
    for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) {
      const a = n[i], b = n[j], same = a.c === b.c, ph = (Math.sin(m.t * 1.2 + i * 0.7 + j) + 1) / 2;
      if (!same && ph < 0.72) continue;
      ctx.strokeStyle = same ? 'rgba(111,155,255,.22)' : 'rgba(175,198,255,' + ((ph - 0.72) * 2.6 * (0.6 + m.hot * 0.5)).toFixed(2) + ')';
      ctx.lineWidth = same ? 1 : 1.4; ctx.beginPath(); ctx.moveTo(X(a), Y(a)); ctx.lineTo(X(b), Y(b)); ctx.stroke();
    }
    n.forEach((p) => { ctx.fillStyle = ['#7FA4FF', '#AFC6FF', '#3D7BFF'][p.c]; ctx.beginPath(); ctx.arc(X(p), Y(p), 4, 0, Math.PI * 2); ctx.fill(); });
  }
  drawImpact(ctx, W, H, m) {
    const cx = W / 2, cy = H * 0.58;
    for (let i = 0; i < 5; i++) { const ph = ((m.t * 0.45 + i / 5) % 1), r = ph * Math.min(W, H) * 0.55; ctx.strokeStyle = 'rgba(127,164,255,' + ((1 - ph) * 0.7).toFixed(2) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.42, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 24; i++) { const x = W * (0.08 + i / 26), d = Math.abs(x - cx) / (W / 2), ph = (m.t * 0.45 - d * 0.6) % 1, lift = Math.max(0, Math.sin(ph * Math.PI * 2)) * 26 * (1 - d * 0.6); ctx.fillStyle = 'rgba(175,198,255,.8)'; ctx.fillRect(x - 1.5, cy + 34 - lift, 3, 6 + lift * 0.4); }
    ctx.fillStyle = '#E6EEFF'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
  }
  drawWaveMini(ctx, W, H, m) {
    const mid = H / 2;
    for (let l = 0; l < 5; l++) { ctx.strokeStyle = 'rgba(127,164,255,' + (0.15 + l * 0.15).toFixed(2) + ')'; ctx.lineWidth = 1 + l * 0.3; ctx.beginPath(); for (let x = 0; x <= W; x += 4) { const u = x / W, y = mid + Math.sin(u * (6 + l) + m.t * (1 + l * 0.3)) * H * 0.18 * Math.sin(Math.PI * u) * (0.5 + l * 0.12); if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); }
  }

  /* ------------------------------------------------------------ signal field (headers, CTA) */
  stepField(F, dt) {
    if (!this.visible(F.cv)) return;
    if (!this.still()) F.t += dt;
    F.mx += (F.tx - F.mx) * 0.06; F.my += (F.ty - F.my) * 0.06;
    const g = this.ctxFor(F.cv), ctx = g.ctx, W = g.w, H = g.h;
    ctx.clearRect(0, 0, W, H);
    const lines = F.lines;
    for (let i = 0; i < lines; i++) {
      const k = i / (lines - 1), baseY = H * (0.08 + k * 0.62);
      ctx.strokeStyle = 'rgba(' + Math.round(60 + k * 80) + ',' + Math.round(110 + k * 80) + ',255,' + (0.1 + 0.45 * Math.pow(k, 1.5)).toFixed(3) + ')';
      ctx.lineWidth = 1 + k * 0.6;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const u = x / W, d = Math.hypot(u - F.mx, (baseY / H - F.my) * 0.8), bump = Math.exp(-d * d * 18) * 60 * (0.4 + k);
        const y = baseY + Math.sin(u * 7 + F.t * 1.2 + k * 3) * (8 + k * 18) + Math.sin(u * 17 - F.t * 2 + k * 9) * 4 - bump;
        if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }

  /* ------------------------------------------------------------ recruitment backgrounds */
  stepRecruit(R, dt) {
    if (!this.visible(R.cv)) return;
    const still = this.still(); if (!still) R.t += dt;
    const g = this.ctxFor(R.cv), ctx = g.ctx, W = g.w, H = g.h, t = R.t;
    ctx.clearRect(0, 0, W, H);
    const mono = (sz) => sz + 'px "IBM Plex Mono", ui-monospace, monospace';
    if (R.v === 'net') {
      const narrow = W < 640;
      const cfg = R.cfg || (R.cfg = { sx: +(R.cv.getAttribute('data-sx') || 0), sy: +(R.cv.getAttribute('data-sy') || 0), sh: +(R.cv.getAttribute('data-sh') || 0) });
      const SX = (cfg.sx && !narrow ? cfg.sx : (narrow ? 0.72 : 0.64)) * W, SY = (cfg.sy && !narrow ? cfg.sy : (narrow ? 0.25 : 0.53)) * H, SS = (cfg.sh && !narrow ? cfg.sh : (narrow ? 0.38 : 0.78)) * H;
      if (!R.st || R.st.W !== W || R.st.H !== H) {
        const line = [];
        const side = [[0.43, 0.52], [0.41, 0.3], [0.36, 0.15], [0.25, 0.06], [0.12, 0.0], [0.07, -0.05], [0.07, -0.125]];
        side.forEach((p) => line.push(p));
        const a0 = Math.atan2(0.155, 0.07), a1 = Math.PI - a0 - Math.PI * 2;
        for (let i = 1; i < 18; i++) { const a = a0 + (a1 - a0) * i / 18; line.push([Math.cos(a) * 0.17, -0.28 + Math.sin(a) * 0.17]); }
        side.slice().reverse().forEach((p) => line.push([-p[0], p[1]]));
        const outline = []; let acc = 0;
        for (let i = 0; i < line.length - 1; i++) {
          const [x0, y0] = line[i], [x1, y1] = line[i + 1], L = Math.hypot(x1 - x0, y1 - y0);
          while (acc <= L) { const k = acc / L; outline.push({ u: x0 + (x1 - x0) * k, v: y0 + (y1 - y0) * k, o: 1 }); acc += 0.058; }
          acc -= L;
        }
        const halfW = (v) => v < 0 ? 0.07 : v < 0.06 ? 0.07 + (v / 0.06) * 0.18 : v < 0.15 ? 0.25 + ((v - 0.06) / 0.09) * 0.11 : v < 0.3 ? 0.36 + ((v - 0.15) / 0.15) * 0.05 : 0.41 + ((v - 0.3) / 0.22) * 0.02;
        const inner = []; let guard = 0;
        while (inner.length < 22 && guard++ < 4000) { const v = 0.02 + Math.random() * 0.46, u = (Math.random() * 2 - 1) * halfW(v) * 0.86; if ([...outline, ...inner].every((n) => Math.hypot(n.u - u, n.v - v) > 0.075)) inner.push({ u, v, o: 0 }); }
        const nodes = outline.concat(inner).map((n) => ({ ...n, p: Math.random() * 6, f: 0.6 + Math.random() * 0.8, r: n.o ? 2.2 + Math.random() * 1.2 : 1.6 + Math.random() * 1.2, ox: 0, oy: 0, x0: Math.random() * W, y0: Math.random() * H, d: Math.random() * 0.5 }));
        const edges = [];
        for (let i = 0; i < outline.length - 1; i++) edges.push([i, i + 1, 1]);
        for (let i = outline.length; i < nodes.length; i++) {
          const ds = nodes.map((m, j) => [j, Math.hypot(m.u - nodes[i].u, m.v - nodes[i].v)]).filter((q) => q[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 3);
          ds.forEach(([j, dd]) => { if (dd < 0.2 && !edges.some((e) => (e[0] === j && e[1] === i))) edges.push([i, j, 0]); });
        }
        const team = []; guard = 0;
        while (team.length < 11 && guard++ < 3000) { const x = (0.36 + Math.random() * 0.62) * W, y = (0.06 + Math.random() * 0.62) * H; if (Math.abs(x - SX) < SS * 0.55 && Math.abs(y - SY) < SS * 0.58) continue; team.push({ bx: x / W, by: y / H, ax: 0.012 + Math.random() * 0.02, ay: 0.015 + Math.random() * 0.025, f: 0.2 + Math.random() * 0.4, p: Math.random() * 6, r: 2.6 + Math.random() * 1.6 }); }
        const parts = []; for (let i = 0; i < 40; i++) parts.push({ u: Math.random(), y: Math.random(), s: 0.04 + Math.random() * 0.07 });
        R.st = { W, H, nodes, edges, team, parts, glow: 0, born: -1, pulses: [], nOut: outline.length };
      }
      const S = R.st;
      if (S.born < 0) S.born = t;
      const age = still ? 9 : t - S.born;
      const inBox = R.inside && Math.abs(R.mx - SX) < SS * 0.48 && Math.abs(R.my - SY) < SS * 0.55;
      S.glow += ((inBox ? 1 : 0) - S.glow) * Math.min(1, dt * 3);
      const breathe = 1 + Math.sin(t * 1.3) * 0.008;
      const P = S.nodes.map((n) => {
        const k = Math.max(0, Math.min(1, (age - n.d) / 2.2)), e = k * k * (3 - 2 * k);
        let x = SX + (n.u + Math.sin(t * n.f + n.p) * 0.005) * SS * breathe, y = SY + (n.v + Math.cos(t * n.f * 0.9 + n.p) * 0.005) * SS * breathe;
        if (R.inside) { const dx = x - R.mx, dy = y - R.my, dd = Math.hypot(dx, dy); if (dd < 70) { const push = (1 - dd / 70) * 16; n.ox += (dx / (dd || 1) * push - n.ox) * 0.2; n.oy += (dy / (dd || 1) * push - n.oy) * 0.2; } else { n.ox *= 0.9; n.oy *= 0.9; } } else { n.ox *= 0.9; n.oy *= 0.9; }
        x += n.ox; y += n.oy;
        return { x: n.x0 + (x - n.x0) * e, y: n.y0 + (y - n.y0) * e, a: e * (n.v > 0.32 ? Math.max(0.15, 1 - (n.v - 0.32) / 0.22) : 1), r: n.r, o: n.o };
      });
      const T = S.team.map((n) => ({ x: (n.bx + Math.sin(t * n.f + n.p) * n.ax) * W, y: (n.by + Math.cos(t * n.f * 0.8 + n.p) * n.ay) * H, r: n.r }));
      const md = Math.min(W, H) * 0.38;
      for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const d = Math.hypot(T[i].x - T[j].x, T[i].y - T[j].y); if (d < md) { ctx.strokeStyle = 'rgba(111,155,255,' + ((1 - d / md) * 0.35).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(T[i].x, T[i].y); ctx.lineTo(T[j].x, T[j].y); ctx.stroke(); } }
      ctx.setLineDash([4, 5]);
      T.forEach((tn) => { let best = -1, bd = 1e9; for (let i = 0; i < S.nOut; i++) { const d = Math.hypot(P[i].x - tn.x, P[i].y - tn.y); if (d < bd) { bd = d; best = i; } } if (bd < md * 1.1) { ctx.strokeStyle = 'rgba(175,198,255,' + ((1 - bd / (md * 1.1)) * 0.55 * P[best].a).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(tn.x, tn.y); ctx.lineTo(P[best].x, P[best].y); ctx.stroke(); } });
      ctx.setLineDash([]);
      if (S.glow > 0.01) { const gr = ctx.createRadialGradient(SX, SY, 0, SX, SY, SS * 0.55); gr.addColorStop(0, 'rgba(61,123,255,' + (0.22 * S.glow).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(SX, SY, SS * 0.55, 0, Math.PI * 2); ctx.fill(); }
      S.edges.forEach(([i, j, o]) => { const a = Math.min(P[i].a, P[j].a) * (o ? 0.75 + S.glow * 0.25 : 0.32 + S.glow * 0.25); if (a < 0.01) return; ctx.strokeStyle = o ? 'rgba(200,215,255,' + a.toFixed(3) + ')' : 'rgba(127,164,255,' + a.toFixed(3) + ')'; ctx.lineWidth = o ? 1.3 : 0.9; ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke(); });
      if (R.inside) { ctx.strokeStyle = 'rgba(175,198,255,.5)'; ctx.lineWidth = 1; T.concat(P.slice(0, S.nOut)).forEach((n) => { const d = Math.hypot(n.x - R.mx, n.y - R.my); if (d < md * 0.7) { ctx.globalAlpha = 1 - d / (md * 0.7); ctx.beginPath(); ctx.moveTo(R.mx, R.my); ctx.lineTo(n.x, n.y); ctx.stroke(); } }); ctx.globalAlpha = 1; }
      if (!still && Math.random() < dt * 1.4 && age > 2.5) S.pulses.push({ a: T[Math.floor(Math.random() * T.length)], b: Math.floor(Math.random() * S.nOut), t: 0 });
      S.pulses = S.pulses.filter((pp) => { pp.t += dt * 0.7; if (pp.t > 1) return false; const q = P[pp.b], x = pp.a.x + (q.x - pp.a.x) * pp.t, y = pp.a.y + (q.y - pp.a.y) * pp.t; const gr = ctx.createRadialGradient(x, y, 0, x, y, 7); gr.addColorStop(0, 'rgba(230,238,255,.95)'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); return true; });
      S.parts.forEach((q) => { if (!still) q.u += q.s * dt; if (q.u > 1) { q.u = 0; q.y = Math.random(); } const x0 = q.u * SX, y0 = q.y * H + (SY + SS * 0.15 - q.y * H) * Math.pow(q.u, 2.2); const a = Math.sin(Math.PI * q.u) * 0.5; ctx.fillStyle = 'rgba(175,198,255,' + a.toFixed(3) + ')'; ctx.fillRect(x0, y0, 1.6, 1.6); });
      T.forEach((n) => { const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4); gr.addColorStop(0, 'rgba(127,164,255,.45)'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#DCE4F7'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); });
      P.forEach((n) => { if (n.a < 0.02) return; const rr = n.r * (n.o ? 3.2 : 2.6); const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr); gr.addColorStop(0, 'rgba(127,164,255,' + (0.5 * n.a).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(232,238,255,' + n.a.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (n.o ? 0.9 : 0.7), 0, Math.PI * 2); ctx.fill(); });
      const qa = Math.max(0, Math.min(1, (age - 1.8) / 1)) * (0.75 + Math.sin(t * 2.2) * 0.15 + S.glow * 0.25), qs = SS * breathe;
      if (qa > 0.01) {
        const hx = SX, hy = SY - 0.29 * qs;
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(127,164,255,.9)'; ctx.shadowBlur = 18 + S.glow * 14;
        ctx.strokeStyle = 'rgba(240,245,255,' + qa.toFixed(3) + ')'; ctx.lineWidth = Math.max(2.4, qs * 0.026);
        ctx.beginPath(); ctx.arc(hx, hy - qs * 0.025, qs * 0.06, Math.PI * 1.05, Math.PI * 2.3); ctx.quadraticCurveTo(hx, hy + qs * 0.035, hx, hy + qs * 0.07); ctx.stroke();
        ctx.fillStyle = 'rgba(240,245,255,' + qa.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(hx, hy + qs * 0.125, Math.max(2, qs * 0.017), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.font = mono(narrow ? 10 : 11); ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(220,228,247,' + Math.min(1, qa + 0.1).toFixed(3) + ')';
        const ly = SY - 0.5 * qs - 14; ctx.fillText(inBox ? 'KAMU, MUNGKIN?' : "WHO'S NEXT?", SX, Math.max(14, ly)); ctx.textAlign = 'left';
      }
    } else if (R.v === 'radar') {
      const cx = W * 0.8, cy = H * 0.46, rad = Math.min(H * 0.9, W * 0.5), ang = (t * 0.9) % (Math.PI * 2);
      if (!R.st) { R.st = { blips: [] }; for (let i = 0; i < 16; i++) R.st.blips.push({ a: Math.random() * Math.PI * 2, d: 0.18 + Math.random() * 0.78, lit: 0, id: 'C-' + String(10 + i * 7).padStart(2, '0') }); }
      ctx.strokeStyle = 'rgba(111,155,255,.22)'; ctx.lineWidth = 1;
      for (let k = 1; k <= 5; k++) { ctx.beginPath(); ctx.arc(cx, cy, rad * k / 5, 0, Math.PI * 2); ctx.stroke(); }
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); ctx.stroke(); }
      for (let k = 0; k < 40; k++) { const a = ang - k * 0.02, al = 0.22 * (1 - k / 40); ctx.strokeStyle = 'rgba(127,164,255,' + al.toFixed(3) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(220,232,255,.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad); ctx.stroke();
      ctx.font = mono(10);
      R.st.blips.forEach((b) => {
        let da = (ang - b.a) % (Math.PI * 2); if (da < 0) da += Math.PI * 2;
        if (da < 0.08) b.lit = 1; b.lit *= Math.exp(-dt * 0.9);
        if (b.lit < 0.02) return;
        const x = cx + Math.cos(b.a) * b.d * rad, y = cy + Math.sin(b.a) * b.d * rad;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, 10); gr.addColorStop(0, 'rgba(230,238,255,' + b.lit.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(175,198,255,' + (b.lit * 0.8).toFixed(3) + ')'; ctx.fillText(b.id, x + 10, y - 8);
      });
      if (R.inside) {
        const x = R.mx, y = R.my, s = 26 + Math.sin(t * 6) * 3, lk = Math.min(99, Math.round(60 + (t * 40) % 40));
        ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.6;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x + a * s, y + b * s - b * 9); ctx.lineTo(x + a * s, y + b * s); ctx.lineTo(x + a * s - a * 9, y + b * s); ctx.stroke(); });
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = mono(11); ctx.fillStyle = '#DCE4F7'; ctx.fillText('TARGET: KAMU · LOCK ' + lk + '%', x + s + 10, y + 4);
      }
      ctx.font = mono(10); ctx.fillStyle = 'rgba(175,198,255,.7)'; ctx.fillText('SCAN ' + String(Math.round(ang * 57.3)).padStart(3, '0') + '° · MENCARI ASISTEN BARU', cx - rad * 0.35, cy - rad * 0.86 > 14 ? cy - rad * 0.86 : 18);
    } else {
      const target = 0.72, idle = 0.5 + 0.42 * Math.sin(t * 0.35);
      if (R.st === null) R.st = { n: idle };
      const want = R.inside ? Math.max(0, Math.min(1, R.mx / W)) : idle;
      R.st.n += (want - R.st.n) * Math.min(1, dt * 5);
      const n = R.st.n, c = Math.exp(-Math.pow((n - target) / 0.07, 2)), lock = c > 0.85;
      const top = H * 0.09, bot = H * 0.39, mid = (top + bot) / 2, hh = (bot - top) / 2;
      for (let l = 0; l < 7; l++) {
        const k = l / 6; ctx.strokeStyle = 'rgba(' + Math.round(90 + k * 120) + ',' + Math.round(130 + k * 90) + ',255,' + (0.18 + k * 0.5 * (0.4 + c * 0.6)).toFixed(3) + ')'; ctx.lineWidth = 1 + k * (0.6 + c);
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const u = x / W, env = Math.sin(Math.PI * u);
          const clean = Math.sin(u * 22 + t * 3 + l * 0.35) * 0.55;
          const noise = (Math.sin(u * 91 + t * 13 + l * 7) * 0.5 + Math.sin(u * 47 - t * 9 + l * 3) * 0.35 + Math.sin(u * 173 + t * 21 + l) * 0.25);
          const y = mid + (clean * c + noise * (1 - c) * 0.8) * hh * env * (0.5 + k * 0.5);
          if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      const dialY = H * 0.45; ctx.strokeStyle = 'rgba(140,155,192,.45)'; ctx.lineWidth = 1; ctx.font = mono(10); ctx.fillStyle = 'rgba(175,198,255,.6)';
      for (let i = 0; i <= 50; i++) { const x = W * 0.04 + (W * 0.92) * i / 50, big = i % 5 === 0; ctx.beginPath(); ctx.moveTo(x, dialY); ctx.lineTo(x, dialY + (big ? 12 : 6)); ctx.stroke(); }
      const tx = W * 0.04 + W * 0.92 * target; ctx.fillStyle = lock ? '#FFFFFF' : 'rgba(175,198,255,.8)'; ctx.fillText('SPIS 26/27', tx - 30, dialY - 8);
      const nx = W * 0.04 + W * 0.92 * n; ctx.strokeStyle = lock ? '#FFFFFF' : 'rgba(127,164,255,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx, top - 10); ctx.lineTo(nx, dialY + 16); ctx.stroke();
      const gr = ctx.createRadialGradient(nx, mid, 0, nx, mid, 60 + c * 60); gr.addColorStop(0, 'rgba(61,123,255,' + (0.15 + c * 0.3).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.fillRect(nx - 130, top - 20, 260, bot - top + 40);
      ctx.font = mono(11); ctx.fillStyle = lock ? '#FFFFFF' : 'rgba(175,198,255,.8)'; ctx.fillText(lock ? 'SINYAL TERKUNCI · FREKUENSIMU ADA DI SINI' : 'MENCARI FREKUENSI… ' + (88 + n * 20).toFixed(1), Math.min(nx + 12, W - 330), top - 14);
    }
  }
  stepType(T, dt) {
    if (!T.w.length || this.still() || !this.visible(T.el)) return;
    T.tm -= dt; if (T.tm > 0) return;
    const word = T.w[T.wi];
    if (T.ph === 'hold') { T.ph = 'del'; T.tm = 0.04; }
    else if (T.ph === 'del') { T.ci--; T.tm = 0.035; if (T.ci <= 0) { T.ci = 0; T.wi = (T.wi + 1) % T.w.length; T.ph = 'type'; T.tm = 0.3; } }
    else { T.ci++; T.tm = 0.06 + Math.random() * 0.05; if (T.ci >= T.w[T.wi].length) { T.ph = 'hold'; T.tm = 2.4; } }
    T.el.textContent = T.w[T.wi].slice(0, T.ci);
  }
  stepTerm(T, dt) {
    if (!this.visible(T.el)) return;
    const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const fmt = (x) => { let h = esc(x).replace(/\*\*(.+?)\*\*/g, '<b style="color:#FFFFFF;font-weight:500">$1</b>'); if (x[0] === '$') h = '<span style="color:#7FA4FF">$</span>' + h.slice(1); else if (x[0] === '›') h = '<span style="color:#5F72A0">›</span>' + h.slice(1); return h; };
    if (this.still()) { T.li = T.L.length; T.done = true; }
    else { T.tm -= dt; while (T.tm <= 0 && !T.done) { const cur = T.L[T.li] || ''; if (T.ci < cur.length) { T.ci++; T.tm += cur[0] === '$' ? 0.055 : 0.016; } else { T.li++; T.ci = 0; T.tm += 0.45; if (T.li >= T.L.length) { T.done = true; T.tm = 6; } } } if (T.done && T.tm <= 0 && !this.still()) { T.li = 0; T.ci = 0; T.done = false; T.tm = 0.5; } if (T.done) T.tm -= 0; }
    const key = T.li + ':' + T.ci + ':' + T.done; if (T.key === key) return; T.key = key;
    let h = ''; for (let i = 0; i < Math.min(T.li, T.L.length); i++) h += fmt(T.L[i]) + '\n';
    if (!T.done) h += fmt(T.L[T.li].slice(0, T.ci));
    h += '<span class="caret"></span>';
    T.el.innerHTML = h;
  }
  stepSlotNet(N, dt) {
    if (!this.visible(N.cv)) return;
    if (!this.still()) N.t += dt;
    const g = this.ctxFor(N.cv), ctx = g.ctx, W = g.w, H = g.h, cr = N.cv.getBoundingClientRect();
    ctx.clearRect(0, 0, W, H);
    const slots = Array.from(N.grid.querySelectorAll('[data-slot]')), tgt = N.grid.querySelector('[data-slot-target]'); if (!tgt) return;
    const c = (el) => { const r = (el.firstElementChild || el).getBoundingClientRect(); return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top }; };
    const T = c(tgt), P = slots.filter((x) => x !== tgt).map(c);
    P.forEach((p, i) => { const mx = (p.x + T.x) / 2, my = Math.min(p.y, T.y) - 18 - (i % 3) * 8; ctx.strokeStyle = 'rgba(111,155,255,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(mx, my, T.x, T.y); ctx.stroke(); p.mx = mx; p.my = my; });
    if (!this.still() && Math.random() < dt * 2.2) N.pulses.push({ i: Math.floor(Math.random() * P.length), t: 0 });
    N.pulses = N.pulses.filter((q) => { q.t += dt * 0.7; if (q.t > 1) return false; const p = P[q.i]; if (!p) return false; const u = q.t, x = (1 - u) * (1 - u) * p.x + 2 * (1 - u) * u * p.mx + u * u * T.x, y = (1 - u) * (1 - u) * p.y + 2 * (1 - u) * u * p.my + u * u * T.y; const gr = ctx.createRadialGradient(x, y, 0, x, y, 6); gr.addColorStop(0, 'rgba(230,238,255,.95)'); gr.addColorStop(1, 'rgba(61,123,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); return true; });
  }
  stepHalo(Hs, dt) {
    if (!this.visible(Hs.cv)) return;
    const still = this.still(); if (!still) Hs.t += dt;
    const g = this.ctxFor(Hs.cv), ctx = g.ctx, W = g.w, H = g.h, t = Hs.t;
    const sp = Math.max(5, Math.round(H / 54));
    if (!Hs.mask || Hs.mW !== W || Hs.mH !== H) {
      const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const o = oc.getContext('2d');
      const cx = W / 2, hy = H * 0.31, hr = H * 0.155;
      o.filter = 'blur(' + Math.max(2, H * 0.012).toFixed(1) + 'px)'; o.fillStyle = '#fff';
      o.beginPath(); o.arc(cx, hy, hr, 0, Math.PI * 2); o.fill();
      o.beginPath(); o.moveTo(cx - H * 0.36, H * 1.02); o.bezierCurveTo(cx - H * 0.36, H * 0.66, cx - H * 0.2, H * 0.53, cx, H * 0.53); o.bezierCurveTo(cx + H * 0.2, H * 0.53, cx + H * 0.36, H * 0.66, cx + H * 0.36, H * 1.02); o.closePath(); o.fill();
      o.filter = 'none'; o.globalCompositeOperation = 'destination-out'; o.font = '800 ' + Math.round(hr * 1.45) + 'px Sora, sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('?', cx, hy + hr * 0.06);
      const d = o.getImageData(0, 0, W, H).data, cols = Math.ceil(W / sp), rows = Math.ceil(H / sp), m = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = Math.min(W - 1, Math.round(i * sp + sp / 2)), y = Math.min(H - 1, Math.round(j * sp + sp / 2)); m[j * cols + i] = d[(y * W + x) * 4 + 3] / 255; }
      Object.assign(Hs, { mask: m, cols, rows, mW: W, mH: H });
    }
    ctx.clearRect(0, 0, W, H);
    const ys = (((t * 0.28) % 1.4) - 0.2) * H, near = Hs.inside && Math.abs(Hs.mx - W / 2) < H * 0.4;
    for (let j = 0; j < Hs.rows; j++) for (let i = 0; i < Hs.cols; i++) {
      const m = Hs.mask[j * Hs.cols + i]; let x = i * sp + sp / 2, y = j * sp + sp / 2;
      const fade = y > H * 0.82 ? Math.max(0, 1 - (y - H * 0.82) / (H * 0.18)) : 1;
      const boost = Math.exp(-Math.pow((y - ys) / (H * 0.05), 2));
      if (Hs.inside) { const dx = x - Hs.mx, dy = y - Hs.my, dd = Math.hypot(dx, dy); if (dd < 120) { const k = Math.sin(dd * 0.09 - t * 7) * Math.exp(-dd / 50) * 4; x += dx / (dd || 1) * k; y += dy / (dd || 1) * k; } }
      const v = m * fade;
      const r = v > 0.02 ? sp * 0.44 * Math.min(1, v * (0.72 + 0.18 * Math.sin(t * 1.6 + i * 0.4 + j * 0.3)) + boost * v * 0.35 + (near ? 0.12 * v : 0)) : sp * 0.07;
      const a = v > 0.02 ? 0.35 + 0.5 * v + boost * 0.3 : 0.12;
      const wht = Math.min(1, boost * v + (near ? 0.25 * v : 0));
      ctx.fillStyle = 'rgba(' + Math.round(110 + wht * 130) + ',' + Math.round(150 + wht * 95) + ',255,' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); ctx.fill();
    }
    ctx.font = Math.max(10, Math.round(H * 0.032)) + 'px "IBM Plex Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(220,228,247,.9)';
    ctx.fillText(near ? 'KAMU?' : "WHO'S NEXT?", W / 2, H - Math.max(8, H * 0.04)); ctx.textAlign = 'left';
  }
  stepBeacon(R, dt) {
    if (!this.visible(R.cv)) return;
    const still = this.still(); if (!still) R.t += dt;
    const g = this.ctxFor(R.cv), ctx = g.ctx, W = g.w, H = g.h, t = R.t;
    ctx.clearRect(0, 0, W, H);
    const bx = W * 0.76, by = H * 0.3, gap = 22, period = 2.2, speed = Math.max(W, H) * 0.45;
    if (R.inside && t - R.lastRip > 0.45) { R.lastRip = t; R.ripples.push({ x: R.mx, y: R.my, t0: t }); }
    R.ripples = R.ripples.filter((r) => t - r.t0 < 2.4);
    for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) {
      const d = Math.hypot(x - bx, y - by); let e = 0;
      for (let k = 0; k < 3; k++) { const age = ((t / period + k / 3) % 1) * period; e = Math.max(e, Math.exp(-Math.pow((d - age * speed) / 26, 2)) * (1 - age / period)); }
      for (let i = 0; i < R.ripples.length; i++) { const r = R.ripples[i], age = t - r.t0, dd = Math.hypot(x - r.x, y - r.y); e = Math.max(e, Math.exp(-Math.pow((dd - age * 220) / 20, 2)) * (1 - age / 2.4) * 0.9); }
      const fade = Math.max(0, 1 - d / (Math.max(W, H) * 0.95));
      const a = 0.08 + fade * 0.14 + e * 0.75;
      ctx.fillStyle = 'rgba(' + Math.round(110 + e * 120) + ',' + Math.round(150 + e * 90) + ',255,' + a.toFixed(3) + ')';
      const s = 1.2 + e * 2.2; ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    const orb = [['SP', 0], ['IS', 2.094], ['CE', 4.188]], ox = Math.min(W * 0.2, H * 0.34), oy = ox * 0.42;
    ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace'; ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(111,155,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(bx, by, ox, oy, 0, 0, Math.PI * 2); ctx.stroke();
    orb.forEach(([lbl, p]) => {
      const a = t * 0.35 + p, x = bx + Math.cos(a) * ox, y = by + Math.sin(a) * oy;
      ctx.strokeStyle = 'rgba(175,198,255,.35)'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = '#071233'; ctx.strokeStyle = 'rgba(175,198,255,.8)'; ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#E8EEFF'; ctx.fillText(lbl, x, y + 4);
    });
    const gr = ctx.createRadialGradient(bx, by, 0, bx, by, 40); gr.addColorStop(0, 'rgba(230,238,255,.9)'); gr.addColorStop(0.3, 'rgba(127,164,255,.5)'); gr.addColorStop(1, 'rgba(61,123,255,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(bx, by, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(175,198,255,.85)'; ctx.fillText((R.cv && R.cv.getAttribute('data-label')) || 'GEDUNG BANGKIT · KK SPICE', bx, by + oy + 34); ctx.textAlign = 'left';
  }

  /* ------------------------------------------------------------ EEG cover (project detail) */
  stepEeg(dt) {
    const E = this.eeg; if (!this.visible(E.cv)) return;
    if (!this.still()) E.t += dt;
    const g = this.ctxFor(E.cv), ctx = g.ctx, W = g.w, H = g.h;
    ctx.clearRect(0, 0, W, H);
    const ch = ['Fp1', 'Fp2', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'], rowH = H / (ch.length + 0.5), left = 56;
    ctx.font = '12px "IBM Plex Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle';
    for (let c = 0; c < ch.length; c++) {
      const y0 = rowH * (c + 0.75);
      ctx.fillStyle = '#8FA6D9'; ctx.fillText(ch[c], 14, y0);
      ctx.strokeStyle = 'rgba(140,155,192,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(left, Math.round(y0) + 0.5); ctx.lineTo(W, Math.round(y0) + 0.5); ctx.stroke();
      ctx.strokeStyle = c >= 6 ? 'rgba(175,198,255,.95)' : 'rgba(127,164,255,.8)'; ctx.lineWidth = 1.3; ctx.beginPath();
      for (let x = left; x <= W; x += 2) {
        const s = (x - left) / 90 + E.t * 1.6, alpha = c >= 6 ? 0.55 + 0.45 * Math.sin(E.t * 0.6 + c) : 0.25;
        const v = Math.sin(s * 10.3 + c) * alpha * 0.55 + Math.sin(s * 3.1 + c * 2) * 0.25 + Math.sin(s * 23.7 + c * 5) * 0.12 + Math.sin(s * 1.3 + c) * 0.18;
        const y = y0 - v * rowH * 0.42;
        if (x === left) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (E.hx !== null) { const x = Math.max(left, E.hx * W); ctx.strokeStyle = 'rgba(230,238,255,.5)'; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); ctx.stroke(); }
  }

  /* ------------------------------------------------------------ organigram connectors */
  startOrg(cv) {
    const host = cv.parentElement;
    this.orgState = { cv, host, t: 0, hover: null, dirty: true, pulses: [] };
    host.querySelectorAll('[data-node]').forEach((n) => {
      this.on(n, 'pointerenter', () => { this.orgState.hover = n.getAttribute('data-node'); });
      this.on(n, 'pointerleave', () => { this.orgState.hover = null; });
    });
  }
  stepOrg(dt) {
    const O = this.orgState; if (!this.visible(O.cv)) return;
    if (!this.still()) O.t += dt;
    const g = this.ctxFor(O.cv), ctx = g.ctx, W = g.w, H = g.h, hr = O.host.getBoundingClientRect();
    ctx.clearRect(0, 0, W, H);
    const sx = W / (hr.width || 1), sy = H / (hr.height || 1);
    const nodes = {};
    O.host.querySelectorAll('[data-node]').forEach((n) => { if (n.offsetParent === null) return; const r = n.getBoundingClientRect(); nodes[n.getAttribute('data-node')] = { id: n.getAttribute('data-node'), x: (r.left + r.width / 2 - hr.left) * sx, left: (r.left - hr.left) * sx, right: (r.right - hr.left) * sx, top: (r.top - hr.top) * sy, bot: (r.bottom - hr.top) * sy, parent: n.getAttribute('data-parent') }; });
    const chain = {}; let h = O.hover; while (h && nodes[h]) { chain[h] = 1; h = nodes[h].parent; }
    const kids = {};
    Object.values(nodes).forEach((n) => { if (nodes[n.parent]) (kids[n.parent] = kids[n.parent] || []).push(n); });
    const paths = [];
    Object.keys(kids).forEach((pid) => {
      const P = nodes[pid], C = kids[pid].slice().sort((a, b) => a.top - b.top || a.x - b.x);
      const rows = [];
      C.forEach((c) => { const r = rows.find((row) => Math.abs(row[0].top - c.top) < 24); if (r) r.push(c); else rows.push([c]); });
      rows.forEach((r) => r.sort((a, b) => a.x - b.x));
      const bus = [], gx = [];
      rows.forEach((row, k) => {
        const top = Math.min(...row.map((c) => c.top));
        if (k === 0) { bus.push(top - Math.min(30, (top - P.bot) / 2)); gx.push(P.x); return; }
        const prev = rows[k - 1], prevBot = Math.max(...prev.map((c) => c.bot));
        bus.push((prevBot + top) / 2);
        const want = row.reduce((s2, c) => s2 + c.x, 0) / row.length;
        const gaps = [];
        for (let j = 0; j < prev.length - 1; j++) gaps.push((prev[j].right + prev[j + 1].left) / 2);
        if (!gaps.length) gaps.push(prev[0].left - 16, prev[0].right + 16);
        gx.push(gaps.reduce((b, v) => (Math.abs(v - want) < Math.abs(b - want) ? v : b), gaps[0]));
      });
      rows.forEach((row, k) => row.forEach((c) => {
        const pts = [[P.x, P.bot], [P.x, bus[0]]];
        for (let j = 1; j <= k; j++) { pts.push([gx[j], bus[j - 1]]); pts.push([gx[j], bus[j]]); }
        pts.push([c.x, bus[k]]); pts.push([c.x, c.top]);
        paths.push({ pts, on: chain[c.id] && chain[pid] });
      }));
    });
    paths.sort((a, b) => (a.on ? 1 : 0) - (b.on ? 1 : 0));
    paths.forEach((p, i) => {
      ctx.strokeStyle = p.on ? 'rgba(175,198,255,.95)' : 'rgba(111,155,255,.28)'; ctx.lineWidth = p.on ? 2 : 1.2;
      ctx.beginPath(); p.pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      let tot = 0; const seg = [];
      for (let j = 1; j < p.pts.length; j++) { const l = Math.abs(p.pts[j][0] - p.pts[j - 1][0]) + Math.abs(p.pts[j][1] - p.pts[j - 1][1]); seg.push(l); tot += l; }
      if (tot <= 0) return;
      let ph = ((O.t * 0.35 + i * 0.137) % 1) * tot, j = 0;
      while (j < seg.length - 1 && ph > seg[j]) { ph -= seg[j]; j++; }
      const a = p.pts[j], b = p.pts[j + 1], k2 = seg[j] ? ph / seg[j] : 0, px = a[0] + (b[0] - a[0]) * k2, py = a[1] + (b[1] - a[1]) * k2;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 8); grd.addColorStop(0, 'rgba(230,238,255,.95)'); grd.addColorStop(1, 'rgba(61,123,255,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
    });
  }

  /* ------------------------------------------------------------ flashlight group photo */
  stepFlash(P, dt) {
    if (!this.visible(P.el)) return;
    P.x += (P.tx - P.x) * 0.16; P.y += (P.ty - P.y) * 0.16; P.r += (P.tr - P.r) * 0.1;
    const r = P.el.getBoundingClientRect();
    P.el.style.setProperty('--fx', (P.x * 100).toFixed(2) + '%'); P.el.style.setProperty('--fy', (P.y * 100).toFixed(2) + '%');
    P.el.style.setProperty('--fr', Math.round(P.r * Math.min(260, r.width * 0.22)) + 'px');
    const uu = Math.max(0.3, r.width / 1440); if (P.u !== uu) { P.u = uu; P.el.style.setProperty('--u', uu.toFixed(3)); }
    let best = null, bd = 1e9; P.hs.forEach((h) => { const hx = parseFloat(h.style.left) / 100, hy = parseFloat(h.style.top) / 100, dd = Math.hypot((hx - P.x) * r.width, (hy - P.y) * r.height); if (dd < bd) { bd = dd; best = h; } });
    P.hs.forEach((h) => { const near = P.inside && h === best && bd < Math.max(46, 80 * uu); if (near !== h._near) { h._near = near; h.setAttribute('data-near', near ? '1' : '0'); } });
  }

  /* ------------------------------------------------------------ drag carousel */
  stepDrag(D, dt) {
    const tr = D.tr, vp = tr.parentElement, max = Math.max(0, tr.scrollWidth - vp.clientWidth);
    if (!D.drag) { D.x += D.v; D.v *= Math.exp(-dt * 4); if (D.x > 0) { D.x += (0 - D.x) * 0.2; D.v = 0; } if (D.x < -max) { D.x += (-max - D.x) * 0.2; D.v = 0; } }
    tr.style.transform = 'translate3d(' + D.x.toFixed(1) + 'px,0,0)';
  }

  /* ------------------------------------------------------------ number count-up */
  stepCount(C, dt) {
    if (C.t < 0) { if (!this.visible(C.el)) return; C.t = 0; }
    if (C.t >= 1) return;
    C.t = this.still() ? 1 : Math.min(1, C.t + dt / 1.6);
    C.el.textContent = String(Math.round(C.to * (1 - Math.pow(1 - C.t, 3))));
  }

}


export function mount(props) {
  const c = new Component(props || {});
  let seen = false;
  try { seen = sessionStorage.getItem('spis-intro') === '1'; } catch (e) {}
  const want = !!(props && props.intro) && !seen;
  const ov = () => { const el = document.querySelector('[data-intro]'); if (el) el.style.display = c.state.introOn ? '' : 'none'; };
  c.state = { introOn: want };
  c.onState = ov; ov();
  if (want) { try { sessionStorage.setItem('spis-intro', '1'); } catch (e) {} }
  c.componentDidMount();
  const onClick = (ev) => {
    const t = ev.target.closest && ev.target.closest('[data-skip],[data-replay]');
    if (!t) return;
    if (t.hasAttribute('data-skip')) c.skip(); else c.replay();
  };
  document.addEventListener('click', onClick);
  return { unmount() { document.removeEventListener('click', onClick); c.componentWillUnmount(); } };
}
