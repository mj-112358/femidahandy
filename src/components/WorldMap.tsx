import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldData from 'world-atlas/countries-110m.json';
import { PLACES, EMPHASIS_ID } from '../lib/countries';

type GeoFeature = {
  type: 'Feature';
  id?: string | number;
  properties: { name?: string };
  geometry: Geometry;
};

const placeById = new Map(PLACES.map((p) => [Number(p.id), p]));

export default function WorldMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  // SSR / no-JS / reduced-motion render the FINAL lit state; motion enhances below.
  const [lit, setLit] = useState<boolean>(true);
  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);

  const W = width;
  const H = Math.round(width * 0.52);

  const features = useMemo(() => {
    const fc = feature(
      worldData as never,
      (worldData as never as { objects: { countries: never } }).objects.countries,
    ) as unknown as FeatureCollection;
    return (fc.features as unknown as GeoFeature[]).filter((f) => Number(f.id) !== 10); // drop Antarctica (id 010)
  }, []);

  const { paths } = useMemo(() => {
    const projection = geoNaturalEarth1().fitSize([W, H], {
      type: 'FeatureCollection',
      features: features as never,
    });
    const path = geoPath(projection);
    return {
      paths: features.map((f, i) => ({
        d: path(f as never) || '',
        id: Number(f.id),
        key: i,
      })),
    };
  }, [features, W, H]);

  // responsive width
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(Math.max(320, e.contentRect.width));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Motion enhancement: dim before paint, then sweep the highlights in on entry.
  const [reduce, setReduce] = useState(false);
  useLayoutEffect(() => {
    const wantsReduce =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      new URLSearchParams(location.search).has('qa');
    setReduce(wantsReduce);
    if (wantsReduce) return; // keep final lit state
    setLit(false); // pre-animation, before browser paints
    const el = wrapRef.current;
    let done = false;
    const light = () => {
      if (done) return;
      done = true;
      setLit(true);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          light();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (el) io.observe(el);
    const fallback = window.setTimeout(light, 2500); // guarantee reveal
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // stagger order for highlighted countries (India last)
  const order = useMemo(() => {
    const ids = PLACES.filter((p) => p.id !== EMPHASIS_ID).map((p) => Number(p.id));
    return new Map(ids.map((id, i) => [id, i]));
  }, []);

  const hoverPlace = hover ? placeById.get(hover.id) : null;

  return (
    <div className="wm-wrap" ref={wrapRef}>
      <svg
        className="wm-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="World map highlighting the countries in Femida Handy's empirical research, with India emphasised."
      >
        <g>
          {paths.map((p) => {
            const place = placeById.get(p.id);
            const isEmphasis = p.id === Number(EMPHASIS_ID);
            const highlighted = !!place;
            const delay = isEmphasis
              ? 1100
              : (order.get(p.id) ?? 0) * 70 + 120;
            const fill = highlighted
              ? lit
                ? isEmphasis
                  ? 'var(--color-penn-red)'
                  : 'var(--color-penn-blue)'
                : 'rgba(1,31,91,0.16)'
              : 'rgba(1,31,91,0.07)';
            return (
              <path
                key={p.key}
                d={p.d}
                tabIndex={highlighted ? 0 : undefined}
                role={highlighted ? 'button' : undefined}
                aria-label={place ? `${place.name}. ${place.note}` : undefined}
                fill={fill}
                stroke="var(--color-canvas)"
                strokeWidth={0.4}
                style={{
                  transition: reduce
                    ? undefined
                    : `fill 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                  cursor: highlighted ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) =>
                  highlighted &&
                  setHover({
                    id: p.id,
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                  })
                }
                onMouseMove={(e) =>
                  highlighted &&
                  setHover({ id: p.id, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
                }
                onMouseLeave={() => setHover(null)}
                onFocus={() => highlighted && setHover({ id: p.id, x: W / 2, y: H / 2 })}
                onBlur={() => setHover(null)}
              />
            );
          })}
        </g>
      </svg>

      {hoverPlace && hover && (
        <div
          className="wm-tip"
          style={{ left: hover.x, top: hover.y }}
          role="status"
        >
          <strong>{hoverPlace.name}</strong>
          <span>{hoverPlace.note}</span>
        </div>
      )}

      {/* accessible / mobile country list */}
      <ul className="wm-list">
        {PLACES.map((p) => (
          <li key={p.id} className={p.emphasis ? 'is-emphasis' : ''}>
            <span className="wm-list-name">{p.name}</span>
            <span className="wm-list-note">{p.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
