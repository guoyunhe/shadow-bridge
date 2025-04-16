import { render, screen } from '@testing-library/react';
import { ShadowBridge } from '.';

describe('ShadowBridge', () => {
  it('render', async () => {
    render(<ShadowBridge>foobar</ShadowBridge>);
    await screen.findByText('foobar');
  });
});
