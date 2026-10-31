export interface SocialLink {
  id: 'facebook' | 'instagram' | 'linkedin';
  label: string;
  url: string;
}

export const contact = {
  phone: { display: '0780519993', international: '+962780519993' },
  whatsapp: { display: '0786019800', url: 'https://wa.me/962786019800' },
  email: 'arvoncontracting@gmail.com',
};

// To publish LinkedIn later, append { id: 'linkedin', label: 'LinkedIn', url: '...' }.
export const socialLinks: SocialLink[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/share/19ysBqVHBR/' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/arvon.jo/' },
];
