import type { Service } from '../content';
import { Picture } from './Picture';
import { ServiceDetail } from './ServiceDetail';

/** Large photograph beside a service panel. */
export function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="service-row">
      <div className="service-row__figure">
        <Picture image={service.image.id} alt={service.image.alt} sizes="(min-width: 1024px) 58vw, 100vw" />
        <span className="service-row__level" aria-hidden="true" />
      </div>
      <ServiceDetail service={service} />
    </div>
  );
}
