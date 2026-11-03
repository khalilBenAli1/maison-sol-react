import { describe, expect, it } from 'vitest';
import { validateContact } from './contact';
describe('demo contact validation', () => {
  it.each(['alex<smith>@example.com', 'alex,smith@example.com'])(
    'rejects unsupported punctuation in an unquoted email: %s',
    (email) => {
      expect(
        validateContact({ name: 'Léa Ben Ali', email, consent: true }),
      ).toHaveProperty('email');
    },
  );
  it.each(['alex.smith+stay@example.com', "o'connor+stay@example.co.uk"])(
    'preserves supported plus and dot addresses: %s',
    (email) => {
      expect(
        validateContact({
          name: ' Léa Ben Ali ',
          email: ` ${email} `,
          consent: true,
        }),
      ).toEqual({});
    },
  );
  it('accepts trimmed sample details and international names', () =>
    expect(
      validateContact({
        name: ' Léa Ben Ali ',
        email: ' lea@example.com ',
        consent: true,
      }),
    ).toEqual({}));
  it('rejects empty fields, malformed addresses and missing acknowledgement', () =>
    expect(
      Object.keys(validateContact({ name: ' ', email: 'a@b', consent: false })),
    ).toEqual(['name', 'email', 'consent']));
  it('bounds lengths and rejects line breaks in email', () => {
    expect(
      validateContact({
        name: 'x'.repeat(101),
        email: 'a\n@example.com',
        consent: true,
      }),
    ).toHaveProperty('name');
    expect(
      validateContact({
        name: 'Alex',
        email: 'a\n@example.com',
        consent: true,
      }),
    ).toHaveProperty('email');
  });
});
