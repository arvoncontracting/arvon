import { content } from '../content';
import { Icon } from './Icon';

const { quote, services } = content;

/** Static markup; behaviour lives in src/client/quote.ts. */
export function QuoteDialog() {
  return (
    <dialog className="quote" aria-labelledby="quote-title">
      <div className="quote__head">
        <h2 id="quote-title">{quote.title}</h2>
        <button type="button" className="icon-button" data-close aria-label={quote.close}>
          <Icon name="close" />
        </button>
      </div>
      <p className="quote__intro">{quote.intro}</p>
      <form className="quote__form" data-greeting={quote.greeting} data-subject={quote.subject}>
        <label>
          <span data-label>{quote.name}</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span data-label>{quote.phone}</span>
          <input name="phone" type="tel" dir="ltr" required autoComplete="tel" />
        </label>
        <label>
          <span><span data-label>{quote.company}</span> <small>({quote.optional})</small></span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span data-label>{quote.service}</span>
          <select name="service" defaultValue="">
            <option value="">{quote.serviceAny}</option>
            {services.items.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </label>
        <label className="quote__wide">
          <span><span data-label>{quote.location}</span> <small>({quote.optional})</small></span>
          <input name="location" />
        </label>
        <label className="quote__wide">
          <span><span data-label>{quote.details}</span> <small>({quote.optional})</small></span>
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
