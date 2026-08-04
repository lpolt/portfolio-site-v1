// Accessible carousel controls: previous/next buttons and keyboard support
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  function scrollByAmount(amount) {
    carousel.scrollBy({ left: amount, behavior: 'smooth' });
  }

  function scrollNext() {
    const amount = Math.round(carousel.clientWidth * 0.8) || 300;
    scrollByAmount(amount);
  }
  function scrollPrev() {
    const amount = Math.round(carousel.clientWidth * 0.8) || 300;
    scrollByAmount(-amount);
  }

  if (nextBtn) nextBtn.addEventListener('click', scrollNext);
  if (prevBtn) prevBtn.addEventListener('click', scrollPrev);

  // Keyboard navigation when carousel has focus
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev(); }
  });

  // Show/hide controls based on overflow
  function updateControls() {
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth - 1;
    if (prevBtn) prevBtn.style.display = (carousel.scrollLeft > 5) ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = (carousel.scrollLeft < maxScrollLeft) ? 'block' : 'none';
  }
  carousel.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});
