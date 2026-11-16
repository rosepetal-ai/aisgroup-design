// Pagefind owns retrieval, ranking, language selection and accent normalization.
// This controller only presents its results with native dialog and link semantics.
type SearchData = { url: string; meta: { title?: string }; excerpt: string; sub_results?: { url: string; title: string; excerpt: string }[] };
type SearchAPI = { search: (query: string) => Promise<{ results: { data: () => Promise<SearchData> }[] }> };
let bound: AbortController | undefined;
export function setupGuideSearch() {
  // Runs after every page change: drop the previous page's listeners, since the triggers persist.
  bound?.abort(); bound = new AbortController();
  const { signal } = bound;
  const dialog = document.querySelector<HTMLDialogElement>('#guide-search');
  const triggers = [...document.querySelectorAll<HTMLButtonElement>('.guide-search-trigger')];
  const trigger = triggers[0];
  if (!dialog || !trigger) return;
  const input = dialog.querySelector<HTMLInputElement>('input')!;
  const status = dialog.querySelector<HTMLElement>('[role="status"]')!;
  const results = dialog.querySelector<HTMLOListElement>('ol')!;
  const labels = dialog.dataset;
  let api: Promise<SearchAPI> | undefined;
  let version = 0;
  let timer: ReturnType<typeof setTimeout>;
  let returnFocus: HTMLElement | null = null;
  const message = (key: string) => { status.textContent = labels[key] || ''; };
  // Only preserve Pagefind's highlight marks; never inject result HTML.
  const excerpt = (html: string) => {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const fragment = document.createDocumentFragment();
    const copy = (node: Node, into: Node) => {
      if (node.nodeType === Node.TEXT_NODE) into.appendChild(document.createTextNode(node.textContent || ''));
      else if (node instanceof Element) {
        const target = node.tagName === 'MARK' ? document.createElement('mark') : into;
        if (target !== into) into.appendChild(target);
        node.childNodes.forEach(child => copy(child, target));
      }
    };
    parsed.body.childNodes.forEach(node => copy(node, fragment));
    return fragment;
  };
  const run = async () => {
    const current = ++version;
    results.replaceChildren();
    const query = input.value.trim();
    if (!query) { message('prompt'); return; }
    message('loading');
    results.setAttribute('aria-busy', 'true');
    try {
      const modulePath = '/pagefind/pagefind.js';
      api ??= import(/* @vite-ignore */ modulePath).catch(error => { api = undefined; throw error; });
      const response = await (await api).search(query);
      const pages = await Promise.all(response.results.slice(0, 12).map(result => result.data()));
      if (current !== version || !dialog.open) return;
      const links = new Set<string>();
      for (const page of pages) {
        const sections = page.sub_results?.length ? page.sub_results.slice(0, 3) : [{ url: page.url, title: page.meta.title || '', excerpt: page.excerpt }];
        for (const section of sections) {
          const url = new URL(section.url, location.origin);
          if (url.origin !== location.origin || !url.pathname.startsWith(`/${document.documentElement.lang}/`) || links.has(url.href)) continue;
          links.add(url.href);
          const li = document.createElement('li');
          const a = document.createElement('a'); a.href = url.pathname + url.hash;
          const title = document.createElement('strong');
          title.textContent = section.title === page.meta.title ? section.title : `${page.meta.title} — ${section.title}`;
          const text = document.createElement('span'); text.append(excerpt(section.excerpt || page.excerpt));
          a.append(title, text); li.append(a); results.append(li);
        }
      }
      if (!links.size) message('empty');
      else status.textContent = `${links.size} ${labels.results}`;
    } catch {
      if (current === version && dialog.open) message('error');
    } finally {
      if (current === version) results.removeAttribute('aria-busy');
    }
  };
  const open = () => {
    if (dialog.open) { input.focus(); return; }
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    dialog.showModal(); input.focus(); input.select(); void run();
  };
  triggers.forEach(t => t.addEventListener('click', open, { signal }));
  const close = () => dialog.close();
  dialog.querySelector('button')!.addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  } });
  dialog.addEventListener('close', () => { ++version; clearTimeout(timer); results.removeAttribute('aria-busy'); returnFocus?.focus(); });
  input.addEventListener('input', () => { ++version; clearTimeout(timer); results.replaceChildren(); results.removeAttribute('aria-busy'); message(input.value.trim() ? 'loading' : 'prompt'); timer = setTimeout(run, 160); });
  dialog.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll<HTMLAnchorElement>('a')];
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    // A search field eats the first Escape to clear itself; one Escape should close the dialog.
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key === 'ArrowDown' && links.length) { event.preventDefault(); links[(index + 1) % links.length].focus(); }
    if (event.key === 'ArrowUp' && links.length) { event.preventDefault(); if (index <= 0) input.focus(); else links[index - 1].focus(); }
    if (event.key === 'Enter' && event.target === input && links.length) { event.preventDefault(); links[0].click(); }
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
  }, { signal });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) triggers.forEach(t => { const k = t.querySelector('kbd'); if (k) k.textContent = '⌘ K'; });
}
