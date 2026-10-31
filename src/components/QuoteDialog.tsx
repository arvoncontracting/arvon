import { useEffect, useRef, useState, type FormEvent } from 'react';
import { content, type ServiceId } from '../content';
import { mailtoUrl, whatsappUrl } from '../utils/links';
import { Icon } from './Icon';

const { quote, services } = content;

interface QuoteDialogProps {
  open: boolean;
  service?: ServiceId;
  onClose: () => void;
}

/**
 * Prepares a quote message and hands it to WhatsApp or the mail client.
 * Nothing is submitted by the site itself. The native dialog traps focus and
 * returns it to the opener on close.
 */
export function QuoteDialog({ open, service, onClose }: QuoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setSelected(service ?? '');
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, service]);

  const buildMessage = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const field = (key: string) => String(data.get(key) ?? '').trim();
    const serviceTitle = services.items.find((item) => item.id === field('service'))?.title ?? quote.serviceAny;
    const lines: [string, string][] = [
      [quote.name, field('name')],
      [quote.phone, field('phone')],
      [quote.company, field('company')],
      [quote.service, serviceTitle],
      [quote.location, field('location')],
      [quote.details, field('details')],
    ];
    return [quote.greeting, '', ...lines.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`)].join('\n');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const channel = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value');
    const message = buildMessage(event.currentTarget);
    if (channel === 'email') {
      window.location.href = mailtoUrl(quote.subject, message);
    } else {
      window.open(whatsappUrl(message), '_blank', 'noopener');
    }
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="quote" aria-labelledby="quote-title" onClose={onClose} onCancel={onClose}>
      <div className="quote__head">
        <h2 id="quote-title">{quote.title}</h2>
        <button type="button" className="icon-button" onClick={onClose} aria-label={quote.close}>
          <Icon name="close" />
        </button>
      </div>
      <p className="quote__intro">{quote.intro}</p>
      <form ref={formRef} onSubmit={handleSubmit} className="quote__form">
        <label>
          <span>{quote.name}</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>{quote.phone}</span>
          <input name="phone" type="tel" dir="ltr" required autoComplete="tel" />
        </label>
        <label>
          <span>{quote.company} <small>({quote.optional})</small></span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span>{quote.service}</span>
          <select name="service" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">{quote.serviceAny}</option>
            {services.items.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </label>
        <label className="quote__wide">
          <span>{quote.location} <small>({quote.optional})</small></span>
          <input name="location" />
        </label>
        <label className="quote__wide">
          <span>{quote.details} <small>({quote.optional})</small></span>
          <textarea name="details" rows={3} />
        </label>
        <div className="quote__actions quote__wide">
          <button type="submit" value="whatsapp" className="button button--primary">
            <Icon name="whatsapp" />
            {quote.sendWhatsapp}
          </button>
          <button type="submit" value="email" className="button button--ghost">
            <Icon name="mail" />
            {quote.sendEmail}
          </button>
        </div>
        <p className="quote__honesty quote__wide">{quote.honesty}</p>
      </form>
    </dialog>
  );
}
