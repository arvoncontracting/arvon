import { useRef } from 'react';
import { content } from '../content';
import { Icon } from '../components/Icon';
import { QuoteLink } from '../components/QuoteLink';
import { SectionHeading } from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { mailtoUrl } from '../utils/links';

const { partners } = content;

export function B2BPartnership() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="partners" className="partners" aria-labelledby="partners-title">
      <div className="partners__stripe" aria-hidden="true" />
      <div className="wrap">
        <SectionHeading id="partners-title" eyebrow={partners.eyebrow} title={partners.title} body={partners.body} />
        <div className="partners__columns">
          <div data-reveal>
            <h3>{partners.audienceTitle}</h3>
            <ul>
              {partners.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h3>{partners.offerTitle}</h3>
            <ul>
              {partners.offer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="partners__actions" data-reveal>
          <QuoteLink className="button button--primary">
            {partners.quoteCta}
            <Icon name="arrow" size={20} />
          </QuoteLink>
          <a className="button button--on-dark" href={mailtoUrl(partners.meetingSubject, partners.meetingBody)}>
            <Icon name="mail" />
            {partners.meetingCta}
          </a>
        </div>
        <p className="partners__note" data-reveal>{partners.meetingNote}</p>
      </div>
    </section>
  );
}
