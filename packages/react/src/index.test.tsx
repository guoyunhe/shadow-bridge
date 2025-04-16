import { render, screen } from '@testing-library/react';
import { React } from '.';

describe('React', () => {
  it('render', async () => {
    render(<React>foobar</React>);
    await screen.findByText('foobar');
  });
});
