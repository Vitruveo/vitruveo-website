import Image from 'next/image';

export const metadata = {
  title: 'Ecosystem - Vitruveo',
  description:
    'Projects running on Vitruveo: Pretrend, Multisig, VTRU Bridge, USDT Bridge, VNS, VIBE, the Vitruveo Explorer, VStats, and Quadplot, with Coinveyor, AIGIS, and Instagraphic coming soon.',
};

const accent = (a, b) => ({ '--pj-a': a, '--pj-b': b });

const Arrow = () => <span aria-hidden="true" className="pj-arrow">↗</span>;

const OUTCOMES = [
  { name: 'Moon', color: '#8b5cf6' },
  { name: 'Bull', color: '#4ade80' },
  { name: 'Flat', color: '#9ca3af' },
  { name: 'Bear', color: '#f97316' },
  { name: 'Crash', color: '#ef4444' },
];

const PRETREND_STATS = [
  { value: '5 min', label: 'per round' },
  { value: '5', label: 'outcomes' },
  { value: '0%', label: 'fee on winnings' },
  { value: '1:1', label: 'USDT-backed VUSD' },
];

// Gradient roundel with a white glyph, for projects that have no standalone logo.
function Badge({ id, a, b, size = 48, children }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="flex-shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${id})`} />
      <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

const GLYPHS = {
  multisig: (
    <>
      <rect x="20" y="29" width="24" height="18" rx="3" />
      <path d="M25 29v-5a7 7 0 0 1 14 0v5" />
      <circle cx="26" cy="38" r="1.5" fill="#fff" />
      <circle cx="32" cy="38" r="1.5" fill="#fff" />
      <circle cx="38" cy="38" r="1.5" fill="#fff" />
    </>
  ),
  bridge: (
    <>
      <path d="M16 26h28l-6-6" />
      <path d="M48 38H20l6 6" />
    </>
  ),
  vns: (
    <>
      <circle cx="32" cy="32" r="5" />
      <path d="M37 32v2.5a4 4 0 0 0 8 0V32a13 13 0 1 0-5.2 10.4" />
    </>
  ),
  stats: (
    <>
      <path d="M20 44V34" />
      <path d="M28 44V24" />
      <path d="M36 44V30" />
      <path d="M44 44V18" />
    </>
  ),
  vibe: <polyline points="12,34 20,34 25,22 31,44 37,16 43,40 47,32 52,32" />,
};

const ECOSYSTEM = [
  {
    name: 'Multisig',
    tag: 'Shared custody',
    href: 'https://scope.vitruveo.ai/assets/multisig',
    host: 'scope.vitruveo.ai/assets/multisig',
    a: '#34d399',
    b: '#0ea5e9',
    glyph: 'multisig',
    blurb: 'Wallets that need several signers before any funds move.',
    features: ['Create a multisig wallet in a few clicks', 'Secures every key Vertical Foundation wallet, 3-of-3', 'Built on Safe contracts'],
  },
  {
    name: 'VTRU Bridge',
    tag: 'Vitruveo ⇄ BNB Chain',
    href: 'https://scope.vitruveo.ai/bridge/vtru',
    host: 'scope.vitruveo.ai/bridge/vtru',
    a: '#b04cff',
    b: '#f0b90b',
    glyph: 'bridge',
    blurb: 'Move VTRU between Vitruveo and BNB Smart Chain and back.',
    features: ['VTRU locked on Vitruveo, minted on BSC', 'Seeds permanent VTRU/USDT liquidity on PancakeSwap', 'LP position burned'],
  },
  {
    name: 'USDT Bridge',
    tag: 'BNB Chain ⇄ Vitruveo',
    href: 'https://scope.vitruveo.ai/bridge/usdt',
    host: 'scope.vitruveo.ai/bridge/usdt',
    a: '#26a17b',
    b: '#f0b90b',
    glyph: 'bridge',
    blurb: 'Move USDT between BNB Smart Chain and Vitruveo.',
    features: ['USDT locked on BSC, USDT.b minted on Vitruveo', 'Backs VUSD, the currency of Pretrend', 'Locked and minted balances in plain view'],
  },
  {
    name: 'VNS',
    tag: 'Vitruveo Naming Service',
    href: 'https://scope.vitruveo.ai/vns',
    host: 'scope.vitruveo.ai/vns',
    a: '#22d3ee',
    b: '#6366f1',
    glyph: 'vns',
    blurb: 'Swap the 0x address for a name people can remember.',
    features: ['Register your name on Vitruveo', 'Send VTRU straight to a name', 'Resolved to its address on-chain'],
  },
  {
    name: 'VIBE',
    tag: 'Community revenue engine',
    href: 'https://scope.vitruveo.ai/assets/vibe',
    host: 'scope.vitruveo.ai/assets/vibe',
    a: '#ffb347',
    b: '#ff4d8d',
    glyph: 'vibe',
    blurb: 'The Vitruveo Income Building Engine routes on-chain revenue back to the community.',
    features: ['Revenue share from the ecosystem', 'Periodic treasury grants on top', 'Fully on-chain payouts'],
  },
  {
    name: 'Explorer',
    tag: 'Every block, on the record',
    href: 'https://explorer.vitruveo.ai',
    host: 'explorer.vitruveo.ai',
    a: '#2dd4bf',
    b: '#4ab0ff',
    logo: <Image src="/projects/vitruveo-mark.svg" alt="" width={48} height={48} className="flex-shrink-0" />,
    blurb: 'Search transactions, inspect addresses, and trace activity across the Vitruveo network.',
    features: ['Transactions, blocks, and addresses', 'Verified smart contract source', 'Full chain data and APIs'],
  },
  {
    name: 'VStats',
    tag: 'Live network stats',
    href: 'https://network.vitruveo.ai',
    host: 'network.vitruveo.ai',
    a: '#b04cff',
    b: '#4ab0ff',
    glyph: 'stats',
    blurb: 'Watch the Vitruveo mainnet in real time: nodes, blocks, and gas.',
    features: ['Fixed supply of 500 million VTRU', 'Shanghai build, lean enough for a t3.small', 'Native Pretrend statistical functions'],
  },
  {
    name: 'Quadplot',
    tag: 'Read the room',
    href: 'https://www.quadplot.com',
    host: 'quadplot.com',
    a: '#007fff',
    b: '#ea580c',
    wordmark: true,
    logo: <Image src="/projects/quadplot-logo.svg" alt="Quadplot" width={205} height={64} className="pj-logo-wide" />,
    mark: <Image src="/projects/quadplot-mark.svg" alt="" width={56} height={56} />,
    blurb: 'Four options on one square. Everyone drops an emoji. The heat map shows the room.',
    features: ['Find where a group stands, no survey needed', 'No accounts, names, or emails', 'Heat map updates live as people answer'],
  },
];

const AigisMark = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="flex-shrink-0">
    <circle cx="16" cy="16" r="14" stroke="#38bdf8" strokeWidth="1.5" />
    <path d="M4 16h24M16 2c5 4 5 24 0 28M16 2c-5 4-5 24 0 28" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    <circle cx="21" cy="11" r="3" fill="#a78bfa" />
  </svg>
);

const COMING_SOON = [
  {
    name: 'Coinveyor',
    tag: 'AI meme coin launchpad',
    href: 'https://www.coinveyor.xyz/',
    host: 'coinveyor.xyz',
    a: '#f7de77',
    b: '#f99b28',
    wordmark: true,
    logo: <Image src="/projects/coinveyor-logo.svg" alt="Coinveyor" width={5880} height={1880} className="pj-logo-wide" />,
    mark: <Image src="/projects/coinveyor-mark.svg" alt="" width={52} height={52} />,
    blurb: 'Every 15 minutes, AI puts a new meme coin on the chain. Coinveyors decide whether it gets minted.',
    features: ['A fresh AI-made coin every 15 minutes', 'USDT liquidity round, split pro rata', 'PancakeSwap v3 pool, LP locked forever'],
  },
  {
    name: 'AIGIS',
    tag: 'AI geospatial intelligence',
    href: 'https://aigis.studio',
    host: 'aigis.studio',
    a: '#38bdf8',
    b: '#a78bfa',
    logo: <AigisMark size={48} />,
    mark: <AigisMark size={56} />,
    blurb: 'Turn documents, spreadsheets, images, and news into animated time-series maps.',
    features: ['Finds every event with a place and a time', 'Spots bursts, hotspots, outliers, and silences', 'Ask the map questions in plain language', 'Publish to Vitruveo'],
  },
  {
    name: 'Instagraphic',
    tag: 'Branded graphics, fast',
    href: 'https://instagraphic.app',
    host: 'instagraphic.app',
    a: '#ffc107',
    b: '#0d6efd',
    logo: <Image src="/projects/instagraphic-mark.svg" alt="" width={48} height={48} className="flex-shrink-0" />,
    mark: <Image src="/projects/instagraphic-mark.svg" alt="" width={52} height={52} />,
    blurb: 'Turn your text into an animated graphic in seconds.',
    features: ['Pick a layout, apply your colors and fonts', 'Type your content and go', 'Download as animated SVG, PNG, or GIF', 'Content Authenticity Initiative certificate on Vitruveo'],
  },
];

const MARKS = [...ECOSYSTEM.filter((p) => p.name !== 'USDT Bridge'), ...COMING_SOON];

function ProjectLogo({ p, size = 48, mark = false }) {
  if (p.glyph) {
    const badge = (
      <Badge id={`g-${p.name.replace(/\W/g, '')}-${mark ? 'm' : 'c'}`} a={p.a} b={p.b} size={size}>
        {GLYPHS[p.glyph]}
      </Badge>
    );
    return mark ? badge : <div className="pj-logo-combo">{badge}<span>{p.name}</span></div>;
  }
  if (mark) return <>{p.mark ?? <Image src="/projects/vitruveo-mark.svg" alt="" width={size} height={size} />}</>;
  if (p.wordmark) return <>{p.logo}</>;
  return <div className="pj-logo-combo">{p.logo}<span>{p.name}</span></div>;
}

function ProjectCard({ p, soon = false }) {
  return (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={soon ? 'pj-card pj-card-soon' : 'pj-card'} style={accent(p.a, p.b)}>
      {soon && <span className="pj-ribbon">Coming soon</span>}
      <div className="pj-card-logo"><ProjectLogo p={p} /></div>
      <div className="pj-card-tag">{p.tag}</div>
      <p className="text-muted-custom mb-3">{p.blurb}</p>
      <ul className="pj-features">
        {p.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <span className="pj-card-link">
        {p.host} <Arrow />
      </span>
    </a>
  );
}

export default function EcosystemPage() {
  return (
    <div className="pj-page">
      {/* Hero with Video */}
      <section className="page-hero d-flex align-items-center" style={{ marginTop: '-108px' }}>
        <video autoPlay muted loop playsInline className="video-bg">
          <source src="/videos/ecosystem.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="container text-center" style={{ paddingTop: '170px', paddingBottom: '90px' }}>
          <a href="#pretrend" className="pj-live-pill">
            <span className="pj-live-dot" />
            Pretrend is live
            <span aria-hidden="true">→</span>
          </a>
          <h1 className="pj-hero-title text-white">
            Built on Vitruveo.
            <br />
            <span className="pj-rainbow">Live today.</span>
          </h1>
          <p className="lead text-muted-light mx-auto mb-5" style={{ maxWidth: '700px' }}>
            Prediction markets, shared custody, cross-chain bridges, human-readable names, community revenue, and the tools to watch the chain, all in production on Vitruveo.
          </p>

          <div className="pj-mark-row">
            <a href="#pretrend" className="pj-mark" style={accent('#7bbd4f', '#0055d6')} aria-label="Pretrend">
              <Image src="/projects/pretrend-mark.png" alt="" width={56} height={56} />
            </a>
            {MARKS.map((p) => (
              <a key={p.name} href={COMING_SOON.includes(p) ? '#coming-soon' : '#projects'} className="pj-mark" style={accent(p.a, p.b)} aria-label={p.name}>
                <ProjectLogo p={p} size={56} mark />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Join the chain */}
      <section className="pj-section pb-0">
        <div className="container">
          <a href="https://snapshot.vitruveo.ai" target="_blank" rel="noopener noreferrer" className="pj-join" style={accent('#b04cff', '#4ab0ff')}>
            <Image src="/projects/vitruveo-mark.svg" alt="" width={96} height={96} className="pj-join-mark" />
            <div className="flex-grow-1">
              <h2 className="h3 fw-bold text-white mb-2">Want to join the Vitruveo chain?</h2>
              <p className="text-muted-custom mb-0">
                Spin up your own node from a daily snapshot. Every step is documented at snapshot.vitruveo.ai.
              </p>
            </div>
            <span className="pj-btn-primary flex-shrink-0">
              Run a node <Arrow />
            </span>
          </a>
        </div>
      </section>

      {/* Pretrend spotlight */}
      <section id="pretrend" className="pj-section">
        <div className="container">
          <div className="pj-spotlight" style={accent('#7bbd4f', '#0055d6')}>
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <Image src="/projects/pretrend-mark.png" alt="" width={72} height={72} className="pj-spot-mark" />
                  <div>
                    <div className="pj-spot-name">Pretrend</div>
                    <div className="pj-badge">
                      <span className="pj-live-dot" /> Live since November 11, 2026
                    </div>
                  </div>
                </div>

                <h2 className="pj-spot-title">
                  Call where the trend is <span className="pj-spot-gradient">heading.</span>
                </h2>
                <p className="text-muted-custom mb-4">
                  Trend prediction markets, resolved on-chain by Vitruveo&apos;s native statistical functions. The first
                  market, Pump.fun 5-Minute Trend, asks one question every five minutes: where is Pump.fun volume going?
                </p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {OUTCOMES.map((o) => (
                    <span key={o.name} className="pj-outcome" style={{ '--pj-o': o.color }}>
                      {o.name}
                    </span>
                  ))}
                </div>

                <div className="pj-stats mb-4">
                  {PRETREND_STATS.map((s) => (
                    <div key={s.label} className="pj-stat">
                      <div className="pj-stat-value">{s.value}</div>
                      <div className="pj-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <a href="https://pretrend.ai/markets/pumpfun-5" target="_blank" rel="noopener noreferrer" className="pj-btn-primary">
                    Open the market <Arrow />
                  </a>
                  <a href="https://pretrend.ai/swap" target="_blank" rel="noopener noreferrer" className="pj-btn-ghost">
                    Get VUSD <Arrow />
                  </a>
                  <a href="https://pretrend.ai" target="_blank" rel="noopener noreferrer" className="pj-btn-ghost">
                    pretrend.ai <Arrow />
                  </a>
                </div>
              </div>

              <div className="col-lg-6">
                <a href="https://pretrend.ai/markets/pumpfun-5" target="_blank" rel="noopener noreferrer" className="pj-shot">
                  <Image
                    src="/projects/pretrend-launch.jpg"
                    alt="Pretrend Pump.fun 5-Minute Trend market with live volume chart and Moon, Bull, Flat, Bear, and Crash outcomes"
                    width={1400}
                    height={1346}
                    className="w-100 h-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="pj-section pt-0">
        <div className="container">
          <div className="text-center mb-5">
            <div className="pj-eyebrow">The ecosystem</div>
            <h2 className="display-6 fw-bold text-white">Everything running on Vitruveo</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {ECOSYSTEM.map((p) => (
              <div key={p.name} className="col-xl-3 col-lg-4 col-md-6">
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section id="coming-soon" className="pj-section pt-0">
        <div className="container">
          <div className="text-center mb-5">
            <div className="pj-eyebrow">Coming soon</div>
            <h2 className="display-6 fw-bold text-white">Next on the line</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {COMING_SOON.map((p) => (
              <div key={p.name} className="col-xl-3 col-md-6">
                <ProjectCard p={p} soon />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
