export interface ContactDetails {
  name: string;
  email: string;
  consent: boolean;
}
export type ContactErrors = Partial<Record<keyof ContactDetails, string>>;
export function validateContact(contact: ContactDetails): ContactErrors {
  const errors: ContactErrors = {};
  if (contact.name.trim().length < 2 || contact.name.trim().length > 100)
    errors.name = 'Please enter a name between 2 and 100 characters.';
  if (
    contact.email.length > 254 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z0-9.-]+$/i.test(
      contact.email.trim(),
    )
  )
    errors.email = 'Please enter a valid email address.';
  if (!contact.consent)
    errors.consent = 'Please confirm that this is a simulated stay.';
  return errors;
}
