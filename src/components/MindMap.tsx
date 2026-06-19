import { useCallback, useEffect, useRef, useState } from 'react';
import { CLUSTERS } from '../lib/clusters';

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

function ClusterContent({ index, close, move }: { index: number; close: () => void; move: (direction: number) => void }) {
  const cluster = CLUSTERS[index];
  return (
    <article
      className="orbit-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={`cluster-${cluster.id}`}
    >
      <button className="orbit-close" onClick={close} aria-label="Close research cluster">Close</button>
      <p className="orbit-panel-index">Research area {String(index + 1).padStart(2, '0')}</p>
      <h3 id={`cluster-${cluster.id}`} className="font-display">{cluster.label}</h3>
      <p className="orbit-panel-blurb">{cluster.blurb}</p>
      <div className="orbit-panel-rule" aria-hidden="true"></div>
      <p className="orbit-panel-label">Selected work</p>
      <ul>
        {cluster.leaves.map((leaf) => (
          <li key={leaf.title}>
            <span>{leaf.title}</span>
            <em>{leaf.status ?? leaf.year}</em>
          </li>
        ))}
      </ul>
      <div className="orbit-nav">
        <button onClick={() => move(-1)} aria-label="Previous research area">Previous</button>
        <span>{index + 1} / {CLUSTERS.length}</span>
        <button onClick={() => move(1)} aria-label="Next research area">Next</button>
      </div>
    </article>
  );
}

function DesktopOrbit() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const dragStart = useRef<number | null>(null);
  const selected = active ?? 0;
  const rotation = active === null ? 0 : -selected * 45 - 45;

  const move = useCallback((direction: number) => {
    setActive((current) => {
      const base = current ?? 0;
      return (base + direction + CLUSTERS.length) % CLUSTERS.length;
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (active === null) return;
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, move]);

  // Tell the persistent dial to sink behind the focused research panel.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dial:research', { detail: active !== null }));
    return () => {
      window.dispatchEvent(new CustomEvent('dial:research', { detail: false }));
    };
  }, [active]);

  return (
    <div
      className={`orbit-stage ${active !== null ? 'has-active' : ''}`}
      onPointerDown={(event) => { dragStart.current = event.clientX; }}
      onPointerUp={(event) => {
        if (dragStart.current === null || active === null) return;
        const delta = event.clientX - dragStart.current;
        if (Math.abs(delta) > 50) move(delta > 0 ? -1 : 1);
        dragStart.current = null;
      }}
    >
      <div
        className="orbit-system"
        style={{
          transform: `rotate(${rotation}deg) scale(${active === null ? 1 : 0.82})`,
          opacity: active === null ? 1 : 0.34,
        }}
      >
        <div className="orbit-rings" aria-hidden="true"><i></i><i></i><i></i></div>
        {CLUSTERS.map((cluster, index) => {
          const angle = index * 45 - 90;
          return (
            <button
              key={cluster.id}
              className="orbit-node"
              style={{ transform: `rotate(${angle}deg) translateY(-15.5rem) rotate(${-angle}deg)` }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => setActive(index)}
              aria-expanded={active === index}
            >
              <span className="orbit-node-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="orbit-node-label">{cluster.label}</span>
            </button>
          );
        })}
        <button className="orbit-hub" onClick={() => setActive(null)} aria-label="Reset research map">
          <span className="font-display">8</span>
          <small>research areas</small>
        </button>
      </div>

      {active !== null && <ClusterContent key={CLUSTERS[active].id} index={active} close={() => setActive(null)} move={move} />}

      {active === null && hovered !== null && (
        <div className="orbit-preview" role="status">
          <strong>{CLUSTERS[hovered].label}</strong>
          <span>{CLUSTERS[hovered].blurb}</span>
        </div>
      )}
    </div>
  );
}

function MobileOrbit() {
  const [active, setActive] = useState(0);
  return (
    <div className="orbit-mobile">
      <div className="orbit-mobile-track" role="tablist" aria-label="Research areas">
        {CLUSTERS.map((cluster, index) => (
          <button
            key={cluster.id}
            role="tab"
            aria-selected={active === index}
            className={active === index ? 'is-active' : ''}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {cluster.label}
          </button>
        ))}
      </div>
      <ClusterContent index={active} close={() => undefined} move={(direction) => setActive((active + direction + CLUSTERS.length) % CLUSTERS.length)} />
    </div>
  );
}

export function MindMap() {
  const mobile = useMobile();
  return (
    <>
      <div className="sr-only">
        <h3>Research areas</h3>
        {CLUSTERS.map((cluster) => (
          <section key={cluster.id}>
            <h4>{cluster.label}</h4>
            <p>{cluster.blurb}</p>
          </section>
        ))}
      </div>
      {mobile ? <MobileOrbit /> : <DesktopOrbit />}
    </>
  );
}
