import { contact } from '../data/contact';

export const whatsappUrl = (message?: string) =>
  message ? `${contact.whatsapp.url}?text=${encodeURIComponent(message)}` : contact.whatsapp.url;

export const mailtoUrl = (subject: string, body: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;

export const telUrl = `tel:${contact.phone.international}`;
