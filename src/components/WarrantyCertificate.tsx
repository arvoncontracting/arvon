import { content } from '../content';
import { Latin } from './Latin';
import { Logo } from './Logo';

const { certificate } = content.quality;

/** Illustrative concept only: no duration, number, signature or seal, and labelled as such. */
export function WarrantyCertificate() {
  return (
    <figure className="certificate">
      <div className="certificate__sheet">
        <svg className="certificate__pattern" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <path key={i} d={`M${-450 + i * 30} 560 L${i * 30} 0`} fill="none" stroke="#D9C6A2" strokeWidth="1" opacity="0.4" />
          ))}
        </svg>
        <span className="certificate__corner" aria-hidden="true" />
        <span className="certificate__sample">{certificate.sample}</span>
        <Logo title="ARVON CONTRACTING" className="certificate__logo" />
        <div className="certificate__text">
          <p className="certificate__title">{certificate.title}</p>
          <Latin className="certificate__latin">{certificate.titleLatin}</Latin>
          <span className="certificate__rule" aria-hidden="true" />
          <p className="certificate__body">{certificate.body}</p>
        </div>
      </div>
      <figcaption>{certificate.caption}</figcaption>
    </figure>
  );
}
