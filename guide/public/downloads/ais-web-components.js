/* AIS Group web components, v0.2: behaviour. Load with defer after ais-web-components.css.
 * Header: mega menus (hover with mouse, click or keyboard elsewhere; Escape closes), the mobile menu and the
 * header that shrinks on scroll. Taken from the AIS Vision Systems site (Header.astro). Works with or without
 * Astro's ClientRouter. */
(() => {
  let mobileMenuController;
  let clearMenuTimers;
  function initMobileMenu() {
    mobileMenuController?.abort();
    clearMenuTimers?.();
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    const header = toggle?.closest('header');
    if (!toggle || !menu || !header) return;
    mobileMenuController = new AbortController();
    const { signal } = mobileMenuController;
    const groups = [...header.querySelectorAll('[data-nav-group]')];
    const timers = new Map();
    const activated = new Set();
    const cancelTimer = (group) => { clearTimeout(timers.get(group)); timers.delete(group); };
    clearMenuTimers = () => { for (const timer of timers.values()) clearTimeout(timer); timers.clear(); };
    const setPanel = (group, open) => {
      cancelTimer(group);
      if (!open) activated.delete(group);
      group.toggleAttribute('data-open', open);
      group.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', String(open));
      const panel = group.querySelector('[data-nav-panel]');
      if (panel) panel.inert = !open;
    };
    const closePanels = () => groups.forEach(group => setPanel(group, false));
    const openPanel = (group) => {
      for (const other of groups) if (other !== group) setPanel(other, false);
      setPanel(group, true);
    };
    groups.forEach(group => {
      const trigger = group.querySelector('[data-nav-trigger]');
      setPanel(group, false);
      group.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') openPanel(group); }, { signal });
      group.addEventListener('pointerleave', event => {
        if (event.pointerType !== 'mouse') return;
        cancelTimer(group);
        timers.set(group, setTimeout(() => { if (!activated.has(group) && !group.contains(document.activeElement)) setPanel(group, false); }, 180));
      }, { signal });
      group.addEventListener('focusin', () => cancelTimer(group), { signal });
      group.addEventListener('focusout', event => { if (!(event.relatedTarget instanceof Node) || !group.contains(event.relatedTarget)) setPanel(group, false); }, { signal });
      trigger?.addEventListener('click', () => {
        if (activated.has(group)) setPanel(group, false);
        else { openPanel(group); activated.add(group); }
      }, { signal });
    });
    header.setAttribute('data-nav-enhanced', '');
    const close = () => {
      closePanels();
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    }, { signal });
    document.addEventListener('focusin', event => { if (event.target instanceof Node && !header.contains(event.target)) close(); }, { signal });
    document.addEventListener('click', event => { if (event.target instanceof Node && !header.contains(event.target)) close(); }, { signal });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const activeGroup = groups.find(group => group.hasAttribute('data-open'));
      if (activeGroup) { event.preventDefault(); activeGroup.querySelector('[data-nav-trigger]')?.focus(); closePanels(); }
      if (toggle.getAttribute('aria-expanded') === 'true') { event.preventDefault(); close(); toggle.focus(); }
    }, { signal });
    const desktop = matchMedia('(min-width: 1200px)');
    desktop.addEventListener('change', close, { signal });
  }
  document.addEventListener('astro:before-swap', () => { mobileMenuController?.abort(); clearMenuTimers?.(); });
  function syncHeaderShrink() {
    const header = document.querySelector('[data-shrink-header]');
    if (!header) return;
    const y = window.scrollY;
    const scrolled = header.classList.contains('is-scrolled');
    if (!scrolled && y > 96) header.classList.add('is-scrolled');
    else if (scrolled && y < 24) header.classList.remove('is-scrolled');
  }
  if (!window.__aisHeaderShrink) { window.__aisHeaderShrink = true; window.addEventListener('scroll', syncHeaderShrink, { passive: true }); }
  const init = () => { initMobileMenu(); syncHeaderShrink(); };
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Hero films (HeroFilm.astro): <ais-hero-film data-desktop data-mobile> with a poster <picture> and a muted <video>.
 * The video loads only in view, never under reduced motion or Save-Data, and fades in once it plays. */
(() => {
  class AISHeroFilm extends HTMLElement {
    connectedCallback() {
      this.cleanup?.();
      const video = this.querySelector('video');
      if (!video) return;
      const controller = new AbortController();
      const { signal } = controller;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const connection = navigator.connection;
      let inView = false;
      const allowed = () => !motion.matches && !connection?.saveData;
      const sync = () => this.toggleAttribute('data-playing', !video.paused && !video.ended);
      const playVideo = async () => {
        if (!video.getAttribute('src')) video.src = (matchMedia(this.dataset.narrow || '(max-width: 599px)').matches ? this.dataset.mobile : this.dataset.desktop) ?? '';
        try { await video.play(); } catch { sync(); }
      };
      const visibility = () => { if (document.hidden || !inView || !allowed()) video.pause(); else void playVideo(); };
      video.addEventListener('playing', () => { this.setAttribute('data-ready', ''); sync(); }, { signal });
      video.addEventListener('pause', sync, { signal });
      video.addEventListener('error', () => { this.removeAttribute('data-ready'); sync(); }, { signal });
      document.addEventListener('visibilitychange', visibility, { signal });
      const preferences = () => { if (!allowed()) video.pause(); else visibility(); };
      motion.addEventListener('change', preferences, { signal });
      connection?.addEventListener?.('change', preferences, { signal });
      const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; visibility(); }, { threshold: .1 });
      observer.observe(this);
      this.cleanup = () => { video.pause(); observer.disconnect(); controller.abort(); };
      sync();
    }
    disconnectedCallback() { this.cleanup?.(); }
  }
  if (!customElements.get('ais-hero-film')) customElements.define('ais-hero-film', AISHeroFilm);
  if (!customElements.get('ais-video-wall')) customElements.define('ais-video-wall', class extends AISHeroFilm {});
})();

/* Language picker outside the header (.ais-nav-language with data-nav-group and data-nav-trigger): hover with a
 * mouse, click or keyboard elsewhere; Escape, a click outside or leaving it closes it. Header.astro's behaviour. */
(() => {
  const init = () => document.querySelectorAll('.ais-nav-language[data-nav-group]:not([data-nav-enhanced])').forEach(group => {
    if (group.closest('header')?.querySelector('[data-mobile-toggle]')) return;
    const trigger = group.querySelector('[data-nav-trigger]');
    const panel = group.querySelector('[data-nav-panel]');
    if (!trigger || !panel) return;
    let timer, pinned = false;
    const set = (open) => {
      clearTimeout(timer);
      if (!open) pinned = false;
      group.toggleAttribute('data-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.inert = !open;
    };
    set(false);
    group.setAttribute('data-nav-enhanced', '');
    group.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') set(true); });
    group.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') timer = setTimeout(() => { if (!pinned && !group.contains(document.activeElement)) set(false); }, 180); });
    group.addEventListener('focusout', e => { if (!(e.relatedTarget instanceof Node) || !group.contains(e.relatedTarget)) set(false); });
    trigger.addEventListener('click', () => { if (pinned) set(false); else { set(true); pinned = true; } });
    document.addEventListener('click', e => { if (e.target instanceof Node && !group.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && group.hasAttribute('data-open')) { set(false); trigger.focus(); } });
  });
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Lead form (form.zoho-form): the browser checks the required fields; on submit this blocks free and disposable email
 * domains with the form's data-corporate-email-error message and fills the values Zoho expects but the visitor never
 * sees (page URL, referrer, the two consents as Sí/No). The form then posts natively to Zoho. From ZohoLeadForm.astro. */
(() => {
  const FREE = ['gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.es', 'icloud.com', 'me.com', 'aol.com', 'gmx.com', 'gmx.es', 'proton.me', 'protonmail.com', 'mail.com', 'yandex.com', 'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com'];
  const init = () => document.querySelectorAll('form.zoho-form, form[data-zoho-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = 'true';
    const email = form.querySelector('input[name="Email"]');
    const error = form.querySelector('[data-email-error]');
    email?.addEventListener('input', () => { email.removeAttribute('aria-invalid'); if (error) error.hidden = true; });
    form.addEventListener('submit', event => {
      const domain = (email?.value || '').trim().toLowerCase().split('@')[1] || '';
      if (FREE.includes(domain)) {
        event.preventDefault();
        if (error) { error.querySelector('span').textContent = form.dataset.corporateEmailError || ''; error.hidden = false; }
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      const set = (selector, value) => { const field = form.querySelector(selector); if (field) field.value = value; };
      set('[data-zoho-page-url]', location.href);
      set('[data-zoho-referrer]', document.referrer);
      set('[data-zoho-consent-privacy]', form.querySelector('[data-consent-privacy]')?.checked ? 'Sí' : 'No');
      set('[data-zoho-consent-marketing]', form.querySelector('[data-consent-marketing]')?.checked ? 'Sí' : 'No');
      const back = form.querySelector('[data-zoho-return-url]');
      if (back?.dataset.path) back.value = location.origin + back.dataset.path;
    });
  });
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Video (.lite-yt[data-video-id]): the still and the play square until a click or Enter/Space, then the
 * youtube-nocookie player, autoplaying. From VideoEmbed.astro. */
(() => {
  const init = () => document.querySelectorAll('.lite-yt[data-video-id]:not([data-bound])').forEach(box => {
    box.dataset.bound = 'true';
    const load = () => {
      if (box.dataset.loaded) return;
      box.dataset.loaded = 'true';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(box.dataset.videoId)}?autoplay=1`;
      iframe.title = box.getAttribute('aria-label') ?? 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      box.appendChild(iframe);
    };
    box.addEventListener('click', load);
    box.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); load(); } });
  });
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Production-line animations (Rosepetal BottlingLine.astro): <ais-line-video data-media> with a poster image and a muted
 * looping <video class="line-video">. data-media holds {"wide": {"alpha": webm, "matte": mp4}, "small": {...}}, or
 * one such set per theme (charcoal, brand, design, light; the captured Rosepetal pages carry this form, on
 * <bottling-line>). The small set plays when the element is 600 px wide or less; WebKit gets the matte loop, which
 * cannot composite VP9 alpha. Plays only in view, never under reduced motion or Save-Data. The detection overlay
 * stays with the site. */
(() => {
  class AISLineVideo extends HTMLElement {
    connectedCallback() {
      this.cleanup?.();
      const video = this.querySelector('video');
      // Defined before the parser reached the children: start once the document is parsed.
      if (!video) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { if (this.isConnected) this.connectedCallback(); }, { once: true }); return; }
      const controller = new AbortController();
      const { signal } = controller;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const connection = navigator.connection;
      let inView = false;
      const allowed = () => !motion.matches && !connection?.saveData;
      const sources = () => {
        let media = {};
        try { media = JSON.parse(this.dataset.media || '{}'); } catch { /* no sources: the poster stays */ }
        if (media.wide || media.small) return media;
        const theme = document.documentElement.dataset.theme ?? '';
        this.dataset.mediaTheme = ['brand', 'design', 'light'].includes(theme) ? theme : 'charcoal';
        return media[this.dataset.mediaTheme] ?? {};
      };
      const load = (alpha) => {
        const src = sources()[this.getBoundingClientRect().width <= 600 ? 'small' : 'wide']?.[alpha ? 'alpha' : 'matte'];
        if (!src) return false;
        this.dataset.format = alpha ? 'alpha' : 'matte';
        video.muted = true;
        video.src = src;
        return true;
      };
      const update = () => {
        if (!allowed()) { video.pause(); this.removeAttribute('data-video'); return; }
        if (!inView || document.hidden) { video.pause(); return; }
        if (!video.getAttribute('src')) {
          const webkit = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
          const alpha = !webkit && Boolean(video.canPlayType('video/webm; codecs="vp9"'));
          if (!load(alpha) && alpha) load(false);
        }
        if (video.getAttribute('src') && video.paused) video.play().catch(() => {});
      };
      video.addEventListener('playing', () => { if (allowed() && inView) this.setAttribute('data-video', ''); }, { signal });
      video.addEventListener('error', () => { this.removeAttribute('data-video'); if (this.dataset.format === 'alpha' && load(false)) update(); }, { signal });
      document.addEventListener('visibilitychange', update, { signal });
      motion.addEventListener('change', update, { signal });
      connection?.addEventListener?.('change', update, { signal });
      const observer = new IntersectionObserver(entries => { inView = entries[entries.length - 1].isIntersecting; update(); });
      observer.observe(this);
      this.cleanup = () => { video.pause(); observer.disconnect(); controller.abort(); };
    }
    disconnectedCallback() { this.cleanup?.(); }
  }
  if (!customElements.get('ais-line-video')) customElements.define('ais-line-video', AISLineVideo);
  if (!customElements.get('bottling-line')) customElements.define('bottling-line', class extends AISLineVideo {});
})();
