import { content } from '../content';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { WarrantyCertificate } from '../components/WarrantyCertificate';

const { quality } = content;

export function QualityAndWarranty() {
  return (
    <section id="quality" className="quality" aria-labelledby="quality-title">
      <div className="wrap quality__grid">
        <div>
          <SectionHeading
            id="quality-title"
            eyebrow={quality.eyebrow}
            title={<>{quality.title} <span className="heading-divider">|</span> <Latin>{quality.titleLatin}</Latin></>}
            body={quality.body}
          />
          <ol className="quality__list">
            {quality.principles.map((principle, index) => (
              <li key={principle.title} data-reveal>
                <Latin className="quality__number">{String(index + 1).padStart(2, '0')}</Latin>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <WarrantyCertificate />
      </div>
      <SectionTransition to="charcoal" />
    </section>
  );
}
