import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initDial } from './dial';

gsap.registerPlugin(ScrollTrigger);

const qa = new URLSearchParams(location.search).has('qa');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || qa;
if (qa) document.documentElement.classList.add('motion-reduced');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ------------------------------------------------------------------ */
/*  Smooth inertial scroll (Lenis) wired to GSAP ScrollTrigger         */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;

if (!reduce) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // exposed for QA / programmatic scrolling
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

}

function scrollToHash(hash: string, immediate = false) {
  if (!hash || hash === '#') return;
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -72, duration: immediate ? 0 : 1.2, immediate });
  else target.scrollIntoView({ behavior: 'auto', block: 'start' });
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    event.preventDefault();
    history.pushState(null, '', hash);
    scrollToHash(hash);
  });
});

window.addEventListener('hashchange', () => scrollToHash(location.hash, true));

/* ------------------------------------------------------------------ */
/*  Reveal system — soft rise + de-blur, staggered children            */
/* ------------------------------------------------------------------ */
function setupReveals() {
  if (reduce) {
    document.querySelectorAll('.reveal, .section-rule, [data-reveal-group]').forEach((el) =>
      el.classList.add('is-revealed'),
    );
    return;
  }

  // group staggering: children of [data-reveal-group] get an incremental delay
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const kids = Array.from(group.querySelectorAll<HTMLElement>('.reveal'));
    ScrollTrigger.create({
      trigger: group,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        kids.forEach((el, i) => {
          const extra = parseFloat(el.dataset.delay || '0');
          setTimeout(() => el.classList.add('is-revealed'), i * 75 + extra);
        });
      },
    });
  });

  // standalone reveals (not inside a group)
  document
    .querySelectorAll<HTMLElement>('.reveal:not([data-reveal-group] .reveal)')
    .forEach((el) => {
      if (el.closest('[data-reveal-group]')) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-revealed'),
      });
    });

  // section rules draw themselves across
  document.querySelectorAll<HTMLElement>('.section-rule').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => el.classList.add('is-revealed'),
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Stat counters — count up once on entry, then settle                */
/* ------------------------------------------------------------------ */
function setupCounters() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!els.length) return;

  const run = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = prefix + Math.round(obj.v) + suffix;
      },
      onComplete: () => {
        el.textContent = prefix + target + suffix;
      },
    });
  };

  // Server-rendered text already holds the final value. Only reset to 0 and
  // animate when the tab is genuinely visible and motion is allowed; otherwise
  // leave the final numbers in place (no-JS, reduced-motion, backgrounded tab).
  if (reduce || document.visibilityState !== 'visible') return;

  els.forEach((el) => {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    el.textContent = prefix + '0' + suffix;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ */
/*  Nav — fade in after hero + thin red scroll-progress line           */
/* ------------------------------------------------------------------ */
function setupNav() {
  const nav = document.getElementById('site-nav');
  const bar = document.getElementById('scroll-progress');
  const hero = document.getElementById('hero');

  if (nav && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 80%',
      onEnter: () => nav.classList.add('nav-visible'),
      onLeaveBack: () => nav.classList.remove('nav-visible'),
    });
  }

  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    if (lenis) lenis.on('scroll', update);
    else window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // active section highlighting in nav
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-navlink]'));
  links.forEach((link) => {
    const id = link.getAttribute('href');
    if (!id) return;
    const section = document.querySelector(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      },
    });
  });
}

function init() {
  setupReveals();
  setupCounters();
  setupNav();
  initDial();
  ScrollTrigger.refresh();
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

// keep ScrollTrigger honest once images/fonts settle
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  if (!location.hash) return;
  window.setTimeout(() => {
    scrollToHash(location.hash, true);
  }, 320);
});

export {};
