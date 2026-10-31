import { useRef } from 'react';
import { content } from '../content';
import { Icon } from '../components/Icon';
import { Latin } from '../components/Latin';
import { Picture } from '../components/Picture';
import { QuoteLink } from '../components/QuoteLink';
import { SectionTransition } from '../components/SectionTransition';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap, ScrollTrigger } from '../utils/gsap';

const { asphalt, services } = content;
const service = services.items.find((item) => item.id === 'asphalt-paving')!;
const index = services.items.indexOf(service) + 1;

export function AsphaltRoads() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useScrollScene(ref, ({ isDesktop }) => {
    const steps = gsap.utils.toArray<HTMLElement>('.road__step');
    const setStep = (progress: number) => {
      const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      steps.forEach((step, i) => step.classList.toggle('is-active', i === active));
      steps.forEach((step, i) => step.classList.toggle('is-done', i < active));
    };

    if (isDesktop) {
      // One pinned stage only: the photo settles while the road runs through the four stages.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.road',
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => setStep(self.progress),
        },
      });
      tl.fromTo('.road__photo picture', { scale: 1.16 }, { scale: 1, duration: 1 }, 0)
        .fromTo('.road__fill', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    } else {
      gsap.fromTo('.road__fill', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.road__track-area', start: 'top 75%', end: 'bottom 60%', scrub: 0.4 },
      });
      ScrollTrigger.create({
        trigger: '.road__track-area',
        start: 'top 75%',
        end: 'bottom 60%',
        onUpdate: (self) => setStep(self.progress),
      });
    }
    setStep(0);
  });

  return (
    <section ref={ref} id="asphalt" className="asphalt" aria-labelledby="asphalt-title">
      <div className="road">
        <div className="road__photo">
          {service.image && <Picture image={service.image.id} alt={service.image.alt} sizes="(min-width: 1024px) 100vw, 100vw" />}
          <div className="road__scrim" />
        </div>
        <div className="road__head wrap">
          <p className="section-tab">{asphalt.eyebrow}</p>
          <h2 id="asphalt-title">{service.title}</h2>
          <Latin className="road__latin">{service.titleLatin}</Latin>
        </div>
        <div className="road__track-area wrap">
          <h3 className="visually-hidden">{asphalt.stepsTitle}</h3>
          <div className="road__track" aria-hidden="true">
            <div className="road__fill" />
          </div>
          <ol className="road__steps">
            {asphalt.steps.map((step, i) => (
              <li key={step.title} className="road__step">
                <Latin className="road__step-number">{String(i + 1).padStart(2, '0')}</Latin>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div id={`service-${service.id}`} className="wrap asphalt__detail" data-service={service.id}>
        <p className="asphalt__lead" data-reveal>
          <Latin className="asphalt__index">{String(index).padStart(2, '0')}</Latin>
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
        {service.note && (
          <aside className="service__note service__note--dark" data-reveal>
            <strong>{services.noteLabel}</strong>
            <p>{service.note}</p>
          </aside>
        )}
        <div data-reveal>
          <QuoteLink service={service.id} className="button button--primary">
            {services.quoteCta}
            <Icon name="arrow" size={20} />
          </QuoteLink>
        </div>
      </div>
      <SectionTransition to="white" />
    </section>
  );
}
