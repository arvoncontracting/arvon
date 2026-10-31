import { content } from '../content';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';

const { experience } = content;

export function ExperienceSection() {
  return (
    <section id="experience" className="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHeading
          id="experience-title"
          eyebrow={experience.eyebrow}
          title={<>{experience.title} <span className="heading-divider">|</span> <Latin>{experience.titleLatin}</Latin></>}
          body={experience.body}
        />
        <ol className="experience__list">
          {experience.records.map((record, index) => (
            <li key={record.name} className="experience__item" data-reveal>
                            <Latin className="experience__number">{String(index + 1).padStart(2, '0')}</Latin>
              <p className="experience__name">{record.name}</p>
              {(record.year || record.scope) && (
                <p className="experience__meta">{[record.year, record.scope].filter(Boolean).join(' · ')}</p>
              )}
              {record.image && <img src={record.image.src} alt={record.image.alt} loading="lazy" />}
            </li>
          ))}
        </ol>
      </div>
      <SectionTransition to="white" flip />
    </section>
  );
}
