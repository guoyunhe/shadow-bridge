import { render, screen } from '@testing-library/preact';
import { Preact } from '.';

describe('Preact', () => {
  it('render', async () => {
    render(<Preact>foobar</Preact>);
    await screen.findByText('foobar');
  });
});
