import { content, type Service } from '../content';
import { Bidi } from './Bidi';
import { Icon } from './Icon';
import { Latin } from './Latin';
import { Picture } from './Picture';
import { QuoteLink } from './QuoteLink';

interface ServiceDetailProps {
  service: Service;
  /** 'narrow-only' hides the inline figure where a sticky stage shows it on wide screens. */
  figure?: 'narrow-only' | 'none';
}

export const serviceNumber = (service: Service) =>
  String(content.services.items.indexOf(service) + 1).padStart(2, '0');

/** Text panel shared by every service. All information is visible without hover. */
export function ServiceDetail({ service, figure = 'none' }: ServiceDetailProps) {
  return (
    <article id={`service-${service.id}`} className="service" data-service={service.id}>
      {figure !== 'none' && (
        <div className="service__figure service__figure--narrow-only">
          <Picture image={service.image.id} alt={service.image.alt} sizes="100vw" />
        </div>
      )}
      <div className="service__body">
        <p className="service__index">
          <Latin>{serviceNumber(service)}</Latin>
          <Latin className="service__latin">{service.titleLatin}</Latin>
        </p>
        <h3><Bidi text={service.title} /></h3>
        <p className="service__lead"><Bidi text={service.lead} /></p>

        {service.specs && (
          <dl className="spec-list">
            {service.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd><Bidi text={spec.value} /></dd>
              </div>
            ))}
          </dl>
        )}

        {service.scope.length > 0 && (
          <>
            <h4>{service.scopeTitle}</h4>
            <ul className="scope-list">
              {service.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        <QuoteLink service={service.id} className="text-link">
          {content.services.quoteCta}
          <Icon name="arrow" size={18} />
        </QuoteLink>
      </div>
    </article>
  );
}
