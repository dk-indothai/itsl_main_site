/** Progressive enhancement: the unenhanced track already exposes all six quotes. */
export function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('.testimonial-track')!;
  const slides = [...track.querySelectorAll<HTMLElement>('[data-slide]')];
  const pauseButton = root.querySelector<HTMLButtonElement>('[data-pause]')!;
  const pauseLabel =
    pauseButton.querySelector<HTMLElement>('[data-pause-label]')!;
  const position = root.querySelector<HTMLElement>('[data-position]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Number(
    getComputedStyle(root).getPropertyValue('--carousel-interval'),
  );
  let index = 0;
  let paused = reducedMotion.matches;
  let hovering = false;
  let visible = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const visibleCount = () =>
    Number(getComputedStyle(root).getPropertyValue('--carousel-visible'));
  const maxIndex = () => Math.max(0, slides.length - visibleCount());
  const update = () => {
    if (timer) clearInterval(timer);
    timer = undefined;
    pauseButton.setAttribute(
      'aria-label',
      reducedMotion.matches
        ? 'Autoplay off: reduced motion'
        : paused
          ? 'Resume autoplay'
          : 'Pause autoplay',
    );
    pauseLabel.textContent = reducedMotion.matches
      ? 'Auto off'
      : paused
        ? 'Play'
        : 'Pause';
    pauseButton.dataset.paused = String(paused || reducedMotion.matches);
    pauseButton.disabled = reducedMotion.matches;
    if (
      !paused &&
      !hovering &&
      visible &&
      !document.hidden &&
      !reducedMotion.matches
    ) {
      timer = setInterval(() => move(1, false), interval);
    }
  };
  const move = (direction: number, manual: boolean) => {
    index =
      direction > 0
        ? index >= maxIndex()
          ? 0
          : index + 1
        : index <= 0
          ? maxIndex()
          : index - 1;
    const left = slides[index].offsetLeft - slides[0].offsetLeft;
    track.scrollTo({
      left,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
    position.textContent = String(index + 1);
    if (manual) {
      paused = true;
      status.textContent = `Showing testimonials ${index + 1} to ${Math.min(index + visibleCount(), slides.length)} of ${slides.length}. Autoplay paused.`;
      update();
    }
  };
  root.querySelector<HTMLElement>('.carousel-controls')!.hidden = false;
  root
    .querySelector('[data-previous]')!
    .addEventListener('click', () => move(-1, true));
  root
    .querySelector('[data-next]')!
    .addEventListener('click', () => move(1, true));
  // Remember pointer intent before focusin pauses rotation and updates the label.
  let pointerPauseIntent: boolean | undefined;
  pauseButton.addEventListener('pointerdown', () => {
    pointerPauseIntent = !paused;
  });
  pauseButton.addEventListener('click', () => {
    paused = pointerPauseIntent ?? !paused;
    pointerPauseIntent = undefined;
    update();
  });
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      hovering = true;
      update();
    }
  });
  root.addEventListener('pointerleave', () => {
    hovering = false;
    update();
  });
  root.addEventListener('focusin', () => {
    paused = true;
    update();
  });
  const pauseInteraction = () => {
    paused = true;
    update();
  };
  track.addEventListener('pointerdown', pauseInteraction);
  track.addEventListener('wheel', pauseInteraction, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1, true);
    } else pauseInteraction();
  });
  track.addEventListener('scrollend', () => {
    const step = slides[1].offsetLeft - slides[0].offsetLeft;
    index = Math.min(
      maxIndex(),
      Math.max(0, Math.round(track.scrollLeft / step)),
    );
    position.textContent = String(index + 1);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) paused = true;
    update();
  });
  document.addEventListener('visibilitychange', update);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      update();
    },
    { threshold: 0.25 },
  ).observe(root);
  new ResizeObserver(() => {
    index = Math.min(index, maxIndex());
    position.textContent = String(index + 1);
    track.scrollTo({
      left: slides[index].offsetLeft - slides[0].offsetLeft,
      behavior: 'instant',
    });
  }).observe(track);
  update();
}
