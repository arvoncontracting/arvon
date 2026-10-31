import { content, type Service } from '../content';
import { Latin } from './Latin';
import { Picture } from './Picture';
import { QuoteLink } from './QuoteLink';
import { Icon } from './Icon';

interface ServiceDetailProps {
  service: Service;
  index: number;
  /** Hide the inline figure where the section's own stage shows the image. */
  figure?: 'always' | 'narrow-only' | 'none';
  sizes?: string;
}

/** Text panel shared by every service. All information is visible without hover. */
export function ServiceDetail({ service, index, figure = 'always', sizes = '(min-width: 1024px) 50vw, 100vw' }: ServiceDetailProps) {
  return (
    <article id={`service-${service.id}`} className="service" data-service={service.id}>
      {figure !== 'none' &&
        (service.image ? (
          <div className={`service__figure service__figure--${figure}`}>
            <Picture image={service.image.id} alt={service.image.alt} sizes={sizes} />
          </div>
        ) : (
          <div className={`service__figure service__figure--${figure}`} aria-hidden="true">
            <ServicePlate service={service} index={index} />
          </div>
        ))}
      <div className="service__body">
        <p className="service__index">
          <Latin>{String(index).padStart(2, '0')}</Latin>
          <Latin className="service__latin">{service.titleLatin}</Latin>
        </p>
        <h3>{service.title}</h3>
        <p className="service__lead">{service.lead}</p>

        {service.specs && (
          <dl className="spec-list">
            {service.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
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

        {service.note && (
          <aside className="service__note">
            <strong>{content.services.noteLabel}</strong>
            <p>{service.note}</p>
          </aside>
        )}

        <QuoteLink service={service.id} className="text-link">
          {content.services.quoteCta}
          <Icon name="arrow" size={18} />
        </QuoteLink>
      </div>
    </article>
  );
}

/** Typographic plate for services with no supplied photograph. Purely abstract, not a cross-section. */
export function ServicePlate({ service, index }: { service: Service; index: number }) {
  return (
    <div className={`plate plate--${service.id}`}>
      <span className="plate__band plate__band--1" />
      <span className="plate__band plate__band--2" />
      <span className="plate__band plate__band--3" />
      <span className="plate__number"><Latin>{String(index).padStart(2, '0')}</Latin></span>
      <span className="plate__title">{service.title}</span>
    </div>
  );
}
