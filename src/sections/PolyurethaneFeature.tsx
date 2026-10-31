import { content } from '../content';
import { SectionTransition } from '../components/SectionTransition';
import { ServiceRow } from '../components/ServiceRow';

const service = content.services.items.find((item) => item.id === 'polyurethane')!;

export function PolyurethaneFeature() {
  return (
    <section id="polyurethane" className="polyurethane" aria-label={service.title}>
      <div className="wrap">
        <ServiceRow service={service} />
      </div>
      <SectionTransition to="sand" />
    </section>
  );
}
