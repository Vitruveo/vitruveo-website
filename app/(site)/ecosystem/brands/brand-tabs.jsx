'use client';

import { useEffect, useState } from 'react';

const BRANDS = [
  { id: 'vitruveo', name: 'Vitruveo' },
  { id: 'pretrend', name: 'Pretrend' },
  { id: 'vtruscope', name: 'VTRU Scope' },
  { id: 'aiwars', name: 'AI Wars' },
  { id: 'verticalfoundation', name: 'Vertical Foundation' },
];

const VARIANTS = [
  { key: 'logomark', label: 'Logomark', note: 'Mark only, full color' },
  { key: 'logomark-circle', label: 'Logomark, circle', note: 'Fits inside a circular crop, for avatars' },
  { key: 'logomark-square', label: 'Logomark, square', note: 'Fills a square, for square tiles' },
  { key: 'logo', label: 'Logo', note: 'Full color, for light backgrounds' },
  { key: 'logo-dark', label: 'Logo, dark', note: 'Full color, for dark backgrounds', dark: true },
  { key: 'logo-white', label: 'Logo, white', note: 'Solid white, for dark or photo backgrounds', dark: true },
  { key: 'logo-bw', label: 'Logo, grayscale', note: 'For black-and-white reproduction' },
];

function AssetCard({ brand, v }) {
  const base = `/brands/${brand.id}/${brand.id}-${v.key}`;
  const shape = v.key === 'logomark-circle' ? ' bk-frame-circle' : v.key === 'logomark-square' ? ' bk-frame-square' : '';
  return (
    <div className="bk-card">
      <div className={`bk-preview${v.dark ? ' bk-preview-dark' : ''}`}>
        <span className={`bk-frame${shape}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${base}.svg`} alt={`${brand.name} ${v.label}`} />
        </span>
      </div>
      <div className="bk-meta">
        <div>
          <div className="bk-label">{v.label}</div>
          <div className="bk-note">{v.note}</div>
          <code className="bk-file">{brand.id}-{v.key}</code>
        </div>
        <div className="bk-dl">
          <a href={`${base}.svg`} download>SVG</a>
          <a href={`${base}.png`} download>PNG</a>
        </div>
      </div>
    </div>
  );
}

export function BrandTabs() {
  const [active, setActive] = useState(BRANDS[0].id);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (BRANDS.some((b) => b.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const select = (id) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const brand = BRANDS.find((b) => b.id === active);

  return (
    <>
      <div className="bk-tabs" role="tablist" aria-label="Brands">
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            role="tab"
            id={`tab-${b.id}`}
            aria-selected={b.id === active}
            aria-controls="bk-panel"
            className={`bk-tab${b.id === active ? ' active' : ''}`}
            onClick={() => select(b.id)}
          >
            {b.name}
          </button>
        ))}
        <a href={`/brands/${brand.id}/${brand.id}-brandkit.zip`} download className="pj-btn-ghost bk-zip">
          Download all {brand.name} (.zip)
        </a>
      </div>
      <div id="bk-panel" role="tabpanel" aria-labelledby={`tab-${brand.id}`} className="bk-grid">
        {VARIANTS.map((v) => (
          <AssetCard key={`${brand.id}-${v.key}`} brand={brand} v={v} />
        ))}
      </div>
    </>
  );
}
