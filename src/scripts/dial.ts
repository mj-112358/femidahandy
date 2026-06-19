/* ------------------------------------------------------------------ */
/*  Central dial controller.                                           */
/*                                                                     */
/*  One persistent SVG dial, one state model. Each section declares    */
/*  an anchor (position, scale, opacity, readout). The controller      */
/*  reads the single global scroll position every frame, resolves the  */
/*  active section, interpolates toward its anchor, and writes the     */
/*  result to CSS custom properties on the dial element. Nothing else  */
/*  touches the dial.                                                  */
/* ------------------------------------------------------------------ */

type Anchor = {
  fx: number; // x offset from viewport centre, in viewport widths
  fy: number; // y offset from viewport centre, in viewport heights
  scale: number;
  opacity: number;
  readout: string;
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

const IDEA_YEARS = ['1995', '1996', '1998', '2018', '2021'];
const IDEA_STEP = 26; // degrees of rotation between readings

const SECTION_ORDER = [
  'question',
  'mindmap',
  'ideas',
  'map',
  'wellbeing',
  'beyond',
  'shelf',
  'recognition',
  'publications',
  'continue',
] as const;

// Declarative per-section anchors (desktop).
const ANCHORS: Record<string, Anchor> = {
  hero: { fx: 0, fy: -0.02, scale: 1.0, opacity: 1, readout: '00' },
  heroRest: { fx: 0.36, fy: -0.36, scale: 0.34, opacity: 0.92, readout: '00' },
  question: { fx: 0.35, fy: -0.27, scale: 0.3, opacity: 0.55, readout: 'WHY' },
  mindmap: { fx: 0.4, fy: -0.27, scale: 0.26, opacity: 0.32, readout: '08' },
  ideas: { fx: 0.3, fy: 0.0, scale: 0.46, opacity: 0.96, readout: '1995' },
  map: { fx: 0.4, fy: 0.3, scale: 0.2, opacity: 0.48, readout: '13' },
  wellbeing: { fx: 0.4, fy: -0.28, scale: 0.2, opacity: 0.4, readout: 'WELL' },
  beyond: { fx: 0.42, fy: -0.28, scale: 0.18, opacity: 0.32, readout: 'MORE' },
  shelf: { fx: 0.4, fy: -0.3, scale: 0.22, opacity: 0.46, readout: '09' },
  recognition: { fx: 0.42, fy: -0.28, scale: 0.18, opacity: 0.3, readout: 'NVSQ' },
  publications: { fx: 0.42, fy: -0.28, scale: 0.18, opacity: 0.28, readout: '100+' },
  continue: { fx: -0.26, fy: 0.0, scale: 0.62, opacity: 1, readout: 'NEXT' },
};

export function initDial() {
  const dial = document.getElementById('dial');
  const readoutEl = dial?.querySelector<SVGTextElement>('[data-dial-readout]');
  if (!dial || !readoutEl) return;

  const root = document.documentElement;
  const reduce =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).has('qa');

  let researchOpen = false;
  window.addEventListener('dial:research', (event) => {
    researchOpen = Boolean((event as CustomEvent).detail);
  });

  const byId = (id: string) => document.getElementById(id);

  // Current (rendered) and target dial state.
  const cur = { x: 0, y: 0, scale: 1, opacity: 1, rot: 0 };
  let curReadout = '00';
  let initialised = false;

  const mobileQuery = window.matchMedia('(max-width: 760px)');

  // Layout (pre-transform) width of the dial; only changes on resize. Used to
  // size the dial as a fraction of a real grid column.
  let dialBase = dial.offsetWidth || 300;
  const measureBase = () => {
    dialBase = dial.offsetWidth || dialBase;
  };

  // Centre the dial inside a real element (a reserved grid column) and size it
  // to a fraction of that column's width, capped so it never clips vertically.
  function slotTarget(selector: string, fill: number, vw: number, vh: number) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return null;
    const targetPx = Math.min(r.width * fill, vh * 0.78);
    return {
      x: r.left + r.width / 2 - vw / 2,
      y: r.top + r.height / 2 - vh / 2,
      scale: targetPx / dialBase,
    };
  }

  function resolveTarget() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = mobileQuery.matches;

    const hero = byId('hero');
    let heroProg = 1;
    if (hero) {
      if (reduce) {
        heroProg = 1;
      } else {
        const r = hero.getBoundingClientRect();
        const span = Math.max(1, hero.offsetHeight - vh);
        heroProg = clamp(-r.top / span);
      }
    }
    root.style.setProperty('--hero-progress', heroProg.toFixed(3));

    // ---- Hero entrance: dial owns the screen until it reaches its rest. ----
    if (heroProg < 0.999 && hero) {
      const a = ANCHORS.hero;
      const b = ANCHORS.heroRest;
      const move = ease(clamp((heroProg - 0.45) / 0.55));
      const lerp = (k: keyof Anchor) =>
        (a[k] as number) + ((b[k] as number) - (a[k] as number)) * move;
      const scaleBoost = mobile ? 0.7 : 1;
      return {
        x: lerp('fx') * vw,
        y: lerp('fy') * vh,
        scale: lerp('scale') * scaleBoost,
        opacity: lerp('opacity'),
        rot: reduce ? 90 : 90 * heroProg,
        readout: '00',
        radialOn: false,
      };
    }

    // ---- Resolve the section nearest the viewport centre. ----
    // 'hero' is a candidate so that once the opening has settled (or in
    // reduced motion) the dial holds its hero rest anchor while the hero
    // is still on screen.
    let active = 'question';
    let best = Infinity;
    for (const id of ['hero', ...SECTION_ORDER]) {
      const el = byId(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2;
      const d = Math.abs(centre - vh * 0.5);
      if (d < best) {
        best = d;
        active = id;
      }
    }

    const a = { ...(active === 'hero' ? ANCHORS.heroRest : ANCHORS[active]) };
    let rot = reduce ? 0 : window.scrollY * 0.018;
    let radialOn = false;
    let pos = { x: a.fx * vw, y: a.fy * vh, scale: a.scale };
    let opacity = a.opacity;

    if (active === 'ideas') {
      const el = byId('ideas');
      if (el) {
        const span = Math.max(1, el.offsetHeight - vh);
        const p = clamp(-el.getBoundingClientRect().top / span);
        const idx = Math.min(IDEA_YEARS.length - 1, Math.floor(p * IDEA_YEARS.length));
        a.readout = IDEA_YEARS[idx];
        rot = idx * IDEA_STEP; // chronological step, settled per reading
      }
      if (mobile || reduce) {
        // The stacked list carries the years (per-idea numerals) when the
        // animated two-column stage is not in play.
        opacity = 0;
      } else {
        // Fill the reserved right-hand stage.
        const slot = slotTarget('.ideas-dial-slot', 0.86, vw, vh);
        if (slot) pos = slot;
      }
    } else if (active === 'mindmap' && researchOpen) {
      opacity *= 0.45; // sink behind the focused research panel
    } else if (active === 'continue') {
      const el = byId('continue');
      if (el) {
        const r = el.getBoundingClientRect();
        // Clamp the final turn so progress past the settled state cannot keep
        // rotating the dial. This is the terminal frame.
        const p = clamp((vh * 0.55 - r.top) / (vh * 0.7));
        rot = reduce ? 18 : 18 + ease(p) * 110;
      }
      radialOn = true;
      const field = slotTarget('.continue-field', mobile ? 0.82 : 0.9, vw, vh);
      if (field) pos = field;
    }

    // ---- Mobile: keep the dial out of single-column reading flow for the
    //      sections that are not element-anchored above. ----
    if (mobile && active !== 'continue' && active !== 'ideas') {
      pos = { x: 0.32 * vw, y: -0.4 * vh, scale: Math.min(a.scale, 0.24) * 0.85 };
      opacity = Math.min(opacity, 0.4);
    }

    return { x: pos.x, y: pos.y, scale: pos.scale, opacity, rot, readout: a.readout, radialOn };
  }

  function frame() {
    const t = resolveTarget();
    const k = reduce || !initialised ? 1 : 0.08;
    initialised = true;

    cur.x += (t.x - cur.x) * k;
    cur.y += (t.y - cur.y) * k;
    cur.scale += (t.scale - cur.scale) * k;
    cur.opacity += (t.opacity - cur.opacity) * k;
    // shortest-path angle interpolation
    let dr = t.rot - cur.rot;
    cur.rot += dr * k;

    dial!.style.setProperty('--dx', `${cur.x.toFixed(1)}px`);
    dial!.style.setProperty('--dy', `${cur.y.toFixed(1)}px`);
    dial!.style.setProperty('--ds', cur.scale.toFixed(3));
    dial!.style.setProperty('--dr', `${cur.rot.toFixed(2)}deg`);
    dial!.style.setProperty('--do', cur.opacity.toFixed(3));

    if (t.readout !== curReadout) {
      curReadout = t.readout;
      readoutEl!.textContent = t.readout;
    }

    root.classList.toggle('continue-active', t.radialOn);

    if (!reduce) window.requestAnimationFrame(frame);
  }

  // Prime once, then animate. In reduced motion we still keep the dial in
  // sync with scroll, but without a continuous RAF loop.
  measureBase();
  resolveTarget();
  frame();

  // Recompute layout-derived values after orientation/resize so the dial is
  // never left at a stale (e.g. desktop) coordinate on a phone.
  const onResize = () => {
    measureBase();
    resolveTarget();
    if (reduce) frame();
  };
  if (reduce) {
    const onScroll = () => frame();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  mobileQuery.addEventListener('change', onResize);
}
