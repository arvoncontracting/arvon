import { content } from '../content';
import { Latin } from '../components/Latin';

const { identity } = content;

export function EngineeringIdentity() {
  return (
    <section id="identity" className="identity" aria-labelledby="identity-title">
      <div className="identity__plane" aria-hidden="true" />
      <div className="wrap identity__grid">
        <header className="identity__head">
          <p className="section-tab" data-reveal>{identity.eyebrow}</p>
          <h2 id="identity-title" data-reveal>
            {identity.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </header>
        <p className="identity__body" data-reveal>{identity.body}</p>
        <ul className="identity__pillars" aria-label={identity.pillarsLabel}>
          {identity.pillars.map((pillar, index) => (
            <li key={pillar.title} data-reveal>
              <Latin className="identity__number">{String(index + 1).padStart(2, '0')}</Latin>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
