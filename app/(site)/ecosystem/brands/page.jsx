import { BrandTabs } from './brand-tabs';

export const metadata = {
  title: 'Brands - Vitruveo',
  description: 'Logos and logomarks for Vitruveo, Pretrend, VTRU Scope, AI Wars, and Vertical Foundation in SVG and transparent PNG.',
};

export default function BrandsPage() {
  return (
    <div className="pj-page">
      <section className="bk-page">
        <div className="container-fluid bk-wrap">
          <div className="pj-eyebrow">Ecosystem</div>
          <h1 className="display-6 fw-bold text-white mb-2">Brands</h1>
          <p className="text-muted-light mb-4">
            Logos and logomarks for Vitruveo and related projects, in SVG and transparent PNG.
          </p>
          <BrandTabs />
        </div>
      </section>
    </div>
  );
}
