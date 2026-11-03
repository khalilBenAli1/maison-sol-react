import { useRef, type FormEvent } from 'react';
import { Arrow } from '../../components/Icons';
import type { ContactDetails, ContactErrors } from '../../domain/contact';
interface Props {
  contact: ContactDetails;
  errors: ContactErrors;
  onChange: (patch: Partial<ContactDetails>) => void;
  onSample: () => void;
  onNext: () => boolean;
  onBack: () => void;
}
export default function GuestDetailsStep({
  contact,
  errors,
  onChange,
  onSample,
  onNext,
  onBack,
}: Props) {
  const form = useRef<HTMLFormElement>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!onNext())
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
  }
  return (
    <form ref={form} onSubmit={submit} noValidate>
      <p className="panel-description">
        This is a simulated stay. Use sample details; nothing is sent or saved.
      </p>
      <button
        type="button"
        className="text-link sample-details"
        onClick={onSample}
      >
        Use sample details <Arrow />
      </button>
      <div className="contact-fields">
        <label>
          Your name
          <input
            autoComplete="off"
            maxLength={100}
            value={contact.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={(event) =>
              onChange({ ...contact, name: event.target.value })
            }
          />
          {errors.name && (
            <span className="field-error" id="name-error">
              {errors.name}
            </span>
          )}
        </label>
        <label>
          Email address
          <input
            type="email"
            autoComplete="off"
            maxLength={254}
            value={contact.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={(event) =>
              onChange({ ...contact, email: event.target.value })
            }
          />
          {errors.email && (
            <span className="field-error" id="email-error">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <label className="consent-field">
        <input
          type="checkbox"
          checked={contact.consent}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
          onChange={(event) =>
            onChange({ ...contact, consent: event.target.checked })
          }
        />
        <span>
          I understand this is a simulated stay. No reservation or payment will
          be made.
        </span>
      </label>
      {errors.consent && (
        <p id="consent-error" className="field-error">
          {errors.consent}
        </p>
      )}
      <div className="step-actions">
        <button className="button" type="submit">
          Review my stay <Arrow />
        </button>
        <button type="button" className="plain-button" onClick={onBack}>
          Change room
        </button>
      </div>
    </form>
  );
}
