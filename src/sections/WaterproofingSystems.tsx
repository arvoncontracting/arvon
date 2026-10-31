import { content } from '../content';
import { Picture } from '../components/Picture';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceDetail } from '../components/ServiceDetail';
import { SectionTransition } from '../components/SectionTransition';

const { services, waterproofing } = content;
const systems = services.items.filter((item) => item.group === 'waterproofing');

export function WaterproofingSystems() {
  return (
    <section id="waterproofing" className="systems" aria-labelledby="waterproofing-title">
      <div className="wrap">
        <SectionHeading id="waterproofing-title" eyebrow={waterproofing.eyebrow} title={waterproofing.title} body={waterproofing.body} />
        <div className="systems__layout">
          <div className="stage" aria-hidden="true">
            <div className="stage__frame">
              {systems.map((service, index) => (
                <div key={service.id} className={`stage__plate${index === 0 ? ' is-active' : ''}`} style={{ zIndex: index + 1 }}>
                  <Picture image={service.image.id} alt="" sizes="46vw" />
                </div>
              ))}
            </div>
            <ol className="stage__ticks">
              {systems.map((service, index) => (
                <li key={service.id} className={`stage__tick${index === 0 ? ' is-active' : ''}`} />
              ))}
            </ol>
          </div>
          <div className="systems__list">
            {systems.map((service) => (
              <ServiceDetail key={service.id} service={service} figure="narrow-only" />
            ))}
          </div>
        </div>
      </div>
      <SectionTransition to="paper" flip />
    </section>
  );
}
