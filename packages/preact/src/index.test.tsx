import * as members from '.';

describe('members', () => {
  it('match snapshot', async () => {
    expect(members).toMatchSnapshot();
  });
});
