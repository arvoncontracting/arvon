import { content } from './content';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuoteDialog } from './components/QuoteDialog';
import { SiteHeader } from './components/SiteHeader';
import { AboutArvon } from './sections/AboutArvon';
import { AsphaltRoads } from './sections/AsphaltRoads';
import { B2BPartnership } from './sections/B2BPartnership';
import { ConcreteWorks } from './sections/ConcreteWorks';
import { ContactSection } from './sections/ContactSection';
import { EngineeringIdentity } from './sections/EngineeringIdentity';
import { ExperienceSection } from './sections/ExperienceSection';
import { HeroExperience } from './sections/HeroExperience';
import { PolyurethaneFeature } from './sections/PolyurethaneFeature';
import { QualityAndWarranty } from './sections/QualityAndWarranty';
import { ServicesShowcase } from './sections/ServicesShowcase';
import { SiteFooter } from './sections/SiteFooter';
import { WaterproofingSystems } from './sections/WaterproofingSystems';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">{content.nav.skipToContent}</a>
      <SiteHeader />
      <main id="main">
        <HeroExperience />
        <EngineeringIdentity />
        <ServicesShowcase />
        <WaterproofingSystems />
        <ConcreteWorks />
        <AsphaltRoads />
        <PolyurethaneFeature />
        <ExperienceSection />
        <AboutArvon />
        <QualityAndWarranty />
        <B2BPartnership />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <QuoteDialog />
    </>
  );
}
