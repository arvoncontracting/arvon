import { content } from '../content';
import { contact, socialLinks } from '../data/contact';
import { Latin } from '../components/Latin';
import { Logo } from '../components/Logo';
import { telUrl, whatsappUrl } from '../utils/links';

const { footer, nav, company } = content;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <Logo tone="dark-bg" title={company.nameLatin} className="site-footer__logo" />
          <p>{footer.tagline}</p>
          <p className="site-footer__coverage">{company.coverage}</p>
        </div>
        <nav aria-label={footer.navTitle}>
          <h2>{footer.navTitle}</h2>
          <ul>
            {nav.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2>{footer.contactTitle}</h2>
          <ul>
            <li><a href={telUrl}><Latin>{contact.phone.display}</Latin></a></li>
            <li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><Latin>{contact.whatsapp.display}</Latin></a></li>
            <li><a href={`mailto:${contact.email}`}><Latin>{contact.email}</Latin></a></li>
            {socialLinks.map((social) => (
              <li key={social.id}>
                <a href={social.url} target="_blank" rel="noopener noreferrer"><Latin>{social.label}</Latin></a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap site-footer__bottom">
        <p>© {footer.rights}</p>
        <a href="#top">{footer.backToTop}</a>
      </div>
    </footer>
  );
}
