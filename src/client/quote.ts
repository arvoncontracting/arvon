import { mailtoUrl, whatsappUrl } from '../utils/links';

/**
 * Prepares a quote message and hands it to WhatsApp or the mail client.
 * Nothing is submitted by the site. The native dialog traps focus and returns
 * it to the opener on close. Until this runs, quote links are plain WhatsApp links.
 */
export function initQuoteDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('dialog.quote');
  const form = dialog?.querySelector('form');
  const select = form?.querySelector('select');
  if (!dialog || !form || !select) return;

  document.addEventListener('click', (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-quote]');
    if (!trigger) return;
    event.preventDefault();
    select.value = trigger.dataset.quote ?? '';
    dialog.showModal();
  });

  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());

  const buildMessage = () => {
    const lines = [...form.querySelectorAll('label')].flatMap((label) => {
      const control = label.querySelector<HTMLInputElement | HTMLSelectElement>('input, select, textarea');
      const name = label.querySelector('[data-label]')?.textContent;
      const value = control instanceof HTMLSelectElement ? control.selectedOptions[0]?.textContent : control?.value.trim();
      return name && value ? [`${name}: ${value}`] : [];
    });
    return [form.dataset.greeting ?? '', '', ...lines].join('\n');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const channel = event.submitter?.getAttribute('value');
    const message = buildMessage();
    if (channel === 'email') window.location.href = mailtoUrl(form.dataset.subject ?? '', message);
    else window.open(whatsappUrl(message), '_blank', 'noopener');
    dialog.close();
  });
}
