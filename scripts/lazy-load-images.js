// Lazy-load elements with data-bg or data-bgset and ensure <img loading="lazy"> is used for images
// data-bgset format: "url-1024.webp 1024w, url-768.webp 768w, url-480.webp 480w"
// The script selects the best candidate based on element width * devicePixelRatio.

document.addEventListener('DOMContentLoaded', function () {
  const config = { rootMargin: '250px' };

  function parseBgSet(bgset) {
    return bgset
      .split(',')
      .map((s) => {
        const part = s.trim();
        const m = part.match(/^(.*?)\s+(\d+)w$/);
        if (m) return { url: m[1].trim(), width: parseInt(m[2], 10) };
        return { url: part, width: Infinity };
      })
      .sort((a, b) => a.width - b.width);
  }

  function chooseSrc(entries) {
    const dpr = window.devicePixelRatio || 1;
    const target = (entries.elementWidth || window.innerWidth) * dpr;
    // find the smallest image width >= target
    for (const e of entries.items) {
      if (e.width >= target) return e.url;
    }
    // fallback to largest
    return entries.items.length
      ? entries.items[entries.items.length - 1].url
      : null;
  }

  const onIntersect = (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Prefer data-bgset (responsive set); fall back to single data-bg
      const bgset = el.dataset && el.dataset.bgset;
      if (bgset) {
        const candidates = parseBgSet(bgset);
        const elementWidth =
          el.clientWidth ||
          parseInt(getComputedStyle(el).width, 10) ||
          window.innerWidth;
        const chosen = chooseSrc({ items: candidates, elementWidth });
        if (chosen) {
          el.style.backgroundImage = `url('${chosen}')`;
          // mark which candidate used
          el.dataset.bg = chosen;
        }
        el.removeAttribute('data-bgset');
        obs.unobserve(el);
        return;
      }

      const bg = el.dataset && el.dataset.bg;
      if (bg) {
        el.style.backgroundImage = `url('${bg}')`;
        el.removeAttribute('data-bg');
        obs.unobserve(el);
        return;
      }
      // <img loading="lazy"> handled by browser
    });
  };

  const observer = new IntersectionObserver(onIntersect, config);
  // Observe elements that want background loading
  document
    .querySelectorAll('[data-bg],[data-bgset]')
    .forEach((el) => observer.observe(el));
});
