export async function initBigIdeas() {
  const reduce =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 820px)').matches ||
    new URLSearchParams(location.search).has('qa');

  const section = document.getElementById('ideas');
  if (!section || reduce) return; // static stacked fallback handles it

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const pin = section.querySelector<HTMLElement>('.ideas-pin');
  const beats = Array.from(section.querySelectorAll<HTMLElement>('.beat'));
  const dots = Array.from(section.querySelectorAll<HTMLElement>('.ip-dot'));
  if (!pin || beats.length === 0) return;

  section.classList.add('is-animated');

  const setActive = (idx: number) => {
    beats.forEach((b, i) => {
      gsap.to(b, {
        opacity: i === idx ? 1 : 0,
        y: i === idx ? 0 : 18,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };

  // initialise
  gsap.set(beats, { opacity: 0, y: 18 });
  gsap.set(beats[0], { opacity: 1, y: 0 });
  dots[0]?.classList.add('is-active');

  let current = 0;
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => '+=' + window.innerHeight * (beats.length - 0.25),
    pin: pin,
    pinSpacing: true,
    scrub: true,
    onUpdate: (self) => {
      const idx = Math.min(beats.length - 1, Math.floor(self.progress * beats.length));
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
    },
  });
}
