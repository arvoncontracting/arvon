import type { ImageId } from '../data/images';

export type ServiceGroup = 'waterproofing' | 'asphalt' | 'concrete';

export type ServiceId =
  | 'hot-asphalt'
  | 'membranes'
  | 'foundation'
  | 'thermal'
  | 'underfloor'
  | 'polyurethane'
  | 'asphalt-paving'
  | 'slope-screed'
  | 'power-trowel';

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface Service {
  id: ServiceId;
  group: ServiceGroup;
  title: string;
  titleLatin: string;
  lead: string;
  scopeTitle: string;
  scope: string[];
  specs?: ServiceSpec[];
  note?: string;
  /** Services without a real photograph use a typographic plate; imagery is never substituted. */
  image?: { id: ImageId; alt: string };
}

export interface ExperienceRecord {
  name: string;
  /** Add these once verified; empty fields are not rendered. */
  year?: string;
  scope?: string;
  image?: { src: string; alt: string };
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  company: { name: string; nameLatin: string; descriptor: string; coverage: string };
  nav: { items: NavItem[]; contactCta: string; menuOpen: string; menuClose: string; menuTitle: string; skipToContent: string; home: string };
  intro: { welcome: string; skip: string };
  hero: {
    brand: string;
    descriptor: string;
    title: string;
    support: string;
    primaryCta: string;
    whatsappCta: string;
    pillars: { label: string; href: string }[];
    imageAlt: string;
  };
  identity: { eyebrow: string; title: string[]; body: string; pillars: { title: string; body: string }[] };
  services: {
    eyebrow: string;
    title: string;
    body: string;
    groups: Record<ServiceGroup, string>;
    items: Service[];
    quoteCta: string;
    noteLabel: string;
  };
  waterproofing: { eyebrow: string; title: string; body: string };
  asphalt: {
    eyebrow: string;
    usesTitle: string;
    uses: string[];
    stepsTitle: string;
    steps: { title: string; body: string }[];
  };
  concrete: { eyebrow: string; title: string; body: string };
  experience: { eyebrow: string; title: string; titleLatin: string; body: string; records: ExperienceRecord[] };
  about: {
    eyebrow: string;
    title: string;
    narrative: string;
    visionTitle: string;
    vision: string;
    foundersTitle: string;
    founders: string[];
    valuesTitle: string;
    values: string[];
  };
  quality: {
    eyebrow: string;
    title: string;
    titleLatin: string;
    body: string;
    principles: { title: string; body: string }[];
    certificate: { title: string; titleLatin: string; body: string; sample: string; caption: string };
  };
  partners: {
    eyebrow: string;
    title: string;
    body: string;
    audienceTitle: string;
    audience: string[];
    offerTitle: string;
    offer: string[];
    quoteCta: string;
    meetingCta: string;
    meetingNote: string;
    meetingSubject: string;
    meetingBody: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    phoneLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    socialLabel: string;
    quoteCta: string;
    meetingCta: string;
    coverageTitle: string;
    governorates: string[];
  };
  quote: {
    title: string;
    intro: string;
    close: string;
    name: string;
    phone: string;
    company: string;
    service: string;
    serviceAny: string;
    location: string;
    details: string;
    optional: string;
    sendWhatsapp: string;
    sendEmail: string;
    honesty: string;
    subject: string;
    greeting: string;
    fallbackMessage: string;
  };
  floating: { whatsapp: string };
  footer: { rights: string; navTitle: string; contactTitle: string; tagline: string; backToTop: string };
}
