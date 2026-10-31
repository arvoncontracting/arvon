import { content } from '../content';
import { Bidi } from '../components/Bidi';
import { Icon } from '../components/Icon';
import { Latin } from '../components/Latin';
import { Picture } from '../components/Picture';
import { QuoteLink } from '../components/QuoteLink';
import { SectionTransition } from '../components/SectionTransition';
import { serviceNumber } from '../components/ServiceDetail';

const { asphalt, services } = content;
const service = services.items.find((item) => item.id === 'asphalt-paving')!;

/** Stages stay fully readable by default; src/motion only adds progress on top. */
export function AsphaltRoads() {
  return (
    <section id="asphalt" className="asphalt" aria-labelledby="asphalt-title">
      <div className="road">
        <div className="road__photo">
          <Picture image={service.image.id} alt={service.image.alt} sizes="100vw" />
          <div className="road__scrim" />
        </div>
        <div className="road__head wrap">
          <p className="section-tab">{asphalt.eyebrow}</p>
          <h2 id="asphalt-title">{service.title}</h2>
          <Latin className="road__latin">{service.titleLatin}</Latin>
        </div>
      </div>

      <div id={`service-${service.id}`} className="wrap asphalt__body" data-service={service.id}>
        <div className="asphalt__aside">
          <p className="asphalt__lead" data-reveal>
            <Latin className="asphalt__index">{serviceNumber(service)}</Latin>
            {service.lead}
          </p>
          <div className="asphalt__uses" data-reveal>
            <h3>{asphalt.usesTitle}</h3>
            <ul>
              {asphalt.uses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <QuoteLink service={service.id} className="button button--primary">
              {services.quoteCta}
              <Icon name="arrow" size={20} />
            </QuoteLink>
          </div>
        </div>

        <div className="asphalt__process">
          <h3>{asphalt.stepsTitle}</h3>
          <p className="asphalt__note">{asphalt.stepsNote}</p>
          <div className="timeline">
            <span className="timeline__rail" aria-hidden="true">
              <span className="timeline__fill" />
            </span>
            <ol>
              {asphalt.steps.map((step, index) => (
                <li key={step.title} className="timeline__stage">
                  <Latin className="timeline__node">{String(index + 1).padStart(2, '0')}</Latin>
                  <div className="timeline__text">
                    <h4><Bidi text={step.title} /></h4>
                    <p><Bidi text={step.body} /></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <SectionTransition to="white" />
    </section>
  );
}
