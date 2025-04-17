import { vue } from '.';

describe('vue', () => {
  it('normal', async () => {
    expect(vue('Foo', 'Bar')).toBe('Foo Bar');
  });

  it('lastName upper case', async () => {
    expect(vue('Foo', 'Bar', { lastNameUpperCase: true })).toBe('Foo BAR');
  });
});
