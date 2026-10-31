import { useEffect, useMemo, useRef, useState } from 'react';
import { content, type ServiceId } from './content';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { IntroSequence } from './components/IntroSequence';
import { QuoteDialog } from './components/QuoteDialog';
import { SiteHeader } from './components/SiteHeader';
import { useEdgeTransitions } from './hooks/useEdgeTransitions';
import { QuoteContext } from './hooks/useQuote';
import { AboutArvon } from './sections/AboutArvon';
import { AsphaltRoads } from './sections/AsphaltRoads';
import { B2BPartnership } from './sections/B2BPartnership';
import { ConcreteWorks } from './sections/ConcreteWorks';
import { ContactSection } from './sections/ContactSection';
import { EngineeringIdentity } from './sections/EngineeringIdentity';
import { ExperienceSection } from './sections/ExperienceSection';
import { HeroExperience } from './sections/HeroExperience';
import { QualityAndWarranty } from './sections/QualityAndWarranty';
import { ServicesShowcase } from './sections/ServicesShowcase';
import { SiteFooter } from './sections/SiteFooter';
import { WaterproofingSystems } from './sections/WaterproofingSystems';
import { ScrollTrigger } from './utils/gsap';

export function App() {
  const [quote, setQuote] = useState<{ open: boolean; service?: ServiceId }>({ open: false });
  const [floatingHidden, setFloatingHidden] = useState(true);
  const contactRef = useRef<HTMLElement>(null);
  const quoteValue = useMemo(() => ({ openQuote: (service?: ServiceId) => setQuote({ open: true, service }) }), []);

  useEdgeTransitions();

  useEffect(() => {
    // Pin spacers change the page height, so deep links are settled after layout.
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      const { hash } = window.location;
      if (hash) document.querySelector(hash)?.scrollIntoView();
    });
  }, []);

  // The hero and contact section carry WhatsApp links of their own.
  useEffect(() => {
    const hero = document.getElementById('top');
    const section = contactRef.current;
    if (!hero || !section) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
        setFloatingHidden(visible.size > 0);
      },
      { threshold: 0.12 },
    );
    observer.observe(hero);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <QuoteContext.Provider value={quoteValue}>
      <a className="skip-link" href="#main">{content.nav.skipToContent}</a>
      <IntroSequence />
      <SiteHeader />
      <main id="main">
        <HeroExperience />
        <EngineeringIdentity />
        <ServicesShowcase />
        <WaterproofingSystems />
        <AsphaltRoads />
        <ConcreteWorks />
        <ExperienceSection />
        <AboutArvon />
        <QualityAndWarranty />
        <B2BPartnership />
        <ContactSection ref={contactRef} />
      </main>
      <SiteFooter />
      <FloatingWhatsApp hidden={floatingHidden} />
      <QuoteDialog open={quote.open} service={quote.service} onClose={() => setQuote({ open: false })} />
    </QuoteContext.Provider>
  );
}
