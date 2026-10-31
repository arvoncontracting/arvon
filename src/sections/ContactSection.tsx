import { forwardRef } from 'react';
import { content } from '../content';
import { contact, socialLinks } from '../data/contact';
import { Icon } from '../components/Icon';
import { Latin } from '../components/Latin';
import { QuoteLink } from '../components/QuoteLink';
import { SectionHeading } from '../components/SectionHeading';
import { mailtoUrl, telUrl, whatsappUrl } from '../utils/links';

const { contact: copy, partners } = content;

export const ContactSection = forwardRef<HTMLElement>(function ContactSection(_props, ref) {
  return (
    <section ref={ref} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div>
          <SectionHeading id="contact-title" eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <div className="contact__actions">
            <QuoteLink className="button button--primary">
              {copy.quoteCta}
              <Icon name="arrow" size={20} />
            </QuoteLink>
            <a className="button button--ghost" href={mailtoUrl(partners.meetingSubject, partners.meetingBody)}>
              <Icon name="mail" />
              {copy.meetingCta}
            </a>
          </div>
        </div>

        <ul className="contact__channels">
          <li>
            <a href={telUrl}>
              <Icon name="phone" size={24} />
              <span className="contact__label">{copy.phoneLabel}</span>
              <Latin className="contact__value">{contact.phone.display}</Latin>
            </a>
          </li>
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={24} />
              <span className="contact__label">{copy.whatsappLabel}</span>
              <Latin className="contact__value">{contact.whatsapp.display}</Latin>
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`}>
              <Icon name="mail" size={24} />
              <span className="contact__label">{copy.emailLabel}</span>
              <Latin className="contact__value contact__value--email">{contact.email}</Latin>
            </a>
          </li>
          {socialLinks.map((social) => (
            <li key={social.id}>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <Icon name={social.id} size={24} />
                <span className="contact__label">{copy.socialLabel}</span>
                <Latin className="contact__value">{social.label}</Latin>
              </a>
            </li>
          ))}
        </ul>

        <div className="contact__coverage">
          <h3>{copy.coverageTitle}</h3>
          <ul>
            {copy.governorates.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});
