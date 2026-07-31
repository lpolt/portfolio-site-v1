// Lazy-load elements with data-bg and ensure <img loading="lazy"> is used for images
document.addEventListener('DOMContentLoaded', function () {
  const config = { rootMargin: '200px' };
  const onIntersect = (entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // background images
      const bg = el.dataset && el.dataset.bg;
      if (bg) {
        el.style.backgroundImage = `url('${bg}')`;
        el.removeAttribute('data-bg');
        obs.unobserve(el);
        return;
      }
      // picture/img lazy swap handled by browser for <img loading="lazy">
    });
  };
  const observer = new IntersectionObserver(onIntersect, config);
  document.querySelectorAll('[data-bg]').forEach(el => observer.observe(el));
});
